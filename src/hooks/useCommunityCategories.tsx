
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
        secureLog('info', 'Fetching forum categories');
        setLoading(true);
        setError(null);
        
        // Tentar buscar da view primeiro, se falhar buscar da tabela direta
        let data, error;
        
        try {
          const viewResult = await supabase
            .from('forum_categories_with_stats')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
          
          data = viewResult.data;
          error = viewResult.error;
          
          secureLog('info', 'Tentativa com view:', { data: data?.length, error });
        } catch (viewError) {
          secureLog('warn', 'View falhou, tentando tabela direta:', viewError);
          
          // Fallback para tabela direta
          const tableResult = await supabase
            .from('forum_categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
          
          data = tableResult.data;
          error = tableResult.error;
        }

        if (error) {
          throw error;
        }

        // Mapear para incluir contadores como fallback se não vieram da view
        const categoriesWithStats = data?.map(cat => ({
          ...cat,
          posts_count: cat.posts_count || 0,
          last_activity: cat.last_activity || cat.created_at || new Date().toISOString()
        })) || [];

        if (isMounted) {
          setCategories(categoriesWithStats);
          setError(null);
          secureLog('info', `Successfully loaded ${categoriesWithStats.length} categories`);
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
        const viewResult = await supabase
          .from('forum_categories_with_stats')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        data = viewResult.data;
        error = viewResult.error;
      } catch (viewError) {
        const tableResult = await supabase
          .from('forum_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        data = tableResult.data;
        error = tableResult.error;
      }

      if (error) throw error;

      const categoriesWithStats = data?.map(cat => ({
        ...cat,
        posts_count: cat.posts_count || 0,
        last_activity: cat.last_activity || cat.created_at || new Date().toISOString()
      })) || [];

      setCategories(categoriesWithStats);
      secureLog('info', `Refetched ${categoriesWithStats.length} categories`);
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
