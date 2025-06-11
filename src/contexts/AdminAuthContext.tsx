
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

type AdminAuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  subscription: SubscriptionInfo | null;
  subscriptionLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  makeUserAdmin: (userId: string) => Promise<{ error: any | null }>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const navigate = useNavigate();

  // Função para verificar se o usuário é admin
  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
      if (error) {
        console.error("Erro ao verificar role admin:", error);
        return false;
      }
      return data || false;
    } catch (error) {
      console.error("Erro ao verificar role admin:", error);
      return false;
    }
  };

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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Verificar se já existe uma sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
        }
        
        if (mounted && session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Verificar se é admin
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro na inicialização da auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Configurar o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Admin auth state changed:", event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Verificar se é admin quando logar
            const adminStatus = await checkAdminRole(session.user.id);
            setIsAdmin(adminStatus);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Verificar assinatura quando o usuário mudar
  useEffect(() => {
    if (user && isAdmin) {
      checkSubscription();
    } else {
      setSubscription(null);
    }
  }, [user, isAdmin]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro no signIn admin:", error);
        return { error, data: null };
      }
      
      console.log("Login admin bem-sucedido:", data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error("Erro no catch do signIn admin:", error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        }
      });
      
      if (error) {
        console.error("Erro no signUp admin:", error);
        return { error, data: null };
      }
      
      console.log("Cadastro admin bem-sucedido:", data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error("Erro no catch do signUp admin:", error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const makeUserAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });
      
      if (error) {
        console.error("Erro ao tornar usuário admin:", error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Erro ao tornar usuário admin:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSubscription(null);
      setIsAdmin(false);
      navigate("/admin/login");
    } catch (error) {
      console.error("Erro ao fazer logout admin:", error);
    }
  };

  const refreshSubscription = async () => {
    await checkSubscription();
  };

  const value = {
    session,
    user,
    loading,
    isAdmin,
    subscription,
    subscriptionLoading,
    signIn,
    signUp,
    signOut,
    refreshSubscription,
    makeUserAdmin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
