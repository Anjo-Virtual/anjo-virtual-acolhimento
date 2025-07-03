
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminChatHistory } from "../../chat/AdminChatHistory";
import { MessagesViewer } from "./MessagesViewer";
import { ConsolidatedLeadsList } from "./ConsolidatedLeadsList";
import { useChatDashboardData } from "@/hooks/admin/useChatDashboardData";
import { ArrowLeft, MessageSquare, Users, BarChart3 } from "lucide-react";

export const AdminChatManager = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'conversations' | 'leads' | 'messages'>('conversations');
  
  const {
    consolidatedLeads,
    conversationMessages,
    messagesLoading,
    loadConversationMessages,
    metrics
  } = useChatDashboardData();

  const handleSelectConversation = async (conversationId: string) => {
    await loadConversationMessages(conversationId);
    setSelectedConversation(conversationId);
    setActiveView('messages');
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setActiveView('conversations');
  };

  return (
    <div className="space-y-6">
      {/* Header com métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total de Conversas</p>
                <p className="text-2xl font-bold">{metrics?.totalConversations || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Leads Capturados</p>
                <p className="text-2xl font-bold">{metrics?.leadsGenerated || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Conversas Ativas</p>
                <p className="text-2xl font-bold">{metrics?.activeConversations || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Chat</h2>
        {selectedConversation && (
          <Button onClick={handleBackToList} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Lista
          </Button>
        )}
      </div>

      {!selectedConversation ? (
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
          <TabsList>
            <TabsTrigger value="conversations">Todas as Conversas</TabsTrigger>
            <TabsTrigger value="leads">Leads Capturados</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            <AdminChatHistory onSelectConversation={handleSelectConversation} />
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <ConsolidatedLeadsList 
              leads={consolidatedLeads}
              onViewConversation={handleSelectConversation}
              messagesLoading={messagesLoading}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <MessagesViewer 
          selectedConversation={selectedConversation}
          conversationMessages={conversationMessages}
          messagesLoading={messagesLoading}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};
