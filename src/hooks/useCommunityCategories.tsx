
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { secureLog } from "@/utils/security";

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
  posts_count: number;
  last_activity: string;
};

export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        secureLog('info', 'Fetching forum categories with stats');
        
        // Tentar usar a view primeiro, se falhar usar tabela direta
        let data, error;
        
        try {
          const result = await supabase
            .from('forum_categories_with_stats')
            .select('*')
            .order('sort_order', { ascending: true });
          
          data = result.data;
          error = result.error;
        } catch (viewError) {
          secureLog('warn', 'View not available, falling back to direct table query', viewError);
          
          // Fallback para tabela direta
          const result = await supabase
            .from('forum_categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
          
          data = result.data?.map(cat => ({
            ...cat,
            posts_count: 0,
            last_activity: cat.created_at
          }));
          error = result.error;
        }

        if (error) {
          throw error;
        }

        if (isMounted) {
          setCategories(data || []);
          setError(null);
          secureLog('info', `Successfully loaded ${data?.length || 0} categories`);
        }
      } catch (err: any) {
        secureLog('error', 'Error fetching categories:', err);
        if (isMounted) {
          setError(err.message || 'Erro ao carregar categorias');
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data, error;
      
      try {
        const result = await supabase
          .from('forum_categories_with_stats')
          .select('*')
          .order('sort_order', { ascending: true });
        
        data = result.data;
        error = result.error;
      } catch (viewError) {
        const result = await supabase
          .from('forum_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        data = result.data?.map(cat => ({
          ...cat,
          posts_count: 0,
          last_activity: cat.created_at
        }));
        error = result.error;
      }

      if (error) throw error;

      setCategories(data || []);
      secureLog('info', `Refetched ${data?.length || 0} categories`);
    } catch (err: any) {
      secureLog('error', 'Error refetching categories:', err);
      setError(err.message || 'Erro ao recarregar categorias');
    } finally {
      setLoading(false);
    }
  };

  return { 
    categories, 
    loading, 
    error, 
    refetch 
  };
};
