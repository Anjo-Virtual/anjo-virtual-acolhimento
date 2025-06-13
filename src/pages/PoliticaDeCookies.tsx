
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaDeCookies = () => {
  return (
    <div className="bg-white">
      <Header />
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8">Política de Cookies</h1>
            
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. O que são Cookies</h2>
              <p className="text-gray-600 mb-6">
                Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site. Eles nos ajudam a fornecer uma melhor experiência de navegação.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Tipos de Cookies que Utilizamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookies Essenciais</h3>
              <p className="text-gray-600 mb-4">
                Necessários para o funcionamento básico do site, como autenticação e segurança.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookies de Performance</h3>
              <p className="text-gray-600 mb-4">
                Coletam informações sobre como você usa nosso site para nos ajudar a melhorar a experiência.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookies de Funcionalidade</h3>
              <p className="text-gray-600 mb-6">
                Lembram suas preferências e configurações para personalizar sua experiência.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Como Gerenciar Cookies</h2>
              <p className="text-gray-600 mb-6">
                Você pode controlar e gerenciar cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookies de Terceiros</h2>
              <p className="text-gray-600 mb-6">
                Utilizamos serviços de terceiros que podem colocar cookies em seu dispositivo, como ferramentas de análise e sistemas de pagamento.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Atualizações desta Política</h2>
              <p className="text-gray-600 mb-6">
                Esta política pode ser atualizada periodicamente. Recomendamos revisar regularmente para se manter informado sobre nosso uso de cookies.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contato</h2>
              <p className="text-gray-600">
                Para dúvidas sobre nosso uso de cookies, entre em contato: contato@anjovirtual.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticaDeCookies;
