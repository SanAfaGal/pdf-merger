import React, { useState, useCallback } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { FileDropzone } from './components/FileDropzone';
import { PDFPairCard } from './components/PDFPairCard';
import { StatsCard } from './components/StatsCard';
import { ZipDownloadModal } from './components/ZipDownloadModal';
import { PDFFile, PDFPair } from './types';
import { createPDFFile, groupPDFFiles, mergePDFs, downloadBlob } from './utils/pdfUtils';
import { createZipFromPairs, downloadZip } from './utils/zipUtils';
import { useLocale, interpolate } from './hooks/useLocale';
import { generateTimestamp } from './utils/formatUtils';

function App() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [pdfPairs, setPdfPairs] = useState<PDFPair[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zipModal, setZipModal] = useState({
    isOpen: false,
    progress: 0,
    isCompleted: false,
    error: null as string | null
  });

  const locale = useLocale();

  const handleFilesSelected = useCallback((files: File[]) => {
    const validPdfFiles: PDFFile[] = [];
    const invalidFiles: string[] = [];

    files.forEach(file => {
      const pdfFile = createPDFFile(file);
      if (pdfFile) {
        validPdfFiles.push(pdfFile);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      const errorMessage = interpolate(locale.errors.invalidFileNames, { 
        files: invalidFiles.join(', ') 
      });
      alert(errorMessage);
    }

    setPdfFiles(validPdfFiles);
    setPdfPairs(groupPDFFiles(validPdfFiles));
  }, [locale]);

  const handleMergePair = useCallback(async (pair: PDFPair) => {
    if (!pair.nFile || !pair.aFile) return;

    setPdfPairs(prev => prev.map(p => 
      p.prefix === pair.prefix ? { ...p, status: 'processing' } : p
    ));

    try {
      const mergedBlob = await mergePDFs(pair.nFile.file, pair.aFile.file);
      
      setPdfPairs(prev => prev.map(p => 
        p.prefix === pair.prefix 
          ? { ...p, status: 'completed', merged: mergedBlob }
          : p
      ));
    } catch (error) {
      setPdfPairs(prev => prev.map(p => 
        p.prefix === pair.prefix 
          ? { ...p, status: 'error', error: locale.errors.mergeFailed }
          : p
      ));
    }
  }, [locale]);

  const handleDownloadPair = useCallback((pair: PDFPair) => {
    if (!pair.merged) return;
    downloadBlob(pair.merged, `${pair.prefix}.pdf`);
  }, []);

  const handleMergeAll = useCallback(async () => {
    const readyPairs = pdfPairs.filter(p => p.status === 'ready');
    if (readyPairs.length === 0) return;

    setIsProcessing(true);
    
    for (const pair of readyPairs) {
      await handleMergePair(pair);
    }
    
    setIsProcessing(false);
  }, [pdfPairs, handleMergePair]);

  const handleDownloadAll = useCallback(async () => {
    const completedPairs = pdfPairs.filter(p => p.status === 'completed' && p.merged);
    
    if (completedPairs.length === 0) {
      alert(locale.errors.noCompletedPairs);
      return;
    }

    // Reset and show modal
    setZipModal({
      isOpen: true,
      progress: 0,
      isCompleted: false,
      error: null
    });

    try {
      const zipBlob = await createZipFromPairs(
        completedPairs,
        (progress) => {
          setZipModal(prev => ({ ...prev, progress }));
        }
      );

      // Generate filename with timestamp
      const timestamp = generateTimestamp();
      const filename = `pdfs-fusionados-${timestamp}.zip`;
      
      downloadZip(zipBlob, filename);
      
      setZipModal(prev => ({
        ...prev,
        progress: 100,
        isCompleted: true
      }));
    } catch (error) {
      setZipModal(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : locale.errors.zipCreationFailed
      }));
    }
  }, [pdfPairs, locale]);

  const handleCloseZipModal = useCallback(() => {
    setZipModal({
      isOpen: false,
      progress: 0,
      isCompleted: false,
      error: null
    });
  }, []);

  const handleReset = useCallback(() => {
    setPdfFiles([]);
    setPdfPairs([]);
    setIsProcessing(false);
    handleCloseZipModal();
  }, [handleCloseZipModal]);

  const stats = {
    totalPairs: pdfPairs.length,
    completePairs: pdfPairs.filter(p => p.status === 'completed').length,
    incompletePairs: pdfPairs.filter(p => p.status === 'incomplete').length,
    processingPairs: pdfPairs.filter(p => p.status === 'processing').length
  };

  const readyPairs = pdfPairs.filter(p => p.status === 'ready').length;
  const completedPairs = pdfPairs.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{locale.appTitle}</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locale.appDescription}
          </p>
        </div>

        {/* File Upload */}
        <div className="max-w-2xl mx-auto mb-8">
          <FileDropzone 
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
          />
        </div>

        {/* Stats and Actions */}
        {pdfPairs.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <StatsCard {...stats} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{locale.actions.title}</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleMergeAll}
                    disabled={readyPairs === 0 || isProcessing}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {locale.actions.mergeAll} ({readyPairs})
                  </button>
                  <button
                    onClick={handleDownloadAll}
                    disabled={completedPairs === 0 || zipModal.isOpen}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{locale.actions.downloadAll} ({completedPairs})</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{locale.actions.reset}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Pairs Grid */}
        {pdfPairs.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{locale.pairsSection.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfPairs.map(pair => (
                <PDFPairCard
                  key={pair.prefix}
                  pair={pair}
                  onDownload={handleDownloadPair}
                  onMerge={handleMergePair}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pdfFiles.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{locale.emptyState.title}</h3>
            <p className="text-gray-600">
              {locale.emptyState.description}
            </p>
          </div>
        )}
      </div>

      {/* ZIP Download Modal */}
      <ZipDownloadModal
        isOpen={zipModal.isOpen}
        onClose={handleCloseZipModal}
        progress={zipModal.progress}
        isCompleted={zipModal.isCompleted}
        error={zipModal.error}
        fileCount={completedPairs}
      />
    </div>
  );
}

export default App;