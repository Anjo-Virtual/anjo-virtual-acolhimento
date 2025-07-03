
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  conversation_id: string;
  conversations?: {
    id: string;
    title: string;
    user_id: string;
    community_profiles?: {
      display_name: string;
      bio: string | null;
      grief_type: string | null;
      is_anonymous: boolean;
    };
  };
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
                     
                     {/* Informações do perfil conectado */}
                     {lead.conversations?.community_profiles && (
                       <div className="mt-2 p-2 bg-blue-50 rounded">
                         <p className="text-blue-700">
                           <strong>Conectado ao perfil:</strong> {lead.conversations.community_profiles.display_name}
                         </p>
                         {lead.conversations.community_profiles.grief_type && (
                           <p className="text-blue-600 text-xs">
                             Tipo de luto: {lead.conversations.community_profiles.grief_type}
                           </p>
                         )}
                         {lead.conversations.community_profiles.bio && (
                           <p className="text-blue-600 text-xs italic">
                             "{lead.conversations.community_profiles.bio.substring(0, 80)}..."
                           </p>
                         )}
                       </div>
                     )}
                     
                     <p className="flex items-center gap-1 mt-2">
                       <Calendar className="h-3 w-3" />
                       {formatDistanceToNow(new Date(lead.created_at), {
                         addSuffix: true,
                         locale: ptBR
                       })}
                     </p>
                   </div>
                 </div>
                 <Button 
                   variant="default" 
                   size="sm"
                   onClick={() => onViewConversation(lead.conversation_id)}
                   disabled={messagesLoading}
                   className="bg-green-600 hover:bg-green-700 text-white min-w-[120px] transition-all duration-200 hover:scale-105"
                 >
                   <Eye className="h-4 w-4 mr-2" />
                   Ver Conversa
                   <ArrowRight className="h-3 w-3 ml-1" />
                 </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
