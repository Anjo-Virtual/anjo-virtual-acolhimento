
import { RagChatBox } from "./RagChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";

interface ChatBoxProps {
  onClose?: () => void;
  leadData?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

const ChatBox = ({ onClose, leadData }: ChatBoxProps) => {
  const { user } = useCommunityAuth();

  return (
    <RagChatBox 
      userId={user?.id}
      onConversationCreated={(conversationId) => {
        console.log('Nova conversa criada:', conversationId);
      }}
    />
  );
};

export default ChatBox;
