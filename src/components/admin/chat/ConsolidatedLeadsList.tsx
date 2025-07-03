import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MessageSquare, 
  Calendar, 
  Eye, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Heart
} from "lucide-react";
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

interface ConsolidatedLeadsListProps {
  leads: ConsolidatedLead[];
  onViewConversation: (conversationId: string) => void;
  messagesLoading: boolean;
}

export const ConsolidatedLeadsList = ({ 
  leads, 
  onViewConversation, 
  messagesLoading 
}: ConsolidatedLeadsListProps) => {
  
  const getEngagementLevel = (score: number) => {
    if (score >= 20) return { level: 'Alto', color: 'bg-green-500', icon: '🔥' };
    if (score >= 10) return { level: 'Médio', color: 'bg-yellow-500', icon: '⚡' };
    return { level: 'Baixo', color: 'bg-gray-500', icon: '💫' };
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'auto_capture':
        return { text: 'Usuário Logado', color: 'bg-blue-500', icon: '👤' };
      case 'explicit_capture':
        return { text: 'Lead Direto', color: 'bg-green-500', icon: '✉️' };
      case 'recovered_lead':
        return { text: 'Recuperado', color: 'bg-amber-500', icon: '🔄' };
      default:
        return { text: 'Desconhecido', color: 'bg-gray-500', icon: '❓' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Leads Consolidados ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum lead encontrado</p>
          ) : (
            leads.map((lead) => {
              const engagement = getEngagementLevel(lead.engagement_score);
              const source = getSourceBadge(lead.lead_source);
              const mostRecentConversation = lead.conversations
                .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())[0];

              return (
                <div key={lead.user_id} className="p-6 border rounded-lg bg-gradient-to-r from-white to-blue-50 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Cabeçalho do Lead */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {lead.profile.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{lead.profile.display_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${source.color} text-white text-xs`}>
                              {source.icon} {source.text}
                            </Badge>
                            <Badge className={`${engagement.color} text-white text-xs`}>
                              {engagement.icon} {engagement.level}
                            </Badge>
                            {lead.profile.is_anonymous && (
                              <Badge variant="outline" className="text-xs">
                                🥸 Anônimo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Informações do Perfil */}
                      {lead.profile.grief_type && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-blue-800 font-medium">
                            <Heart className="h-4 w-4 inline mr-1" />
                            Tipo de luto: {lead.profile.grief_type}
                          </p>
                        </div>
                      )}

                      {lead.profile.bio && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 italic text-sm">
                            "{lead.profile.bio.substring(0, 120)}..."
                          </p>
                        </div>
                      )}

                      {/* Métricas de Engajamento */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-blue-600">{lead.total_conversations}</div>
                          <div className="text-xs text-gray-500">Conversas</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-green-600">{lead.total_messages}</div>
                          <div className="text-xs text-gray-500">Mensagens</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-purple-600">{lead.engagement_score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-lg font-bold text-orange-600">
                            {Math.round(lead.total_messages / lead.total_conversations)}
                          </div>
                          <div className="text-xs text-gray-500">Msg/Conversa</div>
                        </div>
                      </div>

                      {/* Timeline de Interações */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Primeira: {formatDistanceToNow(new Date(lead.first_interaction), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Última: {formatDistanceToNow(new Date(lead.last_interaction), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </div>

                      {/* Conversas Recentes */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          Conversas ({lead.conversations.length})
                        </h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {lead.conversations.slice(0, 3).map((conv) => (
                            <div 
                              key={conv.id} 
                              className="flex items-center justify-between p-2 bg-white rounded border text-sm hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3 text-gray-400" />
                                <span className="truncate max-w-[200px]">
                                  {conv.title || `Conversa ${conv.id.substring(0, 8)}`}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {conv.message_count} msg
                                </Badge>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onViewConversation(conv.id)}
                                disabled={messagesLoading}
                                className="h-6 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {lead.conversations.length > 3 && (
                            <p className="text-xs text-gray-500 text-center py-1">
                              + {lead.conversations.length - 3} conversas adicionais
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ação Principal */}
                    <div className="ml-4">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onViewConversation(mostRecentConversation?.id || lead.conversations[0]?.id)}
                        disabled={messagesLoading || !mostRecentConversation}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Conversa Atual
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};