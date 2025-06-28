
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ChatBox from "../chat/ChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useOriginRedirect } from "@/hooks/useOriginRedirect";
import { useChatInstance } from "@/hooks/useChatInstance";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODAL_CHAT_INSTANCE_ID = "modal-chat";

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const { user } = useCommunityAuth();
  const navigate = useNavigate();
  const { setOrigin } = useOriginRedirect();
  const [chatStarted, setChatStarted] = useState(false);
  const { openChat, closeChat } = useChatInstance();
  
  useEffect(() => {
    if (isOpen && user) {
      setChatStarted(true);
      openChat(MODAL_CHAT_INSTANCE_ID);
    } else if (isOpen && !user) {
      setChatStarted(false);
    }
  }, [isOpen, user]);

  const handleClose = () => {
    closeChat();
    onClose();
  };

  const handleSignUpRedirect = () => {
    setOrigin('chat');
    handleClose();
    navigate('/comunidade/login');
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`} onClick={handleClose}>
      <div 
        className={`bg-white rounded-lg shadow-soft animate-scaleIn mx-4 my-4 sm:mx-auto sm:my-8 relative
          ${chatStarted 
            ? 'w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-h-[800px]' 
            : 'w-full max-w-md p-8'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
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
            <ChatBox onClose={handleClose} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
