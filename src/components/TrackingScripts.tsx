
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrackingSettings {
  google_analytics_id: string;
  facebook_pixel_id: string;
  custom_tracking_scripts: string;
}

export const TrackingScripts = () => {
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Verificar permissões antes de tentar carregar configurações
  const checkPermissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('TrackingScripts: Usuário não autenticado, pulando carregamento');
        setIsLoaded(true);
        return;
      }

      // Verificar se é admin usando a função do banco
      const { data: isAdmin, error } = await supabase.rpc('is_admin', { user_uuid: user.id });
      
      if (error) {
        console.log('TrackingScripts: Erro ao verificar permissões, usando fallback', error);
        setIsLoaded(true);
        return;
      }
      
      setHasPermissions(isAdmin || false);
    } catch (error) {
      console.log('TrackingScripts: Erro ao verificar permissões, usando fallback', error);
      setHasPermissions(false);
    }
  }, []);

  const loadTrackingSettings = useCallback(async () => {
    if (!hasPermissions) {
      setIsLoaded(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'tracking_settings')
        .single();

      if (error) {
        // Se erro de permissão ou tabela não encontrada, usar fallback silencioso
        if (error.code === 'PGRST116' || error.message?.includes('permission')) {
          console.log('TrackingScripts: Configurações de tracking não encontradas ou sem permissão');
        } else {
          console.error('TrackingScripts: Erro ao carregar configurações:', error);
        }
        setIsLoaded(true);
        return;
      }

      if (data?.value) {
        const settings = data.value as unknown as TrackingSettings;
        setTrackingSettings(settings);
      }
    } catch (error) {
      console.error('TrackingScripts: Erro ao carregar configurações:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [hasPermissions]);

  // Verificar permissões primeiro
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Carregar configurações após verificar permissões
  useEffect(() => {
    if (hasPermissions) {
      loadTrackingSettings();
    } else {
      setIsLoaded(true);
    }
  }, [hasPermissions, loadTrackingSettings]);

  useEffect(() => {
    if (!isLoaded || !trackingSettings) return;

    // Inject Google Analytics if ID exists
    if (trackingSettings.google_analytics_id) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      
      // Check if it's a GA4 (G-) or Universal Analytics (UA-) ID
      if (trackingSettings.google_analytics_id.startsWith('G-')) {
        // Google Analytics 4
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingSettings.google_analytics_id}`;
        document.head.appendChild(gaScript);

        const gaConfigScript = document.createElement('script');
        gaConfigScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingSettings.google_analytics_id}');
        `;
        document.head.appendChild(gaConfigScript);
      } else if (trackingSettings.google_analytics_id.startsWith('UA-')) {
        // Universal Analytics
        gaScript.innerHTML = `
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', '${trackingSettings.google_analytics_id}', 'auto');
          ga('send', 'pageview');
        `;
        document.head.appendChild(gaScript);
      }
    }

    // Inject Facebook Pixel if ID exists
    if (trackingSettings.facebook_pixel_id) {
      const fbPixelScript = document.createElement('script');
      fbPixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${trackingSettings.facebook_pixel_id}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbPixelScript);
      
      const fbPixelNoscript = document.createElement('noscript');
      const fbPixelImg = document.createElement('img');
      fbPixelImg.height = 1;
      fbPixelImg.width = 1;
      fbPixelImg.style.display = 'none';
      fbPixelImg.src = `https://www.facebook.com/tr?id=${trackingSettings.facebook_pixel_id}&ev=PageView&noscript=1`;
      fbPixelNoscript.appendChild(fbPixelImg);
      document.head.appendChild(fbPixelNoscript);
    }

    // Inject custom tracking scripts if they exist
    if (trackingSettings.custom_tracking_scripts) {
      const customScriptsContainer = document.createElement('div');
      customScriptsContainer.innerHTML = trackingSettings.custom_tracking_scripts;
      
      // Append all script nodes to head
      const scriptNodes = customScriptsContainer.querySelectorAll('script');
      scriptNodes.forEach(scriptNode => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(scriptNode.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy content
        newScript.innerHTML = scriptNode.innerHTML;
        
        document.head.appendChild(newScript);
      });
    }
  }, [isLoaded, trackingSettings]);

  // This component doesn't render anything visible
  return null;
};
