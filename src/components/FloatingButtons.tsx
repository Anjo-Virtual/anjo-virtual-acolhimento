
import { useState } from 'react';
import ChatModal from './modals/ChatModal';
import WhatsAppModal from './modals/WhatsAppModal';

const FloatingButtons = () => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

  const openChatModal = () => {
    setChatModalOpen(true);
  };

  const closeChatModal = () => {
    setChatModalOpen(false);
  };

  const openWhatsAppModal = () => {
    setWhatsappModalOpen(true);
  };

  const closeWhatsAppModal = () => {
    setWhatsappModalOpen(false);
  };

  return (
    <>
      <div className="floating-buttons">
        <button onClick={openChatModal} className="bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
          <i className="ri-message-3-line ri-lg"></i>
        </button>
        <button onClick={openWhatsAppModal} className="bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
          <i className="ri-whatsapp-line ri-lg"></i>
        </button>
      </div>

      <ChatModal isOpen={chatModalOpen} onClose={closeChatModal} />
      <WhatsAppModal isOpen={whatsappModalOpen} onClose={closeWhatsAppModal} />
    </>
  );
};

export default FloatingButtons;
