
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, MessageSquare, Filter } from "lucide-react";
import { ChatMetricsCards } from "@/components/admin/chat/ChatMetricsCards";
import { ConversationsList } from "@/components/admin/chat/ConversationsList";
import { ConsolidatedLeadsList } from "@/components/admin/chat/ConsolidatedLeadsList";
import { MessagesViewer } from "@/components/admin/chat/MessagesViewer";
import { ChatFilters } from "@/components/admin/chat/ChatFilters";
import { useChatDashboardData } from "@/hooks/admin/useChatDashboardData";

const ChatDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const {
    conversations,
    consolidatedLeads,
    metrics,
    filters,
    setFilters,
    loading,
    conversationMessages,
    messagesLoading,
    recoveryLoading,
    loadDashboardData,
    loadConversationMessages,
    recoverLostLeads
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
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={showFilters ? "bg-blue-50 border-blue-200" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button 
            onClick={recoverLostLeads} 
            variant="secondary" 
            disabled={recoveryLoading || loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${recoveryLoading ? 'animate-spin' : ''}`} />
            {recoveryLoading ? 'Recuperando...' : 'Recuperar Leads'}
          </Button>
          <Button onClick={loadDashboardData} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
        </div>
      </div>

      <ChatMetricsCards metrics={metrics} />

      {/* Filtros */}
      {showFilters && (
        <ChatFilters 
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={consolidatedLeads.length + conversations.length}
        />
      )}

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leads ({consolidatedLeads.length})
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversas ({conversations.length})
          </TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <ConsolidatedLeadsList 
            leads={consolidatedLeads}
            onViewConversation={handleViewConversation}
            messagesLoading={messagesLoading}
          />
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <ConversationsList 
            conversations={conversations}
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
