
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
      {/* Header reorganizado */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard do Chat</h1>
          <p className="text-muted-foreground">Gerencie leads e conversas em tempo real</p>
        </div>
        
        {/* Ações consolidadas */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={recoverLostLeads} 
            variant="secondary" 
            disabled={recoveryLoading || loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${recoveryLoading ? 'animate-spin' : ''}`} />
            {recoveryLoading ? 'Recuperando...' : 'Recuperar Leads'}
          </Button>
          <Button 
            onClick={loadDashboardData} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas aprimoradas */}
      <ChatMetricsCards metrics={metrics} />

      {/* Seção de Filtros - movida para baixo das métricas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Filtros e Visualizações</h2>
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className={showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
        </div>
        
        {showFilters && (
          <ChatFilters 
            filters={filters}
            onFiltersChange={setFilters}
            totalResults={consolidatedLeads.length + conversations.length}
          />
        )}
      </div>

      {/* Tabs aprimoradas */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="leads" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Leads</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {consolidatedLeads.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Conversas</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Mensagens</span>
          </TabsTrigger>
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
