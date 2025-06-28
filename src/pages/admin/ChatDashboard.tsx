
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ChatMetricsCards } from "@/components/admin/chat/ChatMetricsCards";
import { ConversationsList } from "@/components/admin/chat/ConversationsList";
import { LeadsList } from "@/components/admin/chat/LeadsList";
import { MessagesViewer } from "@/components/admin/chat/MessagesViewer";
import { useChatDashboardData } from "@/hooks/admin/useChatDashboardData";

const ChatDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const {
    conversations,
    leads,
    metrics,
    loading,
    conversationMessages,
    messagesLoading,
    loadDashboardData,
    loadConversationMessages
  } = useChatDashboardData();

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleViewConversation = async (conversationId: string) => {
    await loadConversationMessages(conversationId);
    setSelectedConversation(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
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

      <ChatMetricsCards metrics={metrics} />

      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <ConversationsList 
            conversations={conversations}
            onViewConversation={handleViewConversation}
            messagesLoading={messagesLoading}
          />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <LeadsList 
            leads={leads}
            onViewConversation={handleViewConversation}
            messagesLoading={messagesLoading}
          />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <MessagesViewer 
            selectedConversation={selectedConversation}
            conversationMessages={conversationMessages}
            messagesLoading={messagesLoading}
            onBack={handleBackToList}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatDashboard;
