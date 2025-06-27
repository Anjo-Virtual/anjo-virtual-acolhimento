
import { RagChatBox } from "./RagChatBox";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";

const ChatBox = () => {
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
