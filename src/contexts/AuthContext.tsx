
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type SubscriptionInfo = {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  one_time_payment: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscription: SubscriptionInfo | null;
  subscriptionLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const navigate = useNavigate();

  // Função para verificar o status de assinatura do usuário
  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      setSubscriptionLoading(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Erro ao verificar assinatura:", error);
        return;
      }
      
      setSubscription(data as SubscriptionInfo);
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    // Configurar o listener para mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Verificar se já existe uma sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Verificar assinatura quando o usuário mudar
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error, data: null };
      }
      
      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription(null);
    navigate("/admin/login");
  };

  const refreshSubscription = async () => {
    await checkSubscription();
  };

  const value = {
    session,
    user,
    loading,
    subscription,
    subscriptionLoading,
    signIn,
    signOut,
    refreshSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
