import { supabase } from "@/integrations/supabase/client";

export const saveSettingsToDatabase = async (key: string, value: any) => {
  // Check if settings exist
  const { data: existingSettings, error: fetchError } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
    throw fetchError;
  }
  
  let saveError;
  
  // If settings exist, update them
  if (existingSettings) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);
    
    saveError = error;
  } 
  // Otherwise insert new settings
  else {
    const { error } = await supabase
      .from('site_settings')
      .insert({
        key,
        value
      });
    
    saveError = error;
  }
  
  if (saveError) throw saveError;
};
