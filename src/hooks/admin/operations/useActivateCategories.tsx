
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useActivateCategories = () => {
  const { toast } = useToast();

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

  return { activateSpecificCategories };
};
