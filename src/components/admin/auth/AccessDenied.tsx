
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AccessDeniedProps {
  userEmail?: string;
}

export const AccessDenied = ({ userEmail }: AccessDeniedProps) => {
  const { signOut } = useAdminAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-xl">Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissões de administrador para acessar esta área.
            <br />
            {userEmail && (
              <small className="text-xs text-gray-500 mt-2 block">
                Usuário: {userEmail}
              </small>
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={() => window.location.href = "/comunidade"} 
            className="w-full"
          >
            Ir para a Comunidade
          </Button>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            Fazer Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
