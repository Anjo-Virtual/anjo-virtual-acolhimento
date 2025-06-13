
import { supabase } from "@/integrations/supabase/client";

export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
    
    if (error) {
      console.error("Erro ao verificar role admin:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Erro no catch ao verificar role admin:", error);
    return false;
  }
};

export const makeUserAdmin = async (userId: string) => {
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
