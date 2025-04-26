
import { FormEvent, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

const Business = () => {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    mensagem: '',
    termos: false
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simula envio de formulário
    console.log('Formulário enviado:', formData);
    toast({
      title: "Solicitação enviada",
      description: "Recebemos sua solicitação e entraremos em contato em breve!",
    });
    
    // Limpar formulário
    setFormData({
      nome: '',
      empresa: '',
      email: '',
      telefone: '',
      mensagem: '',
      termos: false
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      termos: e.target.checked
    });
  };

  return (
    <section id="empresas" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Para Empresas</h2>
            <p className="text-gray-600 mb-6">Ofereça suporte emocional para seus colaboradores em momentos de luto e perda. Nossa solução corporativa ajuda a criar um ambiente de trabalho mais acolhedor e humano.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-shield-check-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Bem-estar dos Colaboradores</h3>
                  <p className="text-gray-600 text-sm">Suporte emocional especializado</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-line-chart-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Produtividade</h3>
                  <p className="text-gray-600 text-sm">Redução do impacto do luto no trabalho</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-dashboard-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Dashboard</h3>
                  <p className="text-gray-600 text-sm">Gestão e relatórios de utilização</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-paint-brush-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Personalização</h3>
                  <p className="text-gray-600 text-sm">Adaptado à identidade da sua empresa</p>
                </div>
              </div>
            </div>
            <a href="#" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors inline-block whitespace-nowrap">Solicitar Demonstração</a>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Solicite uma Proposta</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      id="nome"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <input
                      type="text"
                      id="empresa"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary"
                      placeholder="Nome da empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      id="telefone"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea
                    id="mensagem"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary"
                    placeholder="Conte-nos sobre as necessidades da sua empresa"
                    value={formData.mensagem}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="flex items-start mb-6">
                  <input
                    type="checkbox"
                    id="termos"
                    className="custom-checkbox mr-2"
                    checked={formData.termos}
                    onChange={handleCheckbox}
                  />
                  <label htmlFor="termos" className="text-sm text-gray-600">
                    Concordo em receber comunicações do Anjo Virtual e aceito os <a href="#" className="text-primary">Termos de Uso</a> e <a href="#" className="text-primary">Política de Privacidade</a>.
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors whitespace-nowrap"
                  disabled={!formData.termos}
                >
                  Enviar Solicitação
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
