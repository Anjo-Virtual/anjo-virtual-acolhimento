
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

      // Perform the update
      const { error: updateError } = await supabase
        .from('forum_categories')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('❌ Admin: Error updating category:', updateError);
        throw updateError;
      }

      console.log('✅ Admin: Category updated successfully');

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
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

  return { updateCategory };
};
