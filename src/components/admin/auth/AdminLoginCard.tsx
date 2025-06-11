
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { AdminLoginForm } from "./AdminLoginForm";

interface AdminLoginCardProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any | null }>;
}

export const AdminLoginCard = ({ onSignIn, onSignUp }: AdminLoginCardProps) => {
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
