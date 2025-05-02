
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { chatFormSchema } from "@/lib/validations/form-schemas";
import { ChatBox } from "../chat/ChatBox";
import { supabase } from "@/integrations/supabase/client";
import { ChatForm } from "../chat/ChatForm";
import { 
  N8nWebhookConfig, 
  LeadData,
  sendLeadToN8n 
} from "@/utils/webhookUtils";
import { fetchPerplexityKey } from "@/utils/perplexityUtils";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = z.infer<typeof chatFormSchema>;

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [n8nConfig, setN8nConfig] = useState<N8nWebhookConfig | null>(null);
  const [leadData, setLeadData] = useState<FormData | null>(null);
  
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

  const onSubmit = async (data: FormData) => {
    // Check if we have the Perplexity key in localStorage or fetch it again
    const perplexityKey = localStorage.getItem('perplexityKey');
    if (!perplexityKey) {
      const apiKey = await fetchPerplexityKey();
      if (!apiKey) {
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
      // Ensure data has all required fields for LeadData type
      const leadData: LeadData = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || ""
      };
      
      // Enviar dados para o webhook do n8n
      const webhookSuccess = await sendLeadToN8n(leadData, n8nConfig);
      
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
        className="bg-white rounded-lg p-8 max-w-md w-full mx-auto my-auto relative shadow-soft animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i className="ri-close-line ri-lg"></i>
        </button>

        {!chatStarted ? (
          <ChatForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        ) : (
          <ChatBox onClose={onClose} leadData={leadData} />
        )}
      </div>
    </div>
  );
};

export default ChatModal;
