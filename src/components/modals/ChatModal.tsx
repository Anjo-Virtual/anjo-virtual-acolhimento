
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
  const { openChat, closeChat } = useChatInstance();
  
  useEffect(() => {
    if (isOpen) {
      openChat(MODAL_CHAT_INSTANCE_ID);
    }
  }, [isOpen]);

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
        className="bg-white rounded-lg shadow-soft animate-scaleIn mx-4 my-4 sm:mx-auto sm:my-8 relative w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-h-[800px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <i className="ri-close-line ri-lg"></i>
        </button>

        {/* Conteúdo principal do modal */}
        <div className="h-full p-4">
          {user ? (
            <ChatBox onClose={handleClose} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Faça login para usar o chat
                </h2>
                <p className="text-gray-600 mb-6">
                  Para ter acesso ao nosso assistente virtual e salvar o histórico das suas conversas, você precisa estar logado.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleSignUpRedirect}
                  className="bg-primary text-white px-6 py-3"
                >
                  Fazer Login / Cadastro
                </Button>
                <Button 
                  onClick={handleClose}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Fechar
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Já tem uma conta? Faça login.</p>
                <p>Novo por aqui? Cadastre-se gratuitamente.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
