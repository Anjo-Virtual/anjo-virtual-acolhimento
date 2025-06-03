
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Clock, User, Eye, Pin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  is_pinned: boolean;
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
  category: {
    name: string;
    slug: string;
    color: string;
  };
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
};

interface PostListProps {
  categorySlug?: string;
  limit?: number;
}

const PostList = ({ categorySlug, limit }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [categorySlug]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          is_pinned,
          author:community_profiles(display_name, is_anonymous),
          category:forum_categories(name, slug, color)
        `)
        .eq('is_published', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (categorySlug) {
        const { data: category } = await supabase
          .from('forum_categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      // Buscar contadores para cada post
      const postsWithCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          // Contar likes
          const { count: likesCount } = await supabase
            .from('forum_post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Contar comentários
          const { count: commentsCount } = await supabase
            .from('forum_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('is_published', true);

          // Verificar se usuário curtiu (se logado)
          const { data: userLike } = await supabase
            .from('forum_post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
            .single();

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            user_has_liked: !!userLike
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_has_liked) {
        // Remover like
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Adicionar like
        await supabase
          .from('forum_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      // Atualizar estado local
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? {
              ...p,
              user_has_liked: !p.user_has_liked,
              likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível curtir o post.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum post encontrado
          </h3>
          <p className="text-gray-600">
            Seja o primeiro a compartilhar nesta categoria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                >
                  <MessageSquare size={20} />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {post.category.name}
                  </Badge>
                  {post.is_pinned && (
                    <Badge variant="default" className="ml-2">
                      <Pin size={12} className="mr-1" />
                      Fixado
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Link 
              to={`/comunidade/${post.category.slug}/post/${post.id}`}
              className="block hover:text-primary transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.content.substring(0, 200)}...
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {post.author?.is_anonymous ? 'A' : post.author?.display_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {post.author?.is_anonymous ? 'Membro Anônimo' : post.author?.display_name}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  {post.view_count}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1 ${
                    post.user_has_liked ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  <Heart size={16} className={post.user_has_liked ? 'fill-current' : ''} />
                  {post.likes_count}
                </Button>
                
                <Link to={`/comunidade/${post.category.slug}/post/${post.id}`}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                    <MessageSquare size={16} />
                    {post.comments_count}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
