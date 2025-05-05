import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { saveSettingsToDatabase } from "@/utils/settingsUtils";

export interface TrackingSettings {
  google_analytics_id: string;
  facebook_pixel_id: string;
  custom_tracking_scripts: string;
}

export interface TrackingSettingsProps {
  googleAnalyticsId: string;
  facebookPixelId: string;
  customTrackingScripts: string;
  onGoogleAnalyticsIdChange: (value: string) => void;
  onFacebookPixelIdChange: (value: string) => void;
  onCustomTrackingScriptsChange: (value: string) => void;
}

export const TrackingSettingsComponent = ({
  googleAnalyticsId,
  facebookPixelId,
  customTrackingScripts,
  onGoogleAnalyticsIdChange,
  onFacebookPixelIdChange,
  onCustomTrackingScriptsChange
}: TrackingSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  // Save tracking settings
  const saveTrackingSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData: TrackingSettings = {
        google_analytics_id: googleAnalyticsId,
        facebook_pixel_id: facebookPixelId,
        custom_tracking_scripts: customTrackingScripts,
      };
      
      await saveSettingsToDatabase('tracking_settings', settingsData);
      
      toast({
        title: "Configurações de rastreamento salvas",
        description: "As configurações de rastreamento foram salvas com sucesso.",
      });
      
    } catch (error: any) {
      console.error("Erro ao salvar configurações de rastreamento:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as configurações de rastreamento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações de Rastreamento</CardTitle>
        <CardDescription>
          Configure códigos de rastreamento e análise para seu site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="google-analytics">ID do Google Analytics</Label>
          <Input
            id="google-analytics"
            placeholder="G-XXXXXXXXXX ou UA-XXXXXXXX-X"
            value={googleAnalyticsId}
            onChange={(e) => onGoogleAnalyticsIdChange(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Ex: G-XXXXXXXXXX (para GA4) ou UA-XXXXXXXX-X (para Universal Analytics)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook-pixel">ID do Facebook Pixel</Label>
          <Input
            id="facebook-pixel"
            placeholder="XXXXXXXXXXXXXXX"
            value={facebookPixelId}
            onChange={(e) => onFacebookPixelIdChange(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Seu ID do Facebook Pixel, geralmente um número de 15 dígitos
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-scripts">Scripts de Rastreamento Personalizados</Label>
          <Textarea
            id="custom-scripts"
            placeholder="<!-- Cole seus scripts personalizados aqui -->"
            value={customTrackingScripts}
            onChange={(e) => onCustomTrackingScriptsChange(e.target.value)}
            className="font-mono text-sm h-40"
          />
          <p className="text-sm text-gray-500 mt-1">
            Cole aqui qualquer código de rastreamento adicional que deseja incluir no cabeçalho do site
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveTrackingSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : "Salvar Configurações de Rastreamento"}
        </Button>
      </CardFooter>
    </Card>
  );
};
