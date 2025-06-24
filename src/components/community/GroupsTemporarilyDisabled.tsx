
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Settings, AlertCircle } from "lucide-react";

const GroupsTemporarilyDisabled = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Grupos da Comunidade
            </h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Funcionalidade em manutenção
            </p>
          </div>
        </div>
      </div>

      {/* Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Manutenção em Andamento:</strong> A funcionalidade de grupos está temporariamente 
          desabilitada enquanto realizamos melhorias no sistema. Em breve estará disponível novamente.
        </AlertDescription>
      </Alert>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sistema em Atualização
          </CardTitle>
          <CardDescription>
            Estamos trabalhando para melhorar sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Grupos em Breve
            </h3>
            <p className="text-gray-500 mb-4">
              Enquanto isso, você pode participar das discussões nos fóruns da comunidade.
            </p>
            <div className="text-sm text-gray-400">
              ⚡ Melhorias em andamento<br />
              🔧 Sistema sendo otimizado<br />
              ✨ Nova experiência chegando em breve
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupsTemporarilyDisabled;
