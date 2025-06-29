
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  conversation_id: string;
}

interface LeadsListProps {
  leads: ChatLead[];
  onViewConversation: (conversationId: string) => void;
  messagesLoading: boolean;
}

export const LeadsList = ({ leads, onViewConversation, messagesLoading }: LeadsListProps) => {
  return (
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
                  onClick={() => onViewConversation(lead.conversation_id)}
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
  );
};
