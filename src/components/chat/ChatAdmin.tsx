import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

// Define interface for the API key settings
interface PerplexitySettings {
  api_key: string;
}
export const ChatAdmin = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [config, setConfig] = useState("");
  const [loading, setLoading] = useState(false);
  const [perplexityKey, setPerplexityKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  useEffect(() => {
    fetchPerplexityKey();
  }, []);
  const fetchPerplexityKey = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('site_settings').select().eq('key', 'perplexity_api_key').single();
      if (error) {
        // If it's not found, that's ok
        if (error.code !== 'PGRST116') {
          console.error("Erro ao buscar chave da API:", error);
        }
        return;
      }
      if (data && data.value) {
        // First check if the value is an object and has an api_key property
        const value = data.value as Record<string, unknown>;
        if (typeof value === 'object' && value !== null && 'api_key' in value) {
          setPerplexityKey("•".repeat(20));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar chave da API:", error);
    }
  };
  const savePerplexityKey = async () => {
    if (!perplexityKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira a chave da API",
        variant: "destructive"
      });
      return;
    }
    setSavingKey(true);
    try {
      // First check if the setting already exists
      const {
        data: existingData,
        error: getError
      } = await supabase.from('site_settings').select().eq('key', 'perplexity_api_key').single();
      if (getError && getError.code !== 'PGRST116') {
        throw getError;
      }
      let error;

      // If the key starts with bullets, it means the user hasn't changed it
      if (perplexityKey.startsWith('•')) {
        setSavingKey(false);
        return;
      }
      if (existingData) {
        // Update the existing setting
        const {
          error: updateError
        } = await supabase.from('site_settings').update({
          value: {
            api_key: perplexityKey
          }
        }).eq('key', 'perplexity_api_key');
        error = updateError;
      } else {
        // Insert a new setting
        const {
          error: insertError
        } = await supabase.from('site_settings').insert({
          key: 'perplexity_api_key',
          value: {
            api_key: perplexityKey
          }
        });
        error = insertError;
      }
      if (error) throw error;

      // Save to localStorage for immediate use
      localStorage.setItem('perplexityKey', perplexityKey);
      toast({
        title: "Sucesso",
        description: "Chave da API salva com sucesso!"
      });

      // Mask the API key after saving
      setPerplexityKey("•".repeat(20));
      setShowKey(false);
    } catch (error) {
      console.error("Erro ao salvar chave da API:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a chave da API: " + error.message,
        variant: "destructive"
      });
    } finally {
      setSavingKey(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let configObj;
      try {
        configObj = JSON.parse(config);
      } catch {
        toast({
          title: "Erro",
          description: "Configuração inválida. Certifique-se que é um JSON válido.",
          variant: "destructive"
        });
        return;
      }
      const {
        error
      } = await supabase.from('integrations').insert({
        name,
        type,
        config: configObj
      });
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Integração criada com sucesso!"
      });
      setName("");
      setType("");
      setConfig("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar integração: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return;
};