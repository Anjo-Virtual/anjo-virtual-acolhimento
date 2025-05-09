
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const whatsAppConfigSchema = z.object({
  destinationNumber: z.string().min(10, "Número de WhatsApp inválido"),
});

type FormData = z.infer<typeof whatsAppConfigSchema>;

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Definindo interface para os dados provenientes do Supabase
interface SiteSettings {
  id: string;
  key: string;
  value: {
    destination_number?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
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
      setLoading(true);
      try {
        // Usando any para bypass da tipagem e especificando formato da resposta
        const { data, error } = await supabase
          .from('site_settings' as any)
          .select()
          .eq("key", "whatsapp_config")
          .single() as { data: SiteSettings | null, error: any };

        if (error) throw error;
        
        if (data && data.value) {
          form.setValue("destinationNumber", data.value.destination_number || "");
        }
      } catch (error) {
        console.error("Erro ao buscar configuração:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Usando tipagem genérica para o update
      const { error } = await supabase
        .from('site_settings' as any)
        .update({
          value: { destination_number: data.destinationNumber },
          updated_at: new Date().toISOString(),
        } as any)
        .eq("key", "whatsapp_config");

      if (error) throw error;
      
      toast({
        title: "Configuração salva",
        description: "A configuração do WhatsApp foi atualizada com sucesso.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração.",
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
                  <FormLabel>Número para redirecionamento (com DDD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="11999999999"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
