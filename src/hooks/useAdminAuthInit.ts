
import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole } from "@/utils/admin-role";

export const useAdminAuthInit = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("useAdminAuthInit - Iniciando verificação de sessão...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log("useAdminAuthInit - Sessão obtida:", session?.user?.email || "sem sessão");
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log("useAdminAuthInit - Verificando role de admin para:", session.user.email);
            const adminStatus = await checkAdminRole(session.user.id);
            console.log("useAdminAuthInit - Status admin:", adminStatus);
            setIsAdmin(adminStatus);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro na inicialização da auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAdminAuthInit - Auth state change:", event, session?.user?.email || "sem usuário");
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout para evitar deadlock no callback
            setTimeout(async () => {
              if (mounted) {
                console.log("useAdminAuthInit - Verificando admin role após auth change");
                const adminStatus = await checkAdminRole(session.user.id);
                console.log("useAdminAuthInit - Admin status após change:", adminStatus);
                setIsAdmin(adminStatus);
              }
            }, 0);
          } else {
            setIsAdmin(false);
          }
          
          // Só marca como não carregando depois que processou o usuário
          if (event !== 'INITIAL_SESSION') {
            setLoading(false);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, isAdmin, setSession, setUser, setIsAdmin };
};
