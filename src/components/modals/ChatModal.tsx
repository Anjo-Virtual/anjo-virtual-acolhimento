
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { chatFormSchema } from "@/lib/validations/form-schemas";
import ChatBox from "../chat/ChatBox";
import { supabase } from "@/integrations/supabase/client";
import { ChatForm } from "../chat/ChatForm";
import { 
  N8nWebhookConfig, 
  LeadData,
  sendLeadToN8n 
} from "@/utils/webhookUtils";
import { fetchPerplexityKey } from "@/utils/perplexityUtils";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = z.infer<typeof chatFormSchema>;

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const { user } = useCommunityAuth();
  const [chatStarted, setChatStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [n8nConfig, setN8nConfig] = useState<N8nWebhookConfig | null>(null);
  const [leadData, setLeadData] = useState<FormData | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      fetchN8nWebhookConfig();
      fetchPerplexityKey();
      
      // Se usuário estiver logado, inicia chat diretamente
      if (user) {
        // Criar lead data a partir dos dados do usuário
        const userLeadData: FormData = {
          name: user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          phone: ''
        };
        setLeadData(userLeadData);
        setChatStarted(true);
      }
    }
  }, [isOpen, user]);

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
        const configData = data.value as unknown as N8nWebhookConfig;
        setN8nConfig(configData);
      }
    } catch (error) {
      console.error("Erro ao buscar configuração do webhook:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
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
      const leadData: LeadData = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || ""
      };
      
      // Enviar dados para o webhook do n8n
      const webhookSuccess = await sendLeadToN8n(leadData, n8nConfig);
      
      if (webhookSuccess) {
        setLeadData(data);
        setChatStarted(true);
        
        toast({
          title: "Chat iniciado",
          description: "Seus dados foram registrados e o chat foi iniciado com sucesso!",
        });
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
        className={`bg-white rounded-lg shadow-soft animate-scaleIn mx-4 my-4 sm:mx-auto sm:my-8 relative
          ${chatStarted 
            ? 'w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-h-[800px]' 
            : 'w-full max-w-md p-8'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <i className="ri-close-line ri-lg"></i>
        </button>

        {!chatStarted ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Iniciar Conversa</h2>
              <p className="text-gray-600">Preencha seus dados para começar a conversar com nosso assistente</p>
            </div>
            <ChatForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </div>
        ) : (
          <div className="h-full p-4">
            <ChatBox onClose={onClose} leadData={leadData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
