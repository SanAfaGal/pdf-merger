import JSZip from 'jszip';
import { PDFPair } from '../types';

export const createZipFromPairs = async (
  pairs: PDFPair[],
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const zip = new JSZip();
  const completedPairs = pairs.filter(p => p.status === 'completed' && p.merged);
  
  if (completedPairs.length === 0) {
    throw new Error('No hay pares de PDF completados disponibles para descargar');
  }

  // Agregar cada PDF fusionado al ZIP
  for (let i = 0; i < completedPairs.length; i++) {
    const pair = completedPairs[i];
    if (pair.merged) {
      const fileName = `${pair.prefix}.pdf`;
      zip.file(fileName, pair.merged);
      
      // Actualizar progreso
      if (onProgress) {
        const progress = ((i + 1) / completedPairs.length) * 50; // Primeros 50% para agregar archivos
        onProgress(progress);
      }
    }
  }

  // Generar el archivo ZIP
  const zipBlob = await zip.generateAsync(
    { 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      if (onProgress) {
        // Segundos 50% para compresión
        const progress = 50 + (metadata.percent * 0.5);
        onProgress(progress);
      }
    }
  );

  return zipBlob;
};

export const downloadZip = (zipBlob: Blob, filename: string = 'pdfs-fusionados.zip') => {
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};