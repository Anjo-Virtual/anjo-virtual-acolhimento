import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChatPermissions } from "./useChatPermissions";
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
  const { currentUser, isAdminUser } = useChatPermissions();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [isInputReady, setIsInputReady] = useState(false);
  const loadedConversationId = useRef<string | null>(null);
  const [sessionId] = useState(() => {
    const effectiveUserId = userId || currentUser?.id;
    if (!effectiveUserId) {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return null;
  });

  // Função para salvar mensagens no sessionStorage
  const saveMessagesToSession = useCallback((msgs: Message[], convId?: string) => {
    try {
      const storageKey = `chat_messages_${convId || 'temp'}`;
      sessionStorage.setItem(storageKey, JSON.stringify(msgs));
    } catch (error) {
      console.warn('Erro ao salvar mensagens no session storage:', error);
    }
  }, []);

  // Função para carregar mensagens do sessionStorage
  const loadMessagesFromSession = useCallback((convId?: string): Message[] => {
    try {
      const storageKey = `chat_messages_${convId || 'temp'}`;
      const stored = sessionStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Erro ao carregar mensagens do session storage:', error);
      return [];
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!currentConversationId) {
      // Carregar mensagens da sessão se não há conversationId
      const sessionMessages = loadMessagesFromSession();
      if (sessionMessages.length > 0) {
        setMessages(sessionMessages);
      }
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
      // Verificar se o usuário tem permissão para ver esta conversa
      const effectiveUserId = userId || currentUser?.id;
      if (!isAdminUser && effectiveUserId) {
        const { data: conversationCheck, error: checkError } = await supabase
          .from('conversations')
          .select('user_id')
          .eq('id', currentConversationId)
          .single();

        if (checkError || conversationCheck?.user_id !== effectiveUserId) {
          console.error('Usuário não tem permissão para ver esta conversa');
          toast({
            title: "Acesso Negado",
            description: "Você não tem permissão para ver esta conversa.",
            variant: "destructive",
          });
          return;
        }
      }

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
      saveMessagesToSession(typedMessages, currentConversationId);
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
  }, [currentConversationId, currentUser?.id, userId, isAdminUser]);

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
    setMessages(prev => {
      const newMessages = [...prev, tempUserMessage];
      saveMessagesToSession(newMessages, currentConversationId);
      return newMessages;
    });

    try {
      const effectiveUserId = userId || currentUser?.id;
      
      console.log('Enviando mensagem para chat-rag:', {
        message: userMessage,
        conversationId: currentConversationId,
        userId: effectiveUserId,
        sessionId: sessionId,
        hasLeadData: !!leadData
      });

      const { data, error } = await supabase.functions.invoke('chat-rag', {
        body: {
          message: userMessage,
          conversationId: currentConversationId,
          userId: effectiveUserId,
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

      setMessages(prev => {
        const filteredMessages = prev.filter(m => m.id !== tempUserMessage.id);
        saveMessagesToSession(filteredMessages, currentConversationId);
        return filteredMessages;
      });
      
      // Aguardar um pouco antes de recarregar as mensagens
      setTimeout(() => {
        loadMessages();
      }, 300);

    } catch (error) {
      console.error('Erro no chat:', error);
      
      setMessages(prev => {
        const filteredMessages = prev.filter(m => m.id !== tempUserMessage.id);
        saveMessagesToSession(filteredMessages, currentConversationId);
        return filteredMessages;
      });
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        saveMessagesToSession(newMessages, currentConversationId);
        return newMessages;
      });

      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInputReady(true);
    }
  }, [currentConversationId, currentUser?.id, userId, sessionId, isLoading, loadMessages, saveMessagesToSession]);

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
  }, [currentConversationId, loadMessages, loadMessagesFromSession]);

  return {
    messages,
    isLoading,
    isInputReady,
    currentConversationId,
    sendMessage,
    setCurrentConversationId
  };
};
