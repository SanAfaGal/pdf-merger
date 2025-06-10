import React from 'react';
import { Download, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocale, interpolate } from '../hooks/useLocale';

interface ZipDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  isCompleted: boolean;
  error: string | null;
  fileCount: number;
}

export const ZipDownloadModal: React.FC<ZipDownloadModalProps> = ({
  isOpen,
  onClose,
  progress,
  isCompleted,
  error,
  fileCount
}) => {
  const locale = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {locale.zipModal.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={!isCompleted && !error}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">{locale.zipModal.compressionFailed}</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          ) : isCompleted ? (
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">{locale.zipModal.downloadComplete}</p>
                <p className="text-sm text-green-600 mt-1">
                  {interpolate(locale.zipModal.successMessage, { count: fileCount.toString() })}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <Download className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {interpolate(locale.zipModal.compressing, { count: fileCount.toString() })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {locale.zipModal.pleaseWait}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{locale.zipModal.progress}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {(isCompleted || error) && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {locale.zipModal.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};