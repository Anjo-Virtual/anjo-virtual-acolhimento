
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold mb-8 text-center text-gray-900">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Informações que Coletamos</h2>
            <p className="mb-6">
              Coletamos informações que você fornece diretamente, como nome, email e conteúdo 
              que você publica em nossa plataforma.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Como Usamos suas Informações</h2>
            <p className="mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Comunicar com você sobre sua conta</li>
              <li>Enviar atualizações e informações relevantes</li>
              <li>Garantir a segurança da plataforma</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Compartilhamento de Informações</h2>
            <p className="mb-6">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto quando necessário para operação do serviço ou quando exigido por lei.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Segurança</h2>
            <p className="mb-6">
              Implementamos medidas de segurança para proteger suas informações pessoais contra 
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Seus Direitos</h2>
            <p className="mb-6">
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. 
              Para exercer esses direitos, entre em contato conosco.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Alterações nesta Política</h2>
            <p className="mb-6">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
              significativas através do site ou email.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Contato</h2>
            <p className="mb-6">
              Para questões sobre esta política, entre em contato através dos canais disponíveis no site.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidade;
