import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Home, AddHomeFormData } from '../../types';
import HomeCard from './HomeCard';
import AddHomeModal from './AddHomeModal';
import EmptyState from '../EmptyState';
import LoadingSpinner from '../LoadingSpinner';

interface EvaluateBrowseProps {
  homes: Home[];
  isLoading: boolean;
  compareCount: number;
  onAddHome: (formData: AddHomeFormData) => Promise<{ success: boolean; error?: string }>;
  onToggleFavorite: (homeId: string) => void;
  onToggleCompare: (homeId: string) => Promise<{ success: boolean; error?: string }>;
  onCompareClick?: () => void;
  onHomeClick: (homeId: string) => void;
}

export default function EvaluateBrowse({
  homes,
  isLoading,
  compareCount,
  onAddHome,
  onToggleFavorite,
  onToggleCompare,
  onCompareClick,
  onHomeClick,
}: EvaluateBrowseProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const filteredHomes = homes.filter((home) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const addressMatch = home.address.toLowerCase().includes(query);
    const neighborhoodMatch = home.neighborhood?.toLowerCase().includes(query);
    return addressMatch || neighborhoodMatch;
  });

  const handleAddHome = async (formData: AddHomeFormData) => {
    setError(null);
    const result = await onAddHome(formData);

    if (result.success) {
      setShowAddModal(false);
    } else {
      setError(result.error || 'Failed to add home');
    }
  };

  const handleToggleCompare = async (homeId: string) => {
    setError(null);
    const result = await onToggleCompare(homeId);

    if (!result.success && result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCardClick = (homeId: string) => {
    onHomeClick(homeId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (homes.length === 0) {
    return (
      <>
        <EmptyState
          icon="🏠"
          title="You haven't added any homes yet"
          description="Start by browsing listings on Realtor.ca or Zolo.ca, then add homes here to rate, compare, and track them."
          actionLabel="+ Add Your First Home"
          onAction={() => setShowAddModal(true)}
        />

        {showAddModal && (
          <AddHomeModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddHome}
          />
        )}

        {error && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address or neighborhood..."
            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredHomes.length} {filteredHomes.length === 1 ? 'home' : 'homes'}
          </p>
        )}
      </div>

      {filteredHomes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No homes found</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            No homes match your search. Try a different address or neighborhood.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-primary-400 hover:text-primary-500 font-medium"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHomes.map((home) => (
            <HomeCard
              key={home.id}
              home={home}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onCardClick={() => handleCardClick(home.id)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 md:right-8 lg:right-12 w-14 h-14 bg-primary-400 text-white rounded-full shadow-lg hover:bg-primary-500 transition-all hover:scale-110 flex items-center justify-center z-10"
        title="Add a home"
      >
        <Plus className="w-6 h-6" />
      </button>

      {compareCount >= 2 && (
        <button
          onClick={onCompareClick}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-500 transition-all z-10 flex items-center gap-2 font-medium"
        >
          Compare {compareCount} Homes
        </button>
      )}

      {showAddModal && (
        <AddHomeModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddHome}
        />
      )}

      {error && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md text-center">
          {error}
        </div>
      )}
    </div>
  );
}
