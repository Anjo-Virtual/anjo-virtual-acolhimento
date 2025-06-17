
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { sanitizeInput, validateEmail, checkRateLimit, secureLog } from "@/utils/security";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push("Nome é obrigatório");
    } else if (formData.name.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    if (!formData.email.trim()) {
      errors.push("Email é obrigatório");
    } else if (!validateEmail(formData.email)) {
      errors.push("Email inválido");
    }
    
    if (!formData.message.trim()) {
      errors.push("Mensagem é obrigatória");
    } else if (formData.message.trim().length < 10) {
      errors.push("Mensagem deve ter pelo menos 10 caracteres");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting
    const clientId = 'contact-form-' + (formData.email || 'anonymous');
    if (!checkRateLimit(clientId, 3, 300000)) { // 3 submissions per 5 minutes
      toast({
        title: "Muitas tentativas",
        description: "Aguarde alguns minutos antes de enviar outra mensagem.",
        variant: "destructive",
      });
      return;
    }
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Erro de validação",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize all input data
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email.toLowerCase()),
        phone: sanitizeInput(formData.phone),
        message: sanitizeInput(formData.message)
      };
      
      const { error } = await supabase
        .from('contact_messages')
        .insert(sanitizedData);
      
      if (error) throw error;
      
      secureLog('info', 'Mensagem de contato enviada com sucesso');
      
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contato. Retornaremos em breve.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
    } catch (error: any) {
      secureLog('error', 'Erro ao enviar mensagem de contato:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Basic input sanitization on change
    let sanitizedValue = value;
    
    if (field === 'email') {
      sanitizedValue = value.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
    } else if (field === 'phone') {
      sanitizedValue = value.replace(/[^0-9\s\-\(\)\+]/g, '');
    } else {
      sanitizedValue = value.replace(/[<>]/g, ''); // Basic XSS prevention
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Entre em Contato
            </h2>
            <p className="text-lg text-gray-600">
              Estamos aqui para ajudar. Envie sua mensagem e retornaremos em breve.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    maxLength={254}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  maxLength={20}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  required
                  maxLength={1000}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                  placeholder="Como podemos ajudar você?"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
