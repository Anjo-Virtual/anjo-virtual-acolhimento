
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  created_at: string;
  category: string;
  content: string;
  image_url?: string | null;
}

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .eq('published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw error;
        }
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error("Erro ao buscar post:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-24 flex justify-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Voltar para o blog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o blog
        </Link>
        
        <article className="max-w-4xl mx-auto">
          {post.image_url ? (
            <div className="relative w-full max-w-3xl mx-auto mb-8 overflow-hidden rounded-2xl bg-gray-100 aspect-[16/9]">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-64 md:h-96 mb-8 flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-purple-50 rounded-2xl">
              <ImageIcon className="h-16 w-16 text-primary/30" />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 flex-wrap">
              <time className="text-sm">{new Date(post.created_at).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</time>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {/* Tags coloridas */}
              <span className="text-primary text-sm font-medium">#AnjoVirtual</span>
              <span className="text-purple-600 text-sm font-medium">#{post.category.replace(/\s+/g, '')}</span>
            </div>
          </header>

          <div className="prose prose-gray max-w-none">
            {post.content?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;
