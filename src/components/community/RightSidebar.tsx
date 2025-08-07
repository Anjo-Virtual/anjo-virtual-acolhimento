
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, MessageCircle, Sparkles } from "lucide-react";
import { useCommunityEvents } from "@/hooks/useCommunityEvents";
import { useChatInstance } from "@/hooks/useChatInstance";

const RightSidebar = () => {
  const { events, loading } = useCommunityEvents();
  const { openChat } = useChatInstance();

  const upcomingEvents = events
    .filter(event => new Date(event.event_date) > new Date())
    .slice(0, 3);

  return (
    <aside className="w-80 space-y-6">
      {/* CTA Anjo Virtual */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Precisa de Apoio?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Converse com nosso Anjo Virtual, uma IA especializada em oferecer suporte emocional e orientação durante o luto.
          </p>
          <Button 
            className="w-full" 
            size="sm" 
            onClick={() => {
              console.log('🎯 [RightSidebar] Botão clicado - Tentando abrir chat');
              openChat('global-persistent-chat');
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Conversar com Anjo Virtual
          </Button>
        </CardContent>
      </Card>

      {/* Próximos Eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="border-l-2 border-primary pl-3 space-y-1">
                <h4 className="font-medium text-sm line-clamp-2">{event.title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(event.event_date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{event.current_participants} participantes</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum evento programado
            </p>
          )}
          
          {upcomingEvents.length > 0 && (
            <Button variant="outline" size="sm" className="w-full mt-4">
              Ver Todos os Eventos
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas da Comunidade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comunidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Membros ativos</span>
            <Badge variant="secondary">1.2k+</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Posts esta semana</span>
            <Badge variant="secondary">89</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Grupos de apoio</span>
            <Badge variant="secondary">24</Badge>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default RightSidebar;
