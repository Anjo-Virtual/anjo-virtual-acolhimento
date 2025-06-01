
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Shield, Heart, LogIn, UserCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunityDashboard from "@/components/community/CommunityDashboard";

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

  // Non-authenticated view
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <CommunityHeader isLoggedIn={false} />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">Ambiente Seguro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Moderação especializada e políticas rígidas de privacidade para garantir um espaço seguro e acolhedor.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <MessageSquare className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <CardTitle className="text-xl">Apoio Mútuo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Conecte-se com pessoas que passaram por experiências similares e encontre compreensão genuína.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <Users className="w-16 h-16 text-tertiary mx-auto mb-4" />
                  <CardTitle className="text-xl">Grupos Especializados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Participe de grupos focados em diferentes tipos de luto e estágios de superação.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-primary/20 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <LogIn className="w-20 h-20 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-4">Junte-se à Nossa Comunidade</CardTitle>
                <CardDescription className="text-lg max-w-2xl mx-auto">
                  Para participar dos fóruns e acessar todos os recursos da comunidade, você precisa criar uma conta ou fazer login. É rápido, seguro e completamente gratuito.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card className="text-center border-2 border-primary/20 bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-3">Novo por aqui?</h3>
                      <p className="text-gray-600 mb-6">
                        Crie sua conta gratuita e junte-se à nossa comunidade de apoio e compreensão.
                      </p>
                      <Link to="/admin/login">
                        <Button size="lg" className="w-full text-lg py-3">
                          Criar Conta Gratuita
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center border-2 border-secondary/20 bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <UserCheck className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-3">Já é membro?</h3>
                      <p className="text-gray-600 mb-6">
                        Faça login para acessar os fóruns, grupos e todos os recursos da comunidade.
                      </p>
                      <Link to="/admin/login">
                        <Button variant="outline" size="lg" className="w-full text-lg py-3 border-2">
                          Fazer Login
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center bg-white/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Sua privacidade é nossa prioridade. Você pode usar pseudônimos e manter o anonimato.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="mt-12">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Fóruns Disponíveis</CardTitle>
                <CardDescription className="text-lg">
                  Veja os tópicos que você poderá acessar após o cadastro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.slice(0, 8).map((category) => (
                    <div key={category.id} className="text-center p-4 border-2 rounded-lg bg-gradient-to-b from-gray-50 to-white hover:shadow-md transition-all cursor-pointer group">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        <MessageSquare size={24} />
                      </div>
                      <h4 className="font-semibold mb-1">{category.name}</h4>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated view - New Circle-inspired layout
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader isLoggedIn={true} />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <CommunityDashboard />
        </main>
      </div>
    </div>
  );
};

export default Community;
