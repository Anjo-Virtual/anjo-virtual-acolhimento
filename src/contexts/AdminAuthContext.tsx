
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContextType, SubscriptionInfo } from "@/types/admin-auth";
import { useAdminAuthInit } from "@/hooks/useAdminAuthInit";
import { checkSubscription } from "@/utils/admin-subscription";
import { signInAdmin, signUpAdmin, signOutAdmin } from "@/utils/admin-auth-operations";
import { makeUserAdmin } from "@/utils/admin-role";

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user, loading, isAdmin, setSession, setUser, setIsAdmin } = useAdminAuthInit();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar assinatura quando o usuário mudar
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user && isAdmin) {
        setSubscriptionLoading(true);
        try {
          const subscriptionData = await checkSubscription(user);
          setSubscription(subscriptionData);
        } catch (error) {
          console.error("Erro ao verificar assinatura:", error);
        } finally {
          setSubscriptionLoading(false);
        }
      } else {
        setSubscription(null);
      }
    };

    fetchSubscription();
  }, [user, isAdmin]);

  const signIn = async (email: string, password: string) => {
    const result = await signInAdmin(email, password);
    return result;
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpAdmin(email, password);
    return result;
  };

  const signOut = async () => {
    await signOutAdmin();
    setSubscription(null);
    setIsAdmin(false);
    navigate("/admin/login");
  };

  const refreshSubscription = async () => {
    if (user && isAdmin) {
      setSubscriptionLoading(true);
      try {
        const subscriptionData = await checkSubscription(user);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error("Erro ao atualizar assinatura:", error);
      } finally {
        setSubscriptionLoading(false);
      }
    }
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
