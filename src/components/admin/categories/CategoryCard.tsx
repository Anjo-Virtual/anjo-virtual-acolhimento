
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ForumCategory } from "@/types/category";

interface CategoryCardProps {
  category: ForumCategory;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              📝
            </div>
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? 'Ativa' : 'Inativa'}
                </Badge>
                <span className="text-xs text-gray-500">Slug: {category.slug}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(category.id)}
              className="flex items-center gap-1"
            >
              <Edit size={14} />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(category.id)}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
