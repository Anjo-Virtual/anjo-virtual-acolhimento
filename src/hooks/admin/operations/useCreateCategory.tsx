
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ForumCategory } from "@/types/category";
import { prepareCategoryData } from "@/utils/categoryUtils";

export const useCreateCategory = () => {
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

  return { createCategory };
};
