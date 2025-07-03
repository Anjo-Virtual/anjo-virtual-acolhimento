import { useState, useEffect, useCallback } from "react";

interface ChatSession {
  conversationId?: string;
  lastActivity: number;
  messages: any[];
  isActive: boolean;
}

export const usePersistentChatSession = () => {
  const [session, setSession] = useState<ChatSession | null>(null);

  // Carregar sessão do sessionStorage unificado
  useEffect(() => {
    const loadSession = () => {
      try {
        console.log('🔄 [SESSION] Carregando sessão persistente');
        
        // Tentar carregar do sistema unificado primeiro
        const unifiedStored = sessionStorage.getItem('global-persistent-chat');
        if (unifiedStored) {
          const unifiedData = JSON.parse(unifiedStored);
          console.log('✅ [SESSION] Dados unificados encontrados:', unifiedData);
          
          // Verificar se a sessão não é muito antiga (24 horas)
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas
          if (Date.now() - unifiedData.lastActivity < maxAge) {
            const session: ChatSession = {
              conversationId: unifiedData.conversationId,
              lastActivity: unifiedData.lastActivity,
              messages: unifiedData.messages || [],
              isActive: unifiedData.isActive || false
            };
            setSession(session);
            return;
          } else {
            console.log('⏰ [SESSION] Sessão unificada expirada, limpando');
            sessionStorage.removeItem('global-persistent-chat');
          }
        }
        
        // Fallback para sistema antigo
        const stored = sessionStorage.getItem('persistent-chat-session');
        if (stored) {
          console.log('⚠️ [SESSION] Usando fallback para sistema antigo');
          const parsedSession = JSON.parse(stored);
          const maxAge = 24 * 60 * 60 * 1000;
          if (Date.now() - parsedSession.lastActivity < maxAge) {
            setSession(parsedSession);
          } else {
            sessionStorage.removeItem('persistent-chat-session');
          }
        }
      } catch (error) {
        console.error('❌ [SESSION] Erro ao carregar sessão:', error);
        sessionStorage.removeItem('persistent-chat-session');
        sessionStorage.removeItem('global-persistent-chat');
      }
    };

    loadSession();
  }, []);

  // Salvar sessão no sessionStorage unificado
  const saveSession = useCallback((updatedSession: ChatSession) => {
    try {
      console.log('💾 [SESSION] Salvando sessão unificada:', updatedSession);
      
      // Salvar no sistema unificado
      const unifiedData = {
        conversationId: updatedSession.conversationId,
        messages: updatedSession.messages,
        lastActivity: updatedSession.lastActivity,
        messageCount: updatedSession.messages.length,
        isActive: updatedSession.isActive,
        location: window.location.pathname
      };
      
      sessionStorage.setItem('global-persistent-chat', JSON.stringify(unifiedData));
      
      // Manter compatibilidade com sistema antigo
      sessionStorage.setItem('persistent-chat-session', JSON.stringify(updatedSession));
      
      setSession(updatedSession);
    } catch (error) {
      console.error('❌ [SESSION] Erro ao salvar sessão:', error);
    }
  }, []);

  // Atualizar conversação
  const updateConversation = useCallback((conversationId: string) => {
    const updatedSession: ChatSession = {
      ...session,
      conversationId,
      lastActivity: Date.now(),
      isActive: true
    };
    saveSession(updatedSession);
  }, [session, saveSession]);

  // Atualizar atividade
  const updateActivity = useCallback(() => {
    if (session) {
      const updatedSession = {
        ...session,
        lastActivity: Date.now()
      };
      saveSession(updatedSession);
    }
  }, [session, saveSession]);

  // Adicionar mensagem à sessão
  const addMessage = useCallback((message: any) => {
    if (session) {
      const updatedSession = {
        ...session,
        messages: [...session.messages, message],
        lastActivity: Date.now()
      };
      saveSession(updatedSession);
    }
  }, [session, saveSession]);

  // Limpar sessão unificada
  const clearSession = useCallback(() => {
    console.log('🗑️ [SESSION] Limpando todas as sessões');
    
    // Limpar sistema unificado
    sessionStorage.removeItem('global-persistent-chat');
    
    // Limpar sistemas antigos
    sessionStorage.removeItem('persistent-chat-session');
    sessionStorage.removeItem('global-chat-state');
    sessionStorage.removeItem('chat_session_meta');
    
    // Limpar também mensagens temporárias
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('chat_messages_')) {
        sessionStorage.removeItem(key);
      }
    });
    
    setSession(null);
  }, []);

  // Inicializar nova sessão
  const initializeSession = useCallback(() => {
    const newSession: ChatSession = {
      lastActivity: Date.now(),
      messages: [],
      isActive: true
    };
    saveSession(newSession);
  }, [saveSession]);

  return {
    session,
    updateConversation,
    updateActivity,
    addMessage,
    clearSession,
    initializeSession,
    hasActiveSession: session?.isActive && session?.conversationId
  };
};