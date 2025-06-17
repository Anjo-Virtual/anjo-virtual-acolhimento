
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveSettingsToDatabase } from "@/utils/settingsUtils";
import { WhatsAppConfig, isWhatsAppConfig } from "@/types/whatsapp";
import { validateWhatsAppNumber, sanitizeInput, secureLog } from "@/utils/security";

const whatsAppConfigSchema = z.object({
  destinationNumber: z.string()
    .min(10, "Número de WhatsApp deve ter pelo menos 10 dígitos")
    .max(15, "Número de WhatsApp deve ter no máximo 15 dígitos")
    .regex(/^\d+$/, "Apenas números são permitidos")
    .refine(validateWhatsAppNumber, "Formato de número WhatsApp inválido"),
});

type FormData = z.infer<typeof whatsAppConfigSchema>;

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppConfigModal = ({ isOpen, onClose }: WhatsAppConfigModalProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(whatsAppConfigSchema),
    defaultValues: {
      destinationNumber: "",
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'whatsapp_config')
          .single();

        if (error && error.code !== 'PGRST116') {
          secureLog('error', 'Erro ao buscar configuração WhatsApp:', error);
          throw error;
        }

        if (data?.value && isWhatsAppConfig(data.value)) {
          const sanitizedNumber = sanitizeInput(data.value.destination_number);
          if (validateWhatsAppNumber(sanitizedNumber)) {
            form.setValue("destinationNumber", sanitizedNumber);
          } else {
            secureLog('warn', 'Número WhatsApp armazenado está em formato inválido');
          }
        }
      } catch (error) {
        secureLog('error', 'Erro ao buscar configuração WhatsApp:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações do WhatsApp.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [isOpen, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Sanitize and validate input
      const sanitizedNumber = sanitizeInput(data.destinationNumber);
      
      if (!validateWhatsAppNumber(sanitizedNumber)) {
        throw new Error("Número WhatsApp inválido");
      }

      const configData: WhatsAppConfig = {
        destination_number: sanitizedNumber
      };
      
      await saveSettingsToDatabase('whatsapp_config', configData);
      
      secureLog('info', 'Configuração WhatsApp salva com sucesso');
      
      toast({
        title: "Configuração salva",
        description: "O número do WhatsApp foi configurado com sucesso.",
      });
      
      onClose();
    } catch (error: any) {
      secureLog('error', 'Erro ao salvar configuração WhatsApp:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a configuração.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-8 max-w-md w-full mx-auto my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Fechar modal"
        >
          <i className="ri-close-line ri-lg"></i>
        </button>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Configurar WhatsApp</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="destinationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número para redirecionamento (com código do país)</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="5511999999999"
                      maxLength={15}
                      {...field}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-sm text-gray-500 mt-1">
                    Exemplo: 5511999999999 (55 = Brasil, 11 = São Paulo, 999999999 = número)
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar configuração"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default WhatsAppConfigModal;
