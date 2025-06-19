
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu, X, Search, Settings, LogOut, User, Shield } from "lucide-react";
import { useCommunityProfile } from "@/hooks/useCommunityProfile";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSafeAdminAuth } from "@/hooks/useSafeAdminAuth";

const CommunityHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile } = useCommunityProfile();
  const { signOut } = useCommunityAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useSafeAdminAuth();

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
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/comunidade" className="flex items-center space-x-2">
            <div className="text-2xl font-playfair font-bold text-primary">
              Comunidade
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/comunidade"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Feed
            </Link>
            <Link
              to="/comunidade/grupos"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Grupos
            </Link>
            <Link
              to="/comunidade/ativos"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Discussões Ativas
            </Link>
            <Link
              to="/comunidade/eventos"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Eventos
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/comunidade/criar-post">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/comunidade/notificacoes">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {getInitials(profile?.display_name || "Usuário")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.display_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Minha Conta
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/comunidade/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/comunidade/salvos">
                    <Settings className="mr-2 h-4 w-4" />
                    Posts Salvos
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/comunidade"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                to="/comunidade/grupos"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Grupos
              </Link>
              <Link
                to="/comunidade/ativos"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Discussões Ativas
              </Link>
              <Link
                to="/comunidade/eventos"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eventos
              </Link>
              <div className="border-t border-gray-200 pt-4">
                <Link
                  to="/comunidade/perfil"
                  className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
                <Link
                  to="/comunidade/salvos"
                  className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Posts Salvos
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Painel Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommunityHeader;
