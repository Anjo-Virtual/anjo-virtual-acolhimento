
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp, Clock, Users, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";

type ActivePost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  likes_count: number;
  replies_count: number;
  category: {
    name: string;
    color: string;
  };
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
};

const ActiveForums = () => {
  const [posts, setPosts] = useState<ActivePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'popular' | 'trending'>('trending');
  const { toast } = useToast();

  useEffect(() => {
    fetchActivePosts();
  }, [filter]);

  const fetchActivePosts = async () => {
    try {
      let query = supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          view_count,
          category:forum_categories(name, color),
          author:community_profiles!forum_posts_author_id_fkey(display_name, is_anonymous),
          forum_post_likes(count),
          forum_comments(count)
        `)
        .eq('is_published', true);

      const { data: rawData, error } = await query.limit(20);

      if (error) throw error;

      // Transform the data to include counts
      const transformedData = rawData?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
        view_count: post.view_count || 0,
        likes_count: post.forum_post_likes?.length || 0,
        replies_count: post.forum_comments?.length || 0,
        category: post.category || { name: 'Geral', color: '#3B82F6' },
        author: post.author || { display_name: 'Membro Anônimo', is_anonymous: true }
      })) || [];

      // Apply sorting based on filter
      let sortedData = [...transformedData];
      switch (filter) {
        case 'recent':
          sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'popular':
          sortedData.sort((a, b) => b.likes_count - a.likes_count);
          break;
        case 'trending':
          sortedData.sort((a, b) => b.replies_count - a.replies_count);
          break;
      }

      setPosts(sortedData);
    } catch (error) {
      console.error('Erro ao carregar posts ativos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts ativos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

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
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fóruns Ativos</h1>
                    <p className="text-gray-600 mt-1">Discussões mais ativas da comunidade</p>
                  </div>
                </div>
                
                <Link to="/comunidade/criar-post">
                  <Button className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Nova Discussão
                  </Button>
                </Link>
              </div>

              {/* Filtros */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={filter === 'trending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('trending')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp size={14} />
                  Em Alta
                </Button>
                <Button
                  variant={filter === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('recent')}
                  className="flex items-center gap-2"
                >
                  <Clock size={14} />
                  Recentes
                </Button>
                <Button
                  variant={filter === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('popular')}
                  className="flex items-center gap-2"
                >
                  <Users size={14} />
                  Populares
                </Button>
              </div>
            </div>

            {/* Lista de Posts */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Carregando discussões...</div>
                </div>
              ) : posts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma discussão encontrada
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Seja o primeiro a iniciar uma conversa na comunidade.
                    </p>
                    <Link to="/comunidade/criar-post">
                      <Button>Criar Nova Discussão</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant="secondary" 
                              style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                            >
                              {post.category.name}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              por {post.author.is_anonymous ? 'Membro Anônimo' : post.author.display_name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(post.created_at)}
                            </span>
                          </div>
                          <Link to={`/comunidade/post/${post.id}`}>
                            <CardTitle className="text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                              {post.title}
                            </CardTitle>
                          </Link>
                          <CardDescription className="line-clamp-2">
                            {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{post.view_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            <span>{post.replies_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>♥</span>
                            <span>{post.likes_count}</span>
                          </div>
                        </div>
                        
                        {post.updated_at !== post.created_at && (
                          <span className="text-xs">
                            Atualizado {formatTimeAgo(post.updated_at)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveForums;
