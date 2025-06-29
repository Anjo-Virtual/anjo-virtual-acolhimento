
import { useState } from "react";
import { RagChatBox } from "./RagChatBox";
import { ChatHistory } from "./ChatHistory";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useChatPermissions } from "@/hooks/useChatPermissions";
import { Button } from "@/components/ui/button";
import { MessageCircle, History, Settings, Plus, ArrowLeft } from "lucide-react";
import { AdminChatManager } from "../admin/chat/AdminChatManager";
import { useMobile } from "@/hooks/useMobile";

interface ChatBoxProps {
  onClose?: () => void;
}

const ChatBox = ({ onClose }: ChatBoxProps) => {
  const { user } = useCommunityAuth();
  const { isAdminUser } = useChatPermissions();
  const isMobile = useMobile();
  const [activeView, setActiveView] = useState<'chat' | 'history' | 'admin'>('chat');
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setActiveView('chat');
  };

  const handleNewChat = () => {
    setSelectedConversationId(undefined);
    setActiveView('chat');
  };

  if (!user) {
    return (
      <div className="h-full">
        <RagChatBox 
          onConversationCreated={(conversationId) => {
            console.log('Nova conversa criada:', conversationId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header com navegação - Melhorado para mobile */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        {/* Mobile: Mostrar título da seção ativa e botão voltar */}
        {isMobile && (selectedConversationId || activeView !== 'chat') && (
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedConversationId) {
                    setSelectedConversationId(undefined);
                  } else {
                    setActiveView('chat');
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {selectedConversationId ? 'Conversa' : 
                 activeView === 'history' ? 'Histórico' : 
                 activeView === 'admin' ? 'Administração' : 'Chat'}
              </span>
            </div>
            {selectedConversationId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Novo
              </Button>
            )}
          </div>
        )}

        {/* Navegação por abas */}
        <div className={`flex ${isMobile ? 'px-2 py-2' : 'p-2'}`}>
          <Button
            variant={activeView === 'chat' ? 'default' : 'ghost'}
            size={isMobile ? 'sm' : 'default'}
            onClick={() => setActiveView('chat')}
            className={`flex items-center gap-2 flex-1 ${isMobile ? 'text-xs px-2' : ''}`}
          >
            <MessageCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {!isMobile && 'Chat'}
          </Button>
          <Button
            variant={activeView === 'history' ? 'default' : 'ghost'}
            size={isMobile ? 'sm' : 'default'}
            onClick={() => setActiveView('history')}
            className={`flex items-center gap-2 flex-1 ${isMobile ? 'text-xs px-2' : ''}`}
          >
            <History className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {!isMobile && 'Histórico'}
          </Button>
          {isAdminUser && (
            <Button
              variant={activeView === 'admin' ? 'default' : 'ghost'}
              size={isMobile ? 'sm' : 'default'}
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 flex-1 ${isMobile ? 'text-xs px-2' : ''}`}
            >
              <Settings className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              {!isMobile && 'Admin'}
            </Button>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeView === 'chat' ? (
          <div className="h-full relative">
            {/* Desktop: Botão nova conversa no canto */}
            {!isMobile && selectedConversationId && (
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewChat}
                  className="text-xs shadow-lg"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova Conversa
                </Button>
              </div>
            )}
            <RagChatBox 
              userId={user.id}
              conversationId={selectedConversationId}
              onConversationCreated={(conversationId) => {
                console.log('Nova conversa criada:', conversationId);
                setSelectedConversationId(conversationId);
              }}
            />
          </div>
        ) : activeView === 'history' ? (
          <div className="h-full overflow-y-auto">
            <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
              <ChatHistory onSelectConversation={handleSelectConversation} />
            </div>
          </div>
        ) : activeView === 'admin' && isAdminUser ? (
          <div className="h-full overflow-y-auto">
            <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
              <AdminChatManager />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatBox;
