import { esCoLocale, LocaleType } from '../locales/es-CO';

// Hook para usar la localización
export const useLocale = (): LocaleType => {
  // Por ahora solo retornamos español colombiano
  // En el futuro se puede expandir para soportar múltiples idiomas
  return esCoLocale;
};

// Función helper para interpolación de strings
export const interpolate = (template: string, values: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
};