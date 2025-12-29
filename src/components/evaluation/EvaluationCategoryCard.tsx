import { ChevronDown, ChevronUp } from 'lucide-react';
import * as Icons from 'lucide-react';
import { EvaluationCategory, RatingValue } from '../../types';
import EvaluationItemComponent from './EvaluationItem';

interface EvaluationCategoryCardProps {
  category: EvaluationCategory;
  categoryId: string;
  isExpanded: boolean;
  onToggle: () => void;
  ratings: Record<string, RatingValue | number | string>;
  itemNotes: Record<string, string>;
  sectionNote: string;
  onRatingChange: (categoryId: string, itemId: string, value: RatingValue | number | string) => void;
  onNoteChange: (itemId: string, note: string) => void;
  onSectionNoteChange: (note: string) => void;
}

export default function EvaluationCategoryCard({
  category,
  categoryId,
  isExpanded,
  onToggle,
  ratings,
  itemNotes,
  sectionNote,
  onRatingChange,
  onNoteChange,
  onSectionNoteChange,
}: EvaluationCategoryCardProps) {
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] || Icons.Home;

  const totalItems = category.items.length;
  const ratedItems = category.items.filter((item) => {
    const value = ratings[item.id];
    return value !== undefined && value !== null && value !== '';
  }).length;
  const progress = totalItems > 0 ? Math.round((ratedItems / totalItems) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-6 h-6 text-primary-400" />
          </div>

          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-gray-900">{category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900">
                {ratedItems}/{totalItems}
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>

            <div className="w-32 hidden md:block">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">{progress}%</div>
            </div>
          </div>
        </div>

        <div className="ml-4">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="px-6 py-4 space-y-1">
            {category.items.map((item) => (
              <EvaluationItemComponent
                key={item.id}
                item={item}
                categoryId={categoryId}
                value={ratings[item.id] || null}
                note={itemNotes[item.id] || ''}
                onRatingChange={onRatingChange}
                onNoteChange={onNoteChange}
              />
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Notes (optional, max 1000 characters)
            </label>
            <textarea
              value={sectionNote}
              onChange={(e) => onSectionNoteChange(e.target.value.slice(0, 1000))}
              placeholder={`Add any general notes about ${category.title.toLowerCase()}...`}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
              rows={4}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {sectionNote.length} / 1000
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
