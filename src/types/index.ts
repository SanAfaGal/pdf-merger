export interface PDFFile {
  file: File;
  name: string;
  prefix: string;
  suffix: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface PDFPair {
  prefix: string;
  nFile?: PDFFile;
  aFile?: PDFFile;
  merged?: Blob;
  status: 'incomplete' | 'ready' | 'processing' | 'completed' | 'error';
  error?: string;
}