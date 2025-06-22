
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
      console.log('[useCommunityDashboard] Buscando categorias...');
      
      // Usar a nova view com estatísticas
      const { data, error } = await supabase
        .from('forum_categories_with_stats')
        .select('*')
        .limit(4); // Limitar para dashboard

      if (error) {
        console.error('[useCommunityDashboard] Erro:', error);
        throw error;
      }

      console.log('[useCommunityDashboard] Categorias carregadas:', data?.length || 0);
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias para dashboard:', error);
      setCategories([]);
    }
  };

  return { categories };
};
