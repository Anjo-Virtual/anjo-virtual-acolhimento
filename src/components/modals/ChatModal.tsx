
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ChatBox from "../chat/ChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useOriginRedirect } from "@/hooks/useOriginRedirect";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const { user } = useCommunityAuth();
  const navigate = useNavigate();
  const { setOrigin } = useOriginRedirect();
  const [chatStarted, setChatStarted] = useState(false);
  
  useEffect(() => {
    if (isOpen && user) {
      // Se usuário estiver logado, inicia chat diretamente
      setChatStarted(true);
    } else if (isOpen && !user) {
      // Se não estiver logado, reset do estado
      setChatStarted(false);
    }
  }, [isOpen, user]);

  const handleSignUpRedirect = () => {
    setOrigin('chat');
    onClose();
    navigate('/comunidade/login');
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div 
        className={`bg-white rounded-lg shadow-soft animate-scaleIn mx-4 my-4 sm:mx-auto sm:my-8 relative
          ${chatStarted 
            ? 'w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-h-[800px]' 
            : 'w-full max-w-md p-8'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <i className="ri-close-line ri-lg"></i>
        </button>

        {!chatStarted ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Conversar com Anjo Virtual</h2>
              <p className="text-gray-600 mb-6">
                Para conversar com nosso assistente virtual, você precisa ter uma conta.
              </p>
              <Button 
                onClick={handleSignUpRedirect}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Cadastre-se para Conversar
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Já tem uma conta? O login também está na próxima página.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full p-4">
            <ChatBox onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
