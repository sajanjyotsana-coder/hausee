import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

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

export function useCompare(selectedHomeIds: string[]) {
  const [compareData, setCompareData] = useState<CompareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedHomeIds.length === 0) {
      setCompareData([]);
      setLoading(false);
      return;
    }

    fetchCompareData();
  }, [selectedHomeIds]);

  const fetchCompareData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: homes, error: homesError } = await supabase
        .from('homes')
        .select('*')
        .in('id', selectedHomeIds);

      if (homesError) throw homesError;

      const { data: evaluations, error: evaluationsError } = await supabase
        .from('home_evaluations')
        .select('*')
        .in('home_id', selectedHomeIds);

      if (evaluationsError) throw evaluationsError;

      const data: CompareData[] = (homes || []).map((home) => {
        const evaluation = evaluations?.find((e) => e.home_id === home.id) || null;
        return { home, evaluation };
      });

      setCompareData(data);
    } catch (err) {
      console.error('Error fetching compare data:', err);
      setError('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  return {
    compareData,
    loading,
    error,
    refresh: fetchCompareData,
  };
}
