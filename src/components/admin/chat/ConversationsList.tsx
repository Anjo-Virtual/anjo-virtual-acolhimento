
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface ConversationsListProps {
  conversations: ConversationStats[];
  onViewConversation: (conversationId: string) => void;
  messagesLoading: boolean;
}

export const ConversationsList = ({ 
  conversations, 
  onViewConversation, 
  messagesLoading 
}: ConversationsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'paused': return 'Pausado';
      case 'completed': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma conversa encontrada</p>
          ) : (
            conversations.slice(0, 20).map((conversation) => (
              <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{conversation.title || 'Conversa sem título'}</h3>
                    <Badge className={`${getStatusColor(conversation.status)} text-white`}>
                      {getStatusText(conversation.status)}
                    </Badge>
                    {conversation.lead_id && (
                      <Badge variant="outline">Lead</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {conversation.message_count} mensagens
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(conversation.last_message_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewConversation(conversation.id)}
                  disabled={messagesLoading}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
