
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteCategory = () => {
  const { toast } = useToast();

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

  return { deleteCategory };
};
