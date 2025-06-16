
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";

const Messages = () => {
  const { user } = useCommunityAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommunityHeader isLoggedIn={false} />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para acessar as mensagens.
            </p>
            <Link to="/comunidade/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader isLoggedIn={true} />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
                  <p className="text-gray-600 mt-1">Suas conversas privadas com outros membros</p>
                </div>
              </div>
            </div>

            {/* Sistema de mensagens em desenvolvimento */}
            <Card className="text-center py-12">
              <CardHeader>
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">Sistema de Mensagens</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  O sistema de mensagens privadas está em desenvolvimento. Em breve você poderá 
                  conversar diretamente com outros membros da comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <strong>Próximas funcionalidades:</strong>
                  <ul className="mt-2 text-left list-disc list-inside space-y-1">
                    <li>Mensagens privadas entre membros</li>
                    <li>Notificações em tempo real</li>
                    <li>Histórico de conversas</li>
                    <li>Compartilhamento de arquivos</li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="flex items-center gap-2" disabled>
                    <Users size={16} />
                    Iniciar Conversa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
