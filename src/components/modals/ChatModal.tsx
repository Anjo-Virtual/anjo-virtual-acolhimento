
import { FormEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Chat iniciado com:", formData);
    
    toast({
      title: "Chat iniciado!",
      description: "Em breve um de nossos anjos entrará em contato.",
    });
    
    onClose();
    
    // Resetar formulário
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
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
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Iniciar Conversa</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input 
                type="text" 
                id="name" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary" 
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                id="email" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary" 
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input 
                type="tel" 
                id="phone" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary" 
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors"
          >
            Iniciar Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
