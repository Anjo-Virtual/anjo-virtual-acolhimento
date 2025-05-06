
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

// Free plan price ID from Stripe
export const FREE_PLAN_PRICE_ID = "price_1RLo8HPEI2ekVLFOBEJ5lP8w";

export const useCheckoutHandler = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: "payment" | "subscription", planType: string) => {
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
