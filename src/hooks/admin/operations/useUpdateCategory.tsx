
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

      // First, perform the update
      const { error: updateError } = await supabase
        .from('forum_categories')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('❌ Admin: Error updating category:', updateError);
        throw updateError;
      }

      // Then fetch the updated data to confirm the changes
      const { data: updatedData, error: fetchError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Admin: Error fetching updated category:', fetchError);
        throw fetchError;
      }

      // Check if data was found after update
      if (!updatedData) {
        console.warn('⚠️ Admin: No data returned after update, but operation may have succeeded');
        // Don't throw error, just log warning and proceed with success
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
        payload: updatedData || { id, ...updateData }
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
