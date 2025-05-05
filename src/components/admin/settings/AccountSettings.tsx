
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export interface AccountSettingsProps {
  email: string;
  name: string;
  onNameChange: (value: string) => void;
}

export const AccountSettings = ({ email, name, onNameChange }: AccountSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { signOut } = useAuth();

  // Add account signout functionality
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      
      toast({
        title: "Desconectado com sucesso",
        description: "Você foi desconectado de sua conta.",
      });
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast({
        title: "Erro ao desconectar",
        description: "Ocorreu um erro ao tentar desconectar sua conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save account settings
  const saveAccountSettings = async () => {
    setIsSaving(true);
    try {
      // Update user password if provided
      if (currentPassword && newPassword) {
        const { error } = await supabase.auth.updateUser({ 
          password: newPassword 
        });
        
        if (error) throw error;
        
        setCurrentPassword("");
        setNewPassword("");
        
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi atualizada com sucesso.",
        });
      }
      
      // Here you could update other account details like name
      // if you're storing them in a separate profiles table
      
    } catch (error: any) {
      console.error("Erro ao salvar configurações da conta:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as configurações da conta.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações da Conta</CardTitle>
        <CardDescription>
          Gerencie suas preferências de conta e informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@exemplo.com"
            value={email}
            disabled // Email usually can't be changed directly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-password">Senha Atual</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova Senha</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? "Aguarde..." : "Sair da conta"}
        </Button>
        <Button onClick={saveAccountSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
};
