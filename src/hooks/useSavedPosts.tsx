
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SavedPost {
  id: string;
  post_id: string;
  saved_at: string;
  post?: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author?: {
      display_name: string;
    };
    category?: {
      name: string;
      color: string;
    };
  };
}

export const useSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCommunityAuth();
  const { toast } = useToast();

  const fetchSavedPosts = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('saved_posts')
        .select(`
          *,
          post:forum_posts(
            id,
            title,
            content,
            created_at,
            author:community_profiles!author_id(display_name),
            category:forum_categories!category_id(name, color)
          )
        `)
        .eq('user_id', profile.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts salvos:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return false;

      const { error } = await supabase
        .from('saved_posts')
        .insert({
          user_id: profile.id,
          post_id: postId
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post salvo com sucesso!",
      });

      fetchSavedPosts();
      return true;
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o post.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeSavedPost = async (savedPostId: string) => {
    try {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('id', savedPostId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post removido dos salvos!",
      });

      fetchSavedPosts();
      return true;
    } catch (error) {
      console.error('Erro ao remover post salvo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o post.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [user]);

  return {
    savedPosts,
    loading,
    savePost,
    removeSavedPost,
    refetch: fetchSavedPosts
  };
};
