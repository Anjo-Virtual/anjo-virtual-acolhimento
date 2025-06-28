
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { useHeaderNavigation } from "@/hooks/useHeaderNavigation";

interface NavigationLinksProps {
  onCommunityScroll: () => void;
  onEmpresasClick: () => void;
}

export const NavigationLinks = ({ onCommunityScroll, onEmpresasClick }: NavigationLinksProps) => {
  const { handleComoFuncionaClick, handlePlanosClick } = useHeaderNavigation();

  return (
    <div className="hidden md:flex space-x-6">
      <button 
        onClick={handleComoFuncionaClick}
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Como Funciona
      </button>
      <button 
        onClick={handlePlanosClick}
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Planos
      </button>
      <button 
        onClick={onCommunityScroll}
        className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2"
      >
        <Users size={18} />
        Comunidade
      </button>
      <button 
        onClick={onEmpresasClick}
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Para Empresas
      </button>
    </div>
  );
};
