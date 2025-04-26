
import { FormEvent, useState } from "react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppModal = ({ isOpen, onClose }: WhatsAppModalProps) => {
  const [phone, setPhone] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Formatar número e criar link WhatsApp
    const formattedPhone = phone.replace(/\D/g, "");
    const whatsappLink = `https://wa.me/55${formattedPhone}?text=Olá! Gostaria de conhecer mais sobre o Anjo Virtual.`;
    
    // Fechar modal e redirecionar para WhatsApp
    onClose();
    window.open(whatsappLink, "_blank");
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
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="whatsappPhone" className="block text-sm font-medium text-gray-700 mb-1">Seu WhatsApp</label>
            <input 
              type="tel" 
              id="whatsappPhone" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary" 
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="mt-6 w-full bg-[#25D366] text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors"
          >
            Abrir WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppModal;
