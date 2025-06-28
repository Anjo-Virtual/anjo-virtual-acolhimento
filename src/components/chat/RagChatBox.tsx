
import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ChatEmptyState } from "./ChatEmptyState";
import { useChatMessages } from "@/hooks/useChatMessages";

interface RagChatBoxProps {
  userId?: string;
  conversationId?: string;
  leadData?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  onConversationCreated?: (conversationId: string) => void;
}

export const RagChatBox = ({ 
  userId, 
  conversationId,
  leadData,
  onConversationCreated 
}: RagChatBoxProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, isInputReady, sendMessage } = useChatMessages(userId, conversationId);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !isInputReady) return;
    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage, onConversationCreated, leadData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isInputReady) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg">
      <ChatHeader />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && isInputReady && <ChatEmptyState />}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <ChatLoadingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        input={input}
        isLoading={isLoading}
        isInputReady={isInputReady}
        onInputChange={setInput}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
