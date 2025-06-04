
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, MapPin } from "lucide-react";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";

const Events = () => {
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
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
                    <p className="text-gray-600 mt-1">Encontros virtuais e presenciais da comunidade</p>
                  </div>
                </div>
                
                <Button className="flex items-center gap-2" disabled>
                  <Calendar size={16} />
                  Criar Evento
                </Button>
              </div>
            </div>

            {/* Preview de eventos futuros */}
            <div className="grid gap-6 mb-8">
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">Círculo de Apoio Virtual</CardTitle>
                      <CardDescription className="text-base">
                        Encontro semanal para compartilhar experiências e apoio mútuo
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">PRÓXIMO</div>
                      <div className="text-xs text-gray-500">Toda Quinta</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>19:00 - 20:30</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>Online (Zoom)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>12 participantes</span>
                    </div>
                  </div>
                  <Button size="sm" disabled>Participar</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workshop: Lidando com Datas Especiais</CardTitle>
                  <CardDescription>
                    Como enfrentar aniversários, feriados e outras datas significativas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>15 de Junho</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>Online</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" disabled>Em Breve</Button>
                </CardContent>
              </Card>
            </div>

            {/* Sistema em desenvolvimento */}
            <Card className="text-center py-8">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sistema de Eventos em Desenvolvimento
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Estamos preparando um sistema completo de eventos para a comunidade. 
                  Em breve você poderá participar e criar seus próprios encontros.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 max-w-lg mx-auto">
                  <strong>Funcionalidades planejadas:</strong>
                  <ul className="mt-2 text-left list-disc list-inside space-y-1">
                    <li>Eventos virtuais e presenciais</li>
                    <li>Inscrições e confirmações</li>
                    <li>Lembretes automáticos</li>
                    <li>Salas de grupo privadas</li>
                    <li>Gravações de sessões</li>
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

export default Events;
