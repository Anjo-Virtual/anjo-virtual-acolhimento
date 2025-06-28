
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    documentName: string;
    documentId: string;
    chunkText: string;
    summary?: string;
    relevanceScore?: number;
  }>;
  created_at: string;
}

export const useChatMessages = (userId?: string, conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [sessionId] = useState(() => {
    // Gerar sessionId único para usuários anônimos
    if (!userId) {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return null;
  });

  const loadMessages = async () => {
    if (!currentConversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', currentConversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      // Type-safe conversion from database format to component format
      const typedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        sources: Array.isArray(msg.sources) ? msg.sources as Array<{
          documentName: string;
          documentId: string;
          chunkText: string;
          summary?: string;
          relevanceScore?: number;
        }> : undefined,
        created_at: msg.created_at
      }));

      setMessages(typedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async (
    userMessage: string, 
    onConversationCreated?: (conversationId: string) => void,
    leadData?: {
      name?: string;
      email?: string;
      phone?: string;
    } | null
  ) => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);

    // Adicionar mensagem do usuário imediatamente na UI
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      console.log('Enviando mensagem para chat-rag:', {
        message: userMessage,
        conversationId: currentConversationId,
        userId: userId,
        sessionId: sessionId,
        hasLeadData: !!leadData
      });

      const { data, error } = await supabase.functions.invoke('chat-rag', {
        body: {
          message: userMessage,
          conversationId: currentConversationId,
          userId: userId,
          sessionId: sessionId, // Para usuários anônimos
          leadData: leadData
        }
      });

      if (error) {
        throw error;
      }

      console.log('Resposta do chat-rag:', data);

      // Se criou nova conversa, atualizar ID
      if (data.conversationId && data.conversationId !== currentConversationId) {
        setCurrentConversationId(data.conversationId);
        onConversationCreated?.(data.conversationId);
      }

      // Mostrar feedback sobre captura de lead
      if (data.lead_captured) {
        console.log('Lead capturado com sucesso');
      }

      // Aguardar um momento e recarregar mensagens para garantir consistência
      setTimeout(() => {
        loadMessages();
      }, 500);

    } catch (error) {
      console.error('Erro no chat:', error);
      
      // Remover mensagem temporária em caso de erro
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      
      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentConversationId) {
      loadMessages();
    }
  }, [currentConversationId]);

  return {
    messages,
    isLoading,
    currentConversationId,
    sendMessage,
    setCurrentConversationId
  };
};
