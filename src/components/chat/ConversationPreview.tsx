
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, User, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConversationPreviewProps {
  conversation: {
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
  };
  onSelect: (conversationId: string) => void;
  isAdmin?: boolean;
  loading?: boolean;
}

export const ConversationPreview = ({ 
  conversation, 
  onSelect, 
  isAdmin = false,
  loading = false 
}: ConversationPreviewProps) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Título e badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-sm">
                {conversation.title || 'Conversa sem título'}
              </h3>
              <Badge className={`${getStatusColor(conversation.status)} text-white text-xs`}>
                {getStatusText(conversation.status)}
              </Badge>
              {conversation.lead_id && (
                <Badge variant="outline" className="text-xs">Lead</Badge>
              )}
            </div>

            {/* Informações do usuário (apenas para admin) */}
            {isAdmin && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User className="h-3 w-3" />
                {conversation.user_email}
              </div>
            )}

            {/* Preview da última mensagem */}
            {conversation.last_message_preview && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {conversation.last_message_preview}...
              </p>
            )}

            {/* Estatísticas */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
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

          {/* Botão de ação */}
          <div className="ml-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSelect(conversation.id)}
              disabled={loading}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              {isAdmin ? 'Gerenciar' : 'Continuar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
