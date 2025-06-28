
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";

export const AdminHeaderNavigation = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/" className="flex items-center gap-2 text-sm">
          <Home className="h-4 w-4" />
          Site Principal
        </Link>
      </Button>
      
      <Button variant="ghost" size="sm" asChild>
        <Link to="/comunidade" className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          Comunidade
        </Link>
      </Button>
    </div>
  );
};
