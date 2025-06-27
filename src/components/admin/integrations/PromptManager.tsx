
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromptConfig {
  id?: string;
  name: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
  active: boolean;
}

export const PromptManager = () => {
  const [config, setConfig] = useState<PromptConfig>({
    name: 'Agente de Acolhimento',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 1000,
    model: "gpt-4o-mini",
    active: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configuração existente
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_configs')
        .select('*')
        .eq('active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao carregar configuração:', error);
        return;
      }

      if (data) {
        setConfig({
          id: data.id,
          name: data.name,
          systemPrompt: data.system_prompt,
          temperature: parseFloat(data.temperature.toString()),
          maxTokens: data.max_tokens,
          model: data.model,
          active: data.active
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const configData = {
        name: config.name,
        system_prompt: config.systemPrompt,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        model: config.model,
        active: config.active
      };

      let result;
      
      if (config.id) {
        // Atualizar configuração existente
        result = await supabase
          .from('agent_configs')
          .update(configData)
          .eq('id', config.id);
      } else {
        // Criar nova configuração
        result = await supabase
          .from('agent_configs')
          .insert(configData);
      }

      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do agente foram atualizadas com sucesso",
      });

      // Recarregar configuração
      await loadConfig();
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando configurações...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração do Agente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Nome do Agente */}
          <div className="space-y-2">
            <Label htmlFor="agent-name">Nome do Agente</Label>
            <Input
              id="agent-name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do agente..."
            />
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="system-prompt">Prompt do Sistema</Label>
            <Textarea
              id="system-prompt"
              value={config.systemPrompt}
              onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
              className="min-h-[200px]"
              placeholder="Define o comportamento e personalidade do agente..."
            />
            <p className="text-xs text-gray-500">
              Este prompt define como o agente se comportará e responderá às perguntas dos usuários.
            </p>
          </div>

          {/* Model Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <select
                id="model"
                value={config.model}
                onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Rápido)</option>
                <option value="gpt-4o">GPT-4o (Avançado)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Econômico)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Criatividade</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              />
              <p className="text-xs text-gray-500">0 = Conservador, 1 = Criativo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-tokens">Tokens Máximos</Label>
              <Input
                id="max-tokens"
                type="number"
                min="100"
                max="4000"
                step="100"
                value={config.maxTokens}
                onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-gray-500">Limite de palavras por resposta</p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
