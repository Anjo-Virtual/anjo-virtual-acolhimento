
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Eye, ArrowRight } from "lucide-react";
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
  community_profiles?: {
    id: string;
    display_name: string;
    bio: string | null;
    grief_type: string | null;
    is_anonymous: boolean;
  };
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
                   
                   {/* Informações do usuário */}
                   {conversation.community_profiles && (
                     <div className="text-sm text-blue-600 mb-2">
                       <strong>Usuário:</strong> {conversation.community_profiles.display_name}
                       {conversation.community_profiles.grief_type && (
                         <span className="ml-2 text-gray-500">• {conversation.community_profiles.grief_type}</span>
                       )}
                       {conversation.community_profiles.is_anonymous && (
                         <span className="ml-2 text-orange-500">• Anônimo</span>
                       )}
                     </div>
                   )}
                   
                   {conversation.community_profiles?.bio && (
                     <div className="text-xs text-gray-600 mb-2 italic">
                       "{conversation.community_profiles.bio.substring(0, 100)}..."
                     </div>
                   )}
                   
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
                   variant="default" 
                   size="sm"
                   onClick={() => onViewConversation(conversation.id)}
                   disabled={messagesLoading}
                   className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] transition-all duration-200 hover:scale-105"
                 >
                   <Eye className="h-4 w-4 mr-2" />
                   Visualizar
                   <ArrowRight className="h-3 w-3 ml-1" />
                 </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
