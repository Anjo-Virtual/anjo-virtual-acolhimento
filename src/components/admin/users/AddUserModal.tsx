import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddUserModal({ open, onOpenChange, onSuccess }: AddUserModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [siteRole, setSiteRole] = useState("community_member");
  const [communityRole, setCommunityRole] = useState("member");
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async () => {
      // Create user using Supabase Auth Admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: password || Math.random().toString(36).slice(-8), // Generate random password if not provided
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
          data: {
            display_name: displayName
          }
        }
      });

      if (authError) {
        console.error("Erro ao criar usuário:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Usuário não foi criado");
      }

      console.log("✅ Usuário criado:", authData.user.id);

      // Add site role if not community_member
      if (siteRole !== 'community_member') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: siteRole as "community_member" | "admin" | "super_admin",
            assigned_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (roleError) {
          console.error("Erro ao atribuir role do site:", roleError);
        }
      }

      // Log admin action
      await supabase
        .from('admin_actions_log')
        .insert({
          admin_user_id: (await supabase.auth.getUser()).data.user?.id,
          target_user_id: authData.user.id,
          action: 'user_created',
          details: { 
            email, 
            display_name: displayName,
            site_role: siteRole,
            community_role: communityRole
          }
        });

      return authData.user;
    },
    onSuccess: (userData) => {
      toast({
        title: "Usuário criado com sucesso",
        description: `Usuário ${email} foi criado e receberá um email de confirmação.`,
      });
      setEmail("");
      setPassword("");
      setDisplayName("");
      setSiteRole("community_member");
      setCommunityRole("member");
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Falha ao criar o usuário. Verifique se o email já existe.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Email é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a secure random password if none provided
    const finalPassword = password.trim() || `Temp${Math.random().toString(36).slice(-8)}#`;
    
    createUserMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie um novo usuário no sistema. Eles receberão um email de confirmação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe vazio para gerar automaticamente"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se não informar, uma senha temporária será gerada
            </p>
          </div>
          <div>
            <Label htmlFor="displayName">Nome de Exibição</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nome do usuário"
            />
          </div>
          <div>
            <Label htmlFor="siteRole">Role do Site</Label>
            <Select value={siteRole} onValueChange={setSiteRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="community_member">Membro da Comunidade</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="super_admin">Super Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="communityRole">Role da Comunidade</Label>
            <Select value={communityRole} onValueChange={setCommunityRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}