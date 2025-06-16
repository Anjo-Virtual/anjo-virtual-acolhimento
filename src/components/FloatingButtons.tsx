
import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import WhatsAppModal from "./modals/WhatsAppModal";
import ChatModal from "./modals/ChatModal";
import ContactModal from "./modals/ContactModal";

const FloatingButtons = () => {
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* WhatsApp Button */}
        <button
          onClick={() => setWhatsAppModalOpen(true)}
          className="whatsapp-button bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Contato via WhatsApp"
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

      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
      />
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
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return {
    // WhatsApp Modal
    whatsAppModalOpen,
    openWhatsAppModal: () => setWhatsAppModalOpen(true),
    closeWhatsAppModal: () => setWhatsAppModalOpen(false),
    
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
