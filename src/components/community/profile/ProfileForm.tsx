
import { useState, useEffect } from "react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityProfile } from "@/hooks/useCommunityProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ProfileForm = () => {
  const { user } = useCommunityAuth();
  const { profile, refetch } = useCommunityProfile();
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update state when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setIsAnonymous(profile.is_anonymous ?? true);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('community_profiles')
        .update({
          display_name: displayName,
          is_anonymous: isAnonymous,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAnonymousChange = (checked: boolean) => {
    setIsAnonymous(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais na comunidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user?.email || ""}
            disabled
            className="bg-gray-100"
          />
          <p className="text-sm text-gray-500">O email não pode ser alterado</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Nome de exibição</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Como você gostaria de ser chamado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você (opcional)"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Perfil Anônimo</Label>
            <p className="text-sm text-gray-500">
              Quando ativado, seu nome real não será exibido nas publicações
            </p>
          </div>
          <Switch
            checked={isAnonymous}
            onCheckedChange={handleAnonymousChange}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
