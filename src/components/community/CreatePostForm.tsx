
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useCommunityCategories } from "@/hooks/useCommunityCategories";

interface CreatePostFormProps {
  preselectedCategory?: string;
  onSuccess?: () => void;
}

const CreatePostForm = ({ preselectedCategory, onSuccess }: CreatePostFormProps) => {
  const { user } = useCommunityAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || "");
  const { categories, loading: loadingCategories, error: categoriesError } = useCommunityCategories();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;

      // Criar post
      const { data: post, error: postError } = await supabase
        .from('forum_posts')
        .insert({
          category_id: selectedCategory,
          author_id: profile.id,
          title: title.trim(),
          content: content.trim(),
          is_published: true
        })
        .select()
        .single();

      if (postError) throw postError;

      toast({
        title: "Sucesso",
        description: "Post criado com sucesso!",
      });

      setTitle("");
      setContent("");
      setSelectedCategory("");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={loadingCategories}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={loadingCategories ? "Carregando categorias..." : "Selecione uma categoria"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoriesError && (
              <p className="text-xs text-red-500 mt-1">Erro ao carregar categorias.</p>
            )}
          </div>

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
            <Button type="submit" disabled={loading || !selectedCategory}>
              {loading ? 'Publicando...' : 'Publicar Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
