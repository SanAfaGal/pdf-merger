import React from 'react';
import { FileText, Check, AlertTriangle, Clock } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

interface StatsCardProps {
  totalPairs: number;
  completePairs: number;
  incompletePairs: number;
  processingPairs: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  totalPairs,
  completePairs,
  incompletePairs,
  processingPairs
}) => {
  const locale = useLocale();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{locale.stats.title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalPairs}</p>
            <p className="text-sm text-gray-600">{locale.stats.totalPairs}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{completePairs}</p>
            <p className="text-sm text-gray-600">{locale.stats.completed}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{incompletePairs}</p>
            <p className="text-sm text-gray-600">{locale.stats.incomplete}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{processingPairs}</p>
            <p className="text-sm text-gray-600">{locale.stats.processing}</p>
          </div>
        </div>
      </div>
    </div>
  );
};