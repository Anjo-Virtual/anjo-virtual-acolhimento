
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
      // Buscar categorias com contadores em uma única consulta otimizada
      const { data } = await supabase
        .from('forum_categories')
        .select(`
          *,
          forum_posts!inner(
            id,
            created_at,
            is_published
          )
        `)
        .eq('is_active', true)
        .eq('forum_posts.is_published', true)
        .order('sort_order');

      if (data) {
        // Processar dados para obter contadores
        const categoriesWithCounts = data.map(category => {
          const posts = category.forum_posts || [];
          const postsCount = posts.length;
          const lastPost = posts.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          return {
            id: category.id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            color: category.color,
            posts_count: postsCount,
            last_activity: lastPost?.created_at || category.created_at || new Date().toISOString()
          };
        });

        // Para categorias sem posts, fazer uma consulta adicional mais eficiente
        const { data: allCategories } = await supabase
          .from('forum_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        const finalCategories = (allCategories || []).map(category => {
          const existingCategory = categoriesWithCounts.find(c => c.id === category.id);
          if (existingCategory) {
            return existingCategory;
          }
          
          return {
            id: category.id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            color: category.color,
            posts_count: 0,
            last_activity: category.created_at || new Date().toISOString()
          };
        });

        setCategories(finalCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  return { categories };
};
