
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Folder, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Mail, 
  MessageSquare,
  Share2,
  UserCheck,
  Eye,
  TrendingUp,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminControlCenter = () => {
  // Fetch admin statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      console.log('📊 Fetching admin dashboard stats...');
      
      // Get categories count
      const { data: categories } = await supabase
        .from('forum_categories')
        .select('id, is_active');
      
      // Get posts count
      const { data: posts } = await supabase
        .from('forum_posts')
        .select('id, is_published');
      
      // Get users count
      const { data: profiles } = await supabase
        .from('community_profiles')
        .select('id');
      
      // Get recent activity (posts from last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentPosts } = await supabase
        .from('forum_posts')
        .select('id')
        .gte('created_at', sevenDaysAgo.toISOString());

      return {
        totalCategories: categories?.length || 0,
        activeCategories: categories?.filter(c => c.is_active).length || 0,
        totalPosts: posts?.length || 0,
        publishedPosts: posts?.filter(p => p.is_published).length || 0,
        totalUsers: profiles?.length || 0,
        recentActivity: recentPosts?.length || 0
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const communityManagement = [
    {
      title: "Gerenciar Categorias",
      description: "Crie, edite e organize as categorias do fórum",
      icon: Folder,
      href: "/admin/categories",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stat: stats ? `${stats.activeCategories}/${stats.totalCategories} ativas` : undefined
    },
    {
      title: "Usuários da Comunidade",
      description: "Gerenciar perfis e permissões dos usuários",
      icon: Users,
      href: "/admin/users",
      color: "text-green-600",
      bgColor: "bg-green-50",
      stat: stats ? `${stats.totalUsers} usuários` : undefined
    },
    {
      title: "Posts do Fórum",
      description: "Moderar e gerenciar posts da comunidade",
      icon: MessageSquare,
      href: "/admin/posts",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      stat: stats ? `${stats.publishedPosts} publicados` : undefined
    }
  ];

  const siteManagement = [
    {
      title: "Dashboard Geral",
      description: "Visão geral completa do sistema",
      icon: BarChart3,
      href: "/admin",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Blog",
      description: "Gerenciar posts do blog",
      icon: FileText,
      href: "/admin/blog",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Newsletter",
      description: "Gerenciar assinantes e campanhas",
      icon: Mail,
      href: "/admin/newsletter",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Configurações do Site",
      description: "Configurações gerais do sistema",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  const integrations = [
    {
      title: "Integrações",
      description: "WhatsApp, N8N e outras integrações",
      icon: Share2,
      href: "/admin/integrations",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Quick Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Centro de Controle Administrativo</h2>
        <p className="text-gray-600 mb-6">Gerencie todos os aspectos do site e da comunidade em um só lugar.</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Atividade Recente</p>
                <p className="text-xl font-semibold">{stats?.recentActivity || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Usuários</p>
                <p className="text-xl font-semibold">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Posts</p>
                <p className="text-xl font-semibold">{stats?.totalPosts || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-xl font-semibold">{stats?.totalCategories || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Community Management Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestão da Comunidade
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communityManagement.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.stat && (
                        <Badge variant="secondary" className="text-xs">
                          {item.stat}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Site Management Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Gestão do Site
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {siteManagement.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Integrations Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Integrações & APIs
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminControlCenter;
