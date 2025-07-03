import { useState, useEffect } from "react";
import { MessageCircle, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatBox from "./ChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useLocation } from "react-router-dom";
import { useChatInstance } from "@/hooks/useChatInstance";

const GLOBAL_CHAT_INSTANCE_ID = "global-persistent-chat";

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  conversationId?: string;
}

const GlobalPersistentChat = () => {
  const { user } = useCommunityAuth();
  const location = useLocation();
  const { openChat, closeChat, isActiveInstance } = useChatInstance();
  
  // Estado inicial do chat carregado do sessionStorage
  const [chatState, setChatState] = useState<ChatState>(() => {
    const savedState = sessionStorage.getItem('global-chat-state');
    return savedState ? JSON.parse(savedState) : { isOpen: false, isMinimized: false };
  });

  // Verificar condições de renderização
  const isAdminPage = location.pathname.startsWith('/admin');
  const shouldRender = user && !isAdminPage;
  
  // Salvar estado no sessionStorage sempre que mudar
  useEffect(() => {
    sessionStorage.setItem('global-chat-state', JSON.stringify(chatState));
  }, [chatState]);

  // Gerenciar instância ativa do chat
  useEffect(() => {
    if (!shouldRender) return;
    
    if (chatState.isOpen && !isActiveInstance(GLOBAL_CHAT_INSTANCE_ID)) {
      openChat(GLOBAL_CHAT_INSTANCE_ID);
    }
  }, [chatState.isOpen, shouldRender, isActiveInstance, openChat]);

  const handleToggleChat = () => {
    setChatState(prev => {
      const newState = { ...prev, isOpen: !prev.isOpen };
      if (newState.isOpen) {
        openChat(GLOBAL_CHAT_INSTANCE_ID);
      } else {
        closeChat();
      }
      return newState;
    });
  };

  const handleMinimize = () => {
    setChatState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const handleConversationCreated = (conversationId: string) => {
    setChatState(prev => ({ ...prev, conversationId }));
  };

  // Não renderizar se não deve aparecer
  if (!shouldRender) {
    return null;
  }

  // Não renderizar se outra instância estiver ativa (modal)
  if (isActiveInstance('modal-chat')) {
    return null;
  }

  // Chat fechado - mostrar apenas botão flutuante
  if (!chatState.isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={handleToggleChat}
          className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          title="Abrir Chat"
        >
          <MessageCircle size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div className="global-chat fixed bottom-6 right-6 z-[9999] w-96 h-[600px]">
      <Card className="h-full shadow-2xl border-primary/20 global-chat">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2 text-primary">
              <MessageCircle size={20} />
              Chat Online
              {chatState.conversationId && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Ativo
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMinimize}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                title={chatState.isMinimized ? "Expandir" : "Minimizar"}
              >
                <Minus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleChat}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                title="Fechar Chat"
              >
                <X size={16} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {!chatState.isMinimized && (
          <CardContent className="p-0 h-[calc(100%-80px)]">
            <ChatBox />
          </CardContent>
        )}
        
        {chatState.isMinimized && (
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Chat minimizado</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMinimize}
              className="mt-2"
            >
              Expandir Chat
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default GlobalPersistentChat;