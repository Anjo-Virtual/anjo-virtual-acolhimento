
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isInputReady, setIsInputReady] = useState(false);
  const loadedConversationId = useRef<string | null>(null);
  const [sessionId] = useState(() => {
    if (!userId) {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return null;
  });

  const loadMessages = useCallback(async () => {
    if (!currentConversationId) {
      setIsInputReady(true);
      return;
    }

    // Evitar carregamento duplicado
    if (loadedConversationId.current === currentConversationId) {
      setIsInputReady(true);
      return;
    }

    console.log('Carregando mensagens para conversa:', currentConversationId);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', currentConversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico da conversa.",
          variant: "destructive",
        });
        return;
      }

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
      loadedConversationId.current = currentConversationId;
      console.log(`Carregadas ${typedMessages.length} mensagens`);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar mensagens.",
        variant: "destructive",
      });
    } finally {
      setIsInputReady(true);
    }
  }, [currentConversationId]);

  const sendMessage = useCallback(async (
    userMessage: string, 
    onConversationCreated?: (conversationId: string) => void,
    leadData?: {
      name?: string;
      email?: string;
      phone?: string;
    } | null
  ) => {
    if (!userMessage.trim() || isLoading) return;

    console.log('Enviando mensagem:', userMessage);
    setIsLoading(true);
    setIsInputReady(false);

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
          sessionId: sessionId,
          leadData: leadData
        }
      });

      if (error) {
        throw error;
      }

      console.log('Resposta do chat-rag:', data);

      if (data.conversationId && data.conversationId !== currentConversationId) {
        console.log('Nova conversa criada:', data.conversationId);
        setCurrentConversationId(data.conversationId);
        loadedConversationId.current = null; // Reset para recarregar
        onConversationCreated?.(data.conversationId);
      }

      if (data.has_history) {
        console.log('IA utilizou histórico da conversa para resposta contextualizada');
      }

      if (data.lead_captured) {
        console.log('Lead capturado com sucesso');
      }

      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      
      // Aguardar um pouco antes de recarregar as mensagens
      setTimeout(() => {
        loadMessages();
      }, 300);

    } catch (error) {
      console.error('Erro no chat:', error);
      
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInputReady(true);
    }
  }, [currentConversationId, userId, sessionId, isLoading, loadMessages]);

  // Resetar quando conversationId muda
  useEffect(() => {
    if (currentConversationId !== loadedConversationId.current) {
      setMessages([]);
      loadedConversationId.current = null;
    }
  }, [currentConversationId]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages();
    } else {
      setIsInputReady(true);
    }
  }, [currentConversationId, loadMessages]);

  return {
    messages,
    isLoading,
    isInputReady,
    currentConversationId,
    sendMessage,
    setCurrentConversationId
  };
};
