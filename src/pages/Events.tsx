
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityEvents } from "@/hooks/useCommunityEvents";

const Events = () => {
  const { user } = useCommunityAuth();
  const { events, loading, joinEvent } = useCommunityEvents();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommunityHeader isLoggedIn={false} />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para acessar os eventos.
            </p>
            <Link to="/comunidade/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const isEventToday = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader isLoggedIn={true} />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
                  <p className="text-gray-600 mt-1">Encontros virtuais e presenciais da comunidade</p>
                </div>
              </div>
              
              <Button className="flex items-center gap-2" disabled>
                <Plus size={16} />
                Criar Evento
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando eventos...</p>
              </div>
            ) : events.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Nenhum evento disponível
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Não há eventos programados no momento. Em breve teremos encontros incríveis para a comunidade!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {events.map((event) => (
                  <Card key={event.id} className={`${
                    isEventToday(event.event_date) ? 'border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5' :
                    isEventPast(event.event_date) ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            {isEventToday(event.event_date) && (
                              <Badge variant="default">HOJE</Badge>
                            )}
                            {isEventPast(event.event_date) && (
                              <Badge variant="secondary">FINALIZADO</Badge>
                            )}
                          </div>
                          <CardDescription className="text-base">
                            {event.description || 'Encontro da comunidade de apoio'}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">
                            {formatDate(event.event_date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Organizado por {event.organizer?.display_name || 'Comunidade'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{event.is_online ? 'Online' : event.location || 'Local a definir'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>
                            {event.current_participants} participante{event.current_participants !== 1 ? 's' : ''}
                            {event.max_participants && ` / ${event.max_participants}`}
                          </span>
                        </div>
                      </div>
                      
                      {!isEventPast(event.event_date) && (
                        <Button 
                          size="sm" 
                          onClick={() => joinEvent(event.id)}
                          disabled={event.max_participants ? event.current_participants >= event.max_participants : false}
                        >
                          {event.max_participants && event.current_participants >= event.max_participants 
                            ? 'Lotado' 
                            : 'Participar'
                          }
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Funcionalidades futuras */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Funcionalidades Futuras</CardTitle>
                <CardDescription>
                  Estamos trabalhando para melhorar sua experiência com eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">📅 Calendário</h4>
                    <p className="text-gray-600">Visualização em calendário dos eventos</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">🔔 Lembretes</h4>
                    <p className="text-gray-600">Notificações antes dos eventos</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">💬 Chat ao vivo</h4>
                    <p className="text-gray-600">Conversa durante os eventos online</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">📱 Integração</h4>
                    <p className="text-gray-600">Sincronização com calendários externos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
