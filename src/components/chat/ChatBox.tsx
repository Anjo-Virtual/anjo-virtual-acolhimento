
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatBoxProps {
  onClose: () => void;
  leadData?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

export const ChatBox = ({ onClose, leadData }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get the API key from localStorage
      const apiKey = localStorage.getItem('perplexityKey');
      
      if (!apiKey) {
        throw new Error("API key not found. Please contact the administrator.");
      }

      // Incluir dados do lead nos metadados da requisição
      const metadata = leadData ? {
        lead: {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone
        }
      } : undefined;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          metadata
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro na Comunicação",
        description: error.message || "Não foi possível obter resposta do assistente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 p-4 space-y-4">
        {leadData && messages.length === 0 && (
          <div className="text-center py-4">
            <p className="font-semibold">Olá {leadData.name}!</p>
            <p className="text-gray-600 mt-2">Como posso ajudar você hoje?</p>
          </div>
        )}
        
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            {message.role === "assistant" && (
              <Bot className="w-6 h-6 text-primary" />
            )}
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.role === "assistant"
                  ? "bg-secondary"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Bot className="w-6 h-6 animate-pulse" />
            <span>Digitando...</span>
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
