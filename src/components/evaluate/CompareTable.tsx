import { Star } from 'lucide-react';
import { EVALUATION_CATEGORIES } from '../../data/evaluationCategories';
import { CompareCell } from './CompareCell';

interface Home {
  id: string;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  year_built: number | null;
  feature_image_url: string | null;
  evaluation_status: string | null;
  overall_rating: number | null;
  offer_intent: string | null;
}

interface HomeEvaluation {
  home_id: string;
  ratings: {
    [categoryId: string]: {
      [itemId: string]: string | number | boolean;
    };
  };
  item_notes: {
    [itemId: string]: string;
  };
  section_notes: {
    [categoryId: string]: string;
  };
  overall_rating: number | null;
}

interface CompareData {
  home: Home;
  evaluation: HomeEvaluation | null;
}

interface CompareTableProps {
  compareData: CompareData[];
}

export function CompareTable({ compareData }: CompareTableProps) {
  const getOfferIntentBadge = (intent: string | null) => {
    if (!intent) return null;

    const styles = {
      yes: 'bg-green-100 text-green-800',
      maybe: 'bg-yellow-100 text-yellow-800',
      no: 'bg-gray-100 text-gray-600',
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles[intent as keyof typeof styles] || ''}`}>
        {intent.charAt(0).toUpperCase() + intent.slice(1)}
      </span>
    );
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-sm text-gray-400">Not rated</span>;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : star === fullStars + 1 && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
        <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="sticky left-0 z-20 bg-gray-50 px-4 py-6 text-left w-64">
              <span className="text-sm font-semibold text-gray-700">Property Details</span>
            </th>
            {compareData.map((data) => (
              <th key={data.home.id} className="px-6 py-4 min-w-[280px]">
                <div className="flex flex-col items-center gap-3">
                  {data.home.feature_image_url ? (
                    <img
                      src={data.home.feature_image_url}
                      alt={data.home.address}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900">{data.home.address}</h3>
                    <p className="text-sm text-gray-600">
                      {data.home.city}, {data.home.province}
                    </p>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr className="border-b border-gray-200 bg-white">
            <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-sm text-gray-700">
              Price
            </td>
            {compareData.map((data) => (
              <td key={data.home.id} className="px-6 py-3 text-center">
                <span className="text-lg font-bold text-gray-900">
                  {data.home.price ? `$${data.home.price.toLocaleString()}` : 'Not listed'}
                </span>
              </td>
            ))}
          </tr>

          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="sticky left-0 z-10 bg-gray-50 px-4 py-3 font-medium text-sm text-gray-700">
              Bedrooms / Bathrooms
            </td>
            {compareData.map((data) => (
              <td key={data.home.id} className="px-6 py-3 text-center">
                <span className="text-sm text-gray-700">
                  {data.home.bedrooms || '—'} bed / {data.home.bathrooms || '—'} bath
                </span>
              </td>
            ))}
          </tr>

          <tr className="border-b border-gray-200 bg-white">
            <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-sm text-gray-700">
              Year Built
            </td>
            {compareData.map((data) => (
              <td key={data.home.id} className="px-6 py-3 text-center">
                <span className="text-sm text-gray-700">
                  {data.home.year_built || '—'}
                </span>
              </td>
            ))}
          </tr>

          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="sticky left-0 z-10 bg-gray-50 px-4 py-3 font-medium text-sm text-gray-700">
              Square Feet
            </td>
            {compareData.map((data) => (
              <td key={data.home.id} className="px-6 py-3 text-center">
                <span className="text-sm text-gray-700">
                  {data.home.square_feet ? `${data.home.square_feet.toLocaleString()} sq ft` : '—'}
                </span>
              </td>
            ))}
          </tr>

          <tr className="border-b border-gray-200 bg-white">
            <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-sm text-gray-700">
              Overall Rating
            </td>
            {compareData.map((data) => (
              <td key={data.home.id} className="px-6 py-3">
                <div className="flex justify-center">
                  {renderStars(data.evaluation?.overall_rating || data.home.overall_rating)}
                </div>
              </td>
            ))}
          </tr>

          <tr className="border-b-2 border-gray-300 bg-gray-50">
            <td className="sticky left-0 z-10 bg-gray-50 px-4 py-3 font-medium text-sm text-gray-700">
              Offer Intent
            </td>
            {compareData.map((data) => (
              <td key={data.home.id} className="px-6 py-3 text-center">
                {getOfferIntentBadge(data.home.offer_intent)}
              </td>
            ))}
          </tr>

          {EVALUATION_CATEGORIES.map((category) => (
            <>
              <tr key={`category-${category.id}`} className="bg-gray-100 border-b border-gray-300">
                <td
                  colSpan={compareData.length + 1}
                  className="sticky left-0 z-10 bg-gray-100 px-4 py-3 font-bold text-sm text-gray-900"
                >
                  {category.title}
                </td>
              </tr>
              {category.items.map((item, index) => (
                <tr
                  key={`${category.id}-${item.id}`}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className={`sticky left-0 z-10 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} px-4 py-3 text-sm text-gray-700`}>
                    {item.label}
                  </td>
                  {compareData.map((data) => {
                    const value = data.evaluation?.ratings?.[category.id]?.[item.id];
                    const note = data.evaluation?.item_notes?.[item.id];
                    return (
                      <td key={data.home.id} className="px-6 py-3">
                        <CompareCell value={value} type={item.type} note={note} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
