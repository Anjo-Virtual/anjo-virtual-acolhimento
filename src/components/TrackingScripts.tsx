
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrackingSettings {
  google_analytics_id: string;
  facebook_pixel_id: string;
  custom_tracking_scripts: string;
}

export const TrackingScripts = () => {
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  const loadTrackingSettings = useCallback(async () => {
    // Evitar múltiplas execuções
    if (initialized.current) return;
    initialized.current = true;

    // Verificar se estamos em desenvolvimento e pular se necessário
    if (process.env.NODE_ENV === 'development') {
      console.log('TrackingScripts: Modo desenvolvimento - carregamento opcional');
    }

    try {
      // Primeiro verificar se o usuário tem permissões
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoaded(true);
        return;
      }

      // Tentar carregar as configurações com timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const queryPromise = supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'tracking_settings')
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        // Falhar silenciosamente se não tiver permissão ou tabela não existir
        if (error.code === 'PGRST116' || error.code === 'PGRST301' || 
            error.message?.includes('permission') || error.message?.includes('relation')) {
          console.log('TrackingScripts: Configurações não disponíveis ou sem permissão');
        }
        setIsLoaded(true);
        return;
      }

      if (data?.value) {
        const settings = data.value as unknown as TrackingSettings;
        setTrackingSettings(settings);
      }
    } catch (error: any) {
      // Falhar silenciosamente em caso de erro
      console.log('TrackingScripts: Erro silencioso:', error.message);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Carregar apenas uma vez
    loadTrackingSettings();
  }, [loadTrackingSettings]);

  useEffect(() => {
    if (!isLoaded || !trackingSettings) return;

    // Injetar scripts apenas se existirem configurações válidas
    if (trackingSettings.google_analytics_id && trackingSettings.google_analytics_id.trim()) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      
      if (trackingSettings.google_analytics_id.startsWith('G-')) {
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
      }
    }

    if (trackingSettings.facebook_pixel_id && trackingSettings.facebook_pixel_id.trim()) {
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
    }

    if (trackingSettings.custom_tracking_scripts && trackingSettings.custom_tracking_scripts.trim()) {
      const customScriptsContainer = document.createElement('div');
      customScriptsContainer.innerHTML = trackingSettings.custom_tracking_scripts;
      
      const scriptNodes = customScriptsContainer.querySelectorAll('script');
      scriptNodes.forEach(scriptNode => {
        const newScript = document.createElement('script');
        Array.from(scriptNode.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.innerHTML = scriptNode.innerHTML;
        document.head.appendChild(newScript);
      });
    }
  }, [isLoaded, trackingSettings]);

  return null;
};
