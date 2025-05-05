import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  site_name: string;
  site_description: string;
  meta_keywords: string;
}

export interface SiteSettingsProps {
  siteName: string;
  siteDescription: string;
  metaKeywords: string;
  onSiteNameChange: (value: string) => void;
  onSiteDescriptionChange: (value: string) => void;
  onMetaKeywordsChange: (value: string) => void;
}

export const SiteSettingsComponent = ({
  siteName,
  siteDescription,
  metaKeywords,
  onSiteNameChange,
  onSiteDescriptionChange,
  onMetaKeywordsChange
}: SiteSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  // Save site settings
  const saveSiteSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData: SiteSettings = {
        site_name: siteName,
        site_description: siteDescription,
        meta_keywords: metaKeywords,
      };
      
      await saveSettingsToDatabase('general_settings', settingsData);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do site foram salvas com sucesso.",
      });
      
    } catch (error: any) {
      console.error("Erro ao salvar configurações do site:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as configurações do site.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to save settings to database
  const saveSettingsToDatabase = async (key: string, value: any) => {
    // Check if settings exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
      throw fetchError;
    }
    
    let saveError;
    
    // If settings exist, update them
    if (existingSettings) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      
      saveError = error;
    } 
    // Otherwise insert new settings
    else {
      const { error } = await supabase
        .from('site_settings')
        .insert({
          key,
          value
        });
      
      saveError = error;
    }
    
    if (saveError) throw saveError;
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações do Site</CardTitle>
        <CardDescription>
          Personalize as configurações gerais do site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-name">Nome do Site</Label>
          <Input
            id="site-name"
            placeholder="Meu Site"
            value={siteName}
            onChange={(e) => onSiteNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="site-description">Descrição do Site</Label>
          <Input
            id="site-description"
            placeholder="Uma breve descrição do seu site"
            value={siteDescription}
            onChange={(e) => onSiteDescriptionChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta-keywords">Palavras-chave para SEO</Label>
          <Input
            id="meta-keywords"
            placeholder="palavra-chave1, palavra-chave2"
            value={metaKeywords}
            onChange={(e) => onMetaKeywordsChange(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSiteSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : "Salvar Configurações"}
        </Button>
      </CardFooter>
    </Card>
  );
};
