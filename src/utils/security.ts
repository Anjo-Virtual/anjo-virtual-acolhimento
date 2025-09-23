
import DOMPurify from 'isomorphic-dompurify';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters and normalize
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove basic XSS characters
    .substring(0, 1000); // Limit length
};

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // International phone number validation (10-15 digits)
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateWhatsAppNumber = (number: string): boolean => {
  // WhatsApp numbers should be 10-15 digits, starting with country code
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length >= 10 && cleanNumber.length <= 15;
};

// Enhanced input validation
export const validateInput = (input: string, type: 'email' | 'phone' | 'text' | 'name'): { isValid: boolean; error?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input é obrigatório' };
  }

  const trimmed = input.trim();
  
  switch (type) {
    case 'email':
      if (!validateEmail(trimmed)) {
        return { isValid: false, error: 'Email inválido' };
      }
      break;
    case 'phone':
      if (!validatePhoneNumber(trimmed)) {
        return { isValid: false, error: 'Telefone inválido' };
      }
      break;
    case 'name':
      if (trimmed.length < 2 || trimmed.length > 100) {
        return { isValid: false, error: 'Nome deve ter entre 2 e 100 caracteres' };
      }
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
        return { isValid: false, error: 'Nome contém caracteres inválidos' };
      }
      break;
    case 'text':
      if (trimmed.length > 2000) {
        return { isValid: false, error: 'Texto muito longo (máximo 2000 caracteres)' };
      }
      break;
  }
  
  return { isValid: true };
};

// Enhanced form validation
export const validateContactForm = (data: { name: string; email: string; phone: string; message?: string }) => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateInput(data.name, 'name');
  if (!nameValidation.isValid) errors.name = nameValidation.error!;
  
  const emailValidation = validateInput(data.email, 'email');
  if (!emailValidation.isValid) errors.email = emailValidation.error!;
  
  const phoneValidation = validateInput(data.phone, 'phone');
  if (!phoneValidation.isValid) errors.phone = phoneValidation.error!;
  
  if (data.message) {
    const messageValidation = validateInput(data.message, 'text');
    if (!messageValidation.isValid) errors.message = messageValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Rate limiting utility (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
};

// Get client IP for rate limiting (fallback implementation)
export const getClientIP = (): string => {
  // In a real implementation, this would come from request headers
  // For client-side rate limiting, we use a combination of browser fingerprinting
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  
  // Simple hash function for fingerprinting
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `client_${Math.abs(hash)}`;
};

// Secure data masking for logs
export const maskSensitiveData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = ['password', 'token', 'key', 'secret', 'api_key'];
  const masked = { ...data };
  
  Object.keys(masked).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***MASKED***';
    }
  });
  
  return masked;
};

// Safe console logging (removes sensitive data)
export const secureLog = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  const maskedData = data ? maskSensitiveData(data) : undefined;
  
  if (process.env.NODE_ENV === 'development') {
    console[level](message, maskedData);
  } else {
    // In production, only log errors and critical warnings
    if (level === 'error') {
      console.error(message, maskedData);
    }
  }
};
