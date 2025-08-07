import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface User {
  user_id: string;
  display_name: string;
}

interface SendNotificationModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendNotificationModal({ user, open, onOpenChange }: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const { toast } = useToast();

  const sendNotificationMutation = useMutation({
    mutationFn: async ({ userId, title, message, type }: { 
      userId: string; 
      title: string; 
      message: string; 
      type: string; 
    }) => {
      // Primeiro, encontrar o profile_id do usuário na community_profiles
      const { data: profile, error: profileError } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (profileError || !profile) {
        throw new Error('Usuário não encontrado na comunidade');
      }

      // Inserir a notificação
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type,
          title,
          message,
          is_read: false
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notificação enviada",
        description: `Notificação enviada com sucesso para ${user?.display_name}`,
      });
      setTitle("");
      setMessage("");
      setType("info");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Erro ao enviar notificação:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar notificação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!user || !title.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e mensagem são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    sendNotificationMutation.mutate({
      userId: user.user_id,
      title: title.trim(),
      message: message.trim(),
      type
    });
  };

  const notificationTypes = [
    { value: "info", label: "Informação" },
    { value: "warning", label: "Aviso" },
    { value: "success", label: "Sucesso" },
    { value: "error", label: "Erro" }
  ];

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Notificação</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enviando para: <span className="font-medium">{user.display_name}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notification-type">Tipo de Notificação</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((notificationType) => (
                  <SelectItem key={notificationType.value} value={notificationType.value}>
                    {notificationType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notification-title">Título *</Label>
            <Input
              id="notification-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da notificação"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="notification-message">Mensagem *</Label>
            <Textarea
              id="notification-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem da notificação"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={sendNotificationMutation.isPending}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSend}
            disabled={sendNotificationMutation.isPending || !title.trim() || !message.trim()}
          >
            {sendNotificationMutation.isPending ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}