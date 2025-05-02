
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
      <div className="bg-primary/5 p-4 rounded-t-lg mb-2">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Conversa com Anjo Virtual</h3>
        {leadData?.name && (
          <p className="text-sm text-gray-600">Bem-vindo(a), {leadData.name}</p>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {leadData && messages.length === 0 && (
          <div className="text-center py-6 bg-primary/5 rounded-lg border border-primary/10 animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-gray-800">Olá {leadData.name}!</p>
            <p className="text-gray-600 mt-2 px-4">Como posso ajudar você hoje? Estou aqui para acolher e conversar sobre o que precisar.</p>
          </div>
        )}
        
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex gap-3 mb-4 ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            } animate-fadeInUp`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            <div
              className={`rounded-2xl p-4 max-w-[80%] shadow-sm ${
                message.role === "assistant"
                  ? "bg-white border border-gray-100"
                  : "bg-primary text-white"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2 mt-auto bg-gray-50/50 rounded-b-lg">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};
