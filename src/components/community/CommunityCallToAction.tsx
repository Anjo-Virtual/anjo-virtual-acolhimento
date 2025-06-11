
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Shield, UserCheck, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const CommunityCallToAction = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-primary/20 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-6">
          <LogIn className="w-20 h-20 text-primary" />
        </div>
        <CardTitle className="text-3xl mb-4">Junte-se à Nossa Comunidade</CardTitle>
        <CardDescription className="text-lg max-w-2xl mx-auto">
          Para participar dos fóruns e acessar todos os recursos da comunidade, você precisa criar uma conta ou fazer login. É rápido, seguro e completamente gratuito.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="text-center border-2 border-primary/20 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Novo por aqui?</h3>
              <p className="text-gray-600 mb-6">
                Crie sua conta gratuita e junte-se à nossa comunidade de apoio e compreensão.
              </p>
              <Link to="/comunidade/login">
                <Button size="lg" className="w-full text-lg py-3">
                  Criar Conta Gratuita
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-secondary/20 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <UserCheck className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Já é membro?</h3>
              <p className="text-gray-600 mb-6">
                Faça login para acessar os fóruns, grupos e todos os recursos da comunidade.
              </p>
              <Link to="/comunidade/login">
                <Button variant="outline" size="lg" className="w-full text-lg py-3 border-2">
                  Fazer Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center bg-white/50 rounded-lg p-4">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Sua privacidade é nossa prioridade. Você pode usar pseudônimos e manter o anonimato.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCallToAction;
