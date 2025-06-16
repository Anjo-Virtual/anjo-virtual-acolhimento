
import { supabase } from "@/integrations/supabase/client";

export const saveSettingsToDatabase = async (key: string, value: any) => {
  try {
    // Verificar se a configuração já existe
    const { data: existingSettings, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 é "No rows found"
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
      console.error('Erro ao salvar configuração:', saveError);
      throw saveError;
    }
    
    console.log(`Configuração ${key} salva com sucesso:`, value);
    return true;
  } catch (error) {
    console.error('Erro na função saveSettingsToDatabase:', error);
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
      throw error;
    }

    return data?.value || null;
  } catch (error) {
    console.error(`Erro ao buscar configuração ${key}:`, error);
    return null;
  }
};
