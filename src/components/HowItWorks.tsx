
const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Como Funciona</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Conheça os passos para iniciar sua jornada de acolhimento com o Anjo Virtual</p>
        </div>
        <div className="relative">
          {/* Linha horizontal entre os itens do timeline */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary/20 -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center bg-primary text-white rounded-full mb-4 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-soft">
                <i className="ri-user-add-line ri-lg"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Cadastre-se</h3>
              <p className="text-gray-600">Crie sua conta de forma rápida e simples para começar</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center bg-primary text-white rounded-full mb-4 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-soft">
                <i className="ri-chat-heart-line ri-lg"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Converse</h3>
              <p className="text-gray-600">Inicie um diálogo acolhedor com o Anjo Virtual</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center bg-primary text-white rounded-full mb-4 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-soft">
                <i className="ri-community-line ri-lg"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Conecte-se</h3>
              <p className="text-gray-600">Participe da comunidade e compartilhe experiências</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center bg-primary text-white rounded-full mb-4 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-soft">
                <i className="ri-heart-line ri-lg"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Encontre Esperança</h3>
              <p className="text-gray-600">Redescubra a esperança e o caminho para a superação</p>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center">
          <a href="#" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft whitespace-nowrap">Começar Agora</a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
