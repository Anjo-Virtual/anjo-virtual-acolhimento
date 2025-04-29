
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatAdmin } from "@/components/chat/ChatAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Share2 } from "lucide-react";
import N8nWebhookConfigModal from "@/components/modals/N8nWebhookConfigModal";
import WhatsAppConfigModal from "@/components/modals/WhatsAppConfigModal";

interface Integration {
  id: string;
  name: string;
  type: string;
  config: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const Integrations = () => {
  const [isWhatsAppConfigModalOpen, setIsWhatsAppConfigModalOpen] = useState(false);
  const [isN8nWebhookConfigModalOpen, setIsN8nWebhookConfigModalOpen] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error("Erro ao buscar integrações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as integrações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegrationStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: `Integração ${currentStatus ? 'desativada' : 'ativada'} com sucesso`,
      });
      
      fetchIntegrations();
    } catch (error) {
      console.error("Erro ao alterar status da integração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da integração",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as integrações do sistema com serviços externos
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* WhatsApp Integration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <span className="mr-2 text-xl text-[#25D366]">
                <i className="ri-whatsapp-line"></i>
              </span>
              WhatsApp
            </CardTitle>
            <CardDescription>
              Configure a integração com WhatsApp para comunicação com clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vincule sua conta do WhatsApp Business para enviar mensagens automatizadas 
              e facilitar a comunicação com seus contatos.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#25D366] hover:bg-opacity-90"
              onClick={() => setIsWhatsAppConfigModalOpen(true)}
            >
              <i className="ri-whatsapp-line mr-2"></i>
              Configurar WhatsApp
            </Button>
          </CardFooter>
        </Card>

        {/* N8N Webhook Integration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <span className="mr-2 text-xl text-blue-600">
                <Share2 className="w-5 h-5" />
              </span>
              N8N Webhook
            </CardTitle>
            <CardDescription>
              Configure webhooks para automações com n8n
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Conecte com o n8n para automação de processos, fluxos de trabalho
              e integração com outras plataformas.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-opacity-90"
              onClick={() => setIsN8nWebhookConfigModalOpen(true)}
            >
              <Share2 className="mr-2 w-4 h-4" />
              Configurar N8N Webhook
            </Button>
          </CardFooter>
        </Card>

        {/* Chat Integration */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Configurar Chat AI
            </CardTitle>
            <CardDescription>
              Gerencie integrações para o chat com inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatAdmin />
          </CardContent>
        </Card>
      </div>

      {/* Integration Modals */}
      {isWhatsAppConfigModalOpen && (
        <WhatsAppConfigModal 
          isOpen={isWhatsAppConfigModalOpen}
          onClose={() => setIsWhatsAppConfigModalOpen(false)}
        />
      )}

      {isN8nWebhookConfigModalOpen && (
        <N8nWebhookConfigModal 
          isOpen={isN8nWebhookConfigModalOpen}
          onClose={() => setIsN8nWebhookConfigModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Integrations;
