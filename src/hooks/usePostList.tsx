
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

  return { posts, loading, toggleLike, refetch: fetchPosts };
};
