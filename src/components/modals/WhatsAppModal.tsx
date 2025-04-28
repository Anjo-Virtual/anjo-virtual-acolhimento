
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { whatsAppFormSchema } from "@/lib/validations/form-schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = z.infer<typeof whatsAppFormSchema>;

const WhatsAppModal = ({ isOpen, onClose }: WhatsAppModalProps) => {
  const [destinationNumber, setDestinationNumber] = useState("");
  
  const form = useForm<FormData>({
    resolver: zodResolver(whatsAppFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    const fetchDestinationNumber = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select()
          .eq("key", "whatsapp_config")
          .single();

        if (error) throw error;
        
        if (data && data.value && data.value.destination_number) {
          setDestinationNumber(data.value.destination_number);
        }
      } catch (error) {
        console.error("Erro ao buscar número de destino:", error);
      }
    };

    if (isOpen) {
      fetchDestinationNumber();
    }
  }, [isOpen]);

  const onSubmit = (data: FormData) => {
    const formattedPhone = data.phone.replace(/\D/g, "");
    
    // Se não tiver número de destino configurado, usar o padrão
    const targetNumber = destinationNumber || "5511999999999";
    
    const whatsappLink = `https://wa.me/${targetNumber}?text=Olá! Gostaria de conhecer mais sobre o Anjo Virtual.`;
    
    onClose();
    window.open(whatsappLink, "_blank");
    form.reset();
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
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Conversar pelo WhatsApp</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="mt-6 w-full bg-[#25D366] text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors"
            >
              Abrir WhatsApp
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default WhatsAppModal;
