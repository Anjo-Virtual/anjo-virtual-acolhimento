import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  content?: string;
}

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "Lidando com o Luto: Um Guia para Iniciantes",
    description: "Aprenda sobre as diferentes fases do luto e como lidar com cada uma delas de forma saudável.",
    date: "2025-04-27",
    category: "Guia",
    content: "O luto é uma jornada única e pessoal que todos nós enfrentamos em algum momento da vida. Neste guia, vamos explorar as diferentes fases do luto e como navegar por cada uma delas de forma saudável.\n\nAs fases do luto incluem negação, raiva, barganha, depressão e aceitação. É importante lembrar que estas fases não são lineares e cada pessoa as experimenta de forma diferente.\n\nDicas para lidar com o luto:\n\n1. Permita-se sentir suas emoções\n2. Busque apoio de amigos e familiares\n3. Considere participar de grupos de apoio\n4. Mantenha uma rotina saudável\n5. Procure ajuda profissional se necessário"
  },
  {
    id: 2,
    title: "Como Ajudar Alguém em Luto",
    description: "Dicas práticas para apoiar amigos e familiares que estão passando pelo processo de luto.",
    date: "2025-04-26",
    category: "Dicas",
    content: "Apoiar alguém que está passando pelo luto pode ser desafiador. Muitas vezes, nos sentimos inseguros sobre o que dizer ou fazer. Aqui estão algumas maneiras de oferecer suporte genuíno.\n\nDicas importantes:\n\n1. Escute mais do que fale\n2. Evite tentar 'consertar' a situação\n3. Ofereça ajuda prática\n4. Respeite o tempo e o espaço da pessoa\n5. Mantenha contato regular\n\nLembre-se que sua presença constante e apoio silencioso podem ser mais valiosos do que palavras."
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = samplePosts.find(p => p.id === Number(id));

  if (!post) {
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
        
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-playfair font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <time>{new Date(post.date).toLocaleDateString('pt-BR')}</time>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
          </header>

          <div className="prose prose-gray max-w-none">
            {post.content?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;
