
import { useContext } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export const useSafeAdminAuth = () => {
  try {
    return useAdminAuth();
  } catch (error) {
    // Se não estiver dentro do AdminAuthProvider, retornar valores padrão
    return {
      session: null,
      user: null,
      loading: false,
      isAdmin: false,
      subscription: null,
      subscriptionLoading: false,
      signIn: async () => ({ error: new Error("Not in admin context") }),
      signUp: async () => ({ error: new Error("Not in admin context") }),
      signOut: async () => {},
      refreshSubscription: async () => {},
      makeUserAdmin: async () => ({ error: new Error("Not in admin context") }),
    };
  }
};
