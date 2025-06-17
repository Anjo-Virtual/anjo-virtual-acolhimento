
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Heart, MessageCircle } from "lucide-react";

const SimplifiedWelcome = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-6 rounded-lg mb-6 border border-primary/20">
      <div className="flex items-start gap-4">
        <div className="bg-primary/20 p-3 rounded-full">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Você não está sozinho nesta jornada
          </h2>
          <p className="text-gray-600 mb-4">
            Nossa comunidade é um espaço acolhedor onde você pode compartilhar experiências, 
            encontrar apoio e conectar-se com pessoas que compreendem o que você está passando.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/comunidade/criar-post">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Compartilhar algo
              </Button>
            </Link>
            <Link to="/comunidade/grupos">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Encontrar grupos de apoio
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-white/60 rounded-lg border border-primary/10">
        <p className="text-sm text-gray-700">
          <strong>💡 Dica:</strong> Precisa de apoio mais personalizado? 
          <Link to="/admin/login" className="text-primary hover:underline ml-1">
            Conheça o Anjo Virtual
          </Link> - nosso assistente especializado em apoio emocional disponível 24/7.
        </p>
      </div>
    </div>
  );
};

export default SimplifiedWelcome;
