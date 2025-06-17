
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Cookie, Settings, BarChart3, Palette, Shield, ArrowUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

const PoliticaDeCookies = () => {
  const [activeSection, setActiveSection] = useState("");
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    performance: true,
    functionality: false,
    analytics: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
          current = section.getAttribute("id") || "";
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreferenceChange = (type: string, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const savePreferences = () => {
    // Aqui você salvaria as preferências do usuário
    console.log("Preferências salvas:", cookiePreferences);
    alert("Preferências de cookies salvas com sucesso!");
  };

  const sections = [
    { id: "o-que-sao", title: "O que são Cookies", icon: Cookie },
    { id: "tipos", title: "Tipos de Cookies", icon: Settings },
    { id: "gerenciar", title: "Como Gerenciar", icon: Shield },
    { id: "terceiros", title: "Cookies de Terceiros", icon: BarChart3 },
    { id: "atualizacoes", title: "Atualizações", icon: Info },
    { id: "contato", title: "Contato", icon: Settings },
  ];

  return (
    <div className="bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-100 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <span>Início</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">Política de Cookies</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Cookie className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">
                Política de Cookies
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Entenda como utilizamos cookies para melhorar sua experiência de navegação e como você pode controlá-los.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Controle Total
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Transparente
              </Badge>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Última atualização: <span className="font-medium">Janeiro de 2025</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-8">
              
              {/* Sidebar Navigation */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-32 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
                      <nav className="space-y-2">
                        {sections.map((section) => {
                          const Icon = section.icon;
                          return (
                            <a
                              key={section.id}
                              href={`#${section.id}`}
                              className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                                activeSection === section.id
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {section.title}
                            </a>
                          );
                        })}
                      </nav>
                    </CardContent>
                  </Card>

                  {/* Cookie Preferences Panel */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Preferências de Cookies</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Essenciais</p>
                            <p className="text-xs text-gray-500">Sempre ativo</p>
                          </div>
                          <Switch checked={cookiePreferences.essential} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Performance</p>
                            <p className="text-xs text-gray-500">Análise de uso</p>
                          </div>
                          <Switch 
                            checked={cookiePreferences.performance}
                            onCheckedChange={(value) => handlePreferenceChange('performance', value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Funcionalidade</p>
                            <p className="text-xs text-gray-500">Personalização</p>
                          </div>
                          <Switch 
                            checked={cookiePreferences.functionality}
                            onCheckedChange={(value) => handlePreferenceChange('functionality', value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Analytics</p>
                            <p className="text-xs text-gray-500">Métricas</p>
                          </div>
                          <Switch 
                            checked={cookiePreferences.analytics}
                            onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
                          />
                        </div>
                        <Button onClick={savePreferences} className="w-full" size="sm">
                          Salvar Preferências
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="prose prose-lg max-w-none">
                  
                  <section id="o-que-sao" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Cookie className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">1. O que são Cookies</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site. Eles nos ajudam a:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Melhorar a experiência</h4>
                            <p className="text-blue-800 text-sm">Lembrar suas preferências e configurações pessoais</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">Funcionalidade</h4>
                            <p className="text-green-800 text-sm">Manter você logado e personalizar o conteúdo</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-purple-900 mb-2">Análise</h4>
                            <p className="text-purple-800 text-sm">Entender como você usa nosso site para melhorá-lo</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <h4 className="font-medium text-yellow-900 mb-2">Segurança</h4>
                            <p className="text-yellow-800 text-sm">Proteger contra fraudes e ataques maliciosos</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="tipos" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">2. Tipos de Cookies que Utilizamos</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <Card className="border-green-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">Cookies Essenciais</h3>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">Sempre Ativo</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">
                                Necessários para o funcionamento básico do site, como autenticação, segurança e navegação.
                              </p>
                              <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-green-800 text-sm mb-2"><strong>Exemplos:</strong></p>
                                <ul className="text-green-700 text-sm space-y-1">
                                  <li>• Cookies de sessão para manter você logado</li>
                                  <li>• Cookies de segurança para proteção CSRF</li>
                                  <li>• Cookies de preferências de idioma</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">Cookies de Performance</h3>
                                <Badge variant="outline">Opcional</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">
                                Coletam informações sobre como você usa nosso site para nos ajudar a melhorar a experiência.
                              </p>
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-blue-800 text-sm mb-2"><strong>Funcionalidades:</strong></p>
                                <ul className="text-blue-700 text-sm space-y-1">
                                  <li>• Análise de páginas mais visitadas</li>
                                  <li>• Tempo de permanência no site</li>
                                  <li>• Identificação de erros técnicos</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Palette className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">Cookies de Funcionalidade</h3>
                                <Badge variant="outline">Opcional</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">
                                Lembram suas preferências e configurações para personalizar sua experiência.
                              </p>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-purple-800 text-sm mb-2"><strong>Personalizações:</strong></p>
                                <ul className="text-purple-700 text-sm space-y-1">
                                  <li>• Preferências de layout e tema</li>
                                  <li>• Histórico de conversas</li>
                                  <li>• Configurações de notificação</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <section id="gerenciar" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">3. Como Gerenciar Cookies</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Você tem controle total sobre os cookies. Pode gerenciá-los através de:
                        </p>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">1. Configurações do Navegador</h4>
                            <p className="text-gray-600 text-sm mb-3">
                              Todos os navegadores permitem controlar cookies através de suas configurações:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div className="text-center p-2 bg-white rounded border">
                                <strong>Chrome</strong><br />
                                <span className="text-gray-500">Configurações → Privacidade</span>
                              </div>
                              <div className="text-center p-2 bg-white rounded border">
                                <strong>Firefox</strong><br />
                                <span className="text-gray-500">Opções → Privacidade</span>
                              </div>
                              <div className="text-center p-2 bg-white rounded border">
                                <strong>Safari</strong><br />
                                <span className="text-gray-500">Preferências → Privacidade</span>
                              </div>
                              <div className="text-center p-2 bg-white rounded border">
                                <strong>Edge</strong><br />
                                <span className="text-gray-500">Configurações → Cookies</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 mb-0">
                              <strong>Importante:</strong> Desabilitar cookies essenciais pode afetar a funcionalidade do site, como manter você logado.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="terceiros" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">4. Cookies de Terceiros</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Utilizamos serviços de terceiros confiáveis que podem colocar cookies em seu dispositivo:
                        </p>
                        <div className="space-y-3">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <BarChart3 className="w-5 h-5 text-blue-600" />
                              <h4 className="font-medium text-gray-900">Google Analytics</h4>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Analytics</Badge>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Para análise de tráfego e comportamento dos usuários, ajudando-nos a melhorar nossos serviços.
                            </p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Shield className="w-5 h-5 text-green-600" />
                              <h4 className="font-medium text-gray-900">Sistemas de Pagamento</h4>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">Segurança</Badge>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Para processar pagamentos de forma segura através de provedores confiáveis como Stripe e PayPal.
                            </p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Settings className="w-5 h-5 text-purple-600" />
                              <h4 className="font-medium text-gray-900">Suporte ao Cliente</h4>
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Funcionalidade</Badge>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Para fornecer chat de suporte e melhor atendimento ao cliente.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="atualizacoes" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Info className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">5. Atualizações desta Política</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Esta política pode ser atualizada periodicamente para refletir mudanças em nossos serviços ou regulamentações.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 mb-0">
                            Recomendamos revisar regularmente esta página para se manter informado sobre nosso uso de cookies. Grandes mudanças serão comunicadas através de nossos canais oficiais.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="contato" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">6. Contato</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Para dúvidas sobre nosso uso de cookies ou para exercer seus direitos:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-primary" />
                            <a href="mailto:contato@anjovirtual.com.br" className="text-primary hover:underline font-medium">
                              contato@anjovirtual.com.br
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>

      <Footer />
    </div>
  );
};

export default PoliticaDeCookies;
