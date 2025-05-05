import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface SiteSettings {
  site_name: string;
  site_description: string;
  meta_keywords: string;
}

interface TrackingSettings {
  google_analytics_id: string;
  facebook_pixel_id: string;
  custom_tracking_scripts: string;
}

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Account settings
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Site settings
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // Tracking settings
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [facebookPixelId, setFacebookPixelId] = useState("");
  const [customTrackingScripts, setCustomTrackingScripts] = useState("");
  
  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);
  
  // Load all settings from database
  const loadSettings = async () => {
    try {
      // Get site settings from database
      const { data: siteData, error: siteError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general_settings')
        .single();
      
      if (siteError && siteError.code !== 'PGRST116') { // PGRST116 is "No rows found"
        console.error("Erro ao carregar configurações do site:", siteError);
      }
      
      if (siteData && siteData.value) {
        // Parse site settings as SiteSettings interface
        const settings = siteData.value as SiteSettings;
        
        // Populate form fields with saved settings
        setSiteName(settings.site_name || "");
        setSiteDescription(settings.site_description || "");
        setMetaKeywords(settings.meta_keywords || "");
      }

      // Get tracking settings
      const { data: trackingData, error: trackingError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'tracking_settings')
        .single();
      
      if (trackingError && trackingError.code !== 'PGRST116') {
        console.error("Erro ao carregar configurações de rastreamento:", trackingError);
      }

      if (trackingData && trackingData.value) {
        // Parse tracking settings
        const trackingSettings = trackingData.value as TrackingSettings;
        
        // Populate form fields with saved settings
        setGoogleAnalyticsId(trackingSettings.google_analytics_id || "");
        setFacebookPixelId(trackingSettings.facebook_pixel_id || "");
        setCustomTrackingScripts(trackingSettings.custom_tracking_scripts || "");
      }
      
      // Get user profile data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        // You could load additional user data from a profiles table if needed
      }
      
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };
  
  // Add account signout functionality
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Desconectado com sucesso",
        description: "Você foi desconectado de sua conta.",
      });
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast({
        title: "Erro ao desconectar",
        description: "Ocorreu um erro ao tentar desconectar sua conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save account settings
  const saveAccountSettings = async () => {
    setIsSaving(true);
    try {
      // Update user password if provided
      if (currentPassword && newPassword) {
        const { error } = await supabase.auth.updateUser({ 
          password: newPassword 
        });
        
        if (error) throw error;
        
        setCurrentPassword("");
        setNewPassword("");
        
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi atualizada com sucesso.",
        });
      }
      
      // Here you could update other account details like name
      // if you're storing them in a separate profiles table
      
    } catch (error: any) {
      console.error("Erro ao salvar configurações da conta:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as configurações da conta.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="tracking">Rastreamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>
                Gerencie suas preferências de conta e informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled // Email usually can't be changed directly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
                {isLoading ? "Aguarde..." : "Sair da conta"}
              </Button>
              <Button onClick={saveAccountSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="site">
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
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Descrição do Site</Label>
                <Input
                  id="site-description"
                  placeholder="Uma breve descrição do seu site"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Palavras-chave para SEO</Label>
                <Input
                  id="meta-keywords"
                  placeholder="palavra-chave1, palavra-chave2"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
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
        </TabsContent>
        
        <TabsContent value="tracking">
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
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
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
                  onChange={(e) => setFacebookPixelId(e.target.value)}
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
                  onChange={(e) => setCustomTrackingScripts(e.target.value)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
