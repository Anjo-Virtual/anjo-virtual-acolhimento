
import ContactForm from "./ContactForm";

const Business = () => {
  return (
    <section id="empresas" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">Para Empresas</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Ofereça um diferencial competitivo para sua equipe com nossa solução corporativa. Ajude seus colaboradores a lidar com o luto, melhorando a saúde mental e reduzindo o absenteísmo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="mb-8">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-user-heart-line text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Suporte Personalizado</h3>
                <p className="text-gray-600">
                  Atendimento individualizado para cada colaborador, com conteúdo personalizado de acordo com a perda específica.
                </p>
              </div>

              <div className="mb-8">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-group-line text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Workshops e Treinamentos</h3>
                <p className="text-gray-600">
                  Capacitações sobre como abordar o luto no ambiente de trabalho para gestores e equipes de RH.
                </p>
              </div>

              <div>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-line-chart-line text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Relatórios de Impacto</h3>
                <p className="text-gray-600">
                  Métricas sobre utilização e impacto do programa de suporte ao luto na produtividade da sua equipe.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-center mb-6">Entre em contato</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
