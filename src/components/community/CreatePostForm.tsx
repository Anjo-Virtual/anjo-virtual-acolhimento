
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "@/hooks/useCommunityProfile";

type ForumCategory = {
  id: string;
  name: string;
  slug: string;
};

interface CreatePostFormProps {
  onSuccess?: () => void;
  preselectedCategory?: string;
}

const CreatePostForm = ({ onSuccess, preselectedCategory }: CreatePostFormProps) => {
  const { user } = useAuth();
  const { profile } = useCommunityProfile();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || "");
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar categorias
  useState(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('forum_categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order');
      
      if (data) {
        setCategories(data);
        if (!preselectedCategory && data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      }
    };
    fetchCategories();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !selectedCategory) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Erro",
        description: "Perfil da comunidade não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert({
          category_id: selectedCategory,
          author_id: profile.id,
          title: title.trim(),
          content: content.trim(),
          is_published: true
        })
        .select(`
          id,
          category:forum_categories(slug)
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post criado com sucesso!",
      });

      // Limpar formulário
      setTitle("");
      setContent("");
      if (!preselectedCategory) {
        setSelectedCategory(categories[0]?.id || "");
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para criar posts.
          </p>
          <Button variant="outline">Fazer Login</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!preselectedCategory && (
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="title">Título do Post</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do seu post..."
              maxLength={200}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/200 caracteres
            </p>
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe sua experiência, dúvida ou reflexão..."
              rows={8}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Seja respeitoso e compartilhe com empatia. Sua experiência pode ajudar outros membros.
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => {
              setTitle("");
              setContent("");
            }}>
              Limpar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
