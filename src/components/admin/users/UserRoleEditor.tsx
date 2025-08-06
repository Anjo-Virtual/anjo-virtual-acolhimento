import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  user_id: string;
  site_role: string | null;
  community_role: string | null;
  display_name: string | null;
}

interface UserRoleEditorProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UserRoleEditor({ user, open, onOpenChange, onSuccess }: UserRoleEditorProps) {
  const [siteRole, setSiteRole] = useState(user.site_role || "");
  const [communityRole, setCommunityRole] = useState(user.community_role || "");

  const updateRolesMutation = useMutation({
    mutationFn: async ({ newSiteRole, newCommunityRole }: { newSiteRole: string; newCommunityRole: string }) => {
      // Update site role
      if (newSiteRole !== user.site_role) {
        if (user.site_role) {
          // Delete existing role
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", user.user_id);
        }
        
        if (newSiteRole) {
          // Insert new role
          const { error: siteError } = await supabase
            .from("user_roles")
            .insert({
              user_id: user.user_id,
              role: newSiteRole as any
            });
          if (siteError) throw siteError;
        }
      }

      // Update community role
      if (newCommunityRole !== user.community_role) {
        // First, get the community profile ID
        const { data: profile, error: profileError } = await supabase
          .from("community_profiles")
          .select("id")
          .eq("user_id", user.user_id)
          .single();

        if (profileError) {
          // If no community profile exists, create one
          if (profileError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from("community_profiles")
              .insert({
                user_id: user.user_id,
                display_name: user.display_name || "Usuário",
                is_anonymous: false
              })
              .select("id")
              .single();
            
            if (createError) throw createError;
            
            // Now create the role
            if (newCommunityRole) {
              const { error: roleError } = await supabase
                .from("community_user_roles")
                .insert({
                  profile_id: newProfile.id,
                  role: newCommunityRole as any
                });
              if (roleError) throw roleError;
            }
          } else {
            throw profileError;
          }
        } else {
          // Update existing community role
          if (user.community_role) {
            // Delete existing role
            await supabase
              .from("community_user_roles")
              .delete()
              .eq("profile_id", profile.id);
          }
          
          if (newCommunityRole) {
            // Insert new role
            const { error: roleError } = await supabase
              .from("community_user_roles")
              .insert({
                profile_id: profile.id,
                role: newCommunityRole as any
              });
            if (roleError) throw roleError;
          }
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Roles atualizados",
        description: "Os privilégios do usuário foram atualizados com sucesso.",
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar roles:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar os privilégios do usuário.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateRolesMutation.mutate({
      newSiteRole: siteRole,
      newCommunityRole: communityRole
    });
  };

  const siteRoles = [
    { value: "", label: "Sem role" },
    { value: "community_member", label: "Membro Comunidade" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" }
  ];

  const communityRoles = [
    { value: "", label: "Sem role" },
    { value: "member", label: "Membro" },
    { value: "moderator", label: "Moderador" },
    { value: "admin", label: "Admin Comunidade" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Privilégios do Usuário</DialogTitle>
          <DialogDescription>
            Gerencie os roles do usuário no site e na comunidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">{user.display_name || 'Usuário Anônimo'}</p>
              <p className="text-sm text-muted-foreground font-mono">
                ID: {user.user_id.slice(0, 8)}...
              </p>
            </div>
          </div>

          {/* Current Roles */}
          <div className="space-y-2">
            <Label>Roles Atuais</Label>
            <div className="flex gap-2">
              <Badge variant="secondary">
                Site: {user.site_role || 'Sem role'}
              </Badge>
              <Badge variant="outline">
                Comunidade: {user.community_role || 'Sem role'}
              </Badge>
            </div>
          </div>

          {/* Site Role Editor */}
          <div className="space-y-2">
            <Label htmlFor="site-role">Role do Site</Label>
            <Select value={siteRole} onValueChange={setSiteRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar role do site" />
              </SelectTrigger>
              <SelectContent>
                {siteRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Community Role Editor */}
          <div className="space-y-2">
            <Label htmlFor="community-role">Role da Comunidade</Label>
            <Select value={communityRole} onValueChange={setCommunityRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar role da comunidade" />
              </SelectTrigger>
              <SelectContent>
                {communityRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning for dangerous roles */}
          {(siteRole === 'super_admin' || siteRole === 'admin') && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Atenção: Você está concedendo privilégios administrativos que dão acesso total ao sistema.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={updateRolesMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateRolesMutation.isPending}
            >
              {updateRolesMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}