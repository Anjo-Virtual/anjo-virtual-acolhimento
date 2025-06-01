
import { Users, Star, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CommunityHeaderProps {
  totalMembers?: number;
  activeToday?: number;
  totalPosts?: number;
  isLoggedIn?: boolean;
}

const CommunityHeader = ({ 
  totalMembers = 1247, 
  activeToday = 89, 
  totalPosts = 3421,
  isLoggedIn = false 
}: CommunityHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 border-b">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comunidade Anjo Virtual
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Um espaço seguro e acolhedor para compartilhar experiências e encontrar apoio em sua jornada
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="text-center border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Membros</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{activeToday}</div>
              <div className="text-sm text-gray-600">Ativos hoje</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="h-6 w-6 text-tertiary" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalPosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Discussões</div>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.9</div>
              <div className="text-sm text-gray-600">Avaliação</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
