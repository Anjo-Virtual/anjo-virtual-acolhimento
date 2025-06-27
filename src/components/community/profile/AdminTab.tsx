
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Folder } from "lucide-react";

const AdminTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administração da Comunidade</CardTitle>
        <CardDescription>
          Ferramentas administrativas para gerenciar a comunidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <Link to="/admin/categories">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Folder className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Gerenciar Categorias</h3>
                    <p className="text-sm text-gray-600">
                      Crie, edite e organize as categorias do fórum
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTab;
