
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { CreateGroupData } from "@/types/groups";
import { AlertCircle } from "lucide-react";

interface CreateGroupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: CreateGroupData) => Promise<boolean>;
}

const CreateGroupForm = ({ onSuccess, onCancel, onSubmit }: CreateGroupFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [maxMembers, setMaxMembers] = useState([12]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  console.log('[CreateGroupForm] Estado atual:', {
    name: name.length,
    description: description.length,
    isPrivate,
    maxMembers: maxMembers[0],
    loading
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome do grupo é obrigatório";
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (description.trim().length < 10) {
      newErrors.description = "Descrição deve ter pelo menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[CreateGroupForm] Iniciando submissão do formulário');
    
    if (!validateForm()) {
      console.log('[CreateGroupForm] Validação falhou:', errors);
      return;
    }

    setLoading(true);

    try {
      const groupData: CreateGroupData = {
        name: name.trim(),
        description: description.trim(),
        is_private: isPrivate,
        max_members: maxMembers[0]
      };

      console.log('[CreateGroupForm] Dados do grupo a serem enviados:', groupData);

      const success = await onSubmit(groupData);

      if (success) {
        console.log('[CreateGroupForm] Grupo criado com sucesso');
        setName("");
        setDescription("");
        setIsPrivate(true);
        setMaxMembers([12]);
        setErrors({});
        onSuccess?.();
      }
    } catch (error) {
      console.error('[CreateGroupForm] Erro ao criar grupo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
          Criar Novo Grupo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Grupo *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do grupo..."
              maxLength={100}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500">
              {name.length}/100 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito e foco do grupo..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {description.length} caracteres
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="private" className="font-medium">
                Grupo Privado
              </Label>
              <p className="text-sm text-gray-600">
                Grupos privados requerem aprovação para entrar
              </p>
            </div>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          <div className="space-y-4">
            <Label className="font-medium">
              Máximo de Membros: {maxMembers[0]}
            </Label>
            <div className="space-y-3">
              <Slider
                value={maxMembers}
                onValueChange={setMaxMembers}
                max={50}
                min={3}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 px-1">
                <span>3 membros</span>
                <span>50 membros</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={loading || !name.trim() || !description.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? 'Criando...' : 'Criar Grupo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGroupForm;
