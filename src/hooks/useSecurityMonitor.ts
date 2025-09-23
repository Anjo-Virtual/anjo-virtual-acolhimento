import { useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { secureLog } from '@/utils/security';

export const useSecurityMonitor = () => {
  const attemptCount = useRef(0);
  const lastAttempt = useRef(0);

  useEffect(() => {
    // Monitor for rapid form submissions
    const monitorFormSubmissions = () => {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        form.addEventListener('submit', () => {
          const now = Date.now();
          if (now - lastAttempt.current < 1000) { // Less than 1 second between submissions
            attemptCount.current++;
            if (attemptCount.current > 3) {
              toast({
                title: "Submissão muito rápida",
                description: "Por favor, aguarde antes de tentar novamente.",
                variant: "destructive",
              });
              secureLog('warn', 'Rapid form submission detected', { 
                attempts: attemptCount.current,
                timestamp: now 
              });
            }
          } else {
            attemptCount.current = 0;
          }
          lastAttempt.current = now;
        });
      });
    };

    // Monitor for URL manipulation attempts
    const monitorURLChanges = () => {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function(state, title, url) {
        if (url && typeof url === 'string') {
          // Check for suspicious URL patterns
          if (url.includes('<script>') || url.includes('javascript:') || url.includes('data:')) {
            secureLog('warn', 'Suspicious URL manipulation detected', { url });
            return;
          }
        }
        return originalPushState.apply(this, arguments);
      };

      history.replaceState = function(state, title, url) {
        if (url && typeof url === 'string') {
          // Check for suspicious URL patterns
          if (url.includes('<script>') || url.includes('javascript:') || url.includes('data:')) {
            secureLog('warn', 'Suspicious URL manipulation detected', { url });
            return;
          }
        }
        return originalReplaceState.apply(this, arguments);
      };
    };

    // Monitor localStorage/sessionStorage access
    const monitorStorageAccess = () => {
      const sensitiveKeys = ['token', 'password', 'secret', 'key', 'auth'];
      
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key, value) {
        if (sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
          secureLog('warn', 'Attempt to store sensitive data in localStorage', { key });
        }
        return originalSetItem.apply(this, arguments);
      };
    };

    monitorFormSubmissions();
    monitorURLChanges();
    monitorStorageAccess();

    // Clean up interval for attempt counting
    const interval = setInterval(() => {
      if (Date.now() - lastAttempt.current > 60000) { // Reset after 1 minute
        attemptCount.current = 0;
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    logSecurityEvent: (event: string, data?: any) => {
      secureLog('warn', `Security event: ${event}`, data);
    }
  };
};