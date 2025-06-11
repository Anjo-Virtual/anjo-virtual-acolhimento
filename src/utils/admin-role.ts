
import { supabase } from "@/integrations/supabase/client";

export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log("Verificando role admin para usuário:", userId);
    const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
    if (error) {
      console.error("Erro ao verificar role admin:", error);
      return false;
    }
    console.log("Resultado verificação admin:", data);
    return data || false;
  } catch (error) {
    console.error("Erro no catch ao verificar role admin:", error);
    return false;
  }
};

export const makeUserAdmin = async (userId: string) => {
  try {
    console.log("Tornando usuário admin:", userId);
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
    
    console.log("Usuário promovido a admin com sucesso");
    return { error: null };
  } catch (error) {
    console.error("Erro ao tornar usuário admin:", error);
    return { error };
  }
};
