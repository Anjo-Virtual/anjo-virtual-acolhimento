
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

// Free plan price ID from Stripe - updated with the correct ID
export const FREE_PLAN_PRICE_ID = "price_1RLo8HPEI2ekVLFOBEJ5lP8w";

export const useCheckoutHandler = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: "payment" | "subscription", planType: string) => {
    try {
      setIsLoading(planType);
      console.log(`Starting checkout process for plan: ${planType}, priceId: ${priceId}, mode: ${mode}`);

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          mode,
          planType
        }
      });

      if (error) {
        console.error("Error invoking create-checkout function:", error);
        throw new Error(error.message || "Erro ao processar o checkout");
      }

      if (!data) {
        console.error("No data returned from create-checkout function");
        throw new Error("Nenhum dado retornado do servidor");
      }

      console.log("Checkout response:", data);

      if (data?.url) {
        console.log("Redirecting to Stripe checkout URL:", data.url);
        window.location.href = data.url;
      } else {
        console.error("No URL returned in checkout response");
        throw new Error("URL de checkout não retornada");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      
      // If user is not authenticated, navigate to login
      if (error instanceof Error && error.message.includes("autenticação")) {
        navigate("/admin/login?redirect=/");
      }
    } finally {
      setIsLoading(null);
    }
  };

  return { handleCheckout, isLoading };
};
