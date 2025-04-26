
const Community = () => {
  return (
    <section id="comunidade" className="py-20 bg-cover bg-center" style={{ backgroundImage: "url('https://readdy.ai/api/search-image?query=A%20soft%2C%20blurred%20background%20image%20showing%20a%20supportive%20community%20gathering.%20The%20image%20should%20have%20a%20light%20blue%20or%20lavender%20overlay%20to%20maintain%20readability%20of%20text.%20It%20should%20depict%20silhouettes%20or%20abstract%20representations%20of%20people%20connecting%20in%20a%20supportive%20environment%2C%20with%20a%20peaceful%20and%20hopeful%20atmosphere.%20The%20style%20should%20be%20minimalist%20and%20respectful%2C%20perfect%20for%20a%20grief%20support%20community%20section.&width=1600&height=600&seq=123458&orientation=landscape')" }}>
      <div className="container mx-auto px-6">
        <div className="bg-white bg-opacity-95 rounded-lg py-16 px-8 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-800 mb-6">Comunidade do Luto</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Um espaço seguro para compartilhar experiências e encontrar apoio em sua jornada</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6">
                <i className="ri-group-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Grupos de Apoio</h3>
              <p className="text-gray-600">Participe de grupos específicos para diferentes tipos de perda</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6">
                <i className="ri-calendar-event-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Encontros Virtuais</h3>
              <p className="text-gray-600">Participe de encontros online com facilitadores especializados</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6">
                <i className="ri-message-3-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Fóruns de Discussão</h3>
              <p className="text-gray-600">Compartilhe suas experiências e aprenda com outros membros</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6">
                <i className="ri-heart-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Histórias de Superação</h3>
              <p className="text-gray-600">Inspire-se com histórias reais de pessoas que encontraram força e esperança</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6">
                <i className="ri-user-voice-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Entrevistas com Especialistas</h3>
              <p className="text-gray-600">Acesse conteúdo exclusivo com profissionais especializados em luto</p>
            </div>
          </div>
          <div className="text-center">
            <a href="#" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors inline-block whitespace-nowrap">Conhecer a Comunidade</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
