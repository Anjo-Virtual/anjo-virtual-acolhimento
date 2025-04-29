import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { chatFormSchema } from "@/lib/validations/form-schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ChatBox } from "../chat/ChatBox";
import { supabase } from "@/integrations/supabase/client";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface N8nWebhookConfig {
  webhook_url: string;
  active: boolean;
}

interface PerplexitySettings {
  api_key: string;
}

type FormData = z.infer<typeof chatFormSchema>;

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [n8nConfig, setN8nConfig] = useState<N8nWebhookConfig | null>(null);
  const [leadData, setLeadData] = useState<FormData | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchN8nWebhookConfig();
      // Also fetch the perplexity key from site settings
      fetchPerplexityKey();
    }
  }, [isOpen]);

  const fetchN8nWebhookConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select()
        .eq('key', 'n8n_webhook_config')
        .single();

      if (error) {
        console.error("Erro ao buscar configuração do webhook:", error);
        return;
      }
      
      if (data && data.value) {
        // Type assertion to handle the conversion properly
        const configData = data.value as unknown as N8nWebhookConfig;
        setN8nConfig(configData);
      }
    } catch (error) {
      console.error("Erro ao buscar configuração do webhook:", error);
    }
  };

  const fetchPerplexityKey = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select()
        .eq('key', 'perplexity_api_key')
        .single();

      if (error) {
        // If not found, it's not a critical error
        if (error.code !== 'PGRST116') {  // Record not found
          console.error("Erro ao buscar API key:", error);
        }
        return;
      }
      
      if (data && data.value) {
        // Type assertion to ensure TypeScript recognizes the api_key property
        const settings = data.value as PerplexitySettings;
        if (settings.api_key) {
          // Store the API key in localStorage for ChatBox component to use
          localStorage.setItem('perplexityKey', settings.api_key);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar configuração da API:", error);
    }
  };

  const sendLeadToN8n = async (data: FormData) => {
    if (!n8nConfig || !n8nConfig.webhook_url || !n8nConfig.active) {
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
          webhookUrl: n8nConfig.webhook_url,
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

  const onSubmit = async (data: FormData) => {
    // Check if we have the Perplexity key in localStorage or fetch it again
    const perplexityKey = localStorage.getItem('perplexityKey');
    if (!perplexityKey) {
      await fetchPerplexityKey();
      const updatedKey = localStorage.getItem('perplexityKey');
      if (!updatedKey) {
        toast({
          title: "Erro",
          description: "O serviço de chat não está configurado corretamente. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Enviar dados para o webhook do n8n
      const webhookSuccess = await sendLeadToN8n(data);
      
      if (webhookSuccess) {
        setLeadData(data); // Armazenar dados do lead para usar no chat
        setChatStarted(true);
      }
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao iniciar o chat. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-8 max-w-md w-full mx-auto my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <i className="ri-close-line ri-lg"></i>
        </button>

        {!chatStarted ? (
          <>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Iniciar Conversa</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Iniciar Chat"
                  )}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <ChatBox onClose={onClose} leadData={leadData} />
        )}
      </div>
    </div>
  );
};

export default ChatModal;
