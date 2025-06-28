
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminChatHistory } from "../../chat/AdminChatHistory";
import { MessagesViewer } from "./MessagesViewer";
import { LeadsList } from "./LeadsList";
import { useChatDashboardData } from "@/hooks/admin/useChatDashboardData";
import { ArrowLeft } from "lucide-react";

export const AdminChatManager = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'conversations' | 'leads' | 'messages'>('conversations');
  
  const {
    leads,
    conversationMessages,
    messagesLoading,
    loadConversationMessages
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
            <LeadsList 
              leads={leads}
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
