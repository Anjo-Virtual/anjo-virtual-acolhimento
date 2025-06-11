import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Plus } from "lucide-react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PostList from "@/components/community/PostList";
import CreatePostForm from "@/components/community/CreatePostForm";

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
};

const ForumCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useCommunityAuth();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  const fetchCategory = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a categoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para acessar os fóruns da comunidade.
            </p>
            <Link to="/comunidade/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando categoria...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
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
                Discussões da categoria
              </div>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                {showCreateForm ? 'Cancelar' : 'Novo Post'}
              </Button>
            </div>
          </div>

          {/* Create Post Form */}
          {showCreateForm && (
            <div className="mb-8">
              <CreatePostForm 
                preselectedCategory={category.id}
                onSuccess={() => setShowCreateForm(false)} 
              />
            </div>
          )}

          {/* Lista de posts */}
          <PostList categorySlug={slug} />
        </div>
      </div>
    </div>
  );
};

export default ForumCategory;
