
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ForumCategory } from "@/types/category";

export const useCategoryFetch = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('📋 Admin: Fetching categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Admin: Error fetching categories:', error);
        throw error;
      }

      console.log('✅ Admin: Categories fetched successfully:', data?.length || 0);
      console.log('📊 Admin: Categories details:', data?.map(cat => ({ 
        name: cat.name, 
        slug: cat.slug, 
        active: cat.is_active 
      })));
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('💥 Admin: Erro ao carregar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    refetch: fetchCategories
  };
};
