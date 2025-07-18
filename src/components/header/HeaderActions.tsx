
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useOriginRedirect } from "@/hooks/useOriginRedirect";

interface HeaderActionsProps {
  user: User | null;
  openChatModal: () => void;
}

export const HeaderActions = ({ user, openChatModal }: HeaderActionsProps) => {
  const { setOrigin } = useOriginRedirect();

  const handleContactClick = () => {
    console.log("Botão Fale Conosco clicado");
    if (!user) {
      setOrigin('chat');
    }
    openChatModal();
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <Link 
          to="/comunidade/perfil" 
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button hover:bg-opacity-90 transition-colors"
        >
          <UserCircle size={18} />
          Minha Conta
        </Link>
      ) : (
        <Link 
          to="/comunidade/login" 
          className="text-gray-700 hover:text-primary transition-colors"
        >
          Login
        </Link>
      )}
      <Button
        onClick={handleContactClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <MessageCircle size={18} />
        Fale Conosco
      </Button>
    </div>
  );
};
