
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isInputReady?: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  isInputReady = true,
  onInputChange,
  onSendMessage,
  onKeyPress
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focar no input quando estiver pronto
  useEffect(() => {
    if (isInputReady && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInputReady]);

  const isDisabled = isLoading || !isInputReady;

  return (
    <div className="flex-shrink-0 p-4 border-t bg-gray-50">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={isInputReady ? "Digite sua mensagem..." : "Carregando..."}
          disabled={isDisabled}
          className="flex-1 text-sm sm:text-base"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={isDisabled || !input.trim()}
          size="icon"
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      {!isInputReady && (
        <p className="text-xs text-gray-500 mt-1">
          Preparando chat...
        </p>
      )}
    </div>
  );
};
