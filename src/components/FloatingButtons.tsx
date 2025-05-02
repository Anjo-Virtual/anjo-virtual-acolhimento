
import { useState } from 'react';
import ChatModal from './modals/ChatModal';
import WhatsAppModal from './modals/WhatsAppModal';
import { MessageCircle, Sparkles } from 'lucide-react';

const FloatingButtons = () => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      <div 
        className="floating-buttons"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex flex-col gap-3 items-end transition-all duration-300 ${isHovered ? 'mb-3' : ''}`}>
          {isHovered && (
            <div className="flex items-center gap-3 animate-fadeInUp">
              <span className="bg-white text-gray-700 py-1 px-3 rounded-lg shadow-md text-sm">
                Fale com Anjo Virtual
              </span>
              <button 
                onClick={openChatModal} 
                className="bg-primary text-white w-12 h-12 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:-translate-y-1 hover:shadow-soft flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {isHovered && (
            <div className="flex items-center gap-3 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="bg-white text-gray-700 py-1 px-3 rounded-lg shadow-md text-sm">
                Fale pelo WhatsApp
              </span>
              <button 
                onClick={openWhatsAppModal} 
                className="bg-[#25D366] text-white w-12 h-12 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:-translate-y-1 hover:shadow-soft flex items-center justify-center"
              >
                <i className="ri-whatsapp-line ri-lg"></i>
              </button>
            </div>
          )}
        </div>
        
        {!isHovered && (
          <button 
            className="bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:-translate-y-1 hover:shadow-soft flex items-center justify-center relative group"
            onMouseEnter={() => setIsHovered(true)}
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        )}
      </div>

      <ChatModal isOpen={chatModalOpen} onClose={closeChatModal} />
      <WhatsAppModal isOpen={whatsappModalOpen} onClose={closeWhatsAppModal} />
    </>
  );
};

export default FloatingButtons;
