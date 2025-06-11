
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Plus,
  Heart,
  Eye,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";
import { supabase } from "@/integrations/supabase/client";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  posts_count: number;
  last_activity: string;
}

const CommunityDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (data) {
        // Buscar contadores para cada categoria
        const categoriesWithCounts = await Promise.all(
          data.map(async (category) => {
            const { count } = await supabase
              .from('forum_posts')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('is_published', true);

            const { data: lastPost } = await supabase
              .from('forum_posts')
              .select('created_at')
              .eq('category_id', category.id)
              .eq('is_published', true)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            return {
              ...category,
              posts_count: count || 0,
              last_activity: lastPost?.created_at || category.created_at || new Date().toISOString()
            };
          })
        );

        setCategories(categoriesWithCounts);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bem-vindo à nossa comunidade de apoio
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Um espaço seguro para compartilhar experiências, encontrar apoio e construir conexões genuínas
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Comece aqui</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="h-auto p-4 justify-start"
              variant={showCreateForm ? "secondary" : "default"}
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Criar Discussão</div>
                  <div className="text-xs opacity-80">Compartilhe seus pensamentos</div>
                </div>
              </div>
            </Button>
            <Link to="/comunidade/grupos">
              <Button variant="outline" className="h-auto p-4 justify-start w-full">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Encontrar Grupos</div>
                    <div className="text-xs opacity-60">Conecte-se com outros</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link to="/comunidade/ativos">
              <Button variant="outline" className="h-auto p-4 justify-start w-full">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Ver Discussões</div>
                    <div className="text-xs opacity-60">Participe das conversas</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Form */}
      {showCreateForm && (
        <CreatePostForm onSuccess={() => setShowCreateForm(false)} />
      )}

      {/* Forum Categories */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categorias de Discussão</CardTitle>
              <CardDescription>
                Explore os diferentes tópicos da nossa comunidade
              </CardDescription>
            </div>
            <Link to="/comunidade/ativos">
              <Button variant="outline" size="sm">
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/comunidade/${category.slug}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category.color}15`, color: category.color }}
                      >
                        <MessageSquare size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{category.posts_count} discussões</span>
                          <Badge variant="secondary" className="text-xs">
                            Ativo
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discussões Recentes</CardTitle>
              <CardDescription>
                Acompanhe as conversas mais recentes da comunidade
              </CardDescription>
            </div>
            <Link to="/comunidade/ativos">
              <Button variant="outline" size="sm">
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <PostList limit={3} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDashboard;
