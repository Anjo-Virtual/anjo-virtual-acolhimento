
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const SimplifiedWelcome = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Bem-vindo à nossa comunidade! 
      </h2>
      <p className="text-gray-600 mb-4">
        Compartilhe suas experiências, encontre apoio e conecte-se com pessoas que compreendem sua jornada.
      </p>
      <Link to="/comunidade/criar-post">
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Compartilhar algo
        </Button>
      </Link>
    </div>
  );
};

export default SimplifiedWelcome;
