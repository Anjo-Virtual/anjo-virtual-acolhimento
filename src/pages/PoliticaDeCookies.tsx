
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaDeCookies = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold mb-8 text-center">Política de Cookies</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. O que são Cookies</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita um site. 
              Eles nos ajudam a melhorar sua experiência e fornecer funcionalidades personalizadas.
            </p>

            <h2>2. Tipos de Cookies que Usamos</h2>
            <h3>Cookies Essenciais</h3>
            <p>
              Necessários para o funcionamento básico do site, incluindo autenticação e navegação.
            </p>

            <h3>Cookies de Funcionalidade</h3>
            <p>
              Permitem que o site lembre suas preferências e configurações para uma experiência personalizada.
            </p>

            <h3>Cookies de Análise</h3>
            <p>
              Nos ajudam a entender como os visitantes usam o site para que possamos melhorá-lo.
            </p>

            <h2>3. Gerenciamento de Cookies</h2>
            <p>
              Você pode controlar e/ou excluir cookies conforme desejar. Pode excluir todos os cookies 
              que já estão em seu computador e configurar a maioria dos navegadores para impedir que sejam colocados.
            </p>

            <h2>4. Cookies de Terceiros</h2>
            <p>
              Alguns cookies podem ser definidos por serviços de terceiros que aparecem em nossas páginas, 
              como ferramentas de análise ou widgets de mídia social.
            </p>

            <h2>5. Atualizações desta Política</h2>
            <p>
              Esta política de cookies pode ser atualizada periodicamente para refletir mudanças 
              em nosso uso de cookies ou por outros motivos operacionais, legais ou regulamentares.
            </p>

            <h2>6. Contato</h2>
            <p>
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
