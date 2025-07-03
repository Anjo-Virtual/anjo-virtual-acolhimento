import { useState, useEffect, useCallback } from "react";

interface ChatSession {
  conversationId?: string;
  lastActivity: number;
  messages: any[];
  isActive: boolean;
}

export const usePersistentChatSession = () => {
  const [session, setSession] = useState<ChatSession | null>(null);

  // Carregar sessão do sessionStorage
  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = sessionStorage.getItem('persistent-chat-session');
        if (stored) {
          const parsedSession = JSON.parse(stored);
          // Verificar se a sessão não é muito antiga (24 horas)
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas
          if (Date.now() - parsedSession.lastActivity < maxAge) {
            setSession(parsedSession);
          } else {
            // Limpar sessão expirada
            sessionStorage.removeItem('persistent-chat-session');
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar sessão do chat:', error);
        sessionStorage.removeItem('persistent-chat-session');
      }
    };

    loadSession();
  }, []);

  // Salvar sessão no sessionStorage
  const saveSession = useCallback((updatedSession: ChatSession) => {
    try {
      sessionStorage.setItem('persistent-chat-session', JSON.stringify(updatedSession));
      setSession(updatedSession);
    } catch (error) {
      console.warn('Erro ao salvar sessão do chat:', error);
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

  // Limpar sessão
  const clearSession = useCallback(() => {
    sessionStorage.removeItem('persistent-chat-session');
    sessionStorage.removeItem('global-chat-state');
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