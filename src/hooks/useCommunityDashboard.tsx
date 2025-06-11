
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  posts_count: number;
  last_activity: string;
}

export const useCommunityDashboard = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (data) {
        // Buscar contadores para cada categoria
        const categoriesWithCounts = await Promise.all(
          data.map(async (category) => {
            const { count } = await supabase
              .from('forum_posts')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('is_published', true);

            const { data: lastPost } = await supabase
              .from('forum_posts')
              .select('created_at')
              .eq('category_id', category.id)
              .eq('is_published', true)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            return {
              ...category,
              posts_count: count || 0,
              last_activity: lastPost?.created_at || category.created_at || new Date().toISOString()
            };
          })
        );

        setCategories(categoriesWithCounts);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  return { categories };
};
