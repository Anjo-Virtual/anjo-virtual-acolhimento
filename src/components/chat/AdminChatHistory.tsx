
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChatFilters } from "./ChatFilters";
import { ConversationPreview } from "./ConversationPreview";
import { useChatHistory } from "@/hooks/useChatHistory";

interface AdminChatHistoryProps {
  onSelectConversation: (conversationId: string) => void;
}

export const AdminChatHistory = ({ onSelectConversation }: AdminChatHistoryProps) => {
  const {
    conversations,
    loading,
    totalCount,
    currentPage,
    pageSize,
    isAdminUser,
    searchConversations,
    updateFilters,
    clearFilters,
    setCurrentPage
  } = useChatHistory();

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {!!isAdminUser ? 'Todas as Conversas' : 'Suas Conversas'} 
              ({totalCount})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <ChatFilters
            onSearch={searchConversations}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
            isAdmin={!!isAdminUser}
            loading={loading}
          />

          {/* Lista de conversas */}
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>Nenhuma conversa encontrada.</p>
                {!!isAdminUser ? (
                  <p className="text-sm mt-2">Aguarde usuários iniciarem conversas no chat.</p>
                ) : (
                  <p className="text-sm mt-2">Inicie uma nova conversa para começar!</p>
                )}
              </div>
            ) : (
              conversations.map((conversation) => (
                <ConversationPreview
                  key={conversation.id}
                  conversation={conversation}
                  onSelect={onSelectConversation}
                  isAdmin={!!isAdminUser}
                  loading={loading}
                />
              ))
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages} 
                ({totalCount} conversas)
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
