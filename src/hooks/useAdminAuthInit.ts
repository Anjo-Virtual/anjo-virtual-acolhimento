
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
        console.log("Inicializando autenticação admin...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
        }
        
        if (mounted) {
          console.log("Sessão encontrada:", session?.user?.email || "nenhuma");
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const adminStatus = await checkAdminRole(session.user.id);
            console.log("Status admin inicial:", adminStatus);
            setIsAdmin(adminStatus);
          }
          
          setLoading(false);
          console.log("Loading inicial finalizado");
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
        console.log("Admin auth state changed:", event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const adminStatus = await checkAdminRole(session.user.id);
            console.log("Status admin após login:", adminStatus);
            setIsAdmin(adminStatus);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
          console.log("Loading finalizado após mudança de estado:", event);
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
