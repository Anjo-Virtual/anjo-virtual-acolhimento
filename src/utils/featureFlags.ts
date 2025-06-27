
// Feature flags para controlar funcionalidades do sistema
export const FEATURE_FLAGS = {
  STRIPE_CHECKOUT_ENABLED: false, // Desabilitado temporariamente
  RAG_CHAT_ENABLED: true,
  N8N_WEBHOOK_ENABLED: true,
} as const;

export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};
