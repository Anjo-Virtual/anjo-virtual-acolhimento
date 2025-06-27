
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  onKeyPress
}: ChatInputProps) => {
  return (
    <div className="flex-shrink-0 p-4 border-t bg-gray-50">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="flex-1 text-sm sm:text-base"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={isLoading || !input.trim()}
          size="icon"
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
