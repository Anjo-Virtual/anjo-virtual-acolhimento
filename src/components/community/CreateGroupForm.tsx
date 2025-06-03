
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface CreateGroupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    is_private: boolean;
    max_members: number;
  }) => Promise<boolean>;
}

const CreateGroupForm = ({ onSuccess, onCancel, onSubmit }: CreateGroupFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [maxMembers, setMaxMembers] = useState([12]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }

    setLoading(true);

    const success = await onSubmit({
      name: name.trim(),
      description: description.trim(),
      is_private: isPrivate,
      max_members: maxMembers[0]
    });

    if (success) {
      setName("");
      setDescription("");
      setIsPrivate(true);
      setMaxMembers([12]);
      onSuccess?.();
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Grupo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nome do Grupo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do grupo..."
              maxLength={100}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito e foco do grupo..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="private">Grupo Privado</Label>
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

          <div className="space-y-3">
            <Label>Máximo de Membros: {maxMembers[0]}</Label>
            <Slider
              value={maxMembers}
              onValueChange={setMaxMembers}
              max={50}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>3</span>
              <span>50</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading || !name.trim() || !description.trim()}>
              {loading ? 'Criando...' : 'Criar Grupo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGroupForm;
