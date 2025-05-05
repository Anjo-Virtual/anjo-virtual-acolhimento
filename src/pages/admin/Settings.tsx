
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AccountSettings } from "@/components/admin/settings/AccountSettings";
import { SiteSettingsComponent } from "@/components/admin/settings/SiteSettings";
import { TrackingSettingsComponent } from "@/components/admin/settings/TrackingSettings";
import type { SiteSettings } from "@/components/admin/settings/SiteSettings";
import type { TrackingSettings } from "@/components/admin/settings/TrackingSettings";

const Settings = () => {
  // Account settings
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  
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
          <AccountSettings 
            email={email}
            name={name}
            onNameChange={setName}
          />
        </TabsContent>
        
        <TabsContent value="site">
          <SiteSettingsComponent 
            siteName={siteName}
            siteDescription={siteDescription}
            metaKeywords={metaKeywords}
            onSiteNameChange={setSiteName}
            onSiteDescriptionChange={setSiteDescription}
            onMetaKeywordsChange={setMetaKeywords}
          />
        </TabsContent>
        
        <TabsContent value="tracking">
          <TrackingSettingsComponent
            googleAnalyticsId={googleAnalyticsId}
            facebookPixelId={facebookPixelId}
            customTrackingScripts={customTrackingScripts}
            onGoogleAnalyticsIdChange={setGoogleAnalyticsId}
            onFacebookPixelIdChange={setFacebookPixelId}
            onCustomTrackingScriptsChange={setCustomTrackingScripts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
