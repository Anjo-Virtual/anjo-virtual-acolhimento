
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
};

interface CommunityPreviewProps {
  categories: ForumCategory[];
}

const CommunityPreview = ({ categories }: CommunityPreviewProps) => {
  return (
    <Card className="mt-12">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Fóruns Disponíveis</CardTitle>
        <CardDescription className="text-lg">
          Veja os tópicos que você poderá acessar após o cadastro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <div key={category.id} className="text-center p-4 border-2 rounded-lg bg-gradient-to-b from-gray-50 to-white hover:shadow-md transition-all cursor-pointer group">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <MessageSquare size={24} />
              </div>
              <h4 className="font-semibold mb-1">{category.name}</h4>
              <p className="text-xs text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPreview;
