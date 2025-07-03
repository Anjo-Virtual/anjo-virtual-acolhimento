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

  // PERSISTÊNCIA UNIFICADA - Chave única para o chat global
  const UNIFIED_STORAGE_KEY = 'global-persistent-chat';

  // Função para salvar dados unificados do chat
  const saveUnifiedChatData = useCallback((msgs: Message[], convId?: string) => {
    try {
      console.log('💾 [PERSISTENCE] Salvando dados unificados:', {
        messagesCount: msgs.length,
        conversationId: convId,
        storageKey: UNIFIED_STORAGE_KEY,
        location: window.location.pathname
      });

      const unifiedData = {
        conversationId: convId,
        messages: msgs,
        lastActivity: Date.now(),
        messageCount: msgs.length,
        isActive: true,
        location: window.location.pathname
      };
      
      sessionStorage.setItem(UNIFIED_STORAGE_KEY, JSON.stringify(unifiedData));
      
      // Manter compatibilidade com sistema antigo temporariamente
      if (convId) {
        sessionStorage.setItem(`chat_messages_${convId}`, JSON.stringify(msgs));
      } else {
        sessionStorage.setItem('chat_messages_global-temp', JSON.stringify(msgs));
      }
    } catch (error) {
      console.error('❌ [PERSISTENCE] Erro ao salvar dados unificados:', error);
    }
  }, []);

  // Função para carregar dados unificados do chat
  const loadUnifiedChatData = useCallback((): { messages: Message[], conversationId?: string } => {
    try {
      console.log('📂 [PERSISTENCE] Carregando dados unificados de:', UNIFIED_STORAGE_KEY, 'na rota:', window.location.pathname);

      const stored = sessionStorage.getItem(UNIFIED_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('✅ [PERSISTENCE] Dados carregados:', {
          messagesCount: data.messages?.length || 0,
          conversationId: data.conversationId,
          lastActivity: new Date(data.lastActivity),
          savedLocation: data.location,
          currentLocation: window.location.pathname
        });
        
        return {
          messages: data.messages || [],
          conversationId: data.conversationId
        };
      }
      
      // Fallback para sistema antigo
      console.log('⚠️ [PERSISTENCE] Usando fallback para sistema antigo');
      const oldStorageKey = 'chat_messages_global-temp';
      const oldStored = sessionStorage.getItem(oldStorageKey);
      if (oldStored) {
        const messages = JSON.parse(oldStored);
        return { messages, conversationId: undefined };
      }
      
      return { messages: [], conversationId: undefined };
    } catch (error) {
      console.error('❌ [PERSISTENCE] Erro ao carregar dados unificados:', error);
      return { messages: [], conversationId: undefined };
    }
  }, []);

  const loadMessages = useCallback(async () => {
    console.log('🔄 [LOAD] Iniciando carregamento de mensagens. ConversationId:', currentConversationId, 'Rota:', window.location.pathname);

    if (!currentConversationId) {
      // Carregar dados unificados da sessão se não há conversationId
      const { messages: sessionMessages, conversationId: storedConvId } = loadUnifiedChatData();
      
      if (sessionMessages.length > 0) {
        console.log('✅ [LOAD] Carregando mensagens da sessão:', sessionMessages.length, 'conversationId:', storedConvId);
        setMessages(sessionMessages);
        
        // Se tem conversationId armazenado, atualizar o estado
        if (storedConvId && storedConvId !== currentConversationId) {
          console.log('🔄 [LOAD] Atualizando conversationId do armazenamento:', storedConvId);
          setCurrentConversationId(storedConvId);
        }
      } else {
        console.log('📭 [LOAD] Nenhuma mensagem encontrada na sessão');
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
      saveUnifiedChatData(typedMessages, currentConversationId);
      loadedConversationId.current = currentConversationId;
      console.log(`✅ [LOAD] Carregadas ${typedMessages.length} mensagens do banco de dados`);
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
        saveUnifiedChatData(newMessages, data.conversationId || currentConversationId);
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
        saveUnifiedChatData(newMessages, currentConversationId);
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
  }, [currentConversationId, currentUser?.id, userId, sessionId, isLoading, saveUnifiedChatData]);

  // Resetar quando conversationId muda com logs detalhados
  useEffect(() => {
    console.log('🔄 [EFFECT] ConversationId mudou:', {
      current: currentConversationId,
      loaded: loadedConversationId.current,
      willReset: currentConversationId !== loadedConversationId.current,
      location: window.location.pathname
    });

    if (currentConversationId !== loadedConversationId.current) {
      console.log('🗑️ [RESET] Limpando mensagens devido a mudança de conversationId');
      setMessages([]);
      loadedConversationId.current = null;
    }
  }, [currentConversationId]);

  // Carregamento inicial com debugging
  useEffect(() => {
    console.log('🎯 [INIT] Efeito de inicialização:', {
      currentConversationId,
      hasCurrentConversationId: !!currentConversationId,
      location: window.location.pathname
    });

    if (currentConversationId) {
      loadMessages();
    } else {
      // Tentar carregar da sessão unificada
      const { messages: storedMessages, conversationId: storedConvId } = loadUnifiedChatData();
      if (storedMessages.length > 0 && storedConvId) {
        console.log('🔄 [INIT] Encontrada conversa na sessão, restaurando:', storedConvId);
        setCurrentConversationId(storedConvId);
      } else {
        setIsInputReady(true);
      }
    }
  }, [currentConversationId, loadMessages, loadUnifiedChatData]);

  return {
    messages,
    isLoading,
    isInputReady,
    currentConversationId,
    sendMessage,
    setCurrentConversationId
  };
};
