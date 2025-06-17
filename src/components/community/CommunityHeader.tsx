
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Settings, LogOut, User } from "lucide-react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import NotificationButton from "./NotificationButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommunityHeaderProps {
  isLoggedIn: boolean;
}

const CommunityHeader = ({ isLoggedIn }: CommunityHeaderProps) => {
  const { user, signOut } = useCommunityAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/comunidade" className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Comunidade do Luto</h1>
              <p className="text-sm text-gray-600">Apoio e compreensão</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Notificações */}
                <NotificationButton />
                
                {/* Menu do usuário */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/comunidade/perfil" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/comunidade/notificacoes" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/comunidade/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link to="/comunidade/login">
                  <Button>Criar Conta</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
