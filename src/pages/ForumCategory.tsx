
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PostList from "@/components/community/PostList";
import CreatePostForm from "@/components/community/CreatePostForm";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";

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
      console.log('[ForumCategory] Buscando categoria:', slug);
      
      // Buscar categoria no banco de dados
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (categoryData) {
        console.log('[ForumCategory] Categoria encontrada:', categoryData);
        setCategory(categoryData);
      } else {
        console.error('[ForumCategory] Categoria não encontrada:', slug);
        throw new Error('Categoria não encontrada');
      }
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
      <CommunityPageLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Você precisa estar logado para acessar os fóruns da comunidade.
          </p>
          <Link to="/comunidade/login">
            <Button size="lg">Fazer Login</Button>
          </Link>
        </div>
      </CommunityPageLayout>
    );
  }

  if (loading) {
    return (
      <CommunityPageLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando categoria...</p>
        </div>
      </CommunityPageLayout>
    );
  }

  if (!category) {
    return (
      <CommunityPageLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Categoria não encontrada
          </h1>
          <Link to="/comunidade">
            <Button variant="outline">Voltar à Comunidade</Button>
          </Link>
        </div>
      </CommunityPageLayout>
    );
  }

  return (
    <CommunityPageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header da categoria */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Link to="/comunidade">
              <Button variant="outline" size="sm">← Voltar</Button>
            </Link>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              <MessageSquare size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-500">
              Discussões da categoria
            </div>
            <Link to="/comunidade/criar-post">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus size={18} />
                Novo Post
              </Button>
            </Link>
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
    </CommunityPageLayout>
  );
};

export default ForumCategory;
