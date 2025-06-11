
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Clock, Eye } from "lucide-react";
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
          author:community_profiles!forum_posts_author_id_fkey(display_name, is_anonymous),
          category:forum_categories!forum_posts_category_id_fkey(name, slug, color)
        `)
        .eq('is_published', true)
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
            user_has_liked: !!userLike,
            author: post.author || { display_name: 'Membro Anônimo', is_anonymous: true },
            category: post.category || { name: 'Geral', slug: 'geral', color: '#3B82F6' }
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
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('forum_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

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
          <Card key={i} className="animate-pulse border-0 shadow-sm">
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
      <Card className="border-0 shadow-sm">
        <CardContent className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma discussão encontrada
          </h3>
          <p className="text-gray-500">
            Seja o primeiro a compartilhar nesta categoria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {post.author?.is_anonymous ? 'A' : post.author?.display_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ backgroundColor: `${post.category.color}15`, color: post.category.color }}
                  >
                    {post.category.name}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {post.author?.is_anonymous ? 'Membro Anônimo' : post.author?.display_name}
                  </span>
                  <span className="text-sm text-gray-400">·</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                </div>

                <Link 
                  to={`/comunidade/post/${post.id}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.substring(0, 200)}
                  {post.content.length > 200 && '...'}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-1 h-auto p-0 ${
                      post.user_has_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} className={post.user_has_liked ? 'fill-current' : ''} />
                    <span>{post.likes_count}</span>
                  </Button>
                  
                  <Link 
                    to={`/comunidade/post/${post.id}`}
                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                  >
                    <MessageSquare size={16} />
                    <span>{post.comments_count}</span>
                  </Link>

                  <div className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{post.view_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
