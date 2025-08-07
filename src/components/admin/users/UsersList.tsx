import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserRoleEditor } from "./UserRoleEditor";
import { UserActionsDropdown } from "./UserActionsDropdown";
import { AddUserModal } from "./AddUserModal";

interface User {
  user_id: string;
  site_role: string | null;
  site_role_assigned_at: string | null;
  community_role: string | null;
  community_role_assigned_at: string | null;
  display_name: string | null;
  last_active: string | null;
  joined_at: string | null;
  status: string;
}

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  onRefetch: () => void;
}

export function UsersList({ users, isLoading, onRefetch }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleEditorOpen, setRoleEditorOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const { toast } = useToast();

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'super_admin': return 'destructive' as const;
      case 'admin': return 'secondary' as const;
      case 'moderator': return 'outline' as const;
      default: return 'default' as const;
    }
  };

  const getRoleLabel = (role: string | null) => {
    const roleLabels: { [key: string]: string } = {
      'super_admin': 'Super Admin',
      'admin': 'Admin', 
      'moderator': 'Moderador',
      'member': 'Membro',
      'community_member': 'Membro Comunidade'
    };
    return role ? roleLabels[role] || role : 'Sem role';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const getActivityStatus = (lastActive: string | null) => {
    if (!lastActive) return { status: "Nunca ativo", variant: "secondary" as const };
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return { status: "Hoje", variant: "default" as const };
    if (diffInDays === 1) return { status: "Ontem", variant: "default" as const };
    if (diffInDays <= 7) return { status: `${diffInDays} dias atrás`, variant: "default" as const };
    if (diffInDays <= 30) return { status: `${Math.floor(diffInDays / 7)} semanas atrás`, variant: "secondary" as const };
    return { status: "Há muito tempo", variant: "secondary" as const };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Ativo', variant: 'default' as const };
      case 'suspended': return { label: 'Suspenso', variant: 'secondary' as const };
      case 'banned': return { label: 'Banido', variant: 'destructive' as const };
      default: return { label: 'Ativo', variant: 'default' as const };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie usuários e suas permissões
              </CardDescription>
            </div>
            <Button onClick={() => setAddUserModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/ID</TableHead>
                  <TableHead>Role Site</TableHead>
                  <TableHead>Role Comunidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.display_name || 'Usuário Anônimo'}
                          </span>
                          <span className="text-sm text-muted-foreground font-mono">
                            {user.user_id.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.site_role)}>
                          {getRoleLabel(user.site_role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.community_role)}>
                          {getRoleLabel(user.community_role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(user.status).variant}>
                          {getStatusBadge(user.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActivityStatus(user.last_active).variant}>
                          {getActivityStatus(user.last_active).status}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setRoleEditorOpen(true);
                            }}
                            className="h-8"
                          >
                            Editar Roles
                          </Button>
                          <UserActionsDropdown user={user} onRefetch={onRefetch} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserRoleEditor
          user={selectedUser}
          open={roleEditorOpen}
          onOpenChange={setRoleEditorOpen}
          onSuccess={() => {
            onRefetch();
            setRoleEditorOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
      
      <AddUserModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        onSuccess={onRefetch}
      />
    </>
  );
}