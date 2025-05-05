
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  published: boolean;
  date: string;
  category: string;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error("Erro ao alterar status do post:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleNewPost = () => {
    navigate("/admin/blog/edit");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Blog</h1>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Buscar posts..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleNewPost}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Nenhum post encontrado.
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={post.published ? "" : "opacity-70"}>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.created_at)}
                  </span>
                </div>
                <CardTitle className="mt-2 flex items-start gap-2">
                  {post.image_url && (
                    <div className="w-16 h-16 shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {!post.image_url && (
                    <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <span className="pt-1">{post.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="line-clamp-3">{post.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Button variant="outline" size="sm" onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
                  Editar
                </Button>
                <Button 
                  size="sm"
                  variant={post.published ? "default" : "secondary"}
                  onClick={() => togglePostStatus(post.id, post.published)}
                >
                  {post.published ? 'Despublicar' : 'Publicar'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
