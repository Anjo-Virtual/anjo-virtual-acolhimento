import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  
  // Load settings on mount
  useEffect(() => {
    loadSiteSettings();
  }, []);
  
  // Load site settings from database
  const loadSiteSettings = async () => {
    try {
      // Get site settings from database
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general_settings')
        .single();
      
      if (error) {
        console.error("Erro ao carregar configurações:", error);
        return;
      }
      
      if (data) {
        // Populate form fields with saved settings
        setSiteName(data.value.site_name || "");
        setSiteDescription(data.value.site_description || "");
        setMetaKeywords(data.value.meta_keywords || "");
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
      const settingsData = {
        site_name: siteName,
        site_description: siteDescription,
        meta_keywords: metaKeywords,
      };
      
      // Check if settings exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general_settings')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
        throw fetchError;
      }
      
      let saveError;
      
      // If settings exist, update them
      if (existingSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: settingsData })
          .eq('key', 'general_settings');
        
        saveError = error;
      } 
      // Otherwise insert new settings
      else {
        const { error } = await supabase
          .from('site_settings')
          .insert({
            key: 'general_settings',
            value: settingsData
          });
        
        saveError = error;
      }
      
      if (saveError) throw saveError;
      
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="site">Site</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Settings;
