
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { Shield } from "lucide-react";

const DangerZone = () => {
  const { signOut } = useCommunityAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado da comunidade.",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Shield className="w-5 h-5" />
          Zona de Perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis relacionadas à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="w-full sm:w-auto"
        >
          Sair da Comunidade
        </Button>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
