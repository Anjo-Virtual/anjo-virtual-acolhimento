
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useHeaderNavigation } from "@/hooks/useHeaderNavigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onCommunityScroll: () => void;
  onEmpresasClick: () => void;
  onBlogClick: () => void;
  openChatModal: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  onClose, 
  user, 
  onCommunityScroll, 
  onEmpresasClick, 
  onBlogClick,
  openChatModal 
}: MobileMenuProps) => {
  const { handleComoFuncionaClick, handlePlanosClick } = useHeaderNavigation();

  if (!isOpen) return null;

  return (
    <div className="mt-4 pb-4 space-y-3">
      <button
        onClick={() => {
          onClose();
          handleComoFuncionaClick();
        }}
        className="block text-gray-700 hover:text-primary transition-colors py-2 text-left w-full"
      >
        Como Funciona
      </button>
      <button
        onClick={() => {
          onClose();
          handlePlanosClick();
        }}
        className="block text-gray-700 hover:text-primary transition-colors py-2 text-left w-full"
      >
        Planos
      </button>
      <button
        onClick={() => {
          onClose();
          onCommunityScroll();
        }}
        className="block text-gray-700 hover:text-primary transition-colors py-2 text-left flex items-center gap-2"
      >
        <Users size={18} />
        Comunidade
      </button>
      <button
        onClick={() => {
          onClose();
          onEmpresasClick();
        }}
        className="block text-gray-700 hover:text-primary transition-colors py-2 text-left w-full"
      >
        Para Empresas
      </button>
      <button
        onClick={() => {
          onClose();
          onBlogClick();
        }}
        className="block text-gray-700 hover:text-primary transition-colors py-2 text-left w-full"
      >
        Blog
      </button>
      
      {user ? (
        <Link
          to="/comunidade/perfil"
          className="block text-gray-700 hover:text-primary transition-colors py-2"
          onClick={onClose}
        >
          Minha Conta
        </Link>
      ) : (
        <Link
          to="/comunidade/login"
          className="block text-gray-700 hover:text-primary transition-colors py-2"
          onClick={onClose}
        >
          Login
        </Link>
      )}
      
      <Button
        onClick={() => {
          onClose();
          openChatModal();
        }}
        variant="outline"
        className="w-full mt-2 flex items-center justify-center gap-2"
      >
        <MessageCircle size={18} />
        Fale Conosco
      </Button>
    </div>
  );
};
