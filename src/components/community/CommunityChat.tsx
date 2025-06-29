
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatBox from "../chat/ChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useOriginRedirect } from "@/hooks/useOriginRedirect";
import { useNavigate, useLocation } from "react-router-dom";
import { useChatInstance } from "@/hooks/useChatInstance";

const CHAT_INSTANCE_ID = "community-chat";

const CommunityChat = () => {
  const { user } = useCommunityAuth();
  const { setOrigin } = useOriginRedirect();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { openChat, closeChat, isActiveInstance } = useChatInstance();

  // Não mostrar o chat em páginas de admin ou se o usuário não estiver logado
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Se não há usuário logado, não renderizar nada
  if (!user || isAdminPage) {
    return null;
  }
  
  useEffect(() => {
    // Verificar se esta instância deve estar ativa
    if (isActiveInstance(CHAT_INSTANCE_ID) && !isOpen) {
      setIsOpen(true);
    } else if (!isActiveInstance(CHAT_INSTANCE_ID) && isOpen) {
      setIsOpen(false);
    }
  }, [isActiveInstance(CHAT_INSTANCE_ID), isOpen]);

  const handleToggleChat = () => {
    if (!isOpen) {
      openChat(CHAT_INSTANCE_ID);
      setIsOpen(true);
    } else {
      closeChat();
      setIsOpen(false);
    }
  };

  // Não renderizar se outra instância estiver ativa
  if (isActiveInstance('modal-chat')) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
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
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <MessageCircle size={20} />
              Chat Online
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleChat}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-80px)]">
          <ChatBox />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityChat;
