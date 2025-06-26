
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
  is_active: boolean; // Added missing property
  posts_count: number;
  last_activity: string;
};

// Cache simples para categorias - removido para debug
let categoriesCache: ForumCategory[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 1000; // Reduzido para 30 segundos para debug

export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        console.log('🔍 Fetching community categories...');
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('forum_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('❌ Error fetching categories:', error);
          throw error;
        }

        console.log('✅ Raw categories data:', data);
        console.log('📊 Categories count:', data?.length || 0);

        const categoriesWithStats = data?.map(cat => {
          console.log('🏷️ Processing category:', cat.name, 'slug:', cat.slug, 'active:', cat.is_active);
          return {
            ...cat,
            posts_count: 0, // Será calculado quando necessário
            last_activity: cat.created_at || new Date().toISOString()
          };
        }) || [];

        console.log('🎯 Final categories with stats:', categoriesWithStats);

        if (isMounted) {
          setCategories(categoriesWithStats);
          setError(null);
          secureLog('info', `Successfully loaded ${categoriesWithStats.length} categories`);
        }
      } catch (err: any) {
        console.error('💥 Error in fetchCategories:', err);
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

    // Sempre buscar dados frescos para debug
    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    console.log('🔄 Manual refetch requested...');
    // Limpar cache completamente
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
        console.error('❌ Error refetching categories:', error);
        throw error;
      }

      console.log('🔄 Refetched categories:', data?.length || 0);

      const categoriesWithStats = data?.map(cat => ({
        ...cat,
        posts_count: 0,
        last_activity: cat.created_at || new Date().toISOString()
      })) || [];

      setCategories(categoriesWithStats);
      console.log('✅ Categories updated successfully');
      secureLog('info', `Refetched ${categoriesWithStats.length} categories`);
    } catch (err: any) {
      console.error('💥 Error refetching categories:', err);
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
