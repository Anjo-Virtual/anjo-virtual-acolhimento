import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  user_id: string;
  display_name: string;
  email?: string;
  status?: string;
  site_role?: string;
  community_role?: string;
  last_active?: string;
  joined_at?: string;
  phone?: string;
  bio?: string;
  site_role_assigned_at?: string;
  community_role_assigned_at?: string;
}

interface UserDetailsModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não disponível";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Suspenso</Badge>;
      case 'banned':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Banido</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getRoleBadge = (role?: string, type: 'site' | 'community' = 'site') => {
    if (!role) return <Badge variant="outline" className="text-muted-foreground">Sem role</Badge>;
    
    const colorClass = type === 'site' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200";
    const roleLabels = {
      site: {
        'community_member': 'Membro Comunidade',
        'admin': 'Admin',
        'super_admin': 'Super Admin'
      },
      community: {
        'member': 'Membro',
        'moderator': 'Moderador',
        'admin': 'Admin Comunidade'
      }
    };
    
    const label = roleLabels[type][role as keyof typeof roleLabels[typeof type]] || role;
    return <Badge variant="outline" className={colorClass}>{label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Usuário
            {getStatusBadge(user.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-sm">{user.display_name || "Nome não definido"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email || "Não disponível"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-sm">{user.phone || "Não disponível"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID do Usuário</p>
                  <p className="text-sm font-mono text-xs break-all">{user.user_id}</p>
                </div>
              </div>
              
              {user.bio && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-sm">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roles e Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Roles e Permissões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Role do Site</p>
                  {getRoleBadge(user.site_role, 'site')}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Role da Comunidade</p>
                  {getRoleBadge(user.community_role, 'community')}
                </div>
              </div>
              {(user.site_role_assigned_at || user.community_role_assigned_at) && (
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    {user.site_role_assigned_at && `Atribuído: ${formatDate(user.site_role_assigned_at)}`}
                  </div>
                  <div>
                    {user.community_role_assigned_at && `Atribuído: ${formatDate(user.community_role_assigned_at)}`}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações de Atividade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                  <p className="text-sm">{formatDate(user.joined_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última atividade</p>
                  <p className="text-sm">{formatDate(user.last_active)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}