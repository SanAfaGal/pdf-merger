import React from 'react';
import { Check, X, Download, Loader2, FileText, AlertTriangle } from 'lucide-react';
import { PDFPair } from '../types';
import { useLocale } from '../hooks/useLocale';

interface PDFPairCardProps {
  pair: PDFPair;
  onDownload: (pair: PDFPair) => void;
  onMerge: (pair: PDFPair) => void;
}

export const PDFPairCard: React.FC<PDFPairCardProps> = ({ pair, onDownload, onMerge }) => {
  const locale = useLocale();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'ready': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error': return <X className="w-4 h-4" />;
      case 'ready': return <FileText className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    return locale.pairStatus[status as keyof typeof locale.pairStatus] || status;
  };

  const canMerge = pair.status === 'ready' && pair.nFile && pair.aFile;
  const canDownload = pair.status === 'completed' && pair.merged;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {locale.pairCard.pairTitle} {pair.prefix}
        </h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pair.status)}`}>
          {getStatusIcon(pair.status)}
          <span>{getStatusText(pair.status)}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${pair.nFile ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-700">
            {pair.nFile ? pair.nFile.name : `${pair.prefix}N.pdf (${locale.pairCard.missing})`}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${pair.aFile ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-700">
            {pair.aFile ? pair.aFile.name : `${pair.prefix}A.pdf (${locale.pairCard.missing})`}
          </span>
        </div>
      </div>

      {pair.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{pair.error}</p>
        </div>
      )}

      <div className="flex space-x-3">
        {canMerge && (
          <button
            onClick={() => onMerge(pair)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {locale.pairCard.mergePdfs}
          </button>
        )}
        {canDownload && (
          <button
            onClick={() => onDownload(pair)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{locale.pairCard.download}</span>
          </button>
        )}
      </div>
    </div>
  );
};