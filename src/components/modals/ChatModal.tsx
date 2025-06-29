
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

        <div className="h-full p-4">
          <ChatBox onClose={handleClose} />
        </div>

        {/* Sugestão de login para usuários não logados */}
        {!user && (
          <div className="absolute bottom-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  Para salvar o histórico das suas conversas, faça login ou cadastre-se.
                </p>
              </div>
              <Button 
                onClick={handleSignUpRedirect}
                size="sm"
                variant="outline"
                className="ml-3"
              >
                Entrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
