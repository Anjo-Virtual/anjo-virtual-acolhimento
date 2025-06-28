
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useOriginRedirect } from "@/hooks/useOriginRedirect";

type CommunityAuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};

const CommunityAuthContext = createContext<CommunityAuthContextType | undefined>(undefined);

export const CommunityAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { redirectAfterLogin } = useOriginRedirect();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Verificar se já existe uma sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
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
        console.log("Community auth state changed:", event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Executar redirecionamento após login bem-sucedido
          if (event === 'SIGNED_IN' && session?.user) {
            setTimeout(() => {
              redirectAfterLogin();
            }, 100);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [redirectAfterLogin]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro no signIn community:", error);
        return { error, data: null };
      }
      
      console.log("Login community bem-sucedido:", data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error("Erro no catch do signIn community:", error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/comunidade`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || email.split('@')[0],
          }
        }
      });
      
      if (error) {
        console.error("Erro no signUp community:", error);
        return { error, data: null };
      }
      
      console.log("Cadastro community bem-sucedido:", data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error("Erro no catch do signUp community:", error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/comunidade");
    } catch (error) {
      console.error("Erro ao fazer logout community:", error);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <CommunityAuthContext.Provider value={value}>{children}</CommunityAuthContext.Provider>;
};

export const useCommunityAuth = () => {
  const context = useContext(CommunityAuthContext);
  if (context === undefined) {
    throw new Error("useCommunityAuth must be used within a CommunityAuthProvider");
  }
  return context;
};
