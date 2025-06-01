
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Shield, Heart, Calendar, BookOpen, UserPlus, Lightbulb, LogIn, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
};

const Community = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias do fórum.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'user-plus': UserPlus,
      'heart': Heart,
      'baby': Users,
      'users': Users,
      'user-heart': Heart,
      'lightbulb': Lightbulb,
      'calendar': Calendar,
      'book-open': BookOpen,
    };
    
    const IconComponent = icons[iconName] || MessageSquare;
    return <IconComponent size={24} />;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Comunidade Caminhos de Superação
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Um espaço seguro e acolhedor para compartilhar experiências e encontrar apoio em sua jornada de superação do luto.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Ambiente Seguro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Moderação especializada e políticas rígidas de privacidade para garantir um espaço seguro.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Apoio Mútuo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Conecte-se com pessoas que passaram por experiências similares e encontre compreensão.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Grupos Especializados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Participe de grupos focados em diferentes tipos de luto e estágios de superação.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seção de Acesso/Cadastro */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <LogIn className="w-16 h-16 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-4">Acesse ou Cadastre-se na Comunidade</CardTitle>
                  <CardDescription className="text-lg">
                    Para participar dos fóruns e acessar todos os recursos da comunidade, você precisa criar uma conta ou fazer login.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-white">
                      <UserPlus className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Novo por aqui?</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Crie sua conta e junte-se à nossa comunidade de apoio
                      </p>
                      <Link to="/admin/login">
                        <Button size="lg" className="w-full">
                          Criar Conta
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg bg-white">
                      <UserCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Já é membro?</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Faça login para acessar os fóruns e grupos
                      </p>
                      <Link to="/admin/login">
                        <Button variant="outline" size="lg" className="w-full">
                          Fazer Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Sua privacidade é nossa prioridade. Você pode usar pseudônimos e manter o anonimato.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Preview das categorias */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Fóruns Disponíveis</CardTitle>
                  <CardDescription>
                    Veja os tópicos que você poderá acessar após o cadastro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.slice(0, 8).map((category) => (
                      <div key={category.id} className="text-center p-3 border rounded-lg bg-gray-50">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {getIconComponent(category.icon)}
                        </div>
                        <h4 className="text-sm font-medium">{category.name}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bem-vindo à Comunidade
            </h1>
            <p className="text-xl text-gray-600">
              Explore os fóruns temáticos e encontre o apoio que você precisa
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando fóruns...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/comunidade/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {getIconComponent(category.icon)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          Ativo
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Clique para participar
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Recursos da Comunidade</CardTitle>
                <CardDescription>
                  Ferramentas e funcionalidades disponíveis para todos os membros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Fóruns Temáticos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Grupos Privados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Moderação 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span>Apoio Profissional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
