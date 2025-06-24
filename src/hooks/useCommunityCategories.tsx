
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
        secureLog('info', 'Fetching forum categories with simplified RLS');
        setLoading(true);
        setError(null);
        
        // Com as novas políticas simplificadas, esta consulta deve funcionar
        const { data, error } = await supabase
          .from('forum_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }

        console.log('Categories fetched successfully:', data?.length || 0);

        // Mapear dados com contadores padrão (será otimizado posteriormente)
        const categoriesWithStats = data?.map(cat => ({
          ...cat,
          posts_count: 0, // Será calculado posteriormente quando necessário
          last_activity: cat.created_at || new Date().toISOString()
        })) || [];

        if (isMounted) {
          setCategories(categoriesWithStats);
          setError(null);
          secureLog('info', `Successfully loaded ${categoriesWithStats.length} categories`);
        }
      } catch (err: any) {
        secureLog('error', 'Error fetching categories:', err);
        console.error('Full error details:', err);
        
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
    console.log('Refetching categories...');
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error refetching categories:', error);
        throw error;
      }

      const categoriesWithStats = data?.map(cat => ({
        ...cat,
        posts_count: 0,
        last_activity: cat.created_at || new Date().toISOString()
      })) || [];

      setCategories(categoriesWithStats);
      console.log('Categories refetched successfully:', categoriesWithStats.length);
      secureLog('info', `Refetched ${categoriesWithStats.length} categories`);
    } catch (err: any) {
      console.error('Error refetching categories:', err);
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
