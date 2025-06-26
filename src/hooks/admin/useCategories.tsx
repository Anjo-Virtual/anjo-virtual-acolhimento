
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

  const handleCreateCategory = async (formData: any) => {
    const success = await createCategory(formData);
    if (success) {
      await refetch();
    }
    return success;
  };

  const handleUpdateCategory = async (id: string, data: any) => {
    const success = await updateCategory(id, data);
    if (success) {
      await refetch();
    }
    return success;
  };

  const handleDeleteCategory = async (id: string) => {
    const success = await deleteCategory(id);
    if (success) {
      await refetch();
    }
    return success;
  };

  const handleActivateSpecificCategories = async () => {
    const success = await activateSpecificCategories();
    if (success) {
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
