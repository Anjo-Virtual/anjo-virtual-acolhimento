
const Plans = () => {
  return (
    <section id="planos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Planos Disponíveis</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Escolha o plano que melhor atende às suas necessidades de acolhimento</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Plano Gratuito */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Gratuito</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-800">R$0,00</span>
                <span className="text-gray-500">/Mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Acesso às conversas básicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Conteúdos introdutórios</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Acesso limitado à comunidade</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <a href="#" className="block w-full bg-white border border-primary text-primary text-center py-3 rounded-button hover:bg-primary hover:text-white transition-colors whitespace-nowrap">Começar Grátis</a>
            </div>
          </div>

          {/* Plano Presente de Consolo */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Presente de Consolo</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-800">R$39,00</span>
                <span className="text-gray-500">/único</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Acesso completo por 3 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Conversas ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Acesso total à comunidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Cartão digital de presente</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <a href="#" className="block w-full bg-white border border-primary text-primary text-center py-3 rounded-button hover:bg-primary hover:text-white transition-colors whitespace-nowrap">Presentear Alguém</a>
            </div>
          </div>

          {/* Plano Mensal */}
          <div className="bg-primary bg-opacity-5 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">Mais Popular</div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Plano Mensal</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-800">R$29,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Conversas ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Acesso completo aos conteúdos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Participação em grupos exclusivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Suporte prioritário</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <a href="#" className="block w-full bg-primary text-white text-center py-3 rounded-button hover:bg-opacity-90 transition-colors whitespace-nowrap">Assinar Agora</a>
            </div>
          </div>

          {/* Plano para Empresas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Para Empresas</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-800">Sob Consulta</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Suporte para colaboradores</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Dashboard para gestão</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Relatórios de utilização</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600">Personalização para sua empresa</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <a href="#" className="block w-full bg-white border border-primary text-primary text-center py-3 rounded-button hover:bg-primary hover:text-white transition-colors whitespace-nowrap">Solicitar Proposta</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;
