
import { useState } from "react";
import { RagChatBox } from "./RagChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useMobile } from "@/hooks/useMobile";

interface ChatBoxProps {
  onClose?: () => void;
}

const ChatBox = ({ onClose }: ChatBoxProps) => {
  const { user } = useCommunityAuth();
  const isMobile = useMobile();

  // Chat básico e direto - sem abas de navegação
  return (
    <div className="h-full bg-white">
      <RagChatBox 
        userId={user?.id}
        onConversationCreated={(conversationId) => {
          console.log('Nova conversa criada:', conversationId);
        }}
      />
    </div>
  );
};

export default ChatBox;
