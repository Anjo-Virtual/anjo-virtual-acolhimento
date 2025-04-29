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

  return (
    <section id="admin" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Configuração de Integrações</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-medium mb-4">Configurar API da Perplexity</h3>
            <p className="text-gray-600 mb-4">
              Configure sua chave de API da Perplexity para habilitar o chat inteligente.
            </p>
            
            <div className="relative mb-4">
              <Input
                type={showKey ? "text" : "password"}
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
                placeholder="Insira sua chave da API"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <Button 
              onClick={savePerplexityKey}
              disabled={savingKey}
              className="w-full"
            >
              {savingKey ? "Salvando..." : "Salvar Chave da API"}
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-4">Adicionar Nova Integração</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Integração
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da integração"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Integração
                </label>
                <Input
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Tipo (e.g., webhook, api)"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
                  Configuração (JSON)
                </label>
                <Textarea
                  id="config"
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                  placeholder='{"key": "value", ...}'
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adicionando..." : "Adicionar Integração"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
