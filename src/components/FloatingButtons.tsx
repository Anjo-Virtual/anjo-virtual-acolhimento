
import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import ChatModal from "./modals/ChatModal";
import ContactModal from "./modals/ContactModal";
import { supabase } from "@/integrations/supabase/client";

const FloatingButtons = () => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsAppClick = async () => {
    setLoading(true);
    try {
      // Buscar número configurado no admin
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'whatsapp_config')
        .single();

      let destinationNumber = "5511999999999"; // Número padrão
      
      if (!error && data?.value?.destination_number) {
        destinationNumber = data.value.destination_number;
      }

      // Mensagem pré-definida
      const message = encodeURIComponent("Olá! Gostaria de conhecer mais sobre o Anjo Virtual.");
      const whatsappLink = `https://wa.me/${destinationNumber}?text=${message}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappLink, "_blank");
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      // Fallback para número padrão
      const message = encodeURIComponent("Olá! Gostaria de conhecer mais sobre o Anjo Virtual.");
      const fallbackLink = `https://wa.me/5511999999999?text=${message}`;
      window.open(fallbackLink, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          disabled={loading}
          className="whatsapp-button bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed"
          aria-label="Contato via WhatsApp"
          title={loading ? "Conectando..." : "Falar no WhatsApp"}
        >
          <Phone size={24} />
        </button>

        {/* Chat Button */}
        <button
          onClick={() => setChatModalOpen(true)}
          className="chat-button bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Iniciar chat"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
      />
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
};

// Hook para controlar os modais de qualquer lugar da aplicação
export const useModalControls = () => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return {
    // Chat Modal
    chatModalOpen,
    openChatModal: () => setChatModalOpen(true),
    closeChatModal: () => setChatModalOpen(false),
    
    // Contact Modal
    contactModalOpen,
    openContactModal: () => setContactModalOpen(true),
    closeContactModal: () => setContactModalOpen(false),
  };
};

export default FloatingButtons;
