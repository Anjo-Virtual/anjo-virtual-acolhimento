
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, MessageSquare, Heart, Calendar, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useNotifications } from "@/hooks/useNotifications";

const Notifications = () => {
  const { user } = useCommunityAuth();
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (!user) {
    return (
      <CommunityPageLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Você precisa estar logado para acessar as notificações.
          </p>
          <Link to="/comunidade/login">
            <Button size="lg">Fazer Login</Button>
          </Link>
        </div>
      </CommunityPageLayout>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-600" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-600" />;
      case 'message':
        return <Mail className="h-5 w-5 text-purple-600" />;
      case 'group':
        return <Users className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'reply': return 'Resposta';
      case 'like': return 'Curtida';
      case 'mention': return 'Menção';
      case 'event': return 'Evento';
      case 'message': return 'Mensagem';
      case 'group': return 'Grupo';
      default: return 'Notificação';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <CommunityPageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-8 w-8 text-primary" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600 mt-1">
                Atualizações sobre suas atividades na comunidade
                {unreadCount > 0 && (
                  <span className="ml-2 text-primary font-medium">
                    ({unreadCount} não lida{unreadCount !== 1 ? 's' : ''})
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} className="flex items-center gap-2 w-full sm:w-auto">
              <CheckCheck size={16} />
              Marcar Todas como Lidas
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando notificações...</p>
          </div>
        ) : notifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhuma notificação ainda
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Quando alguém interagir com seus posts ou você tiver atualizações importantes, 
                elas aparecerão aqui.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 max-w-lg mx-auto mb-6">
                <strong>Você receberá notificações quando:</strong>
                <ul className="mt-2 text-left list-disc list-inside space-y-1">
                  <li>Alguém responder seus posts</li>
                  <li>Seus posts receberem curtidas</li>
                  <li>Você for mencionado em comentários</li>
                  <li>Houver novos eventos na comunidade</li>
                  <li>Receber mensagens privadas</li>
                </ul>
              </div>

              <Link to="/comunidade">
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <MessageSquare size={16} />
                  Explorar Comunidade
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read ? 'border-l-4 border-l-primary bg-blue-50/50' : ''
                }`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {getNotificationTypeLabel(notification.type)}
                        </Badge>
                        {!notification.is_read && (
                          <Badge variant="default" className="text-xs">Nova</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-400">{formatDate(notification.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Configurações futuras */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Configurações de Notificação</CardTitle>
            <CardDescription>
              Em breve você poderá personalizar suas preferências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">📧 Email</h4>
                <p className="text-gray-600">Receba resumos por email</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">🔔 Push</h4>
                <p className="text-gray-600">Notificações instantâneas no navegador</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">⚙️ Filtros</h4>
                <p className="text-gray-600">Escolha quais tipos de notificação receber</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">⏰ Horários</h4>
                <p className="text-gray-600">Configure quando receber notificações</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CommunityPageLayout>
  );
};

export default Notifications;
