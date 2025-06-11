
import { Session, User } from "@supabase/supabase-js";

export type SubscriptionInfo = {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  one_time_payment: boolean;
};

export type AdminAuthContextType = {
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
