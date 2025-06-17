
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Shield, Database, Lock, Eye, Settings, Mail, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const PoliticaDePrivacidade = () => {
  const [activeSection, setActiveSection] = useState("");

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

  const sections = [
    { id: "informacoes", title: "Informações que Coletamos", icon: Database },
    { id: "uso", title: "Como Usamos suas Informações", icon: Settings },
    { id: "compartilhamento", title: "Compartilhamento de Informações", icon: Shield },
    { id: "seguranca", title: "Segurança dos Dados", icon: Lock },
    { id: "direitos", title: "Seus Direitos", icon: Eye },
    { id: "cookies", title: "Cookies", icon: Settings },
    { id: "alteracoes", title: "Alterações na Política", icon: Clock },
    { id: "contato", title: "Contato", icon: Mail },
  ];

  return (
    <div className="bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <span>Início</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">Política de Privacidade</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">
                Política de Privacidade
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Transparência total sobre como coletamos, usamos e protegemos suas informações pessoais.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                LGPD Compatível
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Dados Criptografados
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
                <div className="sticky top-32">
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
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="prose prose-lg max-w-none">
                  
                  <section id="informacoes" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">1. Informações que Coletamos</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Coletamos informações que você nos fornece diretamente ao usar nossos serviços:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Informações de Conta</h4>
                            <ul className="text-blue-800 text-sm space-y-1">
                              <li>• Nome e sobrenome</li>
                              <li>• Endereço de email</li>
                              <li>• Número de telefone</li>
                            </ul>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">Dados de Uso</h4>
                            <ul className="text-green-800 text-sm space-y-1">
                              <li>• Histórico de conversas</li>
                              <li>• Preferências do usuário</li>
                              <li>• Dados de navegação</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 mb-0">
                            <strong>Nota:</strong> Nunca coletamos informações sensíveis sem seu consentimento explícito.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="uso" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">2. Como Usamos suas Informações</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Utilizamos suas informações exclusivamente para:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-sm font-bold">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Fornecer nossos serviços</h4>
                              <p className="text-gray-600 text-sm">Personalizar o atendimento e melhorar a experiência do usuário</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-sm font-bold">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Comunicações importantes</h4>
                              <p className="text-gray-600 text-sm">Enviar atualizações sobre o serviço e informações relevantes</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-sm font-bold">3</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Melhorar nosso serviço</h4>
                              <p className="text-gray-600 text-sm">Analisar padrões de uso para aprimorar nossos recursos</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="compartilhamento" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">3. Compartilhamento de Informações</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-red-900 mb-2">🚫 Política de Não Compartilhamento</h4>
                          <p className="text-red-800 mb-0">
                            <strong>Nunca</strong> vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins comerciais.
                          </p>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Compartilhamos informações apenas em situações específicas:
                        </p>
                        <div className="space-y-3">
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-gray-700 font-medium mb-1">Prestadores de serviços essenciais</p>
                            <p className="text-gray-600 text-sm">Parceiros que nos ajudam a fornecer nossos serviços (sempre sob rigorosos acordos de confidencialidade)</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-gray-700 font-medium mb-1">Exigências legais</p>
                            <p className="text-gray-600 text-sm">Quando requerido por lei ou ordem judicial</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="seguranca" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">4. Segurança dos Dados</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Implementamos múltiplas camadas de segurança para proteger suas informações:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Medidas Técnicas
                            </h4>
                            <ul className="text-gray-600 text-sm space-y-1">
                              <li>• Criptografia SSL/TLS</li>
                              <li>• Bancos de dados protegidos</li>
                              <li>• Monitoramento 24/7</li>
                              <li>• Backups seguros</li>
                            </ul>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Medidas Organizacionais
                            </h4>
                            <ul className="text-gray-600 text-sm space-y-1">
                              <li>• Acesso restrito aos dados</li>
                              <li>• Treinamento da equipe</li>
                              <li>• Auditorias regulares</li>
                              <li>• Políticas internas rígidas</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="direitos" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">5. Seus Direitos</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          De acordo com a LGPD, você tem os seguintes direitos sobre seus dados:
                        </p>
                        <div className="grid gap-3">
                          {[
                            { title: "Acesso", desc: "Saber quais dados temos sobre você" },
                            { title: "Correção", desc: "Atualizar informações incorretas" },
                            { title: "Exclusão", desc: "Solicitar a remoção de seus dados" },
                            { title: "Portabilidade", desc: "Transferir seus dados para outro serviço" },
                            { title: "Revogação", desc: "Retirar consentimento a qualquer momento" },
                          ].map((direito, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 text-sm font-bold">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{direito.title}</p>
                                <p className="text-gray-600 text-sm">{direito.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="cookies" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">6. Cookies</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Utilizamos cookies para melhorar sua experiência de navegação:
                        </p>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                          <p className="text-orange-800 mb-2">
                            Para mais detalhes sobre nosso uso de cookies, consulte nossa
                          </p>
                          <a href="/politica-de-cookies" className="text-primary hover:underline font-medium">
                            Política de Cookies completa →
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="alteracoes" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">7. Alterações na Política</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-0">
                          Podemos atualizar esta política periodicamente. Quando isso acontecer, notificaremos sobre mudanças significativas através do email cadastrado ou aviso em nosso site. Recomendamos revisar esta página regularmente.
                        </p>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="contato" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">8. Contato</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Para questões sobre esta política ou exercer seus direitos:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-primary" />
                              <a href="mailto:contato@anjovirtual.com.br" className="text-primary hover:underline font-medium">
                                contato@anjovirtual.com.br
                              </a>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Nosso prazo de resposta é de até 5 dias úteis para solicitações relacionadas à LGPD.</p>
                            </div>
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

export default PoliticaDePrivacidade;
