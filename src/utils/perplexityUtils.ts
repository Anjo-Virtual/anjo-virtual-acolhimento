
import { supabase } from "@/integrations/supabase/client";

export interface PerplexitySettings {
  api_key: string;
}

export const fetchPerplexityKey = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select()
      .eq('key', 'perplexity_api_key')
      .single();

    if (error) {
      // If not found, it's not a critical error
      if (error.code !== 'PGRST116') {  // Record not found
        console.error("Erro ao buscar API key:", error);
      }
      return null;
    }
    
    if (data && data.value) {
      // Check if the value is an object and has an api_key property
      const value = data.value as Record<string, unknown>;
      if (typeof value === 'object' && value !== null && 'api_key' in value) {
        // Store the API key in localStorage for ChatBox component to use
        const apiKey = value.api_key as string;
        localStorage.setItem('perplexityKey', apiKey);
        return apiKey;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar configuração da API:", error);
    return null;
  }
};
