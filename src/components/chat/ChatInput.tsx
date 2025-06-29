
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMobile } from "@/hooks/useMobile";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMobile();

  // Focar no input quando estiver pronto
  useEffect(() => {
    if (isInputReady && inputRef.current && !isMobile) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInputReady, isMobile]);

  const isDisabled = isLoading || !isInputReady;
  const canSend = input.trim() && !isDisabled;

  const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // No mobile, permitir quebra de linha normalmente
    if (isMobile) return;
    
    // No desktop, enviar com Enter (sem Shift)
    if (e.key === 'Enter' && !e.shiftKey && canSend) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-shrink-0 border-t bg-gray-50">
      <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleTextareaKeyPress}
              placeholder={
                isInputReady 
                  ? isMobile 
                    ? "Sua mensagem..." 
                    : "Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                  : "Carregando..."
              }
              disabled={isDisabled}
              className={`resize-none transition-all duration-200 ${
                isMobile 
                  ? 'min-h-[60px] max-h-[120px] text-sm' 
                  : 'min-h-[80px] max-h-[200px] text-base'
              }`}
              rows={isMobile ? 3 : 3}
            />
            {!isInputReady && (
              <p className="text-xs text-gray-500 mt-1">
                Preparando chat...
              </p>
            )}
          </div>
          <Button 
            onClick={onSendMessage} 
            disabled={!canSend}
            size={isMobile ? "sm" : "default"}
            className={`flex-shrink-0 ${isMobile ? 'h-12 w-12' : 'h-14 w-14'} p-0`}
          >
            {isLoading ? (
              <Loader2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} animate-spin`} />
            ) : (
              <Send className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            )}
          </Button>
        </div>
        
        {/* Dica para mobile */}
        {isMobile && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Toque no botão para enviar sua mensagem
          </p>
        )}
      </div>
    </div>
  );
};
