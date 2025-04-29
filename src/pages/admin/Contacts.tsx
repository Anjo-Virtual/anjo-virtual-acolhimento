
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  processed: boolean;
}

const Contacts = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const fetchContactMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContactMessages(data || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsProcessed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ processed: true })
        .eq("id", id);

      if (error) throw error;
      fetchContactMessages();
    } catch (error) {
      console.error("Erro ao marcar como processado:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  const filteredMessages = contactMessages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mensagens de Contato</h1>
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Buscar mensagens..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Nenhuma mensagem encontrada.
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map((message) => (
            <div 
              key={message.id} 
              className={`border-l-4 ${message.processed ? 'border-gray-300' : 'border-primary'} bg-white p-4 rounded shadow-sm`}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{message.name}</h3>
                <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <p>Email: {message.email}</p>
                <p>Telefone: {message.phone}</p>
              </div>
              <p className="mt-2 whitespace-pre-line">{message.message}</p>
              
              {!message.processed && (
                <div className="mt-4 text-right">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsProcessed(message.id)}
                  >
                    Marcar como processado
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
