
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

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

  const createCategory = async (formData: Omit<ForumCategory, 'id'>) => {
    try {
      console.log('➕ Admin: Creating category:', formData);
      const slug = generateSlug(formData.name);
      
      // Garantir que a categoria seja criada como ativa
      const categoryData = {
        ...formData,
        slug,
        is_active: true // Forçar como ativo
      };
      
      console.log('📝 Admin: Final category data:', categoryData);
      
      const { error } = await supabase
        .from('forum_categories')
        .insert(categoryData);

      if (error) {
        console.error('❌ Admin: Error creating category:', error);
        throw error;
      }

      console.log('✅ Admin: Category created successfully');

      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      await fetchCategories();
      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao criar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a categoria.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCategory = async (id: string, data: Partial<ForumCategory>) => {
    try {
      console.log('✏️ Admin: Updating category:', id, data);
      // Se o nome foi alterado, gerar novo slug
      const updateData = { ...data };
      if (data.name) {
        updateData.slug = generateSlug(data.name);
      }

      console.log('📝 Admin: Final update data:', updateData);

      const { error } = await supabase
        .from('forum_categories')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('❌ Admin: Error updating category:', error);
        throw error;
      }

      console.log('✅ Admin: Category updated successfully');

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });

      await fetchCategories();
      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao atualizar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a categoria.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('🗑️ Admin: Deleting category:', id);
      const { error } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Admin: Error deleting category:', error);
        throw error;
      }

      console.log('✅ Admin: Category deleted successfully');

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });

      await fetchCategories();
      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao excluir categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
