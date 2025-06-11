
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface UsePostListProps {
  categorySlug?: string;
  limit?: number;
}

export const usePostList = ({ categorySlug, limit }: UsePostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [categorySlug]);

  const fetchPosts = async () => {
    try {
      // Usar a view otimizada em vez de múltiplas consultas
      let query = supabase
        .from('forum_posts_with_stats')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Filtrar por categoria se necessário
      if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      // Obter o usuário atual uma vez só
      const { data: { user } } = await supabase.auth.getUser();
      
      // Se há usuário logado, verificar quais posts foram curtidos
      let userLikes: string[] = [];
      if (user && postsData?.length) {
        const postIds = postsData.map(post => post.id);
        const { data: likesData } = await supabase
          .from('forum_post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        
        userLikes = likesData?.map(like => like.post_id) || [];
      }

      // Transformar os dados para o formato esperado
      const transformedPosts = (postsData || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        view_count: post.view_count || 0,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        user_has_liked: userLikes.includes(post.id),
        author: {
          display_name: post.author_display_name || 'Membro Anônimo',
          is_anonymous: post.author_is_anonymous !== false
        },
        category: {
          name: post.category_name || 'Geral',
          slug: post.category_slug || 'geral',
          color: post.category_color || '#3B82F6'
        }
      }));

      setPosts(transformedPosts);
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

      // Atualizar estado localmente para resposta imediata
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

  return { posts, loading, toggleLike, refetch: fetchPosts };
};
