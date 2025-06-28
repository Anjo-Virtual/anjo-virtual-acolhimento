
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useChatPermissions } from "@/hooks/useChatPermissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdminChatHistory } from "./AdminChatHistory";

interface Conversation {
  id: string;
  title: string;
  started_at: string;
  last_message_at: string;
  message_count: number;
  status: string;
}

interface ChatHistoryProps {
  onSelectConversation: (conversationId: string) => void;
}

export const ChatHistory = ({ onSelectConversation }: ChatHistoryProps) => {
  const { user } = useCommunityAuth();
  const { isAdminUser } = useChatPermissions();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Se é admin, usar o componente de histórico avançado
  if (isAdminUser) {
    return <AdminChatHistory onSelectConversation={onSelectConversation} />;
  }

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })
        .limit(10); // Limitar para usuários comuns

      if (error) {
        console.error('Erro ao carregar conversas:', error);
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p>Nenhuma conversa anterior encontrada.</p>
        <p className="text-sm mt-2">Inicie uma nova conversa para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Suas Conversas</h3>
      {conversations.map((conversation) => (
        <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium mb-1">
                  {conversation.title || 'Conversa sem título'}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(conversation.last_message_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </div>
                  <span>{conversation.message_count} mensagens</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectConversation(conversation.id)}
                className="flex items-center gap-1"
              >
                Continuar
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
