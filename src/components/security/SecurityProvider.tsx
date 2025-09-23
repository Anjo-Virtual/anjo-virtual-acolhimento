import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Add security headers via meta tags
    const addSecurityHeaders = () => {
      // Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https: blob:;
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        frame-src 'self' https://js.stripe.com;
      `.replace(/\s+/g, ' ').trim();
      
      // X-Frame-Options
      const frameMeta = document.createElement('meta');
      frameMeta.httpEquiv = 'X-Frame-Options';
      frameMeta.content = 'DENY';
      
      // X-Content-Type-Options
      const contentTypeMeta = document.createElement('meta');
      contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
      contentTypeMeta.content = 'nosniff';
      
      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      
      // Permissions Policy
      const permissionsMeta = document.createElement('meta');
      permissionsMeta.httpEquiv = 'Permissions-Policy';
      permissionsMeta.content = 'camera=(), microphone=(), location=(), payment=()';
      
      // Add to head if not already present
      const head = document.head;
      if (!head.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        head.appendChild(cspMeta);
      }
      if (!head.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        head.appendChild(frameMeta);
      }
      if (!head.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        head.appendChild(contentTypeMeta);
      }
      if (!head.querySelector('meta[name="referrer"]')) {
        head.appendChild(referrerMeta);
      }
      if (!head.querySelector('meta[http-equiv="Permissions-Policy"]')) {
        head.appendChild(permissionsMeta);
      }
    };

    // Monitor for suspicious activity
    const monitorSecurity = () => {
      // Detect potential XSS attempts
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const errorMsg = args.join(' ');
        if (errorMsg.includes('script') || errorMsg.includes('eval') || errorMsg.includes('iframe')) {
          toast({
            title: "Atividade suspeita detectada",
            description: "Um potencial problema de segurança foi bloqueado.",
            variant: "destructive",
          });
        }
        originalConsoleError.apply(console, args);
      };

      // Detect excessive failed requests (potential attack)
      let failedRequests = 0;
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          if (!response.ok && response.status >= 400) {
            failedRequests++;
            if (failedRequests > 10) {
              toast({
                title: "Muitas requisições falharam",
                description: "Por favor, atualize a página e tente novamente.",
                variant: "destructive",
              });
            }
          } else {
            failedRequests = Math.max(0, failedRequests - 1);
          }
          return response;
        } catch (error) {
          failedRequests++;
          throw error;
        }
      };
    };

    // Disable right-click context menu on production
    const disableContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
        return false;
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U in production
    const disableDevTools = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    addSecurityHeaders();
    monitorSecurity();
    
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('keydown', disableDevTools);
    }

    return () => {
      if (process.env.NODE_ENV === 'production') {
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableDevTools);
      }
    };
  }, []);

  return <>{children}</>;
};