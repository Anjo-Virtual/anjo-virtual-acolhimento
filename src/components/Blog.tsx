
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBlogNavigation } from "@/hooks/useBlogNavigation";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  created_at: string;
  category: string;
  image_url?: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateToBlog, navigateToBlogPost } = useBlogNavigation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, description, created_at, category, image_url')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-6">
            Blog e Recursos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Artigos, guias e recursos para ajudar você em sua jornada
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToBlogPost(post.id)}>
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{post.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button 
            onClick={navigateToBlog}
            className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
          >
            Ver Todos os Artigos
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
