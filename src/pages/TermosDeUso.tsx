
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold mb-8 text-center">Termos de Uso</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar este site, você aceita e concorda em ficar vinculado aos termos e condições de uso aqui apresentados.
            </p>

            <h2>2. Uso do Site</h2>
            <p>
              Este site destina-se a fornecer informações e suporte para pessoas em processo de luto. 
              O uso inadequado ou para fins não relacionados ao propósito do site é proibido.
            </p>

            <h2>3. Conteúdo do Usuário</h2>
            <p>
              Os usuários são responsáveis pelo conteúdo que publicam. Não toleramos conteúdo ofensivo, 
              discriminatório ou que viole direitos de terceiros.
            </p>

            <h2>4. Privacidade</h2>
            <p>
              Respeitamos sua privacidade. Consulte nossa Política de Privacidade para entender como 
              coletamos, usamos e protegemos suas informações.
            </p>

            <h2>5. Modificações</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação.
            </p>

            <h2>6. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato conosco através dos canais disponíveis no site.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermosDeUso;
