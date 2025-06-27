
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ForumCategory } from "@/types/category";

export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      console.log('🎯 Community: Fetching active categories...');
      setLoading(true);
      setError(null);
      
      // Fetch only active categories for community users
      const { data, error: fetchError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) {
        console.error('❌ Community: Error fetching categories:', fetchError);
        setError('Erro ao carregar categorias');
        throw fetchError;
      }

      console.log('✅ Community: Active categories fetched:', data?.length || 0);
      setCategories(data || []);
    } catch (err: any) {
      console.error('💥 Community: Error in fetchCategories:', err);
      setCategories([]);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = async () => {
    console.log('🔄 Community: Manual refetch requested...');
    await fetchCategories();
  };

  return { categories, loading, error, refetch };
};
