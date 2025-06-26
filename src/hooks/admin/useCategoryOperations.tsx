
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ForumCategory } from "@/types/category";
import { prepareCategoryData, generateSlug } from "@/utils/categoryUtils";

export const useCategoryOperations = () => {
  const { toast } = useToast();

  const createCategory = async (formData: Omit<ForumCategory, 'id'>) => {
    try {
      console.log('➕ Admin: Creating category:', formData);
      const categoryData = prepareCategoryData(formData);
      
      console.log('📝 Admin: Final category data for creation:', categoryData);
      
      const { data, error } = await supabase
        .from('forum_categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) {
        console.error('❌ Admin: Error creating category:', error);
        throw error;
      }

      console.log('✅ Admin: Category created successfully:', data);

      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      // Broadcast change for real-time updates
      await supabase.channel('category-updates').send({
        type: 'broadcast',
        event: 'category_created',
        payload: data
      });

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
      
      const { data: existingCategory, error: fetchError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingCategory) {
        console.error('❌ Admin: Category not found:', id, fetchError);
        throw new Error('Categoria não encontrada');
      }

      console.log('📄 Admin: Found existing category:', existingCategory);
      
      const updateData: any = { ...data };
      
      // Gerar novo slug se o nome mudou
      if (data.name && data.name !== existingCategory.name) {
        updateData.slug = generateSlug(data.name);
      }

      // Garantir que description nunca seja null
      if (updateData.description === undefined || updateData.description === null) {
        updateData.description = existingCategory.description || 'Categoria para discussões e apoio mútuo';
      }

      // Validar sort_order
      if (updateData.sort_order !== undefined) {
        updateData.sort_order = Math.max(0, parseInt(updateData.sort_order) || 0);
      }

      console.log('📝 Admin: Final update data:', updateData);

      const { data: updatedData, error: updateError } = await supabase
        .from('forum_categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Admin: Error updating category:', updateError);
        throw updateError;
      }

      console.log('✅ Admin: Category updated successfully:', updatedData);

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });

      // Broadcast change for real-time updates
      await supabase.channel('category-updates').send({
        type: 'broadcast',
        event: 'category_updated',
        payload: updatedData
      });

      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao atualizar categoria:', error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar a categoria: ${error.message}`,
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

      // Broadcast change for real-time updates
      await supabase.channel('category-updates').send({
        type: 'broadcast',
        event: 'category_deleted',
        payload: { id }
      });

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

  const activateSpecificCategories = async () => {
    const categoriesToActivate = [
      'Apoio Emocional',
      'Histórias de Superação', 
      'Dúvidas e Orientações',
      'Grupos de Apoio'
    ];

    try {
      console.log('🔄 Admin: Activating specific categories:', categoriesToActivate);
      
      for (const categoryName of categoriesToActivate) {
        const { error } = await supabase
          .from('forum_categories')
          .update({ is_active: true })
          .eq('name', categoryName);

        if (error) {
          console.error(`❌ Error activating category ${categoryName}:`, error);
        } else {
          console.log(`✅ Activated category: ${categoryName}`);
        }
      }

      toast({
        title: "Sucesso",
        description: "Categorias específicas foram ativadas!",
      });

      // Broadcast change for real-time updates
      await supabase.channel('category-updates').send({
        type: 'broadcast',
        event: 'categories_activated',
        payload: { categories: categoriesToActivate }
      });

      return true;
    } catch (error: any) {
      console.error('💥 Error activating categories:', error);
      toast({
        title: "Erro",
        description: "Erro ao ativar categorias específicas.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    activateSpecificCategories
  };
};
