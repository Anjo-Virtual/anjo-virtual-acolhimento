
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const adminStatus = await checkAdminRole(session.user.id);
            setIsAdmin(adminStatus);
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
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout para evitar deadlock no callback
            setTimeout(async () => {
              if (mounted) {
                const adminStatus = await checkAdminRole(session.user.id);
                setIsAdmin(adminStatus);
              }
            }, 0);
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

  return { session, user, loading, isAdmin, setSession, setUser, setIsAdmin };
};
