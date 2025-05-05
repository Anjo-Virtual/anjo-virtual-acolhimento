
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface BlogPost {
  id?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  published: boolean;
}

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    title: "",
    description: "",
    content: "",
    category: "",
    published: false
  });

  // Load post data if editing
  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const loadPost = async (postId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      
      if (data) {
        setPost({
          id: data.id,
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category,
          published: data.published
        });
      }
    } catch (error) {
      console.error("Erro ao carregar post:", error);
      toast({
        title: "Erro ao carregar post",
        description: "Não foi possível carregar os dados do post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setPost(prev => ({ ...prev, published: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const postData = {
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category,
        published: post.published,
        author_id: user.id,
      };

      let result;
      
      if (isEdit) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
      } else {
        // Insert new post
        result = await supabase
          .from('blog_posts')
          .insert(postData);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Post atualizado" : "Post criado",
        description: isEdit 
          ? "O post foi atualizado com sucesso." 
          : "O post foi criado com sucesso.",
      });

      navigate("/admin/blog");
    } catch (error: any) {
      console.error("Erro ao salvar post:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o post.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? "Editar Post" : "Novo Post"}</h1>
        <Button variant="outline" onClick={() => navigate("/admin/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdit ? "Editar Publicação" : "Nova Publicação"}</CardTitle>
            <CardDescription>
              {isEdit 
                ? "Atualize as informações da sua publicação" 
                : "Preencha as informações para criar uma nova publicação"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                placeholder="Digite o título do post"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={post.description}
                onChange={handleChange}
                placeholder="Uma breve descrição do conteúdo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                name="category"
                value={post.category}
                onChange={handleChange}
                placeholder="Ex: Dicas, Guia, Notícias"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleChange}
                placeholder="Escreva o conteúdo completo do post"
                className="min-h-[300px]"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="published" 
                checked={post.published}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="published">Publicar imediatamente</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blog")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Atualizar" : "Salvar"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BlogEdit;
