
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
  const [recoveryLoading, setRecoveryLoading] = useState(false);
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
    leads,
    metrics,
    loading,
    conversationMessages,
    messagesLoading,
    recoveryLoading,
    loadDashboardData,
    loadConversationMessages,
    recoverLostLeads
  };
};
