
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
  session_id?: string | null;
  community_profiles?: {
    id: string;
    display_name: string;
    bio: string | null;
    grief_type: string | null;
    is_anonymous: boolean;
  };
}

interface ConsolidatedLead {
  user_id: string;
  profile: {
    id: string;
    display_name: string;
    bio: string | null;
    grief_type: string | null;
    is_anonymous: boolean;
  };
  conversations: ConversationStats[];
  total_conversations: number;
  total_messages: number;
  first_interaction: string;
  last_interaction: string;
  lead_source: 'auto_capture' | 'explicit_capture' | 'recovered_lead';
  engagement_score: number;
}

interface ChatFilters {
  period: 'today' | 'week' | 'month' | 'all';
  activity: 'last_24h' | 'most_active' | 'recent' | 'all';
  engagement: 'high' | 'medium' | 'low' | 'all';
  status: 'active' | 'paused' | 'completed' | 'all';
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
  const [consolidatedLeads, setConsolidatedLeads] = useState<ConsolidatedLead[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    leadsGenerated: 0,
    avgMessagesPerConversation: 0
  });
  const [filters, setFilters] = useState<ChatFilters>({
    period: 'week',
    activity: 'all',
    engagement: 'all',
    status: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const { toast } = useToast();

  const applyFilters = useCallback((conversations: ConversationStats[]) => {
    let filtered = [...conversations];

    // Filtro por período
    if (filters.period !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.period) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(conv => new Date(conv.last_message_at) >= cutoff);
    }

    // Filtro por atividade
    if (filters.activity !== 'all') {
      const now = new Date();
      
      switch (filters.activity) {
        case 'last_24h':
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          filtered = filtered.filter(conv => new Date(conv.last_message_at) >= yesterday);
          break;
        case 'most_active':
          filtered = filtered.filter(conv => conv.message_count >= 10);
          break;
        case 'recent':
          filtered = filtered.slice(0, 20);
          break;
      }
    }

    // Filtro por engajamento
    if (filters.engagement !== 'all') {
      switch (filters.engagement) {
        case 'high':
          filtered = filtered.filter(conv => conv.message_count >= 10);
          break;
        case 'medium':
          filtered = filtered.filter(conv => conv.message_count >= 5 && conv.message_count < 10);
          break;
        case 'low':
          filtered = filtered.filter(conv => conv.message_count < 5);
          break;
      }
    }

    // Filtro por status
    if (filters.status !== 'all') {
      filtered = filtered.filter(conv => conv.status === filters.status);
    }

    return filtered;
  }, [filters]);

  const consolidateLeadsByUser = useCallback((conversations: ConversationStats[]) => {
    const userMap = new Map<string, ConsolidatedLead>();

    conversations.forEach(conv => {
      if (!conv.user_id || !conv.community_profiles) return;

      const userId = conv.user_id;
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user_id: userId,
          profile: conv.community_profiles,
          conversations: [],
          total_conversations: 0,
          total_messages: 0,
          first_interaction: conv.started_at || conv.last_message_at,
          last_interaction: conv.last_message_at,
          lead_source: 'auto_capture',
          engagement_score: 0
        });
      }

      const lead = userMap.get(userId)!;
      lead.conversations.push(conv);
      lead.total_conversations++;
      lead.total_messages += conv.message_count || 0;
      
      // Atualizar primeira e última interação
      if (new Date(conv.started_at || conv.last_message_at) < new Date(lead.first_interaction)) {
        lead.first_interaction = conv.started_at || conv.last_message_at;
      }
      if (new Date(conv.last_message_at) > new Date(lead.last_interaction)) {
        lead.last_interaction = conv.last_message_at;
      }
      
      // Calcular score de engajamento
      lead.engagement_score = lead.total_messages + (lead.total_conversations * 2);
    });

    return Array.from(userMap.values()).sort((a, b) => b.engagement_score - a.engagement_score);
  }, []);

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

      // Aplicar filtros e consolidar leads
      const filteredConversations = applyFilters(enrichedConversations);
      const consolidated = consolidateLeadsByUser(filteredConversations);

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
      const leadsGenerated = consolidated?.length || 0;
      const avgMessages = totalConversations > 0 ? Math.round((totalMessages || 0) / totalConversations) : 0;

      setConversations(enrichedConversations);
      setConsolidatedLeads(consolidated);
      setMetrics({
        totalConversations,
        activeConversations,
        totalMessages: totalMessages || 0,
        leadsGenerated,
        avgMessagesPerConversation: avgMessages
      });

      console.log('Dashboard carregado com sucesso', {
        conversations: enrichedConversations.length,
        consolidatedLeads: consolidated.length,
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
  }, [toast, applyFilters, consolidateLeadsByUser]);

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

  const recoverLostLeads = useCallback(async () => {
    setRecoveryLoading(true);
    try {
      console.log('🔍 Iniciando recuperação de leads perdidos...');
      
      // Buscar conversas ativas sem leads que têm user_id e pelo menos 3 mensagens
      const { data: conversationsWithoutLeads, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .is('lead_id', null)
        .not('user_id', 'is', null)
        .gte('message_count', 3)
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      // Buscar perfis dos usuários das conversas sem leads
      let conversationsWithProfiles: any[] = [];
      if (conversationsWithoutLeads && conversationsWithoutLeads.length > 0) {
        const userIds = conversationsWithoutLeads.map(c => c.user_id).filter(Boolean);
        
        if (userIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('community_profiles')
            .select('*')
            .in('user_id', userIds);
            
          if (!profileError && profiles) {
            conversationsWithProfiles = conversationsWithoutLeads.map(conversation => {
              const profile = profiles.find(p => p.user_id === conversation.user_id);
              return {
                ...conversation,
                community_profiles: profile || null
              };
            }).filter(c => c.community_profiles); // Apenas conversas com perfil
          }
        }
      }

      if (convError) {
        console.error('Erro ao buscar conversas sem leads:', convError);
        throw new Error('Erro ao identificar conversas perdidas');
      }

      console.log(`📊 Encontradas ${conversationsWithProfiles?.length || 0} conversas sem leads com perfil`);

      if (!conversationsWithProfiles || conversationsWithProfiles.length === 0) {
        toast({
          title: "Recuperação Completa",
          description: "Não foram encontradas conversas sem leads para recuperar.",
        });
        return 0;
      }

      let recoveredCount = 0;

      // Recuperar leads para cada conversa
      for (const conversation of conversationsWithProfiles) {
        if (!conversation.community_profiles) continue;

        const profile = conversation.community_profiles;
        const recoveredEmail = `${profile.user_id}@recovered.local`;

        try {
          // Verificar se já existe um lead recuperado para este usuário
          const { data: existingRecoveredLead, error: checkError } = await supabase
            .from('chat_leads')
            .select('id')
            .eq('email', recoveredEmail)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error(`Erro ao verificar lead existente para ${profile.display_name}:`, checkError);
            continue;
          }

          let leadId = null;

          if (!existingRecoveredLead) {
            // Criar novo lead recuperado
            console.log(`🔄 Criando lead recuperado para: ${profile.display_name}`);
            
            const { data: newLead, error: leadError } = await supabase
              .from('chat_leads')
              .insert({
                name: profile.display_name,
                email: recoveredEmail,
                phone: null,
                conversation_id: conversation.id,
                metadata: {
                  source: 'recovery_process',
                  type: 'recovered_lead',
                  user_id: conversation.user_id,
                  original_conversation_id: conversation.id,
                  recovered_at: new Date().toISOString(),
                  grief_type: profile.grief_type || null,
                  message_count_at_recovery: conversation.message_count,
                  last_activity: conversation.last_message_at
                }
              })
              .select('id')
              .single();

            if (leadError) {
              console.error(`Erro ao criar lead para ${profile.display_name}:`, leadError);
              continue;
            }

            leadId = newLead.id;
          } else {
            leadId = existingRecoveredLead.id;
            console.log(`♻️ Reutilizando lead existente para: ${profile.display_name}`);
          }

          // Conectar conversa ao lead
          const { error: updateError } = await supabase
            .from('conversations')
            .update({ lead_id: leadId })
            .eq('id', conversation.id);

          if (updateError) {
            console.error(`Erro ao conectar conversa ${conversation.id} ao lead:`, updateError);
            continue;
          }

          recoveredCount++;
          console.log(`✅ Lead recuperado: ${profile.display_name} -> Conversa ${conversation.id}`);

        } catch (error) {
          console.error(`Erro ao processar conversa ${conversation.id}:`, error);
          continue;
        }
      }

      // Recarregar dados do dashboard
      await loadDashboardData();

      toast({
        title: "Leads Recuperados",
        description: `${recoveredCount} leads foram recuperados com sucesso!`,
      });

      console.log(`🎉 Recuperação concluída: ${recoveredCount}/${conversationsWithProfiles.length} leads criados`);
      return recoveredCount;

    } catch (error) {
      console.error('Erro na recuperação de leads:', error);
      toast({
        title: "Erro na Recuperação",
        description: "Erro ao recuperar leads perdidos. Tente novamente.",
        variant: "destructive",
      });
      return 0;
    } finally {
      setRecoveryLoading(false);
    }
  }, [toast, loadDashboardData]);

  return {
    conversations,
    consolidatedLeads,
    metrics,
    filters,
    setFilters,
    loading,
    conversationMessages,
    messagesLoading,
    recoveryLoading,
    loadDashboardData,
    loadConversationMessages,
    recoverLostLeads
  };
};
