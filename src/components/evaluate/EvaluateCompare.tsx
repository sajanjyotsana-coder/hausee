import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCompare } from '../../hooks/useCompare';
import { CompareTable } from './CompareTable';

interface EvaluateCompareProps {
  selectedHomeIds: string[];
  onBack: () => void;
}

export function EvaluateCompare({ selectedHomeIds, onBack }: EvaluateCompareProps) {
  const { compareData, loading, error } = useCompare(selectedHomeIds);
  const [currentPage, setCurrentPage] = useState(0);

  const homesPerPage = 3;
  const totalPages = Math.ceil(compareData.length / homesPerPage);
  const displayedHomes = compareData.slice(
    currentPage * homesPerPage,
    (currentPage + 1) * homesPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (selectedHomeIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Homes Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Select 2-3 homes from the Browse view to compare them side-by-side.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (selectedHomeIds.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select More Homes
          </h3>
          <p className="text-gray-600 mb-6">
            You need to select at least 2 homes to compare. Select one more home from the Browse view.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Comparison
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Browse</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900">
              Comparing {compareData.length} {compareData.length === 1 ? 'Home' : 'Homes'}
            </h2>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <CompareTable compareData={displayedHomes} />
      </div>

      <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {displayedHomes.length} of {compareData.length} selected{' '}
            {compareData.length === 1 ? 'home' : 'homes'}
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Exit Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
