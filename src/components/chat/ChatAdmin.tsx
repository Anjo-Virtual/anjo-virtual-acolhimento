
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
      const { data, error } = await supabase
        .from('site_settings')
        .select()
        .eq('key', 'perplexity_api_key')
        .single();

      if (error) {
        // If it's not found, that's ok
        if (error.code !== 'PGRST116') {
          console.error("Erro ao buscar chave da API:", error);
        }
        return;
      }
      
      if (data && data.value) {
        // Type assertion to ensure TypeScript recognizes the api_key property
        const settings = data.value as PerplexitySettings;
        if (settings.api_key) {
          // Mask the API key for display
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
        variant: "destructive",
      });
      return;
    }

    setSavingKey(true);
    try {
      // First check if the setting already exists
      const { data: existingData, error: getError } = await supabase
        .from('site_settings')
        .select()
        .eq('key', 'perplexity_api_key')
        .single();

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
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({
            value: { api_key: perplexityKey }
          })
          .eq('key', 'perplexity_api_key');
        
        error = updateError;
      } else {
        // Insert a new setting
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({
            key: 'perplexity_api_key',
            value: { api_key: perplexityKey }
          });
        
        error = insertError;
      }

      if (error) throw error;

      // Save to localStorage for immediate use
      localStorage.setItem('perplexityKey', perplexityKey);

      toast({
        title: "Sucesso",
        description: "Chave da API salva com sucesso!",
      });

      // Mask the API key after saving
      setPerplexityKey("•".repeat(20));
      setShowKey(false);
    } catch (error) {
      console.error("Erro ao salvar chave da API:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a chave da API: " + error.message,
        variant: "destructive",
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
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('integrations')
        .insert({
          name,
          type,
          config: configObj
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Integração criada com sucesso!",
      });

      setName("");
      setType("");
      setConfig("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar integração: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Configuração da API Perplexity</h2>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Chave da API</label>
            <div className="flex relative">
              <Input
                type={showKey ? "text" : "password"}
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
                placeholder="Insira a chave da API Perplexity"
                className="pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Esta chave será usada para todas as conversas no chat.
            </p>
          </div>
          
          <Button 
            onClick={savePerplexityKey}
            disabled={savingKey}
            className="w-full"
          >
            {savingKey ? "Salvando..." : "Salvar Chave da API"}
          </Button>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Outras Integrações para Chat</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da integração"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Tipo da integração (ex: perplexity, n8n)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Configuração (JSON)</label>
          <Textarea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            placeholder="Configuração em formato JSON"
            rows={5}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Integração"}
        </Button>
      </form>
    </div>
  );
};
