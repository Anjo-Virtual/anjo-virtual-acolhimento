
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { CategoryFormData } from "@/types/category";

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CategoryForm = ({ onSubmit, onCancel, isSubmitting = false }: CategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    color: '#3B82F6',
    icon: 'MessageSquare',
    sort_order: 0,
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Categoria</CardTitle>
        <CardDescription>Preencha os dados para criar uma nova categoria</CardDescription>
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
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save size={16} />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
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
