
import { useSafeAdminAuth } from "@/hooks/useSafeAdminAuth";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useCheckoutHandler, FREE_PLAN_PRICE_ID } from "@/utils/checkoutUtils";
import { isFeatureEnabled } from "@/utils/featureFlags";

const Plans = () => {
  const { user } = useSafeAdminAuth();
  const { handleCheckout, isLoading } = useCheckoutHandler();
  
  // Updated Stripe prices with the correct IDs provided by the user
  const STRIPE_PRICES = {
    free: "price_1RLo8HPEI2ekVLFOBEJ5lP8w",       // Plano Gratuito
    gift: "price_1RLVazPEI2ekVLFOqERdOweO",       // Presente de Consolo
    monthly: "price_1RLVbmPEI2ekVLFOvBYliVNK",    // Plano Individual
    family: "price_1RZM6jPEI2ekVLFOhb5nyQoa"      // Plano Família
  };

  const isCheckoutDisabled = !isFeatureEnabled('STRIPE_CHECKOUT_ENABLED');

  // Botão com loading state
  const CheckoutButton = ({ 
    children, 
    onClick, 
    variant = "primary", 
    planType 
  }: { 
    children: React.ReactNode, 
    onClick: () => void, 
    variant?: "primary" | "outline", 
    planType: string 
  }) => {
    const isDisabled = isCheckoutDisabled || !!isLoading;
    
    return (
      <button
        onClick={isCheckoutDisabled ? undefined : onClick}
        disabled={isDisabled}
        className={`block w-full text-center py-3 rounded-button transition-colors whitespace-nowrap flex items-center justify-center ${
          isCheckoutDisabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
            : variant === "primary" 
              ? "bg-primary text-white hover:bg-opacity-90" 
              : "bg-white border border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        {isLoading === planType ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </span>
        ) : (
          isCheckoutDisabled ? "Em Breve" : children
        )}
      </button>
    );
  };

  return (
    <section id="planos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Planos Disponíveis</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Escolha o plano que melhor atende às suas necessidades de acolhimento</p>
          {isCheckoutDisabled && (
            <p className="text-sm text-gray-500 mt-2 bg-gray-100 p-3 rounded-lg max-w-md mx-auto">
              💡 Estamos finalizando os últimos detalhes. Os planos estarão disponíveis em breve!
            </p>
          )}
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
              <CheckoutButton 
                onClick={() => handleCheckout(STRIPE_PRICES.free, "payment", "free")}
                variant="outline"
                planType="free"
              >
                Começar Grátis
              </CheckoutButton>
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
              <CheckoutButton 
                onClick={() => handleCheckout(STRIPE_PRICES.gift, "payment", "gift")}
                variant="outline"
                planType="gift"
              >
                Presentear Alguém
              </CheckoutButton>
            </div>
          </div>

          {/* Plano Individual */}
          <div className="bg-primary bg-opacity-5 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">Mais Popular</div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Plano Individual</h3>
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
              <CheckoutButton 
                onClick={() => handleCheckout(STRIPE_PRICES.monthly, "payment", "monthly")}
                variant="primary"
                planType="monthly"
              >
                Assinar Agora
              </CheckoutButton>
            </div>
          </div>

          {/* Plano Família */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Plano Família</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-800">R$49,90</span>
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
                  <span className="text-gray-600">Para 4 pessoas da família</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <CheckoutButton 
                onClick={() => handleCheckout(STRIPE_PRICES.family, "payment", "family")}
                variant="outline"
                planType="family"
              >
                Assinar Plano Família
              </CheckoutButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;
