import { PDFDocument } from 'pdf-lib';
import { PDFFile, PDFPair } from '../types';
import { normalizeText } from './formatUtils';

export const parsePDFFileName = (fileName: string): { prefix: string; suffix: string } | null => {
  // Normalizar el texto para manejar caracteres especiales
  const normalizedName = normalizeText(fileName);
  const match = normalizedName.match(/^(\d+)([an])\.pdf$/i);
  if (!match) return null;
  
  return {
    prefix: match[1],
    suffix: match[2].toUpperCase()
  };
};

export const createPDFFile = (file: File): PDFFile | null => {
  const parsed = parsePDFFileName(file.name);
  if (!parsed) return null;
  
  return {
    file,
    name: file.name,
    prefix: parsed.prefix,
    suffix: parsed.suffix,
    status: 'pending'
  };
};

export const groupPDFFiles = (pdfFiles: PDFFile[]): PDFPair[] => {
  const groups: { [key: string]: PDFPair } = {};
  
  pdfFiles.forEach(pdfFile => {
    if (!groups[pdfFile.prefix]) {
      groups[pdfFile.prefix] = {
        prefix: pdfFile.prefix,
        status: 'incomplete'
      };
    }
    
    if (pdfFile.suffix === 'N') {
      groups[pdfFile.prefix].nFile = pdfFile;
    } else if (pdfFile.suffix === 'A') {
      groups[pdfFile.prefix].aFile = pdfFile;
    }
  });
  
  // Actualizar estado basado en completitud
  Object.values(groups).forEach(pair => {
    if (pair.nFile && pair.aFile) {
      pair.status = 'ready';
    }
  });
  
  return Object.values(groups);
};

export const mergePDFs = async (nFile: File, aFile: File): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();
  
  // Procesar archivo N
  const nArrayBuffer = await nFile.arrayBuffer();
  const nPdf = await PDFDocument.load(nArrayBuffer);
  const nPages = await mergedPdf.copyPages(nPdf, nPdf.getPageIndices());
  nPages.forEach(page => mergedPdf.addPage(page));
  
  // Procesar archivo A
  const aArrayBuffer = await aFile.arrayBuffer();
  const aPdf = await PDFDocument.load(aArrayBuffer);
  const aPages = await mergedPdf.copyPages(aPdf, aPdf.getPageIndices());
  aPages.forEach(page => mergedPdf.addPage(page));
  
  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};