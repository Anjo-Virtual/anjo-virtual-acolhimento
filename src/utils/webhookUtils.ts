
import { toast } from "@/components/ui/use-toast";

export interface N8nWebhookConfig {
  webhook_url: string;
  active: boolean;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export const sendLeadToN8n = async (data: LeadData, webhookConfig: N8nWebhookConfig | null): Promise<boolean> => {
  if (!webhookConfig || !webhookConfig.webhook_url || !webhookConfig.active) {
    console.log("Webhook n8n não configurado ou inativo, prosseguindo sem enviar");
    return true;
  }
  
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/webhook-n8n`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookUrl: webhookConfig.webhook_url,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: 'chat'
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao enviar dados para o webhook');
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar lead para o n8n:", error);
    toast({
      title: "Erro",
      description: "Não foi possível processar seu contato. Por favor, tente novamente.",
      variant: "destructive",
    });
    return false;
  }
};
