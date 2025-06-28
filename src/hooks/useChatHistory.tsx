
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChatPermissions } from "./useChatPermissions";
import { toast } from "@/components/ui/use-toast";

interface ConversationWithDetails {
  id: string;
  title: string;
  user_id: string;
  started_at: string;
  last_message_at: string;
  message_count: number;
  status: string;
  lead_id: string | null;
  user_email?: string;
  last_message_preview?: string;
}

interface ChatHistoryFilters {
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  hasLead?: boolean;
  userId?: string;
}

export const useChatHistory = () => {
  const { isAdminUser, userId, canViewAllConversations } = useChatPermissions();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ChatHistoryFilters>({});
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          profiles:auth.users!conversations_user_id_fkey(email),
          messages!inner(content)
        `, { count: 'exact' });

      // Se não é admin, filtrar apenas conversas do usuário
      if (!canViewAllConversations && userId) {
        query = query.eq('user_id', userId);
      }

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.hasLead !== undefined) {
        if (filters.hasLead) {
          query = query.not('lead_id', 'is', null);
        } else {
          query = query.is('lead_id', null);
        }
      }

      if (filters.userId && canViewAllConversations) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.dateRange) {
        query = query
          .gte('started_at', filters.dateRange.start.toISOString())
          .lte('started_at', filters.dateRange.end.toISOString());
      }

      // Ordenação e paginação
      const offset = (currentPage - 1) * pageSize;
      const { data, error, count } = await query
        .order('last_message_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error('Erro ao carregar conversas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico de conversas.",
          variant: "destructive",
        });
        return;
      }

      // Processar dados para incluir informações adicionais
      const processedConversations: ConversationWithDetails[] = (data || []).map(conv => ({
        ...conv,
        user_email: conv.profiles?.email || 'Email não disponível',
        last_message_preview: conv.messages?.[0]?.content?.substring(0, 100) || 'Sem mensagens'
      }));

      setConversations(processedConversations);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar conversas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [canViewAllConversations, userId, filters, currentPage]);

  const searchConversations = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    setCurrentPage(1); // Reset para primeira página
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ChatHistoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset para primeira página
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (userId || canViewAllConversations) {
      loadConversations();
    }
  }, [loadConversations, userId, canViewAllConversations]);

  return {
    conversations,
    loading,
    filters,
    totalCount,
    currentPage,
    pageSize,
    isAdminUser,
    loadConversations,
    searchConversations,
    updateFilters,
    clearFilters,
    setCurrentPage
  };
};
