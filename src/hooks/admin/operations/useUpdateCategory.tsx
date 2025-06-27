
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ForumCategory } from "@/types/category";
import { generateSlug } from "@/utils/categoryUtils";

export const useUpdateCategory = () => {
  const { toast } = useToast();

  const updateCategory = async (id: string, data: Partial<ForumCategory>) => {
    try {
      console.log('✏️ Admin: Updating category:', id, data);
      
      const updateData: any = { ...data };
      
      // Generate new slug if name changed
      if (data.name) {
        updateData.slug = generateSlug(data.name);
      }

      // Handle description properly - allow empty string but not null
      if (updateData.description === undefined) {
        updateData.description = '';
      } else if (updateData.description === null) {
        updateData.description = '';
      }

      // Validate sort_order
      if (updateData.sort_order !== undefined) {
        updateData.sort_order = Math.max(0, parseInt(updateData.sort_order) || 0);
      }

      console.log('📝 Admin: Final update data:', updateData);

      // Perform the update with select to verify changes
      const { data: updatedRows, error: updateError, count } = await supabase
        .from('forum_categories')
        .update(updateData)
        .eq('id', id)
        .select('*');

      if (updateError) {
        console.error('❌ Admin: Error updating category:', updateError);
        throw updateError;
      }

      // Verify that the update actually affected a row
      if (!updatedRows || updatedRows.length === 0) {
        console.error('❌ Admin: No rows were updated - category not found or no permission');
        throw new Error('Nenhuma categoria foi atualizada. Verifique se você tem permissão para editar esta categoria.');
      }

      console.log('✅ Admin: Category updated successfully:', updatedRows[0]);

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao atualizar categoria:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Não foi possível atualizar a categoria';
      
      if (error.message.includes('permission') || error.message.includes('policy')) {
        errorMessage = 'Você não tem permissão para editar categorias. Verifique se possui role de admin.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Categoria não encontrada.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return { updateCategory };
};
