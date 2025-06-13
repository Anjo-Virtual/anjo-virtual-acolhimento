
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermosDeUso = () => {
  return (
    <div className="bg-white">
      <Header />
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8">Termos de Uso</h1>
            
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-600 mb-6">
                Ao acessar e usar o serviço Anjo Virtual, você concorda em estar vinculado a estes Termos de Uso e todas as leis e regulamentos aplicáveis.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-600 mb-6">
                O Anjo Virtual é um assistente digital de acolhimento no luto que oferece suporte emocional através de conversas e recursos educativos para pessoas em processo de luto.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Uso Responsável</h2>
              <p className="text-gray-600 mb-6">
                Você se compromete a usar nosso serviço de forma responsável e apropriada, respeitando outros usuários e as diretrizes da comunidade.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Privacidade</h2>
              <p className="text-gray-600 mb-6">
                Respeitamos sua privacidade. Consulte nossa Política de Privacidade para entender como coletamos, usamos e protegemos suas informações.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitação de Responsabilidade</h2>
              <p className="text-gray-600 mb-6">
                O Anjo Virtual não substitui atendimento médico ou psicológico profissional. Em casos de emergência, procure ajuda médica imediatamente.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Modificações</h2>
              <p className="text-gray-600 mb-6">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contato</h2>
              <p className="text-gray-600">
                Para dúvidas sobre estes termos, entre em contato conosco através do email: contato@anjovirtual.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermosDeUso;
