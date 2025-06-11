
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  posts_count: number;
  last_activity: string;
}

interface CategoriesSectionProps {
  categories: ForumCategory[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categorias de Discussão</CardTitle>
            <CardDescription>
              Explore os diferentes tópicos da nossa comunidade
            </CardDescription>
          </div>
          <Link to="/comunidade/ativos">
            <Button variant="outline" size="sm">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/comunidade/${category.slug}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category.color}15`, color: category.color }}
                    >
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{category.posts_count} discussões</span>
                        <Badge variant="secondary" className="text-xs">
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
