
import { useEffect, useState, useCallback, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole } from "@/utils/admin-role";

export const useAdminAuthInit = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Usar ref para evitar múltiplas verificações simultâneas
  const adminCheckInProgress = useRef(false);
  const mounted = useRef(true);

  // Debounce da verificação de admin role
  const checkAdminRoleDebounced = useCallback(async (userId: string) => {
    if (adminCheckInProgress.current) return;
    
    adminCheckInProgress.current = true;
    
    try {
      const adminStatus = await checkAdminRole(userId);
      if (mounted.current) {
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error("Erro ao verificar admin role:", error);
      if (mounted.current) {
        setIsAdmin(false);
      }
    } finally {
      adminCheckInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          if (mounted.current) {
            setLoading(false);
          }
          return;
        }
        
        if (mounted.current) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await checkAdminRoleDebounced(session.user.id);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro na inicialização da auth:", error);
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAdminAuthInit - Auth state change:", event);
        
        if (mounted.current) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user && event !== 'INITIAL_SESSION') {
            // Usar setTimeout para evitar deadlock
            setTimeout(() => {
              if (mounted.current) {
                checkAdminRoleDebounced(session.user.id);
              }
            }, 100);
          } else {
            setIsAdmin(false);
          }
          
          if (event !== 'INITIAL_SESSION') {
            setLoading(false);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [checkAdminRoleDebounced]);

  return { session, user, loading, isAdmin, setSession, setUser, setIsAdmin };
};
