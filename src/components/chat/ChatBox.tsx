
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
      leadData={leadData}
      onConversationCreated={(conversationId) => {
        console.log('Nova conversa criada:', conversationId);
        if (leadData) {
          console.log('Lead capturado:', leadData);
        }
      }}
    />
  );
};

export default ChatBox;
