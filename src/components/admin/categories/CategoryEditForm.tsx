
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

interface CategoryEditFormProps {
  category: ForumCategory;
  onSubmit: (id: string, data: Partial<ForumCategory>) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Submitting category update:', formData);
    onSubmit(category.id, formData);
  };

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
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da categoria"
                required
              />
            </div>
            <div>
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
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
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sort_order">Ordem de Exibição</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Categoria Ativa</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save size={16} />
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
              className="flex items-center gap-2"
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
