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
      const storageKey = `chat_messages_${convId || 'global-temp'}`;
      sessionStorage.setItem(storageKey, JSON.stringify(msgs));
      
      // Também salvar metadados da sessão
      const sessionMeta = {
        conversationId: convId,
        lastActivity: Date.now(),
        messageCount: msgs.length
      };
      sessionStorage.setItem('chat_session_meta', JSON.stringify(sessionMeta));
    } catch (error) {
      console.warn('Erro ao salvar mensagens no session storage:', error);
    }
  }, []);

  // Função para carregar mensagens do sessionStorage
  const loadMessagesFromSession = useCallback((convId?: string): Message[] => {
    try {
      const storageKey = `chat_messages_${convId || 'global-temp'}`;
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

    console.log('🚀 [CHAT] Enviando mensagem:', userMessage);
    setIsLoading(true);
    setIsInputReady(false);

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    
    // Adicionar mensagem temporária imediatamente
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const effectiveUserId = userId || currentUser?.id;
      
      console.log('📡 [CHAT] Chamando função chat-rag:', {
        message: userMessage.substring(0, 50) + '...',
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

      console.log('📥 [CHAT] Resposta raw da função:', { data, error });

      if (error) {
        console.error('❌ [CHAT] Erro da função:', error);
        throw new Error(`Erro na função: ${error.message || 'Erro desconhecido'}`);
      }

      if (!data || !data.success) {
        console.error('❌ [CHAT] Resposta inválida:', data);
        throw new Error('Resposta inválida do servidor');
      }

      console.log('✅ [CHAT] Resposta processada com sucesso');

      // Atualizar conversationId se foi criada nova conversa
      if (data.conversationId && data.conversationId !== currentConversationId) {
        console.log('🆕 [CHAT] Nova conversa criada:', data.conversationId);
        setCurrentConversationId(data.conversationId);
        onConversationCreated?.(data.conversationId);
      }

      // Remover mensagem temporária e adicionar resposta do assistente
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMessage.id);
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response || 'Resposta recebida com sucesso.',
          sources: data.sources || [],
          created_at: new Date().toISOString()
        };
        
        const finalUserMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: userMessage,
          created_at: new Date().toISOString()
        };

        const newMessages = [...filtered, finalUserMessage, assistantMessage];
        saveMessagesToSession(newMessages, data.conversationId || currentConversationId);
        return newMessages;
      });

    } catch (error) {
      console.error('💥 [CHAT] Erro crítico:', error);
      
      // Remover mensagem temporária e mostrar erro
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMessage.id);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Desculpe, ocorreu um erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`,
          created_at: new Date().toISOString()
        };
        
        const finalUserMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: userMessage,
          created_at: new Date().toISOString()
        };

        const newMessages = [...filtered, finalUserMessage, errorMessage];
        saveMessagesToSession(newMessages, currentConversationId);
        return newMessages;
      });

      toast({
        title: "Erro no Chat",
        description: `Falha ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInputReady(true);
    }
  }, [currentConversationId, currentUser?.id, userId, sessionId, isLoading, saveMessagesToSession]);

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
