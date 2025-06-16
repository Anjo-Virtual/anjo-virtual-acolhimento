
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, LogOut, ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "./AdminLoginForm";
import { User } from "@supabase/supabase-js";

interface AdminLoginCardProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any | null }>;
  user?: User | null;
  isAdmin?: boolean;
  onSignOut?: () => Promise<void>;
}

export const AdminLoginCard = ({ onSignIn, onSignUp, user, isAdmin, onSignOut }: AdminLoginCardProps) => {
  // Se usuário está logado mas não é admin
  if (user && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissões de administrador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Sua conta: <strong>{user.email}</strong>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Para acessar o painel administrativo, você precisa de permissões especiais.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => window.location.href = "/comunidade"}
              className="w-full"
              variant="default"
            >
              <Users className="mr-2 h-4 w-4" />
              Ir para Comunidade
            </Button>
            <Button 
              onClick={onSignOut}
              variant="outline" 
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Fazer Logout
            </Button>
            <Button 
              onClick={() => window.location.href = "/"}
              variant="ghost" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Site
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Se usuário está logado e é admin
  if (user && isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Você já está logado</CardTitle>
            <CardDescription>
              Escolha para onde deseja ir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Logado como: <strong>{user.email}</strong>
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => window.location.href = "/admin"}
              className="w-full"
              variant="default"
            >
              <Shield className="mr-2 h-4 w-4" />
              Ir para Painel Admin
            </Button>
            <Button 
              onClick={() => window.location.href = "/comunidade"}
              variant="outline" 
              className="w-full"
            >
              <Users className="mr-2 h-4 w-4" />
              Ir para Comunidade
            </Button>
            <Button 
              onClick={onSignOut}
              variant="outline" 
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Fazer Logout
            </Button>
            <Button 
              onClick={() => window.location.href = "/"}
              variant="ghost" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Site
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Tela de login padrão
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
          <CardDescription>
            Acesso restrito a administradores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm onSignIn={onSignIn} onSignUp={onSignUp} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            ⚠️ Contas criadas aqui precisam ser promovidas a admin por um super-admin
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Acesso restrito a administradores do sistema
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
