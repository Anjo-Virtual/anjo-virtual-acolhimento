
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConversationStats {
  id: string;
  title: string;
  user_id: string;
  started_at: string;
  last_message_at: string;
  message_count: number;
  status: string;
  lead_id: string | null;
}

interface ChatLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  conversation_id: string;
}

interface DashboardMetrics {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  leadsGenerated: number;
  avgMessagesPerConversation: number;
}

export const useChatDashboardData = () => {
  const [conversations, setConversations] = useState<ConversationStats[]>([]);
  const [leads, setLeads] = useState<ChatLead[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    leadsGenerated: 0,
    avgMessagesPerConversation: 0
  });
  const [loading, setLoading] = useState(true);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Carregando dados do dashboard...');
      
      // Buscar conversas
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (convError) {
        console.error('Erro ao buscar conversas:', convError);
        toast({
          title: "Erro",
          description: "Erro ao carregar conversas.",
          variant: "destructive",
        });
      }

      // Buscar leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('chat_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error('Erro ao buscar leads:', leadsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar leads.",
          variant: "destructive",
        });
      }

      // Buscar total de mensagens
      const { count: totalMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      if (messagesError) {
        console.error('Erro ao contar mensagens:', messagesError);
      }

      // Calcular métricas
      const totalConversations = conversationsData?.length || 0;
      const activeConversations = conversationsData?.filter(c => c.status === 'active').length || 0;
      const leadsGenerated = leadsData?.length || 0;
      const avgMessages = totalConversations > 0 ? Math.round((totalMessages || 0) / totalConversations) : 0;

      setConversations(conversationsData || []);
      setLeads(leadsData || []);
      setMetrics({
        totalConversations,
        activeConversations,
        totalMessages: totalMessages || 0,
        leadsGenerated,
        avgMessagesPerConversation: avgMessages
      });

      console.log('Dashboard carregado com sucesso');

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadConversationMessages = useCallback(async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar mensagens da conversa.",
          variant: "destructive",
        });
        return;
      }

      setConversationMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar mensagens.",
        variant: "destructive",
      });
    } finally {
      setMessagesLoading(false);
    }
  }, [toast]);

  return {
    conversations,
    leads,
    metrics,
    loading,
    conversationMessages,
    messagesLoading,
    loadDashboardData,
    loadConversationMessages
  };
};
