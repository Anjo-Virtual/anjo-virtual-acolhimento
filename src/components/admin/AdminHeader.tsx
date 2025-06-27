
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut, Home, Users, Shield } from "lucide-react";
import { useCommunityProfile } from "@/hooks/useCommunityProfile";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  title: string;
  userEmail?: string;
}

const AdminHeader = ({ title, userEmail }: AdminHeaderProps) => {
  const { profile } = useCommunityProfile();
  const { signOut } = useCommunityAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.display_name || userEmail?.split('@')[0] || "Administrador";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {title}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Navigation */}
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

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center justify-start gap-2 p-3">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {userEmail || "Administrador"}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            
            {/* Navigation Items */}
            <DropdownMenuItem asChild>
              <Link to="/comunidade/perfil" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/comunidade/salvos" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Posts Salvos
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Quick Access */}
            <DropdownMenuItem asChild>
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Site Principal
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/comunidade" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Comunidade
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
