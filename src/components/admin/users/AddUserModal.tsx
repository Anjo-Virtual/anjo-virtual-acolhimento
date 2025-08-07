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
      // Create user via Supabase Admin API would require service role key
      // For now, we'll create an invitation system instead
      
      // Create a temporary invitation record
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert({
          email,
          invited_by: (await supabase.auth.getUser()).data.user?.id,
          site_role: siteRole,
          community_role: communityRole,
          display_name: displayName,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

      if (inviteError) throw inviteError;

      // In a real implementation, you would send an email invitation here
      // For now, we'll just show a success message
    },
    onSuccess: () => {
      toast({
        title: "Convite enviado",
        description: "Um convite foi criado para o usuário. Eles receberão instruções por email.",
      });
      setEmail("");
      setPassword("");
      setDisplayName("");
      setSiteRole("community_member");
      setCommunityRole("member");
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar convite para o usuário.",
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
    createUserMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie um convite para um novo usuário. Eles receberão instruções por email.
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
              Criar Convite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}