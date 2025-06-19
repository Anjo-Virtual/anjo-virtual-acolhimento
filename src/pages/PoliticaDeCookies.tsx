
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaDeCookies = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold mb-8 text-center text-gray-900">Política de Cookies</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. O que são Cookies</h2>
            <p className="mb-6">
              Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita um site. 
              Eles nos ajudam a melhorar sua experiência e fornecer funcionalidades personalizadas.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Tipos de Cookies que Usamos</h2>
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Cookies Essenciais</h3>
            <p className="mb-4">
              Necessários para o funcionamento básico do site, incluindo autenticação e navegação.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Cookies de Funcionalidade</h3>
            <p className="mb-4">
              Permitem que o site lembre suas preferências e configurações para uma experiência personalizada.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Cookies de Análise</h3>
            <p className="mb-6">
              Nos ajudam a entender como os visitantes usam o site para que possamos melhorá-lo.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Gerenciamento de Cookies</h2>
            <p className="mb-6">
              Você pode controlar e/ou excluir cookies conforme desejar. Pode excluir todos os cookies 
              que já estão em seu computador e configurar a maioria dos navegadores para impedir que sejam colocados.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Cookies de Terceiros</h2>
            <p className="mb-6">
              Alguns cookies podem ser definidos por serviços de terceiros que aparecem em nossas páginas, 
              como ferramentas de análise ou widgets de mídia social.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Atualizações desta Política</h2>
            <p className="mb-6">
              Esta política de cookies pode ser atualizada periodicamente para refletir mudanças 
              em nosso uso de cookies ou por outros motivos operacionais, legais ou regulamentares.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Contato</h2>
            <p className="mb-6">
              Se você tiver dúvidas sobre nossa política de cookies, entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticaDeCookies;
