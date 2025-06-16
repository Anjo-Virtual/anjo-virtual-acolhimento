
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const FeedHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Diga oi! 👋
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/comunidade/criar-post">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Publicação
          </Button>
        </Link>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Mais Recente
        </Button>
      </div>
    </div>
  );
};

export default FeedHeader;
