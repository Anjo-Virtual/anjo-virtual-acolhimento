
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MessageSquare, Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useSavedPosts } from "@/hooks/useSavedPosts";

const SavedPosts = () => {
  const { user } = useCommunityAuth();
  const { savedPosts, loading, removeSavedPost } = useSavedPosts();

  if (!user) {
    return (
      <CommunityPageLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Você precisa estar logado para acessar os posts salvos.
          </p>
          <Link to="/comunidade/login">
            <Button size="lg">Fazer Login</Button>
          </Link>
        </div>
      </CommunityPageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <CommunityPageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Posts Salvos</h1>
              <p className="text-gray-600 mt-1">Discussões e conteúdos que você salvou para ler depois</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando posts salvos...</p>
          </div>
        ) : savedPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhum post salvo ainda
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Quando você encontrar discussões interessantes, clique no ícone de bookmark 
                para salvá-las aqui e ler mais tarde.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 max-w-lg mx-auto mb-6">
                <strong>Como salvar posts:</strong>
                <ul className="mt-2 text-left list-disc list-inside space-y-1">
                  <li>Navegue pelos fóruns da comunidade</li>
                  <li>Clique no ícone <Bookmark className="inline h-4 w-4" /> ao lado do post</li>
                  <li>Acesse seus posts salvos aqui a qualquer momento</li>
                  <li>Organize por categorias (em breve)</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/comunidade">
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <MessageSquare size={16} />
                    Explorar Fóruns
                  </Button>
                </Link>
                <Link to="/comunidade/ativos">
                  <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                    <Heart size={16} />
                    Ver Posts Populares
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((savedPost) => (
              <Card key={savedPost.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <CardTitle className="text-lg line-clamp-2">
                          {savedPost.post?.title || 'Post sem título'}
                        </CardTitle>
                        {savedPost.post?.category && (
                          <Badge 
                            variant="secondary" 
                            style={{ backgroundColor: `${savedPost.post.category.color}20`, color: savedPost.post.category.color }}
                          >
                            {savedPost.post.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        Por {savedPost.post?.author?.display_name || 'Usuário'} • {' '}
                        Criado em {savedPost.post?.created_at ? formatDate(savedPost.post.created_at) : 'Data não disponível'} • {' '}
                        Salvo em {formatDate(savedPost.saved_at)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSavedPost(savedPost.id)}
                      className="text-gray-500 hover:text-red-600 flex-shrink-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    {savedPost.post?.content ? truncateContent(savedPost.post.content) : 'Conteúdo não disponível'}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                      <Link to={`/comunidade/post/${savedPost.post_id}`}>
                        Ler Post Completo
                      </Link>
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Bookmark size={14} className="text-primary" />
                      <span>Salvo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Funcionalidade futura */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Futuras</CardTitle>
            <CardDescription>
              Estamos trabalhando para melhorar sua experiência de leitura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">📚 Coleções</h4>
                <p className="text-gray-600">Organize seus posts em coleções temáticas</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">🏷️ Tags</h4>
                <p className="text-gray-600">Adicione tags personalizadas aos seus salvos</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">📝 Notas</h4>
                <p className="text-gray-600">Adicione anotações pessoais aos posts</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">🔔 Atualizações</h4>
                <p className="text-gray-600">Receba notificações de novos comentários</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CommunityPageLayout>
  );
};

export default SavedPosts;
