
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActivePost, ForumFilter } from "@/types/forum";

export const useActivePosts = (filter: ForumFilter) => {
  const [posts, setPosts] = useState<ActivePost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivePosts();
  }, [filter]);

  const fetchActivePosts = async () => {
    try {
      let query = supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          view_count,
          category:forum_categories(name, color),
          author:community_profiles!forum_posts_author_id_fkey(display_name, is_anonymous),
          forum_post_likes(count),
          forum_comments(count)
        `)
        .eq('is_published', true);

      const { data: rawData, error } = await query.limit(20);

      if (error) throw error;

      // Transform the data to include counts
      const transformedData = rawData?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
        view_count: post.view_count || 0,
        likes_count: post.forum_post_likes?.length || 0,
        replies_count: post.forum_comments?.length || 0,
        category: post.category || { name: 'Geral', color: '#3B82F6' },
        author: post.author || { display_name: 'Membro Anônimo', is_anonymous: true }
      })) || [];

      // Apply sorting based on filter
      let sortedData = [...transformedData];
      switch (filter) {
        case 'recent':
          sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'popular':
          sortedData.sort((a, b) => b.likes_count - a.likes_count);
          break;
        case 'trending':
          sortedData.sort((a, b) => b.replies_count - a.replies_count);
          break;
      }

      setPosts(sortedData);
    } catch (error) {
      console.error('Erro ao carregar posts ativos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts ativos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, refetch: fetchActivePosts };
};
