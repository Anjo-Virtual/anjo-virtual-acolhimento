
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Plans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Preços fixos do Stripe
  const STRIPE_PRICES = {
    monthly: "price_1GrUrVFGP9lWHwUzuZ3kuPzZ", // Substitua com seu price_id real do Stripe
    gift: "price_1GrUrRFGP9lWHwUzC8fUBZbM",    // Substitua com seu price_id real do Stripe
  };

  const handleCheckout = async (priceId: string, mode: "payment" | "subscription", planType: string) => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para continuar com a compra.",
        variant: "destructive",
      });
      navigate("/admin/login?redirect=/planos");
      return;
    }

    try {
      setIsLoading(planType);

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          mode,
          planType
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast({
        title: "Erro no processamento do pagamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

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
  }) => (
    <button
      onClick={onClick}
      disabled={!!isLoading}
      className={`block w-full ${
        variant === "primary" 
          ? "bg-primary text-white hover:bg-opacity-90" 
          : "bg-white border border-primary text-primary hover:bg-primary hover:text-white"
      } text-center py-3 rounded-button transition-colors whitespace-nowrap`}
    >
      {isLoading === planType ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );

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
              <CheckoutButton 
                onClick={() => navigate(user ? "/dashboard" : "/admin/login")}
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
              <CheckoutButton 
                onClick={() => handleCheckout(STRIPE_PRICES.monthly, "subscription", "monthly")}
                variant="primary"
                planType="monthly"
              >
                Assinar Agora
              </CheckoutButton>
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
              <CheckoutButton 
                onClick={() => navigate("/contato?assunto=Plano%20Empresarial")}
                variant="outline"
                planType="business"
              >
                Solicitar Proposta
              </CheckoutButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;
