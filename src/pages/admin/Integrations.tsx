
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Share2, BarChart } from "lucide-react";
import N8nWebhookConfigModal from "@/components/modals/N8nWebhookConfigModal";
import WhatsAppConfigModal from "@/components/modals/WhatsAppConfigModal";
import { ChatAdmin } from "@/components/chat/ChatAdmin";
import { DocumentManager } from "@/components/admin/integrations/DocumentManager";
import { PromptManager } from "@/components/admin/integrations/PromptManager";
import { ChatMetrics } from "@/components/admin/integrations/ChatMetrics";

const Integrations = () => {
  const [isWhatsAppConfigModalOpen, setIsWhatsAppConfigModalOpen] = useState(false);
  const [isN8nWebhookConfigModalOpen, setIsN8nWebhookConfigModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Integrações</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Gerencie as integrações do sistema com serviços externos e configure o chat com IA
        </p>
      </div>
      
      <Tabs defaultValue="chat-ai" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-[320px]">
            <TabsTrigger value="chat-ai" className="text-xs sm:text-sm">
              Chat AI & RAG
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="text-xs sm:text-sm">
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs sm:text-sm">
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs sm:text-sm">
              Métricas
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat AI & RAG Tab */}
        <TabsContent value="chat-ai" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Sistema RAG (Retrieval-Augmented Generation)
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Configure o chat inteligente com base de conhecimento para acolhimento
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">
                      Funcionalidades Implementadas:
                    </h4>
                    <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                      <li>✅ Interface de chat completa e responsiva</li>
                      <li>✅ Sistema de upload e processamento de PDFs</li>
                      <li>✅ Integração com OpenAI GPT-4</li>
                      <li>✅ Sistema de busca na base de conhecimento</li>
                      <li>✅ Salvamento automático de conversas</li>
                      <li>✅ Configuração de prompt personalizado</li>
                      <li>✅ Citação de fontes nas respostas</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2 text-sm sm:text-base">
                      Como Funciona:
                    </h4>
                    <div className="text-xs sm:text-sm text-green-800 space-y-2">
                      <p><strong>Para o Gestor:</strong> Faz upload dos PDFs, configura o prompt do agente e monitora métricas</p>
                      <p><strong>Para o Cliente:</strong> Acessa chat integrado, faz perguntas e recebe respostas baseadas nos documentos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:gap-6">
              <DocumentManager />
              <PromptManager />
              <ChatAdmin />
            </div>
          </div>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="w-full">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  N8N Webhook
                </CardTitle>
                <CardDescription className="text-sm">
                  Configure webhooks para automações com n8n
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Conecte com o n8n para automação de processos, fluxos de trabalho
                  e integração com outras plataformas.
                </p>
              </CardContent>
              <CardFooter className="p-4 sm:p-6">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                  onClick={() => setIsN8nWebhookConfigModalOpen(true)}
                >
                  <Share2 className="mr-2 w-4 h-4" />
                  Configurar N8N Webhook
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="w-full">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <span className="mr-2 text-[#25D366]">
                    <i className="ri-whatsapp-line text-lg sm:text-xl"></i>
                  </span>
                  WhatsApp
                </CardTitle>
                <CardDescription className="text-sm">
                  Configure a integração com WhatsApp para comunicação com clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Vincule sua conta do WhatsApp Business para enviar mensagens automatizadas 
                  e facilitar a comunicação com seus contatos.
                </p>
              </CardContent>
              <CardFooter className="p-4 sm:p-6">
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-sm"
                  onClick={() => setIsWhatsAppConfigModalOpen(true)}
                >
                  <i className="ri-whatsapp-line mr-2 text-base"></i>
                  Configurar WhatsApp
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4 sm:space-y-6">
          <ChatMetrics />
        </TabsContent>
      </Tabs>

      {/* Integration Modals */}
      {isWhatsAppConfigModalOpen && (
        <WhatsAppConfigModal 
          isOpen={isWhatsAppConfigModalOpen}
          onClose={() => setIsWhatsAppConfigModalOpen(false)}
        />
      )}

      {isN8nWebhookConfigModalOpen && (
        <N8nWebhookConfigModal 
          isOpen={isN8nWebhookConfigModalOpen}
          onClose={() => setIsN8nWebhookConfigModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Integrations;
