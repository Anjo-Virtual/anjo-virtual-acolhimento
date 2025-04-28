
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import WhatsAppConfigModal from "@/components/modals/WhatsAppConfigModal";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  processed: boolean;
}

interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
  active: boolean;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [isWhatsAppConfigModalOpen, setIsWhatsAppConfigModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContactMessages();
      fetchSubscribers();
    }
  }, [isAuthenticated]);

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContactMessages(data || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Erro ao buscar assinantes:", error);
    }
  };

  const markAsProcessed = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ processed: true })
        .eq("id", id);

      if (error) throw error;
      fetchContactMessages();
    } catch (error) {
      console.error("Erro ao marcar como processado:", error);
    }
  };

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchSubscribers();
    } catch (error) {
      console.error("Erro ao alterar status do assinante:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h1 className="text-3xl font-bold mb-6">Acesso Restrito</h1>
        <p className="text-gray-600 mb-4">Você precisa estar autenticado para acessar esta página.</p>
        <Button onClick={() => window.location.href = "/"} className="bg-primary text-white">
          Voltar para a página inicial
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="space-x-4">
            <Button 
              onClick={() => setIsWhatsAppConfigModalOpen(true)}
              className="bg-[#25D366] text-white hover:bg-opacity-90"
            >
              <i className="ri-whatsapp-line mr-2"></i>
              Configurar WhatsApp
            </Button>
            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline"
            >
              Voltar ao site
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Mensagens de Contato</h2>
              
              {contactMessages.length === 0 ? (
                <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {contactMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`border-l-4 ${message.processed ? 'border-gray-300' : 'border-primary'} bg-gray-50 p-4 rounded`}
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
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Assinantes da Newsletter</h2>
              
              {subscribers.length === 0 ? (
                <p className="text-gray-500">Nenhum assinante encontrado.</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {subscribers.map((subscriber) => (
                    <div 
                      key={subscriber.id} 
                      className="flex justify-between items-center p-3 border-b last:border-0"
                    >
                      <div>
                        <p className={`font-medium ${subscriber.active ? '' : 'text-gray-400'}`}>
                          {subscriber.email}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(subscriber.created_at)}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant={subscriber.active ? "default" : "outline"}
                        className={subscriber.active ? "bg-green-600" : ""}
                        onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.active)}
                      >
                        {subscriber.active ? 'Ativo' : 'Inativo'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isWhatsAppConfigModalOpen && (
        <WhatsAppConfigModal 
          isOpen={isWhatsAppConfigModalOpen}
          onClose={() => setIsWhatsAppConfigModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
