
export interface WhatsAppConfig {
  destination_number: string;
}

export const isWhatsAppConfig = (value: any): value is WhatsAppConfig => {
  return value && typeof value === 'object' && typeof value.destination_number === 'string';
};
