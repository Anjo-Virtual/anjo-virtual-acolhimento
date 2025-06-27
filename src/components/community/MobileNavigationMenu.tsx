
import { Link } from "react-router-dom";
import { User, Settings, Shield, AlertTriangle, Users2, Home, LogOut } from "lucide-react";
import { useCommunityProfile } from "@/hooks/useCommunityProfile";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useSafeAdminAuth } from "@/hooks/useSafeAdminAuth";

interface MobileNavigationMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MobileNavigationMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileNavigationMenuProps) => {
  const { profile } = useCommunityProfile();
  const { signOut } = useCommunityAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useSafeAdminAuth();

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

  if (!isMobileMenuOpen) return null;

  return (
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
            className="flex flex-col text-gray-700 hover:text-primary transition-colors mb-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
              {isAdmin && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Admin
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-6">/comunidade/perfil</span>
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
            <>
              <div className="my-2 border-t border-gray-200 pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">GESTÃO DO SITE</p>
                <Link
                  to="/admin"
                  className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Painel Administrativo
                </Link>
                <Link
                  to="/admin/contacts"
                  className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Alertas para Novos Contatos
                </Link>
              </div>
              
              <div className="my-2 border-t border-gray-200 pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">GESTÃO DA COMUNIDADE</p>
                <Link
                  to="/comunidade/perfil"
                  className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users2 className="mr-2 h-4 w-4" />
                  Centro de Controle
                </Link>
              </div>
            </>
          )}

          <Link
            to="/"
            className="flex items-center text-gray-700 hover:text-primary transition-colors mb-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home className="mr-2 h-4 w-4" />
            Site Principal
          </Link>
          
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
  );
};

export default MobileNavigationMenu;
