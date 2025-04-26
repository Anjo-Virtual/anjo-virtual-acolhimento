
const Hero = () => {
  return (
    <section className="hero-section pt-32 pb-20">
      <div className="container mx-auto px-6 w-full">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-4">Um abraço virtual para seu momento de luto</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">Encontre acolhimento, compreensão e esperança em sua jornada de superação da perda.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors text-center whitespace-nowrap">Iniciar Acolhimento Gratuito</a>
            <a href="#como-funciona" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-button hover:bg-gray-50 transition-colors text-center whitespace-nowrap">Saiba Mais</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
