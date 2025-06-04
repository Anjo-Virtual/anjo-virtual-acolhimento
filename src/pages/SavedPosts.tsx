
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageSquare, Heart } from "lucide-react";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";

const SavedPosts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader isLoggedIn={true} />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Bookmark className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Posts Salvos</h1>
                  <p className="text-gray-600 mt-1">Discussões e conteúdos que você salvou para ler depois</p>
                </div>
              </div>
            </div>

            {/* Estado vazio */}
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

                <div className="flex gap-3 justify-center">
                  <Button className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Explorar Fóruns
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Heart size={16} />
                    Ver Posts Populares
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Funcionalidade futura */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Funcionalidades Futuras</CardTitle>
                <CardDescription>
                  Estamos trabalhando para melhorar sua experiência de leitura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
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
        </main>
      </div>
    </div>
  );
};

export default SavedPosts;
