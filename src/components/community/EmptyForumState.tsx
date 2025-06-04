
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyForumState = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma discussão encontrada
        </h3>
        <p className="text-gray-600 mb-4">
          Seja o primeiro a iniciar uma conversa na comunidade.
        </p>
        <Link to="/comunidade/criar-post">
          <Button>Criar Nova Discussão</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EmptyForumState;
