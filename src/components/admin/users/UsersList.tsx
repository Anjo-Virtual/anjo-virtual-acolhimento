import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserRoleEditor } from "./UserRoleEditor";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  user_id: string;
  site_role: string | null;
  community_role: string | null;
  display_name: string | null;
  last_active: string | null;
  joined_at: string | null;
  site_role_assigned_at: string | null;
  community_role_assigned_at: string | null;
}

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  onRefetch: () => void;
}

export function UsersList({ users, isLoading, onRefetch }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'secondary';
      case 'moderator':
        return 'outline';
      default:
        return 'default';
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
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const getActivityStatus = (lastActive: string | null) => {
    if (!lastActive) return 'Inativo';
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays <= 7) return `${diffDays}d atrás`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}sem atrás`;
    return 'Inativo';
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowRoleEditor(true);
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
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Role do Site</TableHead>
                  <TableHead>Role da Comunidade</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {getActivityStatus(user.last_active)}
                          </span>
                          {user.last_active && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(user.last_active)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              Editar Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigator.clipboard.writeText(user.user_id)}
                            >
                              Copiar ID
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Editor Modal */}
      {selectedUser && (
        <UserRoleEditor
          user={selectedUser}
          open={showRoleEditor}
          onOpenChange={setShowRoleEditor}
          onSuccess={() => {
            onRefetch();
            setShowRoleEditor(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}