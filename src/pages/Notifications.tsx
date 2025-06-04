
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Users, Heart, Settings } from "lucide-react";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";

const Notifications = () => {
  // Notificações de exemplo (futuro: vir do banco de dados)
  const mockNotifications = [
    {
      id: 1,
      type: 'reply',
      title: 'Nova resposta no seu post',
      message: 'João comentou na discussão "Como lidar com a saudade"',
      time: '2 horas atrás',
      read: false,
      icon: MessageSquare
    },
    {
      id: 2,
      type: 'like',
      title: 'Seu post recebeu curtidas',
      message: '5 pessoas curtiram sua discussão sobre apoio familiar',
      time: '4 horas atrás',
      read: false,
      icon: Heart
    },
    {
      id: 3,
      type: 'group',
      title: 'Novo membro no grupo',
      message: 'Maria se juntou ao grupo "Perda de Entes Queridos"',
      time: '1 dia atrás',
      read: true,
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader isLoggedIn={true} />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Bell className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
                    <p className="text-gray-600 mt-1">Mantenha-se atualizado com as atividades da comunidade</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings size={16} />
                  Configurar
                </Button>
              </div>

              {/* Filtros */}
              <div className="flex gap-2 mb-6">
                <Button variant="default" size="sm">Todas</Button>
                <Button variant="outline" size="sm">Não lidas</Button>
                <Button variant="outline" size="sm">Menções</Button>
                <Button variant="outline" size="sm">Grupos</Button>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="space-y-3">
              {mockNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <Card 
                    key={notification.id} 
                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                      !notification.read ? 'border-l-4 border-l-primary bg-blue-50/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'reply' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'like' ? 'bg-red-100 text-red-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <IconComponent size={16} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">Nova</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sistema em desenvolvimento */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Sistema de Notificações</CardTitle>
                <CardDescription>
                  Estamos aprimorando o sistema de notificações para uma melhor experiência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <strong>Funcionalidades em desenvolvimento:</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Notificações em tempo real</li>
                    <li>Configurações personalizadas de notificação</li>
                    <li>Notificações por email (opcionais)</li>
                    <li>Agrupamento de notificações similares</li>
                    <li>Marca como lida em lote</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
