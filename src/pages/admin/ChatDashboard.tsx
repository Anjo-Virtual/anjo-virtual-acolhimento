
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Eye,
  Calendar,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
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

const ChatDashboard = () => {
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
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
  };

  const loadConversationMessages = async (conversationId: string) => {
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
      setSelectedConversation(conversationId);
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
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard do Chat</h1>
        <Button onClick={loadDashboardData} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.leadsGenerated}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Msg/Conversa</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgMessagesPerConversation}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
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
                        onClick={() => loadConversationMessages(conversation.id)}
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
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leads Capturados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum lead encontrado</p>
                ) : (
                  leads.slice(0, 20).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{lead.name}</h3>
                        <div className="text-sm text-gray-500">
                          <p>{lead.email}</p>
                          {lead.phone && <p>{lead.phone}</p>}
                          <p className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(lead.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadConversationMessages(lead.conversation_id)}
                        disabled={messagesLoading}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Conversa
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mensagens da Conversa</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedConversation(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {conversationMessages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Nenhuma mensagem encontrada</p>
                    ) : (
                      conversationMessages.map((message) => (
                        <div key={message.id} className={`p-3 rounded-lg ${
                          message.role === 'user' ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'
                        }`}>
                          <div className="text-xs text-gray-500 mb-1">
                            {message.role === 'user' ? 'Usuário' : 'Assistente'} - {
                              formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })
                            }
                          </div>
                          <div className="text-sm">{message.content}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  Selecione uma conversa para ver as mensagens
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatDashboard;
