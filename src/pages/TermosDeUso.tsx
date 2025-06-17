
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Shield, User, FileText, Mail, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const TermosDeUso = () => {
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
    { id: "aceitacao", title: "Aceitação dos Termos", icon: FileText },
    { id: "descricao", title: "Descrição do Serviço", icon: User },
    { id: "uso-responsavel", title: "Uso Responsável", icon: Shield },
    { id: "privacidade", title: "Privacidade", icon: Shield },
    { id: "limitacao", title: "Limitação de Responsabilidade", icon: Shield },
    { id: "modificacoes", title: "Modificações", icon: Clock },
    { id: "contato", title: "Contato", icon: Mail },
  ];

  return (
    <div className="bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-100 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <span>Início</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">Termos de Uso</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Termos de Uso
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossos termos de uso estabelecem as regras e diretrizes para utilizar nossos serviços de forma segura e responsável.
            </p>
            <div className="mt-8">
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
                  
                  <section id="aceitacao" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">1. Aceitação dos Termos</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-0">
                          Ao acessar e usar o serviço <strong>Anjo Virtual</strong>, você concorda em estar vinculado a estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar nossos serviços.
                        </p>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="descricao" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">2. Descrição do Serviço</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          O <strong>Anjo Virtual</strong> é um assistente digital de acolhimento no luto que oferece:
                        </p>
                        <ul className="text-gray-600 space-y-2 mb-0">
                          <li>• Suporte emocional através de conversas empáticas</li>
                          <li>• Recursos educativos sobre o processo de luto</li>
                          <li>• Comunidade de apoio para pessoas em situações similares</li>
                          <li>• Orientações para lidar com diferentes aspectos do luto</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="uso-responsavel" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">3. Uso Responsável</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Você se compromete a usar nosso serviço de forma responsável e apropriada, incluindo:
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <ul className="text-gray-700 space-y-1 mb-0">
                            <li>• Respeitar outros usuários e suas experiências</li>
                            <li>• Não compartilhar informações pessoais sensíveis</li>
                            <li>• Seguir as diretrizes da comunidade</li>
                            <li>• Não usar o serviço para fins comerciais não autorizados</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="privacidade" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">4. Privacidade</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Respeitamos sua privacidade e protegemos suas informações pessoais conforme descrito em nossa Política de Privacidade.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 mb-0">
                            Para mais detalhes, consulte nossa <a href="/politica-de-privacidade" className="text-primary hover:underline font-medium">Política de Privacidade</a>.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="limitacao" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">5. Limitação de Responsabilidade</h2>
                    </div>
                    <Card className="border-red-200">
                      <CardContent className="p-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-red-800 font-medium mb-2">⚠️ Aviso Importante</p>
                          <p className="text-red-700 mb-0">
                            O Anjo Virtual <strong>não substitui</strong> atendimento médico ou psicológico profissional. Em casos de emergência ou pensamentos de autolesão, procure ajuda médica imediatamente.
                          </p>
                        </div>
                        <p className="text-gray-600 mb-0">
                          Nosso serviço é complementar e destinado ao apoio emocional, não constituindo aconselhamento médico ou terapêutico profissional.
                        </p>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="modificacoes" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">6. Modificações</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-0">
                          Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. Recomendamos revisar periodicamente esta página para se manter atualizado.
                        </p>
                      </CardContent>
                    </Card>
                  </section>

                  <section id="contato" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-800 m-0">7. Contato</h2>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4">
                          Para dúvidas sobre estes termos, entre em contato conosco:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
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

export default TermosDeUso;
