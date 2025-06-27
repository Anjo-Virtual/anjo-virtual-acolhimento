
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteCategory = () => {
  const { toast } = useToast();

  const deleteCategory = async (id: string) => {
    try {
      console.log('🗑️ Admin: Deleting category:', id);

      // Perform the delete with count to verify deletion
      const { data: deletedRows, error: deleteError } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', id)
        .select('*');

      if (deleteError) {
        console.error('❌ Admin: Error deleting category:', deleteError);
        throw deleteError;
      }

      // Verify that the delete actually affected a row
      if (!deletedRows || deletedRows.length === 0) {
        console.error('❌ Admin: No rows were deleted - category not found or no permission');
        throw new Error('Nenhuma categoria foi excluída. Verifique se você tem permissão para excluir esta categoria.');
      }

      console.log('✅ Admin: Category deleted successfully');

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao excluir categoria:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Não foi possível excluir a categoria';
      
      if (error.message.includes('permission') || error.message.includes('policy')) {
        errorMessage = 'Você não tem permissão para excluir categorias. Verifique se possui role de admin.';
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

  return { deleteCategory };
};
