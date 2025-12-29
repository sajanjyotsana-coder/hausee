import { EvaluationCategory } from '../types';

export const EVALUATION_CATEGORIES: EvaluationCategory[] = [
  {
    id: 'exteriors',
    title: 'Exteriors',
    icon: 'Home',
    items: [
      { id: 'curb_appeal', label: 'Curb Appeal', type: 'rating' },
      { id: 'backyard', label: 'Backyard', type: 'rating' },
      { id: 'windows_doors', label: 'Windows / Doors', type: 'rating' },
      { id: 'roofing', label: 'Roofing', type: 'rating' },
      { id: 'entryway_driveway', label: 'Entryway / Driveway', type: 'rating' },
      { id: 'balcony_deck_patio_porch', label: 'Balcony / Deck / Patio / Porch', type: 'rating' },
      { id: 'fencing', label: 'Fencing', type: 'rating' },
    ],
  },
  {
    id: 'interiors',
    title: 'Interiors',
    icon: 'Layout',
    items: [
      { id: 'walls_ceiling', label: 'Walls / Ceiling', type: 'rating' },
      { id: 'stairs', label: 'Stairs', type: 'rating' },
      { id: 'dine_in_area', label: 'Dine-in Area', type: 'rating' },
      { id: 'other_bedrooms', label: 'Other Bedrooms', type: 'rating' },
      { id: 'other_bathrooms', label: 'Other Bathrooms', type: 'rating' },
      { id: 'laundry_area_appliances', label: 'Laundry Area & Appliances', type: 'rating' },
      { id: 'light_fixtures', label: 'Light Fixtures', type: 'rating' },
      { id: 'basement', label: 'Basement', type: 'rating' },
      { id: 'flooring', label: 'Flooring', type: 'rating' },
      { id: 'living_area_room', label: 'Living Area / Room', type: 'rating' },
      { id: 'primary_bedroom', label: 'Primary Bedroom', type: 'rating' },
      { id: 'primary_bathroom', label: 'Primary Bathroom', type: 'rating' },
      { id: 'den_home_office', label: 'Den / Home Office', type: 'rating' },
      { id: 'walk_in_closet_storage', label: 'Walk-in Closet / Storage', type: 'rating' },
      { id: 'garage', label: 'Garage', type: 'rating' },
      { id: 'home_layout', label: 'Home Layout', type: 'rating' },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    icon: 'Utensils',
    items: [
      { id: 'overall_kitchen', label: 'Overall Kitchen', type: 'rating' },
      { id: 'counter_space', label: 'Counter Space', type: 'rating' },
      { id: 'kitchen_flooring', label: 'Flooring', type: 'rating' },
      { id: 'pantry', label: 'Pantry', type: 'rating' },
      { id: 'dishwasher', label: 'Dishwasher', type: 'rating' },
      { id: 'island', label: 'Island', type: 'rating' },
      { id: 'countertop', label: 'Countertop', type: 'rating' },
      { id: 'cabinets', label: 'Cabinets', type: 'rating' },
      { id: 'backsplash', label: 'Backsplash', type: 'rating' },
      { id: 'microwave', label: 'Microwave', type: 'rating' },
      { id: 'stove_oven', label: 'Stove / Oven', type: 'rating' },
    ],
  },
  {
    id: 'home_systems',
    title: 'Home Systems',
    icon: 'Settings',
    items: [
      { id: 'hvac', label: 'Heating, Ventilation & Air Conditioning (HVAC)', type: 'rating' },
      { id: 'electrical_plumbing', label: 'Electrical & Plumbing', type: 'rating' },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    icon: 'MapPin',
    items: [
      { id: 'your_work', label: 'Your Work', type: 'rating' },
      { id: 'public_transport', label: 'Public Transport', type: 'rating' },
      { id: 'child_care', label: 'Child Care', type: 'rating' },
      { id: 'grocery_shopping_centers', label: 'Grocery / Shopping Centers', type: 'rating' },
      { id: 'place_of_worship', label: 'Place of Worship', type: 'rating' },
      { id: 'mobile_network', label: 'Mobile Network', type: 'rating' },
      { id: 'spouse_work', label: "Your Spouse's Work", type: 'rating' },
      { id: 'highway', label: 'Highway', type: 'rating' },
      { id: 'schools', label: 'Schools', type: 'rating' },
      { id: 'medical_care', label: 'Medical Care', type: 'rating' },
      { id: 'parks_playgrounds', label: 'Parks & Playgrounds', type: 'rating' },
    ],
  },
  {
    id: 'additional_features',
    title: 'Additional Features',
    icon: 'Star',
    items: [
      { id: 'fireplace', label: 'Fireplace', type: 'rating' },
      { id: 'family_room', label: 'Family Room', type: 'rating' },
      { id: 'extra_parking', label: 'Extra Parking', type: 'rating' },
      { id: 'pool', label: 'Pool', type: 'rating' },
      { id: 'pot_lights', label: 'Pot Lights', type: 'rating' },
      { id: 'walk_in_closet', label: 'Walk-in Closet', type: 'rating' },
      { id: 'additional_other', label: 'Other', type: 'checkbox_with_text' },
    ],
  },
  {
    id: 'smart_features',
    title: 'Smart Home Features',
    icon: 'Smartphone',
    items: [
      { id: 'smart_thermostat', label: 'Smart Thermostat', type: 'checkbox' },
      { id: 'smart_doorbell', label: 'Smart Door Bell', type: 'checkbox' },
      { id: 'smart_garage_opener', label: 'Smart Garage Opener', type: 'checkbox' },
      { id: 'smart_smoke_detector', label: 'Smart Smoke Detector', type: 'checkbox' },
      { id: 'smart_door_lock', label: 'Smart Door Lock', type: 'checkbox' },
      { id: 'smart_security_camera', label: 'Smart Security Camera', type: 'checkbox' },
      { id: 'smart_other', label: 'Other', type: 'checkbox_with_text' },
    ],
  },
  {
    id: 'monthly_costs',
    title: 'Monthly Costs',
    icon: 'DollarSign',
    items: [
      { id: 'utilities_cost', label: 'Utilities', type: 'currency' },
      { id: 'condo_fees', label: 'Condo / POTL Fees', type: 'currency' },
      { id: 'insurance_cost', label: 'Insurance', type: 'currency' },
      { id: 'other_fees', label: 'Other Fees', type: 'currency' },
    ],
  },
  {
    id: 'other_observations',
    title: 'Other Observations',
    icon: 'FileText',
    items: [
      { id: 'general_notes', label: 'General observations', type: 'textarea' },
    ],
  },
];

export const RATING_VALUES = {
  good: { value: 5, color: 'green', label: 'Good' },
  fair: { value: 3, color: 'yellow', label: 'Fair' },
  poor: { value: 1, color: 'red', label: 'Poor' },
};

export function getTotalEvaluationItems(): number {
  return EVALUATION_CATEGORIES.reduce((total, category) => {
    return total + category.items.filter((item) => item.type === 'rating').length;
  }, 0);
}

export function calculateOverallRating(ratings: {
  [categoryId: string]: { [itemId: string]: string | number | boolean };
}): number {
  let totalValue = 0;
  let totalItems = 0;

  Object.values(ratings).forEach((category) => {
    Object.entries(category).forEach(([, value]) => {
      if (typeof value === 'string' && ['good', 'fair', 'poor'].includes(value)) {
        const points = value === 'good' ? 5 : value === 'fair' ? 3 : 1;
        totalValue += points;
        totalItems++;
      }
    });
  });

  if (totalItems === 0) return 0;

  const averageScore = totalValue / (totalItems * 5);
  const overallRating = averageScore * 5;

  return Math.round(overallRating * 10) / 10;
}

export function calculateCompletionPercentage(ratings: {
  [categoryId: string]: { [itemId: string]: string | number | boolean };
}): number {
  let completedItems = 0;
  let totalItems = 0;

  EVALUATION_CATEGORIES.forEach((category) => {
    category.items.forEach((item) => {
      totalItems++;
      const rating = ratings[category.id]?.[item.id];
      if (rating !== undefined && rating !== null && rating !== '') {
        completedItems++;
      }
    });
  });

  return Math.round((completedItems / totalItems) * 100);
}
