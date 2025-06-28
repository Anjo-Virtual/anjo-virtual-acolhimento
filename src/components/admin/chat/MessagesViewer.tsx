
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface MessagesViewerProps {
  selectedConversation: string | null;
  conversationMessages: Message[];
  messagesLoading: boolean;
  onBack: () => void;
}

export const MessagesViewer = ({ 
  selectedConversation, 
  conversationMessages, 
  messagesLoading, 
  onBack 
}: MessagesViewerProps) => {
  if (!selectedConversation) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            Selecione uma conversa para ver as mensagens
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mensagens da Conversa</CardTitle>
          <Button variant="outline" onClick={onBack}>
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
  );
};
