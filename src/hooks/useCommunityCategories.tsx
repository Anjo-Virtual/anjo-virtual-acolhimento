
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

// Cache simples para categorias
let categoriesCache: ForumCategory[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        // Verificar cache primeiro
        const now = Date.now();
        if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
          secureLog('info', 'Using cached categories');
          if (isMounted) {
            setCategories(categoriesCache);
            setLoading(false);
          }
          return;
        }

        secureLog('info', 'Fetching forum categories from database');
        setLoading(true);
        setError(null);
        
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

        const categoriesWithStats = data?.map(cat => ({
          ...cat,
          posts_count: 0, // Será calculado quando necessário
          last_activity: cat.created_at || new Date().toISOString()
        })) || [];

        // Atualizar cache
        categoriesCache = categoriesWithStats;
        cacheTimestamp = now;

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
    // Limpar cache ao refetch manual
    categoriesCache = null;
    cacheTimestamp = 0;
    
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

      // Atualizar cache
      categoriesCache = categoriesWithStats;
      cacheTimestamp = Date.now();

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
