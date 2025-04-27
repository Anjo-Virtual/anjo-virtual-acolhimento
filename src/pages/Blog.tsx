
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "Lidando com o Luto: Um Guia para Iniciantes",
    description: "Aprenda sobre as diferentes fases do luto e como lidar com cada uma delas de forma saudável.",
    date: "2025-04-27",
    category: "Guia"
  },
  {
    id: 2,
    title: "Como Ajudar Alguém em Luto",
    description: "Dicas práticas para apoiar amigos e familiares que estão passando pelo processo de luto.",
    date: "2025-04-26",
    category: "Dicas"
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts] = useState<BlogPost[]>(samplePosts);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-playfair font-bold text-center mb-8">Blog</h1>
      
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar artigos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link to={`/blog/${post.id}`} key={post.id}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{new Date(post.date).toLocaleDateString('pt-BR')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.description}</p>
                <div className="mt-4">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
