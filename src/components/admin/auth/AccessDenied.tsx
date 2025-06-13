
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Home } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AccessDeniedProps {
  userEmail?: string;
}

export const AccessDenied = ({ userEmail }: AccessDeniedProps) => {
  const { signOut } = useAdminAuth();

  const handleLogout = async () => {
    console.log("AccessDenied - Fazendo logout do usuário");
    await signOut();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-xl text-red-600">Acesso Negado</CardTitle>
          <CardDescription className="text-center">
            Você não tem permissões de administrador para acessar esta área.
            {userEmail && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                <strong>Usuário logado:</strong> {userEmail}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-600">
          <p>Para acessar o painel administrativo, você precisa de permissões especiais.</p>
          <p className="mt-2">Entre em contato com um administrador para solicitar acesso.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleGoHome}
            className="w-full"
            variant="default"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para o Site Principal
          </Button>
          <Button 
            onClick={() => window.location.href = "/comunidade"} 
            className="w-full"
            variant="outline"
          >
            Acessar Comunidade
          </Button>
          <Button 
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Fazer Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
