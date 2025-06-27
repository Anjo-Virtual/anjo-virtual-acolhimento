
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PreferencesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências da Comunidade</CardTitle>
        <CardDescription>
          Configure como você interage com a comunidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Receber notificações por email</Label>
              <p className="text-sm text-gray-500">
                Receba atualizações sobre suas publicações e mensagens
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Permitir mensagens privadas</Label>
              <p className="text-sm text-gray-500">
                Outros membros podem enviar mensagens privadas
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Participar de grupos</Label>
              <p className="text-sm text-gray-500">
                Permitir convites para grupos de apoio
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
