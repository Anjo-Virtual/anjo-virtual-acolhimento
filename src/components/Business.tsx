import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { businessFormSchema } from "@/lib/validations/form-schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof businessFormSchema>;

const Business = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      nome: "",
      empresa: "",
      email: "",
      telefone: "",
      mensagem: "",
      termos: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Formulário enviado:", data);
    toast({
      title: "Solicitação enviada",
      description: "Recebemos sua solicitação e entraremos em contato em breve!",
    });
    
    form.reset();
  };

  return (
    <section id="empresas" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Para Empresas</h2>
            <p className="text-gray-600 mb-6">Ofereça suporte emocional para seus colaboradores em momentos de luto e perda. Nossa solução corporativa ajuda a criar um ambiente de trabalho mais acolhedor e humano.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-shield-check-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Bem-estar dos Colaboradores</h3>
                  <p className="text-gray-600 text-sm">Suporte emocional especializado</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-line-chart-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Produtividade</h3>
                  <p className="text-gray-600 text-sm">Redução do impacto do luto no trabalho</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-dashboard-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Dashboard</h3>
                  <p className="text-gray-600 text-sm">Gestão e relatórios de utilização</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary">
                  <i className="ri-paint-brush-line ri-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Personalização</h3>
                  <p className="text-gray-600 text-sm">Adaptado à identidade da sua empresa</p>
                </div>
              </div>
            </div>
            <a href="#" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors inline-block whitespace-nowrap">Solicitar Demonstração</a>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Solicite uma Proposta</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mensagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos sobre as necessidades da sua empresa" 
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Concordo em receber comunicações do Anjo Virtual e aceito os{" "}
                            <a href="#" className="text-primary">
                              Termos de Uso
                            </a>{" "}
                            e{" "}
                            <a href="#" className="text-primary">
                              Política de Privacidade
                            </a>
                            .
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors"
                    disabled={!form.getValues("termos")}
                  >
                    Enviar Solicitação
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
