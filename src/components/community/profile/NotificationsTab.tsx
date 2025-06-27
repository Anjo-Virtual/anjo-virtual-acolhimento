
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
        <CardDescription>
          Escolha quando e como ser notificado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Novas respostas aos meus posts</Label>
              <p className="text-sm text-gray-500">
                Quando alguém responde às suas publicações
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mensagens privadas</Label>
              <p className="text-sm text-gray-500">
                Quando você recebe uma nova mensagem privada
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Novos eventos</Label>
              <p className="text-sm text-gray-500">
                Quando novos eventos são criados na comunidade
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
