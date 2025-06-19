import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Mail, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { usePrivateMessages } from "@/hooks/usePrivateMessages";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Messages = () => {
  const { user } = useCommunityAuth();
  const { messages, loading, sendMessage, markAsRead } = usePrivateMessages();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [showNewMessage, setShowNewMessage] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommunityHeader />
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

  const handleSendMessage = async () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) return;

    const success = await sendMessage(newMessage.recipient, newMessage.subject, newMessage.content);
    if (success) {
      setNewMessage({ recipient: '', subject: '', content: '' });
      setShowNewMessage(false);
    }
  };

  const handleMessageClick = (messageId: string, isRead: boolean) => {
    setSelectedMessage(messageId);
    if (!isRead) {
      markAsRead(messageId);
    }
  };

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
                  <p className="text-gray-600 mt-1">Suas conversas privadas com outros membros</p>
                </div>
              </div>
              
              <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Nova Mensagem
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova Mensagem</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipient">Destinatário (ID do perfil)</Label>
                      <Input
                        id="recipient"
                        value={newMessage.recipient}
                        onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                        placeholder="ID do perfil do destinatário"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Assunto</Label>
                      <Input
                        id="subject"
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                        placeholder="Assunto da mensagem"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Mensagem</Label>
                      <Textarea
                        id="content"
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                        placeholder="Digite sua mensagem..."
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSendMessage} className="flex items-center gap-2">
                        <Send size={16} />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de mensagens */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Caixa de Entrada</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Carregando...</div>
                    ) : messages.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma mensagem ainda</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                              selectedMessage === message.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleMessageClick(message.id, message.is_read)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm truncate">
                                    {message.sender?.display_name || 'Usuário'}
                                  </p>
                                  {!message.is_read && (
                                    <Badge variant="default" className="text-xs">Nova</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                                <p className="text-xs text-gray-400">
                                  {new Date(message.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Visualização da mensagem */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  {selectedMessageData ? (
                    <>
                      <CardHeader>
                        <CardTitle>{selectedMessageData.subject}</CardTitle>
                        <CardDescription>
                          De: {selectedMessageData.sender?.display_name || 'Usuário'} • {' '}
                          {new Date(selectedMessageData.created_at).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-wrap">{selectedMessageData.content}</p>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                        <p>Selecione uma mensagem para visualizar</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
