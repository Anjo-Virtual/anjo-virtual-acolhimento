import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ClientArea = () => {
  const { user, subscription, loading, subscriptionLoading, refreshSubscription, signOut } = useAdminAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login?redirect=/minha-conta");
      return;
    }

    if (user) {
      refreshSubscription();
    }
  }, [user, loading, navigate, refreshSubscription]);

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL do portal não retornada");
      }
    } catch (error) {
      console.error("Erro ao acessar portal do cliente:", error);
      toast({
        title: "Erro ao acessar portal",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSubscribed = subscription?.subscribed;
  const subscriptionTier = subscription?.subscription_tier;
  const subscriptionEnd = subscription?.subscription_end 
    ? new Date(subscription.subscription_end).toLocaleDateString('pt-BR')
    : null;
  const isOneTimePayment = subscription?.one_time_payment;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-gray-600">Gerencie sua assinatura e acesse conteúdos exclusivos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="subscription">
            <TabsList className="mb-6">
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Status da Assinatura
                    {subscriptionLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>Detalhes do seu plano atual</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubscribed ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{subscriptionTier || "Plano Premium"}</p>
                            <p className="text-sm text-gray-500">
                              {isOneTimePayment 
                                ? "Pagamento único" 
                                : "Assinatura ativa"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Ativo
                        </Badge>
                      </div>
                      
                      {subscriptionEnd && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {isOneTimePayment 
                              ? `Válido até ${subscriptionEnd}` 
                              : `Próxima renovação em ${subscriptionEnd}`}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Sem assinatura ativa</AlertTitle>
                      <AlertDescription>
                        Você não possui um plano ativo no momento. Escolha um plano para desbloquear todos os recursos.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  {isSubscribed ? (
                    <Button 
                      onClick={handleManageSubscription} 
                      disabled={portalLoading}
                      className="w-full sm:w-auto"
                    >
                      {portalLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <Settings className="mr-2 h-4 w-4" />
                          Gerenciar Assinatura
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate("/")}
                      className="w-full sm:w-auto"
                    >
                      Ver Planos Disponíveis
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => refreshSubscription()} 
                    variant="outline"
                    disabled={subscriptionLoading}
                    className="w-full sm:w-auto"
                  >
                    {subscriptionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Atualizar Status
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Perfil</CardTitle>
                  <CardDescription>Suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID do usuário</p>
                      <p className="font-medium text-xs">{user?.id}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={signOut} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>Seus pagamentos e faturas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Para acessar seu histórico de pagamentos, use o portal de gerenciamento de assinatura.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={portalLoading || !isSubscribed}
                    className="w-full"
                  >
                    {portalLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Carregando Portal...
                      </>
                    ) : (
                      'Acessar Portal de Pagamentos'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Links Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/")}
                >
                  Página Inicial
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/blog")}
                >
                  Blog
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
