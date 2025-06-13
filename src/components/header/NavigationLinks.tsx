
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

interface NavigationLinksProps {
  onCommunityScroll: () => void;
  onEmpresasClick: () => void;
}

export const NavigationLinks = ({ onCommunityScroll, onEmpresasClick }: NavigationLinksProps) => {
  return (
    <div className="hidden md:flex space-x-6">
      <a href="#como-funciona" className="text-gray-700 hover:text-primary transition-colors">
        Como Funciona
      </a>
      <a href="#planos" className="text-gray-700 hover:text-primary transition-colors">
        Planos
      </a>
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
      <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
        Blog
      </Link>
    </div>
  );
};
