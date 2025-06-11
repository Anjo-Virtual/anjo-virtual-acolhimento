
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminLoginFormProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any | null }>;
}

export const AdminLoginForm = ({ onSignIn, onSignUp }: AdminLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Tentando fazer login com:", email);
      const { error } = await onSignIn(email, password);
      
      if (error) {
        console.error("Erro de login admin:", error);
        toast({
          title: "Erro de autenticação",
          description: error.message || "Falha ao fazer login. Verifique suas credenciais.",
          variant: "destructive",
        });
      } else {
        console.log("Login realizado, aguardando verificação de permissões...");
        toast({
          title: "Login bem-sucedido",
          description: "Verificando permissões de administrador...",
        });
      }
    } catch (error: any) {
      console.error("Erro no processo de login admin:", error);
      toast({
        title: "Erro ao processar a solicitação",
        description: error.message || "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Tentando criar conta para:", email);
      const { error } = await onSignUp(email, password);
      
      if (error) {
        console.error("Erro de cadastro admin:", error);
        toast({
          title: "Erro ao criar conta",
          description: error.message || "Falha ao criar conta. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar sua conta. Nota: Você precisará de permissões de admin para acessar o painel.",
        });
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Erro no processo de cadastro admin:", error);
      toast({
        title: "Erro ao processar a solicitação",
        description: error.message || "Ocorreu um erro ao tentar criar a conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Entrar</TabsTrigger>
        <TabsTrigger value="signup">Criar Conta</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="admin@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Senha</Label>
            <Input
              id="signin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Autenticando...
              </>
            ) : (
              "Entrar no Painel"
            )}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="admin@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Senha</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta de Admin"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};
