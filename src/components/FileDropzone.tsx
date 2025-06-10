import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const locale = useLocale();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'application/pdf'
      );
      onFilesSelected(files);
      e.dataTransfer.clearData();
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale.dropzone.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {locale.dropzone.subtitle}
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{locale.dropzone.pdfOnly}</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{locale.dropzone.format}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};