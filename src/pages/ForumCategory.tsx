
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Clock, User, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ForumPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  is_pinned: boolean;
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
  _count: {
    comments: number;
  };
};

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
};

const ForumCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchCategoryAndPosts();
    }
  }, [slug]);

  const fetchCategoryAndPosts = async () => {
    try {
      // Buscar categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Buscar posts da categoria
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          is_pinned,
          author:community_profiles(display_name, is_anonymous)
        `)
        .eq('category_id', categoryData.id)
        .eq('is_published', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Para cada post, contar comentários
      const postsWithComments = await Promise.all(
        (postsData || []).map(async (post) => {
          const { count } = await supabase
            .from('forum_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('is_published', true);

          return {
            ...post,
            _count: { comments: count || 0 }
          };
        })
      );

      setPosts(postsWithComments);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts da categoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para acessar os fóruns da comunidade.
            </p>
            <Link to="/admin/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Categoria não encontrada
            </h1>
            <Link to="/comunidade">
              <Button variant="outline">Voltar à Comunidade</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header da categoria */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/comunidade">
                <Button variant="outline" size="sm">← Voltar</Button>
              </Link>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <MessageSquare size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </div>
              <Link to={`/comunidade/${category.slug}/novo-post`}>
                <Button className="flex items-center gap-2">
                  <Plus size={18} />
                  Novo Post
                </Button>
              </Link>
            </div>
          </div>

          {/* Lista de posts */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum post ainda
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Seja o primeiro a compartilhar nesta categoria.
                  </p>
                  <Link to={`/comunidade/${category.slug}/novo-post`}>
                    <Button>Criar Primeiro Post</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.is_pinned && (
                            <Badge variant="secondary" className="text-xs">
                              Fixado
                            </Badge>
                          )}
                          <Link 
                            to={`/comunidade/${category.slug}/post/${post.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {post.author?.is_anonymous ? 'Membro Anônimo' : post.author?.display_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDistanceToNow(new Date(post.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {post._count.comments} {post._count.comments === 1 ? 'resposta' : 'respostas'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.view_count} {post.view_count === 1 ? 'visualização' : 'visualizações'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCategory;
