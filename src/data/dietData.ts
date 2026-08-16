export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'

export interface Recipe {
  id: string
  nameEnglish: string
  nameTamil: string
  category: MealCategory
  prepTime: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  minerals: string[]
  ingredients: string[]
  instructions: string[]
}

export const DIET_RECIPES: Recipe[] = [
  {
    id: '1',
    nameEnglish: 'Steamed Idli & Mint Sambar',
    nameTamil: 'இட்லி & புதினா சாம்பார்',
    category: 'Breakfast',
    prepTime: '15 mins',
    calories: 220,
    protein: 8,
    carbs: 42,
    fat: 2,
    fiber: 6,
    minerals: ['Iron', 'Calcium', 'Potassium'],
    ingredients: [
      '3 fermented rice & urad dal idlis',
      '1 cup toor dal (split pigeon peas)',
      '1/2 cup mixed vegetables (drumstick, carrots)',
      'Fresh mint and coriander leaves',
      '1 tsp minimal sesame oil for tempering',
    ],
    instructions: [
      'Steam the idlis without using any oil on the plates.',
      'Boil the toor dal and vegetables until soft.',
      'Prepare a light sambar using tamarind extract and fresh mint leaves.',
      'Temper with mustard seeds and curry leaves using exactly 1 tsp of oil.',
      'Serve hot. Skip coconut chutney to save on fat macros.',
    ],
  },
  {
    id: '2',
    nameEnglish: 'Kuthiraivali & Nattu Kozhi Kuzhambu',
    nameTamil: 'குதிரைவாலி & நாட்டுக்கோழி குழம்பு',
    category: 'Lunch',
    prepTime: '40 mins',
    calories: 380,
    protein: 32,
    carbs: 45,
    fat: 8,
    fiber: 8,
    minerals: ['Zinc', 'Phosphorus', 'B-Vitamins'],
    ingredients: [
      '1 cup cooked Kuthiraivali (Barnyard Millet)',
      '150g lean Nattu Kozhi (Country Chicken)',
      '1 tomato and 1 onion, finely chopped',
      'Ginger-garlic paste and turmeric',
      'Roasted pepper and cumin powder',
    ],
    instructions: [
      'Wash and cook the millet with a 1:2.5 water ratio until fluffy.',
      'Marinate the country chicken with turmeric and ginger-garlic paste.',
      'Dry roast pepper and cumin, then grind to a fine powder.',
      'Cook the chicken with onions and tomatoes, adding the ground spice mix and water to form a gravy.',
      'Simmer until the chicken is tender. Do not add coconut paste.',
    ],
  },
  {
    id: '3',
    nameEnglish: 'Seeraga Samba Mutton Biryani (Diet Portion)',
    nameTamil: 'சீரக சம்பா மட்டன் பிரியாணி',
    category: 'Lunch',
    prepTime: '50 mins',
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 15,
    fiber: 5,
    minerals: ['Iron', 'Zinc', 'Vitamin B12'],
    ingredients: [
      '1/2 cup Seeraga Samba rice (raw weight)',
      '150g lean mutton (trim visible fat)',
      '1/2 cup thick curd (yogurt)',
      'Whole spices (cardamom, cloves, cinnamon, star anise)',
      'Mint, coriander, green chilies, and onion',
      '1 tbsp ghee (strictly measured)',
    ],
    instructions: [
      'Marinate lean mutton pieces in thick curd, ginger-garlic paste, and turmeric for 30 minutes.',
      'In a pressure cooker, heat exactly 1 tbsp ghee. Sauté whole spices, sliced onions, and green chilies until golden.',
      'Add mint and coriander, followed by the marinated mutton. Sauté well.',
      'Add washed Seeraga Samba rice and water (1:1.5 ratio).',
      'Cook on a low flame (dum) or pressure cook for 2 whistles. Serve with cucumber raita instead of calorie-heavy salna.',
    ],
  },
  {
    id: '4',
    nameEnglish: 'Kala Chana Sundal',
    nameTamil: 'கருப்பு கொண்டக்கடலை சுண்டல்',
    category: 'Snack',
    prepTime: '10 mins',
    calories: 180,
    protein: 10,
    carbs: 28,
    fat: 3,
    fiber: 9,
    minerals: ['Magnesium', 'Iron', 'Folate'],
    ingredients: [
      '1 cup boiled black chickpeas (Kala Chana)',
      '1/2 tsp mustard seeds',
      '1 dry red chili and curry leaves',
      'A pinch of asafoetida (hing)',
      '1 tsp grated coconut (optional)',
    ],
    instructions: [
      'Soak chickpeas overnight and pressure cook until soft.',
      'In a pan, add a few drops of oil and splutter mustard seeds, red chili, and curry leaves.',
      'Add asafoetida and the boiled chickpeas. Toss well.',
      'Garnish with minimal grated coconut and serve warm.',
    ],
  },
  {
    id: '5',
    nameEnglish: 'Spiced Neer Mor',
    nameTamil: 'நீர் மோர்',
    category: 'Snack',
    prepTime: '5 mins',
    calories: 45,
    protein: 2,
    carbs: 6,
    fat: 1,
    fiber: 1,
    minerals: ['Calcium', 'Sodium', 'Probiotics'],
    ingredients: [
      '1/4 cup low-fat yogurt',
      '1 cup cold water',
      '1/2 inch ginger, crushed',
      'Curry leaves and coriander',
      'Rock salt to taste',
    ],
    instructions: [
      'Churn the yogurt and water together until completely smooth and frothy.',
      'Add crushed ginger, rock salt, and finely chopped leaves.',
      'Mix well and serve chilled. Excellent for rehydration and gut health.',
    ],
  },
  {
    id: '6',
    nameEnglish: 'Wheat Chapati & Paneer Kurma',
    nameTamil: 'சப்பாத்தி & பன்னீர் குருமா',
    category: 'Dinner',
    prepTime: '30 mins',
    calories: 360,
    protein: 18,
    carbs: 38,
    fat: 14,
    fiber: 7,
    minerals: ['Calcium', 'Manganese', 'Phosphorus'],
    ingredients: [
      '2 whole wheat chapatis (no oil/ghee)',
      '100g low-fat paneer, cubed',
      '1 cup tomato-onion puree',
      'Garam masala, turmeric, and chili powder',
      '2 tbsp skimmed milk or curd (instead of cream)',
    ],
    instructions: [
      'Dry roast the chapatis on a tawa until fully cooked.',
      'In a pan, cook the tomato-onion puree until the raw smell disappears.',
      'Add dry spices and a splash of water to form a thick base.',
      'Fold in the paneer cubes and simmer for 5 minutes.',
      'Stir in skimmed milk or curd at the end for creaminess without the heavy fat macros.',
    ],
  },
]
