
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PromptConfig {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

export const PromptManager = () => {
  const [config, setConfig] = useState<PromptConfig>({
    systemPrompt: `Você é um assistente especializado em acolhimento e suporte emocional para pessoas em luto. 

Suas características:
- Empático e compassivo
- Oferece suporte baseado em evidências
- Cita fontes dos documentos quando relevante
- Mantém um tom acolhedor e respeitoso
- Evita conselhos médicos diretos

Quando responder:
1. Seja gentil e compreensivo
2. Use informações da base de conhecimento quando relevante
3. Cite as fontes dos documentos utilizados
4. Ofereça suporte emocional adequado
5. Sugira recursos adicionais quando apropriado`,
    temperature: 0.7,
    maxTokens: 1000,
    model: "gpt-4o-mini"
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulação de salvamento - aqui você implementaria a lógica real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do agente foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
