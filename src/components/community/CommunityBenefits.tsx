
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Shield } from "lucide-react";

const CommunityBenefits = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <Card className="text-center border-0 shadow-lg">
        <CardHeader>
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-xl">Ambiente Seguro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Moderação especializada e políticas rígidas de privacidade para garantir um espaço seguro e acolhedor.
          </p>
        </CardContent>
      </Card>

      <Card className="text-center border-0 shadow-lg">
        <CardHeader>
          <MessageSquare className="w-16 h-16 text-secondary mx-auto mb-4" />
          <CardTitle className="text-xl">Apoio Mútuo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Conecte-se com pessoas que passaram por experiências similares e encontre compreensão genuína.
          </p>
        </CardContent>
      </Card>

      <Card className="text-center border-0 shadow-lg">
        <CardHeader>
          <Users className="w-16 h-16 text-tertiary mx-auto mb-4" />
          <CardTitle className="text-xl">Grupos Especializados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Participe de grupos focados em diferentes tipos de luto e estágios de superação.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityBenefits;
