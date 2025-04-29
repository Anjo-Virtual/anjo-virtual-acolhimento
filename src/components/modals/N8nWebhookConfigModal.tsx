
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface N8nWebhookConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const n8nWebhookConfigSchema = z.object({
  webhook_url: z.string().url("URL inválida"),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof n8nWebhookConfigSchema>;

const N8nWebhookConfigModal = ({ isOpen, onClose }: N8nWebhookConfigModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(n8nWebhookConfigSchema),
    defaultValues: {
      webhook_url: "",
      active: true,
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Buscar configuração atual do webhook n8n
        const { data, error } = await supabase
          .from('site_settings')
          .select()
          .eq('key', 'n8n_webhook_config')
          .single();

        if (error) {
          console.error("Erro ao buscar configuração:", error);
          return;
        }
        
        if (data && data.value) {
          // Add proper type assertion here
          const configData = data.value as unknown as FormData;
          // Atualizar formulário com valores existentes
          form.reset(configData);
        }
      } catch (error) {
        console.error("Erro ao buscar configuração:", error);
      }
    };

    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      // Atualizar configuração do webhook n8n
      const { error } = await supabase
        .from('site_settings')
        .update({ value: data })
        .eq('key', 'n8n_webhook_config');

      if (error) throw error;
      
      toast({
        title: "Configuração salva",
        description: "A configuração do webhook N8N foi salva com sucesso.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testWebhook = async () => {
    const values = form.getValues();
    
    if (!values.webhook_url) {
      toast({
        title: "Erro",
        description: "Insira uma URL de webhook válida para testar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      const response = await fetch(`${window.location.origin}/functions/v1/webhook-n8n`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: values.webhook_url,
          data: {
            name: "Teste de Integração",
            email: "teste@exemplo.com",
            phone: "(00) 00000-0000",
            source: "admin_test"
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha no teste do webhook');
      }
      
      toast({
        title: "Teste realizado",
        description: "O webhook foi testado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro",
        description: "Falha ao testar o webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Configurar Webhook N8N</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="webhook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Webhook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://n8n.seu-dominio.com/webhook/xxx" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL do webhook do n8n que receberá os dados de contato.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Ativar Webhook</FormLabel>
                    <FormDescription>
                      Quando ativado, os dados de contato serão enviados para o webhook.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 justify-end mt-6">
              <Button 
                type="button"
                variant="outline"
                onClick={testWebhook}
                disabled={isSaving}
              >
                Testar Webhook
              </Button>
              <Button 
                type="submit"
                disabled={isSaving}
              >
                Salvar Configurações
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default N8nWebhookConfigModal;
