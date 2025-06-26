
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { secureLog } from "@/utils/security";
import { ForumCategory } from "@/types/category";

type CommunityCategory = ForumCategory & {
  posts_count: number;
  last_activity: string;
};

// Reduzir o tempo de cache para 10 segundos para melhor sincronização
const CACHE_DURATION = 10 * 1000;
let categoriesCache: CommunityCategory[] | null = null;
let cacheTimestamp: number = 0;

export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (forceRefresh = false) => {
    try {
      console.log('🔍 Fetching community categories...');
      
      // Verificar cache apenas se não for refresh forçado
      const now = Date.now();
      if (!forceRefresh && categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('📋 Using cached categories');
        setCategories(categoriesCache);
        setLoading(false);
        return;
      }

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
        console.log('🏷️ Processing category:', cat.name, 'slug:', cat.slug, 'active:', cat.is_active, 'description:', cat.description);
        return {
          ...cat,
          posts_count: 0,
          last_activity: cat.created_at || new Date().toISOString()
        };
      }) || [];

      console.log('🎯 Final categories with stats:', categoriesWithStats);

      // Atualizar cache
      categoriesCache = categoriesWithStats;
      cacheTimestamp = now;

      setCategories(categoriesWithStats);
      setError(null);
      secureLog('info', `Successfully loaded ${categoriesWithStats.length} categories`);
    } catch (err: any) {
      console.error('💥 Error in fetchCategories:', err);
      secureLog('error', 'Error fetching categories:', err);
      
      setError(err.message || 'Erro ao carregar categorias');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      if (isMounted) {
        await fetchCategories();
      }
    };

    loadCategories();

    // Configurar realtime updates para sincronização automática
    const channel = supabase
      .channel('category-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_categories'
        },
        (payload) => {
          console.log('🔄 Category change detected:', payload);
          // Invalidar cache e refetch
          categoriesCache = null;
          cacheTimestamp = 0;
          if (isMounted) {
            fetchCategories(true);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const refetch = async () => {
    console.log('🔄 Manual refetch requested...');
    await fetchCategories(true);
  };

  // Função para invalidar cache (útil para chamar após mudanças no admin)
  const invalidateCache = () => {
    categoriesCache = null;
    cacheTimestamp = 0;
  };

  return { 
    categories, 
    loading, 
    error, 
    refetch,
    invalidateCache
  };
};
