
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppConfig {
  destination_number: string;
}

// Este componente não é mais usado diretamente, mas mantido para compatibilidade
// O redirecionamento agora é feito diretamente no FloatingButtons
const WhatsAppModal = () => {
  return null;
};

// Função utilitária para abrir WhatsApp (pode ser usada em outros lugares)
export const openWhatsApp = async (customMessage?: string) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'whatsapp_config')
      .single();

    let destinationNumber = "5511999999999";
    
    if (!error && data?.value?.destination_number) {
      destinationNumber = data.value.destination_number;
    }

    const message = encodeURIComponent(
      customMessage || "Olá! Gostaria de conhecer mais sobre o Anjo Virtual."
    );
    const whatsappLink = `https://wa.me/${destinationNumber}?text=${message}`;
    
    window.open(whatsappLink, "_blank");
  } catch (error) {
    console.error("Erro ao abrir WhatsApp:", error);
    const fallbackMessage = encodeURIComponent(
      customMessage || "Olá! Gostaria de conhecer mais sobre o Anjo Virtual."
    );
    const fallbackLink = `https://wa.me/5511999999999?text=${fallbackMessage}`;
    window.open(fallbackLink, "_blank");
  }
};

export default WhatsAppModal;
