
import { useCreateCategory } from "./operations/useCreateCategory";
import { useUpdateCategory } from "./operations/useUpdateCategory";
import { useDeleteCategory } from "./operations/useDeleteCategory";
import { useActivateCategories } from "./operations/useActivateCategories";

export const useCategoryOperations = () => {
  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();
  const { deleteCategory } = useDeleteCategory();
  const { activateSpecificCategories } = useActivateCategories();

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    activateSpecificCategories
  };
};
