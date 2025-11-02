
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ImageIcon, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  created_at: string;
  category: string;
  image_url?: string | null;
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-center mb-4">
          Recursos e Inspiração
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Artigos, guias e histórias para acolher sua jornada
        </p>
        
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Buscar artigos..."
            className="pl-14 pr-6 py-6 text-lg border-2 border-input bg-background focus:border-primary rounded-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum artigo encontrado.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id}>
                <Card className="group cursor-pointer overflow-hidden h-full flex flex-col bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
                  <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] w-full">
                    {post.image_url ? (
                      <>
                        <img 
                          src={post.image_url} 
                          alt={post.title} 
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Overlay escuro permanente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Título sobreposto na imagem */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                          <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg font-playfair line-clamp-3">
                            {post.title}
                          </h3>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-purple-50">
                        <ImageIcon className="h-20 w-20 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2 flex-grow space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CardDescription className="flex items-center gap-2">
                          {new Date(post.created_at).toLocaleDateString('pt-BR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-5 px-5 mt-auto space-y-3">
                    <p className="text-gray-600 line-clamp-3 leading-relaxed text-base">{post.description}</p>
                    
                    {/* Tags coloridas */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-primary text-xs font-medium">#AnjoVirtual</span>
                      <span className="text-purple-600 text-xs font-medium">#{post.category.replace(/\s+/g, '')}</span>
                    </div>
                    
                    <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-300 pt-1">
                      Ler artigo completo 
                      <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blog;
