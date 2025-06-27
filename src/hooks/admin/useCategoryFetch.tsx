
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ForumCategory } from "@/types/category";

export const useCategoryFetch = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Admin: Fetching categories for admin...');
      setLoading(true);
      
      // First check if user is admin using the new function
      const { data: isAdminData, error: adminError } = await supabase
        .rpc('current_user_is_admin');

      if (adminError) {
        console.error('❌ Admin: Error checking admin status:', adminError);
        throw adminError;
      }

      console.log('🔐 Admin status:', isAdminData);

      // Fetch categories with proper RLS policies
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Admin: Error fetching categories:', error);
        
        // Check if it's a permission error
        if (error.message.includes('policy') || error.message.includes('permission')) {
          console.error('🚫 Admin: Permission denied - user may not have admin role');
        }
        
        throw error;
      }

      console.log('✅ Admin: Categories fetched successfully:', data?.length || 0);
      setCategories(data || []);
    } catch (err: any) {
      console.error('💥 Admin: Error in fetchCategories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = async () => {
    console.log('🔄 Admin: Manual refetch requested...');
    await fetchCategories();
  };

  return { categories, loading, refetch };
};
