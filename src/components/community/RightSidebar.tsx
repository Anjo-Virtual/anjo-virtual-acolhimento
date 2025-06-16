
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, TrendingUp, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCommunityEvents } from "@/hooks/useCommunityEvents";
import { useActivePosts } from "@/hooks/useActivePosts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const RightSidebar = () => {
  const { events, loading: eventsLoading } = useCommunityEvents();
  const { posts: trendingPosts, loading: postsLoading } = useActivePosts('trending');

  const upcomingEvents = events.slice(0, 3);
  const hotPosts = trendingPosts.slice(0, 4);

  return (
    <div className="w-80 bg-gray-50 p-6 space-y-6">
      {/* Próximos Eventos */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {eventsLoading ? (
            <div className="space-y-2">
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-white rounded-lg border border-gray-100">
                  <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(event.event_date), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {event.is_online ? 'Online' : 'Presencial'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {event.current_participants}/{event.max_participants || '∞'}
                    </span>
                  </div>
                </div>
              ))}
              <Link to="/comunidade/eventos">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Ver todos os eventos
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum evento programado
            </p>
          )}
        </CardContent>
      </Card>

      {/* Publicações em Alta */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Publicações em Alta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {postsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : hotPosts.length > 0 ? (
            <>
              {hotPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/comunidade/post/${post.id}`}
                  className="block p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {post.author?.is_anonymous ? 'A' : post.author?.display_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.replies_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/comunidade/ativos">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Ver mais discussões
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhuma publicação em alta
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
