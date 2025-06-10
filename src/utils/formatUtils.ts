// Utilidades de formato para Colombia
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

// Función para normalizar texto con caracteres especiales del español
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remueve acentos para búsquedas
};

// Función para mantener caracteres especiales en visualización
export const preserveAccents = (text: string): string => {
  return text; // Mantiene los acentos originales
};

// Función para generar timestamp en formato colombiano
export const generateTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
};