
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const planType = queryParams.get("plan");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    const checkSubscription = async () => {
      try {
        // Only check subscription if user is authenticated
        if (user) {
          const { data, error } = await supabase.functions.invoke("check-subscription");
          
          if (error) {
            throw new Error(error.message);
          }
          
          setSubscriptionInfo(data);
        } else {
          // For non-authenticated users, just set basic plan info
          setSubscriptionInfo({
            subscription_tier: getPlanDescription(),
            // No end date for non-authenticated users
          });
        }
      } catch (error) {
        console.error("Erro ao verificar assinatura:", error);
        toast({
          title: "Erro ao verificar assinatura",
          description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      } finally {
        setChecking(false);
      }
    };

    checkSubscription();
  }, [user, sessionId, navigate, location.search]);

  const getPlanDescription = () => {
    if (planType === "monthly") {
      return "Plano Mensal";
    } else if (planType === "gift") {
      return "Presente de Consolo";
    } else {
      return "Plano Premium";
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verificando seu pagamento...</h1>
          <p className="text-gray-600 mb-4">
            Estamos processando sua transação. Isso pode levar alguns instantes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Pagamento confirmado!
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          Seu pagamento para {getPlanDescription()} foi processado com sucesso.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Plano:</span>
            <span className="font-medium">{subscriptionInfo?.subscription_tier || getPlanDescription()}</span>
          </div>
          
          {subscriptionInfo?.subscription_end && (
            <div className="flex justify-between">
              <span className="text-gray-600">Válido até:</span>
              <span className="font-medium">
                {new Date(subscriptionInfo.subscription_end).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center"
          >
            Ir para a página inicial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {user && (
            <Button 
              variant="outline"
              onClick={() => navigate("/minha-conta")}
              className="w-full"
            >
              Minha conta
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
