
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategoryFormData } from "@/types/category";
import { generateSlug } from "@/utils/categoryUtils";

export const useCreateCategory = () => {
  const { toast } = useToast();

  const createCategory = async (data: CategoryFormData) => {
    try {
      console.log('🆕 Admin: Creating category:', data);

      // First check if user is admin
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('current_user_is_admin');

      if (adminError || !isAdmin) {
        console.error('🚫 Admin: User is not admin or error checking admin status:', adminError);
        throw new Error('Você não tem permissão para criar categorias. Verifique se possui role de admin.');
      }

      const categoryData = {
        ...data,
        slug: generateSlug(data.name),
        description: data.description || '',
        sort_order: Math.max(0, data.sort_order || 0)
      };

      console.log('📝 Admin: Final category data:', categoryData);

      const { data: createdCategory, error: createError } = await supabase
        .from('forum_categories')
        .insert([categoryData])
        .select('*')
        .single();

      if (createError) {
        console.error('❌ Admin: Error creating category:', createError);
        throw createError;
      }

      console.log('✅ Admin: Category created successfully:', createdCategory);

      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('💥 Admin: Erro ao criar categoria:', error);
      
      let errorMessage = 'Não foi possível criar a categoria';
      
      if (error.message.includes('permission') || error.message.includes('policy')) {
        errorMessage = 'Você não tem permissão para criar categorias. Verifique se possui role de admin.';
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

  return { createCategory };
};
