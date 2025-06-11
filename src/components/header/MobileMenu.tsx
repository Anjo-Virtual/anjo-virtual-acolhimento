
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onCommunityScroll: () => void;
  onEmpresasClick: () => void;
  openChatModal: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  onClose, 
  user, 
  onCommunityScroll, 
  onEmpresasClick, 
  openChatModal 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="mt-4 pb-4 space-y-3">
      <a
        href="#como-funciona"
        className="block text-gray-700 hover:text-primary transition-colors py-2"
        onClick={onClose}
      >
        Como Funciona
      </a>
      <a
        href="#planos"
        className="block text-gray-700 hover:text-primary transition-colors py-2"
        onClick={onClose}
      >
        Planos
      </a>
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
      <Link
        to="/blog"
        className="block text-gray-700 hover:text-primary transition-colors py-2"
        onClick={onClose}
      >
        Blog
      </Link>
      <button
        onClick={() => {
          onClose();
          onEmpresasClick();
        }}
        className="block text-gray-700 hover:text-primary transition-colors py-2 text-left"
      >
        Para Empresas
      </button>
      
      {user ? (
        <Link
          to="/minha-conta"
          className="block text-gray-700 hover:text-primary transition-colors py-2"
          onClick={onClose}
        >
          Minha Conta
        </Link>
      ) : (
        <Link
          to="/admin/login"
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
