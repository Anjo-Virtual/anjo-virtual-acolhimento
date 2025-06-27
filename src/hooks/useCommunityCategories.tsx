
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { secureLog } from "@/utils/security";
import { ForumCategory } from "@/types/category";

type CommunityCategory = ForumCategory & {
  posts_count: number;
  last_activity: string;
};

// Cache mais robusto
const CACHE_DURATION = 10 * 1000; // 10 segundos
let categoriesCache: CommunityCategory[] | null = null;
let cacheTimestamp: number = 0;
let activeChannel: any = null;

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

      console.log('✅ Categories fetched successfully:', data?.length || 0);

      const categoriesWithStats = data?.map(cat => {
        console.log('🏷️ Processing category:', cat.name, 'slug:', cat.slug);
        
        return {
          ...cat,
          posts_count: 0,
          last_activity: cat.created_at || new Date().toISOString()
        };
      }) || [];

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

    // Cleanup any existing channel
    if (activeChannel) {
      console.log('🧹 Cleaning up existing channel');
      supabase.removeChannel(activeChannel);
      activeChannel = null;
    }

    // Configurar realtime updates - apenas uma subscription
    activeChannel = supabase
      .channel('community-categories-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_categories'
        },
        (payload) => {
          console.log('🔄 Category change detected:', payload.eventType);
          // Invalidar cache e refetch apenas se montado
          if (isMounted) {
            categoriesCache = null;
            cacheTimestamp = 0;
            fetchCategories(true);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Channel subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleanup: Component unmounting');
      isMounted = false;
      if (activeChannel) {
        supabase.removeChannel(activeChannel);
        activeChannel = null;
      }
    };
  }, []);

  const refetch = async () => {
    console.log('🔄 Manual refetch requested...');
    await fetchCategories(true);
  };

  // Função para invalidar cache
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
