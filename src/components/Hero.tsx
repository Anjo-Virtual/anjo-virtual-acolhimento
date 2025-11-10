
import { useCheckoutHandler } from '@/utils/checkoutUtils';
import { Loader2 } from "lucide-react";
import { isFeatureEnabled } from '@/utils/featureFlags';
import { useModalControls } from './FloatingButtons';

const Hero = () => {
  const { handleCheckout, isLoading } = useCheckoutHandler();
  const { openChatModal } = useModalControls();

  const startFreePlan = () => {
    if (!isFeatureEnabled('STRIPE_CHECKOUT_ENABLED')) {
      return;
    }
    handleCheckout("price_1RLo8HPEI2ekVLFOBEJ5lP8w", "payment", "free");
  };

  const isCheckoutDisabled = !isFeatureEnabled('STRIPE_CHECKOUT_ENABLED');

  return (
    <section className="hero-section pt-32 pb-20">
      <div className="container mx-auto px-6 w-full">
        <div className="max-w-xl animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-4 [text-wrap:balance]">
            Um abraço virtual para seu momento de luto
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 animate-slideIn [text-wrap:pretty]">
            Encontre acolhimento, compreensão e esperança em sua jornada de superação da perda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={openChatModal}
              className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 hover:translate-y-[-2px] hover:shadow-soft text-center whitespace-nowrap animate-scaleIn transition-all duration-300"
            >
              Conversar com Anjo Virtual
            </button>
            <button 
              onClick={startFreePlan}
              disabled={isCheckoutDisabled || isLoading === "free"}
              className={`px-8 py-3 rounded-button text-center whitespace-nowrap animate-scaleIn flex items-center justify-center transition-all duration-300 ${
                isCheckoutDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:translate-y-[-2px] hover:shadow-soft'
              }`}
            >
              {isLoading === "free" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                isCheckoutDisabled ? "Planos em Breve" : "Ver Planos"
              )}
            </button>
            <a 
              href="#como-funciona" 
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-button hover:bg-gray-50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-soft text-center whitespace-nowrap"
            >
              Saiba Mais
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
