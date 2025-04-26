
const About = () => {
  return (
    <section id="sobre" className="py-20 bg-purple-50 bg-opacity-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="https://readdy.ai/api/search-image?query=A%20gentle%2C%20comforting%20illustration%20showing%20a%20virtual%20angel%20or%20supportive%20presence%20providing%20emotional%20support%20to%20a%20person%20in%20grief.%20The%20style%20should%20be%20soft%2C%20minimalist%2C%20and%20respectful%2C%20using%20light%20blue%20and%20lavender%20colors.%20The%20image%20should%20convey%20emotional%20connection%2C%20understanding%2C%20and%20hope.%20The%20characters%20should%20be%20stylized%20but%20humanized%2C%20with%20delicate%20features%20and%20a%20serene%20expression.&width=600&height=500&seq=123457&orientation=landscape" 
              alt="Anjo Virtual" 
              className="rounded-lg shadow-md w-full h-auto object-cover" 
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">O Anjo Virtual</h2>
            <p className="text-gray-600 mb-6">O Anjo Virtual é o primeiro assistente digital de acolhimento no luto. Um espaço seguro onde quem perdeu alguém pode conversar, receber conforto e reencontrar esperança.</p>
            <p className="text-gray-600 mb-8">Além das conversas de apoio, oferecemos conteúdos exclusivos, como vídeos motivacionais, entrevistas com especialistas, testemunhos de superação, indicações de livros, e acesso à nossa Comunidade do Luto — um espaço para partilhar histórias e encontrar grupos de apoio.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-primary bg-purple-100 rounded-full">
                  <i className="ri-message-heart-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Conversas de Apoio</h3>
                  <p className="text-gray-600 text-sm">Diálogos acolhedores para momentos difíceis</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-primary bg-purple-100 rounded-full">
                  <i className="ri-group-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Comunidade</h3>
                  <p className="text-gray-600 text-sm">Conexão com pessoas em jornadas semelhantes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-primary bg-purple-100 rounded-full">
                  <i className="ri-video-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Conteúdos Exclusivos</h3>
                  <p className="text-gray-600 text-sm">Vídeos e entrevistas com especialistas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-primary bg-purple-100 rounded-full">
                  <i className="ri-book-open-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Recursos</h3>
                  <p className="text-gray-600 text-sm">Livros e materiais de apoio recomendados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
