
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold mb-8 text-center">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Informações que Coletamos</h2>
            <p>
              Coletamos informações que você fornece diretamente, como nome, email e conteúdo 
              que você publica em nossa plataforma.
            </p>

            <h2>2. Como Usamos suas Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Comunicar com você sobre sua conta</li>
              <li>Enviar atualizações e informações relevantes</li>
              <li>Garantir a segurança da plataforma</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto quando necessário para operação do serviço ou quando exigido por lei.
            </p>

            <h2>4. Segurança</h2>
            <p>
              Implementamos medidas de segurança para proteger suas informações pessoais contra 
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2>5. Seus Direitos</h2>
            <p>
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. 
              Para exercer esses direitos, entre em contato conosco.
            </p>

            <h2>6. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
              significativas através do site ou email.
            </p>

            <h2>7. Contato</h2>
            <p>
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
