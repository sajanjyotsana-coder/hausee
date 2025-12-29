import { Check, X, Minus } from 'lucide-react';

interface CompareCellProps {
  value: string | number | boolean | null | undefined;
  type: 'rating' | 'radio' | 'checkbox' | 'checkbox_with_text' | 'currency' | 'textarea';
  note?: string;
}

export function CompareCell({ value, type, note }: CompareCellProps) {
  if (type === 'rating') {
    if (value === 'good') {
      return (
        <div className="flex flex-col items-center gap-1">
          <Check className="w-6 h-6 text-green-600" />
          {note && (
            <button className="text-xs text-gray-500 hover:text-gray-700">
              Note
            </button>
          )}
        </div>
      );
    }
    if (value === 'fair') {
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl text-yellow-600">~</span>
          {note && (
            <button className="text-xs text-gray-500 hover:text-gray-700">
              Note
            </button>
          )}
        </div>
      );
    }
    if (value === 'poor') {
      return (
        <div className="flex flex-col items-center gap-1">
          <X className="w-6 h-6 text-red-600" />
          {note && (
            <button className="text-xs text-gray-500 hover:text-gray-700">
              Note
            </button>
          )}
        </div>
      );
    }
  }

  if (type === 'checkbox' || type === 'checkbox_with_text') {
    if (value === true || (typeof value === 'string' && value !== '')) {
      return (
        <div className="flex flex-col items-center gap-1">
          <Check className="w-6 h-6 text-green-600" />
          {typeof value === 'string' && value !== '' && (
            <span className="text-xs text-gray-600 truncate max-w-[120px]" title={value}>
              {value}
            </span>
          )}
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex items-center justify-center">
          <X className="w-6 h-6 text-gray-400" />
        </div>
      );
    }
  }

  if (type === 'radio') {
    if (typeof value === 'string' && value !== '') {
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-gray-700">{value}</span>
          {note && (
            <button className="text-xs text-gray-500 hover:text-gray-700">
              Note
            </button>
          )}
        </div>
      );
    }
  }

  if (type === 'currency') {
    if (typeof value === 'number' && value > 0) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            ${value.toLocaleString()}
          </span>
        </div>
      );
    }
  }

  if (type === 'textarea') {
    if (typeof value === 'string' && value.trim() !== '') {
      return (
        <div className="flex items-center justify-center px-2">
          <button
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            title={value}
          >
            View note
          </button>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Minus className="w-5 h-5 text-gray-300" />
    </div>
  );
}
