
import { useCategoryFetch } from "./useCategoryFetch";
import { useCategoryOperations } from "./useCategoryOperations";

export const useCategories = () => {
  const { categories, loading, refetch } = useCategoryFetch();
  const { 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    activateSpecificCategories 
  } = useCategoryOperations();

  const handleCreateCategory = async (formData: any): Promise<boolean> => {
    console.log('🆕 Creating category...');
    const success = await createCategory(formData);
    if (success) {
      console.log('✅ Category created, refreshing list...');
      await refetch();
    }
    return success;
  };

  const handleUpdateCategory = async (id: string, data: any): Promise<boolean> => {
    console.log('✏️ Updating category:', id);
    const success = await updateCategory(id, data);
    if (success) {
      console.log('✅ Category updated, refreshing list...');
      // Aguardar um pouco antes de refetch para garantir que a mudança foi persistida
      setTimeout(async () => {
        await refetch();
      }, 500);
    }
    return success;
  };

  const handleDeleteCategory = async (id: string): Promise<boolean> => {
    console.log('🗑️ Deleting category:', id);
    const success = await deleteCategory(id);
    if (success) {
      console.log('✅ Category deleted, refreshing list...');
      await refetch();
    }
    return success;
  };

  const handleActivateSpecificCategories = async (): Promise<boolean> => {
    console.log('🔄 Activating specific categories...');
    const success = await activateSpecificCategories();
    if (success) {
      console.log('✅ Categories activated, refreshing list...');
      await refetch();
    }
    return success;
  };

  return {
    categories,
    loading,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    refetch,
    activateSpecificCategories: handleActivateSpecificCategories
  };
};
