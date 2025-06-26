
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
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log('Categories fetched successfully:', data?.length || 0);
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
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
      console.log('Creating category:', formData);
      const slug = generateSlug(formData.name);
      const { error } = await supabase
        .from('forum_categories')
        .insert({
          ...formData,
          slug
        });

      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      fetchCategories();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
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
      console.log('Updating category:', id, data);
      // Se o nome foi alterado, gerar novo slug
      const updateData = { ...data };
      if (data.name) {
        updateData.slug = generateSlug(data.name);
      }

      const { error } = await supabase
        .from('forum_categories')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });

      fetchCategories();
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error);
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
      console.log('Deleting category:', id);
      const { error } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });

      fetchCategories();
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
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
