
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Heart,
  Reply,
  Pin,
  Eye,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

interface ForumPreview {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  memberCount: number;
  lastActivity: string;
  isActive: boolean;
  recentPosts: {
    id: string;
    title: string;
    author: string;
    authorInitials: string;
    timeAgo: string;
    repliesCount: number;
    likesCount: number;
    isPinned?: boolean;
  }[];
}

const mockForums: ForumPreview[] = [
  {
    id: "1",
    name: "Luto por Perda de Ente Querido",
    description: "Compartilhe suas experiências e encontre apoio após a perda de familiares",
    slug: "luto-ente-querido",
    color: "#8A6FD6",
    memberCount: 342,
    lastActivity: "5 min atrás",
    isActive: true,
    recentPosts: [
      {
        id: "1",
        title: "Como lidar com o primeiro aniversário de morte",
        author: "Maria S.",
        authorInitials: "MS",
        timeAgo: "2h",
        repliesCount: 12,
        likesCount: 8,
        isPinned: true
      },
      {
        id: "2",
        title: "Encontrando forças no dia a dia",
        author: "João P.",
        authorInitials: "JP",
        timeAgo: "4h",
        repliesCount: 6,
        likesCount: 15
      }
    ]
  },
  {
    id: "2",
    name: "Apoio para Viúvos e Viúvas",
    description: "Um espaço especial para quem perdeu o companheiro de vida",
    slug: "viuvos-viuvas",
    color: "#57B5E7",
    memberCount: 189,
    lastActivity: "15 min atrás",
    isActive: true,
    recentPosts: [
      {
        id: "3",
        title: "Reconstruindo a vida após 30 anos juntos",
        author: "Ana L.",
        authorInitials: "AL",
        timeAgo: "1h",
        repliesCount: 9,
        likesCount: 22
      }
    ]
  },
  {
    id: "3",
    name: "Luto Infantil",
    description: "Apoio para pais que perderam filhos e orientações sobre luto em crianças",
    slug: "luto-infantil",
    color: "#F9B572",
    memberCount: 156,
    lastActivity: "1h atrás",
    isActive: true,
    recentPosts: [
      {
        id: "4",
        title: "Como explicar a morte para outras crianças da família",
        author: "Roberto M.",
        authorInitials: "RM",
        timeAgo: "3h",
        repliesCount: 14,
        likesCount: 11
      }
    ]
  }
];

const CommunityDashboard = () => {
  const [selectedForum, setSelectedForum] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Comece uma nova discussão ou participe das existentes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Link to="/comunidade/criar-post">
              <Button className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Criar Post
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Encontrar Grupos
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Histórias de Esperança
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Forums */}
      <div className="grid lg:grid-cols-2 gap-6">
        {mockForums.map((forum) => (
          <Card 
            key={forum.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedForum === forum.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedForum(selectedForum === forum.id ? null : forum.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${forum.color}20`, color: forum.color }}
                  >
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{forum.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        {forum.memberCount} membros
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {forum.lastActivity}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={forum.isActive ? "default" : "secondary"}>
                  {forum.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{forum.description}</p>
              
              {/* Recent Posts Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Discussões Recentes</span>
                  <Link 
                    to={`/comunidade/${forum.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Ver todas
                  </Link>
                </div>
                
                {forum.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{post.authorInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <Pin className="h-3 w-3 text-primary" />
                        )}
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>por {post.author}</span>
                        <span>{post.timeAgo}</span>
                        <div className="flex items-center gap-1">
                          <Reply className="h-3 w-3" />
                          {post.repliesCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likesCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link to={`/comunidade/${forum.slug}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Participar das Discussões
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recursos da Comunidade
          </CardTitle>
          <CardDescription>
            Ferramentas e conteúdos para apoiar sua jornada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Fóruns Temáticos</h4>
              <p className="text-xs text-gray-600">Discussões organizadas por temas</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Grupos Privados</h4>
              <p className="text-xs text-gray-600">Espaços mais íntimos de apoio</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Heart className="h-8 w-8 text-tertiary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Histórias de Esperança</h4>
              <p className="text-xs text-gray-600">Relatos inspiradores de superação</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Apoio Profissional</h4>
              <p className="text-xs text-gray-600">Orientação de especialistas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDashboard;
