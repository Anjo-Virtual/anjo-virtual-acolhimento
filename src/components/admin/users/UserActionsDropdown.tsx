import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, UserX, UserCheck, Ban, Copy, Bell, Eye, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  user_id: string;
  status: string;
  display_name: string | null;
}

interface UserActionsDropdownProps {
  user: User;
  onRefetch: () => void;
}

export function UserActionsDropdown({ user, onRefetch }: UserActionsDropdownProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'ban' | null>(null);
  const { toast } = useToast();

  const statusMutation = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('community_profiles')
        .update({ status: newStatus })
        .eq('user_id', userId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions_log')
        .insert({
          admin_user_id: (await supabase.auth.getUser()).data.user?.id,
          target_user_id: userId,
          action: `user_${newStatus}`,
          details: { previous_status: user.status, new_status: newStatus }
        });
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do usuário foi alterado com sucesso.",
      });
      onRefetch();
      setShowConfirmDialog(false);
      setActionType(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do usuário.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleStatusChange = (newStatus: 'active' | 'suspended' | 'banned') => {
    setActionType(newStatus === 'active' ? 'activate' : newStatus === 'suspended' ? 'suspend' : 'ban');
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (actionType === 'activate') {
      statusMutation.mutate({ userId: user.user_id, newStatus: 'active' });
    } else if (actionType === 'suspend') {
      statusMutation.mutate({ userId: user.user_id, newStatus: 'suspended' });
    } else if (actionType === 'ban') {
      statusMutation.mutate({ userId: user.user_id, newStatus: 'banned' });
    }
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user.user_id);
    toast({
      title: "ID copiado",
      description: "ID do usuário copiado para a área de transferência.",
    });
  };

  const getActionText = () => {
    switch (actionType) {
      case 'activate': return 'reativar';
      case 'suspend': return 'suspender';
      case 'ban': return 'banir';
      default: return '';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Abrir menu de ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Gestão de Conta
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={copyUserId}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar ID do Usuário
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Enviar Notificação
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Ações Administrativas
          </DropdownMenuLabel>
          {user.status !== 'active' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('active')}
              className="text-green-600 dark:text-green-400"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Reativar Usuário
            </DropdownMenuItem>
          )}
          {user.status === 'active' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('suspended')}
              className="text-amber-600 dark:text-amber-400"
            >
              <UserX className="mr-2 h-4 w-4" />
              Suspender Usuário
            </DropdownMenuItem>
          )}
          {user.status !== 'banned' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('banned')}
              className="text-destructive focus:text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Banir Usuário
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {getActionText()} o usuário "{user.display_name || user.user_id}"?
              {actionType === 'ban' && " Esta ação é irreversível."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === 'ban' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {actionType === 'activate' ? 'Reativar' : 
               actionType === 'suspend' ? 'Suspender' : 'Banir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}