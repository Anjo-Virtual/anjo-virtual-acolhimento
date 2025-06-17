
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const NotificationButton = () => {
  const [hasUnread, setHasUnread] = useState(true);
  
  // Mock notifications - in real app, this would come from a hook
  const notifications = [
    {
      id: 1,
      title: "Nova resposta ao seu post",
      message: "Alguém respondeu ao seu post sobre 'Superando momentos difíceis'",
      time: "2 min atrás",
      unread: true
    },
    {
      id: 2,
      title: "Novo evento na comunidade",
      message: "Participe do encontro virtual 'Roda de Conversa' amanhã às 20h",
      time: "1 hora atrás",
      unread: true
    },
    {
      id: 3,
      title: "Mensagem privada",
      message: "Você recebeu uma nova mensagem de apoio",
      time: "3 horas atrás",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            Nenhuma notificação
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex-col items-start p-4">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary cursor-pointer">
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationButton;
