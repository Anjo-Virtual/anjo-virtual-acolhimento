
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
}

const QuickActions = ({ showCreateForm, setShowCreateForm }: QuickActionsProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Comece aqui</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-auto p-4 justify-start"
            variant={showCreateForm ? "secondary" : "default"}
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Criar Discussão</div>
                <div className="text-xs opacity-80">Compartilhe seus pensamentos</div>
              </div>
            </div>
          </Button>
          <Link to="/comunidade/grupos">
            <Button variant="outline" className="h-auto p-4 justify-start w-full">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Encontrar Grupos</div>
                  <div className="text-xs opacity-60">Conecte-se com outros</div>
                </div>
              </div>
            </Button>
          </Link>
          <Link to="/comunidade/ativos">
            <Button variant="outline" className="h-auto p-4 justify-start w-full">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Ver Discussões</div>
                  <div className="text-xs opacity-60">Participe das conversas</div>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
