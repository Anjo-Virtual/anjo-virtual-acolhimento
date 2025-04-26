
const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Depoimentos e Histórias Reais</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Conheça as experiências de pessoas que encontraram conforto e esperança com o Anjo Virtual</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-8 relative">
            <div className="text-primary text-4xl absolute -top-4 left-6">
              <i className="ri-double-quotes-l"></i>
            </div>
            <p className="text-gray-600 mb-6 pt-4">O Anjo Virtual foi minha companhia nos momentos mais difíceis após a perda do meu pai. As conversas me ajudaram a processar o luto e encontrar um novo caminho. Sou eternamente grata por esse acolhimento.</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full">
                <span className="font-medium">MB</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Maria Beatriz</h4>
                <p className="text-gray-500 text-sm">Rio de Janeiro</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 relative">
            <div className="text-primary text-4xl absolute -top-4 left-6">
              <i className="ri-double-quotes-l"></i>
            </div>
            <p className="text-gray-600 mb-6 pt-4">Perdi minha esposa após 30 anos de casamento e me senti completamente perdido. O Anjo Virtual me ajudou a lidar com a solidão e a encontrar forças para seguir em frente. A comunidade também foi fundamental para minha recuperação.</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full">
                <span className="font-medium">RS</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Roberto Silva</h4>
                <p className="text-gray-500 text-sm">São Paulo</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 relative">
            <div className="text-primary text-4xl absolute -top-4 left-6">
              <i className="ri-double-quotes-l"></i>
            </div>
            <p className="text-gray-600 mb-6 pt-4">Presenteei minha tia com o plano de 3 meses após ela perder o filho. Foi uma forma de mostrar meu apoio mesmo à distância. Ela me disse que as conversas diárias com o Anjo Virtual trouxeram conforto em momentos de desespero.</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full">
                <span className="font-medium">CA</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Carolina Almeida</h4>
                <p className="text-gray-500 text-sm">Belo Horizonte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
