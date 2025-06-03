
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
  Eye
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
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {showCreateForm ? 'Cancelar' : 'Criar Post'}
            </Button>
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

      {/* Create Post Form */}
      {showCreateForm && (
        <CreatePostForm onSuccess={() => setShowCreateForm(false)} />
      )}

      {/* Forum Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Fóruns Ativos
          </CardTitle>
          <CardDescription>
            Explore as discussões em andamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/comunidade/${category.slug}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        <MessageSquare size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-tight">{category.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{category.posts_count} posts</span>
                      <Badge variant="secondary" className="text-xs">
                        Ativo
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Discussões Recentes
              </CardTitle>
              <CardDescription>
                Acompanhe as conversas mais recentes da comunidade
              </CardDescription>
            </div>
            <Link to="/comunidade/todos-posts">
              <Button variant="outline" size="sm">Ver Todos</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <PostList limit={5} />
        </CardContent>
      </Card>

      {/* Community Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
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
