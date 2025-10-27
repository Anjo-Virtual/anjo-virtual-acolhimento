
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
    <section id="blog" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Blog
          </span>
          <h2 className="text-5xl font-playfair font-bold text-gray-900 mb-6">
            Recursos e Inspiração
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Artigos, guias e histórias para acolher sua jornada
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-500 text-sm">Carregando artigos...</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-16 max-w-7xl mx-auto">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="group cursor-pointer overflow-hidden h-full flex flex-col
                  bg-white border-0 shadow-lg hover:shadow-2xl 
                  transition-all duration-500 hover:-translate-y-2
                  rounded-2xl"
                onClick={() => navigateToBlogPost(post.id)}
              >
          <div className="relative overflow-hidden bg-gray-100 aspect-[16/9] w-full">
            {post.image_url ? (
              <>
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-purple-50">
                <ImageIcon className="h-20 w-20 text-primary/30" />
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
              {post.category}
            </div>
          </div>

          <CardHeader className="pb-2 flex-grow space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.created_at).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            
            <CardTitle className="text-xl font-playfair line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 pb-5 px-5 mt-auto space-y-3">
            <p className="text-gray-600 line-clamp-2 leading-relaxed text-base">
              {post.description}
            </p>
                  
                  <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-300">
                    Ler artigo completo 
                    <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button 
            onClick={navigateToBlog}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg rounded-full 
              shadow-lg hover:shadow-xl transition-all duration-300 
              hover:scale-105 inline-flex items-center gap-3 font-semibold"
          >
            Ver Todos os Artigos
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
