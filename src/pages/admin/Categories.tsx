import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw } from "lucide-react";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { CategoryEditForm } from "@/components/admin/categories/CategoryEditForm";
import { CategoryCard } from "@/components/admin/categories/CategoryCard";
import { useCategories } from "@/hooks/admin/useCategories";

const AdminCategories = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { 
    categories, 
    loading, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    activateSpecificCategories 
  } = useCategories();

  const handleCreate = async (formData: any) => {
    const success = await createCategory(formData);
    if (success) {
      setShowCreateForm(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleUpdate = async (id: string, data: any): Promise<boolean> => {
    const success = await updateCategory(id, data);
    if (success) {
      setEditingId(null);
    }
    return success;
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta categoria?');
    if (confirmed) {
      await deleteCategory(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
          <p className="text-gray-600">Administre as categorias do fórum da comunidade</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={activateSpecificCategories}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Ativar Categorias
          </Button>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Nova Categoria
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category.id}>
            {editingId === category.id ? (
              <CategoryEditForm
                category={category}
                onSubmit={handleUpdate}
                onCancel={handleCancelEdit}
              />
            ) : (
              <CategoryCard
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma categoria encontrada</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Criar primeira categoria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCategories;
