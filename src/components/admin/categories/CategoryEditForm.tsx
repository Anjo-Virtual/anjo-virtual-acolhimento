
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";
import { ForumCategory } from "@/types/category";

interface CategoryEditFormProps {
  category: ForumCategory;
  onSubmit: (id: string, data: Partial<ForumCategory>) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CategoryEditForm = ({ category, onSubmit, onCancel, isSubmitting = false }: CategoryEditFormProps) => {
  const [formData, setFormData] = useState({
    name: category.name || '',
    description: category.description || '',
    color: category.color || '#3B82F6',
    icon: category.icon || 'MessageSquare',
    sort_order: category.sort_order || 0,
    is_active: category.is_active ?? true
  });

  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  // Reset form when category changes
  useEffect(() => {
    setFormData({
      name: category.name || '',
      description: category.description || '',
      color: category.color || '#3B82F6',
      icon: category.icon || 'MessageSquare',
      sort_order: category.sort_order || 0,
      is_active: category.is_active ?? true
    });
  }, [category.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      return;
    }

    console.log('📝 Submitting category update:', formData);
    setLocalIsSubmitting(true);
    
    try {
      // Prepare data for submission, ensuring description is properly handled
      const dataToSubmit = {
        ...formData,
        description: formData.description.trim() || '', // Ensure empty string instead of null
        sort_order: Math.max(0, parseInt(formData.sort_order.toString()) || 0)
      };

      console.log('📤 Data being sent to backend:', dataToSubmit);
      
      const success = await onSubmit(category.id, dataToSubmit);
      
      if (success) {
        console.log('✅ Category update successful');
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error);
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  const isFormSubmitting = isSubmitting || localIsSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Categoria</CardTitle>
        <CardDescription>Modifique os dados da categoria "{category.name}"</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da categoria"
                required
                disabled={isFormSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                disabled={isFormSubmitting}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da categoria"
              rows={3}
              disabled={isFormSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sort_order">Ordem de Exibição</Label>
              <Input
                id="sort_order"
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                disabled={isFormSubmitting}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                disabled={isFormSubmitting}
              />
              <Label htmlFor="is_active">Categoria Ativa</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isFormSubmitting} className="flex items-center gap-2">
              <Save size={16} />
              {isFormSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
              className="flex items-center gap-2"
              disabled={isFormSubmitting}
            >
              <X size={16} />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
