
import { useState } from "react";
import { RagChatBox } from "./RagChatBox";
import { ChatHistory } from "./ChatHistory";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { Button } from "@/components/ui/button";
import { MessageCircle, History } from "lucide-react";

interface ChatBoxProps {
  onClose?: () => void;
}

const ChatBox = ({ onClose }: ChatBoxProps) => {
  const { user } = useCommunityAuth();
  const [activeView, setActiveView] = useState<'chat' | 'history'>('chat');
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
      <RagChatBox 
        onConversationCreated={(conversationId) => {
          console.log('Nova conversa criada:', conversationId);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header com navegação */}
      <div className="flex border-b border-gray-200 p-2">
        <Button
          variant={activeView === 'chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('chat')}
          className="flex items-center gap-2 flex-1"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
        <Button
          variant={activeView === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('history')}
          className="flex items-center gap-2 flex-1"
        >
          <History className="h-4 w-4" />
          Histórico
        </Button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-h-0">
        {activeView === 'chat' ? (
          <div className="h-full relative">
            {selectedConversationId && (
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewChat}
                  className="text-xs"
                >
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
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <ChatHistory onSelectConversation={handleSelectConversation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
