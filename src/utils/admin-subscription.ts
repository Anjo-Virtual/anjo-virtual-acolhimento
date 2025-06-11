
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionInfo } from "@/types/admin-auth";

export const checkSubscription = async (user: any): Promise<SubscriptionInfo | null> => {
  if (!user) return null;
  
  try {
    const { data, error } = await supabase.functions.invoke("check-subscription");
    
    if (error) {
      console.error("Erro ao verificar assinatura:", error);
      return null;
    }
    
    return data as SubscriptionInfo;
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return null;
  }
};
