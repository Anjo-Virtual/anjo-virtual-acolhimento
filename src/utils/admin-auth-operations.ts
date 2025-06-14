
import { supabase } from "@/integrations/supabase/client";

export const signInAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Erro no signIn admin:", error);
      return { error, data: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Erro no catch do signIn admin:", error);
    return { error, data: null };
  }
};

export const signUpAdmin = async (email: string, password: string) => {
  try {
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
    
    return { data, error: null };
  } catch (error) {
    console.error("Erro no catch do signUp admin:", error);
    return { error, data: null };
  }
};

export const signOutAdmin = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Erro ao fazer logout admin:", error);
  }
};
