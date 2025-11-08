
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
            <div className="w-full max-w-3xl mx-auto mb-8 overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-auto object-contain max-h-96"
              />
            </div>
          ) : (
            <div className="w-full h-64 md:h-96 mb-8 flex items-center justify-center bg-gray-100 rounded-lg">
              <ImageIcon className="h-16 w-16 text-gray-300" />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl font-playfair font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <time>{new Date(post.created_at).toLocaleDateString('pt-BR')}</time>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
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
