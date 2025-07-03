
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
  community_profiles?: {
    id: string;
    display_name: string;
    bio: string | null;
    grief_type: string | null;
    is_anonymous: boolean;
  };
}

interface ChatLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  conversation_id: string;
  conversations?: {
    id: string;
    title: string;
    user_id: string;
    community_profiles?: {
      display_name: string;
      bio: string | null;
      grief_type: string | null;
      is_anonymous: boolean;
    };
  };
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
      
      // Buscar conversas básicas
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

      // Buscar perfis dos usuários das conversas
      const userIds = conversationsData?.filter(c => c.user_id).map(c => c.user_id) || [];
      let profilesData: any[] = [];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('community_profiles')
          .select('*')
          .in('user_id', userIds);
          
        if (!profileError) {
          profilesData = profiles || [];
        }
      }

      // Combinar conversas com perfis
      const enrichedConversations = conversationsData?.map(conversation => {
        const profile = profilesData.find(p => p.user_id === conversation.user_id);
        return {
          ...conversation,
          community_profiles: profile || null
        };
      }) || [];

      // Buscar leads básicos
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

      // Enriquecer leads com dados das conversas
      const enrichedLeads = await Promise.all(
        (leadsData || []).map(async (lead) => {
          const conversation = enrichedConversations.find(c => c.id === lead.conversation_id);
          return {
            ...lead,
            conversations: conversation ? {
              id: conversation.id,
              title: conversation.title,
              user_id: conversation.user_id,
              community_profiles: conversation.community_profiles
            } : null
          };
        })
      );

      // Buscar total de mensagens
      const { count: totalMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      if (messagesError) {
        console.error('Erro ao contar mensagens:', messagesError);
      }

      // Calcular métricas
      const totalConversations = enrichedConversations?.length || 0;
      const activeConversations = enrichedConversations?.filter(c => c.status === 'active').length || 0;
      const leadsGenerated = enrichedLeads?.length || 0;
      const avgMessages = totalConversations > 0 ? Math.round((totalMessages || 0) / totalConversations) : 0;

      setConversations(enrichedConversations);
      setLeads(enrichedLeads);
      setMetrics({
        totalConversations,
        activeConversations,
        totalMessages: totalMessages || 0,
        leadsGenerated,
        avgMessagesPerConversation: avgMessages
      });

      console.log('Dashboard carregado com sucesso', {
        conversations: enrichedConversations.length,
        leads: enrichedLeads.length,
        profiles: profilesData.length
      });

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
