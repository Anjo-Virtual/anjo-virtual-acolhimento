
import { useState, useEffect } from "react";

let globalChatInstance: string | null = null;
const chatInstanceListeners = new Set<(instance: string | null) => void>();

export const useChatInstance = () => {
  const [currentInstance, setCurrentInstance] = useState<string | null>(globalChatInstance);

  useEffect(() => {
    const listener = (instance: string | null) => {
      setCurrentInstance(instance);
    };
    
    chatInstanceListeners.add(listener);
    
    return () => {
      chatInstanceListeners.delete(listener);
    };
  }, []);

  const openChat = (instanceId: string) => {
    if (globalChatInstance && globalChatInstance !== instanceId) {
      console.log(`Fechando chat anterior: ${globalChatInstance}`);
    }
    
    globalChatInstance = instanceId;
    chatInstanceListeners.forEach(listener => listener(instanceId));
  };

  const closeChat = () => {
    globalChatInstance = null;
    chatInstanceListeners.forEach(listener => listener(null));
  };

  const isActiveInstance = (instanceId: string) => {
    return globalChatInstance === instanceId;
  };

  return {
    currentInstance,
    openChat,
    closeChat,
    isActiveInstance
  };
};
