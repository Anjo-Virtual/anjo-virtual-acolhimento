
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ChatAdmin = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [config, setConfig] = useState("");
  const [loading, setLoading] = useState(false);

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
      <h2 className="text-2xl font-semibold mb-6">Gerenciar Integrações</h2>
      
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
