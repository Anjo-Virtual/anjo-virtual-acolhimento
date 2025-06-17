
import { supabase } from "@/integrations/supabase/client";
import { secureLog, maskSensitiveData } from "@/utils/security";

export const saveSettingsToDatabase = async (key: string, value: any) => {
  try {
    // Log the operation (with masked sensitive data)
    secureLog('info', `Attempting to save setting: ${key}`, { key, value: maskSensitiveData(value) });
    
    // Verificar se a configuração já existe
    const { data: existingSettings, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 é "No rows found"
      secureLog('error', 'Error fetching existing settings:', fetchError);
      throw fetchError;
    }
    
    let saveError;
    
    // Se a configuração existe, atualizar
    if (existingSettings) {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);
      
      saveError = error;
    } 
    // Senão, inserir nova configuração
    else {
      const { error } = await supabase
        .from('site_settings')
        .insert({
          key,
          value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      saveError = error;
    }
    
    if (saveError) {
      secureLog('error', 'Erro ao salvar configuração:', saveError);
      throw saveError;
    }
    
    secureLog('info', `Configuração ${key} salva com sucesso`);
    return true;
  } catch (error) {
    secureLog('error', 'Erro na função saveSettingsToDatabase:', error);
    throw error;
  }
};

// Função utilitária para buscar configurações
export const getSettingsFromDatabase = async (key: string) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      secureLog('error', `Erro ao buscar configuração ${key}:`, error);
      throw error;
    }

    return data?.value || null;
  } catch (error) {
    secureLog('error', `Erro ao buscar configuração ${key}:`, error);
    return null;
  }
};

// Função para validar se o usuário tem permissão para acessar configurações
export const validateSettingsAccess = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      secureLog('warn', 'Tentativa de acesso a configurações sem autenticação');
      return false;
    }
    
    // Verificar se é admin usando a função do banco
    const { data: isAdmin, error } = await supabase.rpc('is_admin', { user_uuid: user.id });
    
    if (error) {
      secureLog('error', 'Erro ao verificar permissões de admin:', error);
      return false;
    }
    
    if (!isAdmin) {
      secureLog('warn', `Usuário ${user.email} tentou acessar configurações sem permissão de admin`);
      return false;
    }
    
    return true;
  } catch (error) {
    secureLog('error', 'Erro ao validar acesso a configurações:', error);
    return false;
  }
};
