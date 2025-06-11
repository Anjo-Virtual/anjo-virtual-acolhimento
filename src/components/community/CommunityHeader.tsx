
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, Settings, LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { Input } from "@/components/ui/input";

interface CommunityHeaderProps {
  isLoggedIn: boolean;
}

const CommunityHeader = ({ isLoggedIn }: CommunityHeaderProps) => {
  const { signOut, user } = useCommunityAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e navegação */}
          <div className="flex items-center space-x-6">
            <Link to="/comunidade" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Comunidade</span>
            </Link>
          </div>

          {/* Barra de pesquisa - apenas para usuários logados */}
          {isLoggedIn && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar discussões..."
                  className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Ações do usuário */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Settings className="w-5 h-5" />
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/comunidade/login">
                <Button size="sm">Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
