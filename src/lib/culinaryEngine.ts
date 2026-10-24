// src/lib/culinaryEngine.ts
// Charaka Samhita Cooking Science (Karan / Samskara), 3-Course Plate Sequence (Bhojana Krama),
// Macronutrient Distribution (Carbs, Protein, Fats, Fiber), and Daily Mandatory Essentials (Nitya Sevaniya Ahara)
// Grounded in: Charaka Vimana 1.21-24 (Ashta Ahara Vidhi & Karan), Charaka Sutra 5.12 (Nitya Sevaniya),
// Charaka Sutra 27 (Annapana Vidhi), and Sushruta Sutra 46 (Bhojana Krama).

import type { UserProfile, Dosha } from './data'
import { calculateAyurvedicMetabolism } from './metabolicEngine'

export interface CookingInstruction {
  prepPhase: {
    washingAndSoaking: string
    scientificAyurvedicReason: string
  }
  agniProcessing: {
    cookingMethod: 'Open Pot Boiling (Laghu)' | 'Dry Roasting (Bhrishta - Lekhana)' | 'Steaming (Svedana)' | 'Slow Simmer (Mandagni)'
    waterRatio: string
    durationMinutes: number
    fireIntensity: 'Mild (Mandagni)' | 'Medium (Madhyamagni)' | 'High (Tikshnagni)'
  }
  ghritaSamskaraTadka: {
    fatUsed: 'Pure A2 Cow Ghee (Supreme Yogavahi)' | 'Cold-Pressed Sesame Oil (Til Taila)' | 'Cold-Pressed Mustard Oil (Sarshapa)'
    spiceOrder: string[]
    medicinalPurpose: string
  }
  servingRule: string
}

export interface BhojanaKramaCourse {
  courseNumber: 1 | 2 | 3
  sanskritName: string
  englishName: string
  platePortion: string
  traditionalIngredients: string[]
  gastrointestinalPurpose: string
  classicalCitation: string
}

export interface MealMacronutrients {
  caloriesKcal: number
  carbohydratesGrams: number
  carbsPercentage: number // ~50%
  proteinGrams: number
  proteinPercentage: number // ~18%
  healthyFatsGrams: number
  fatsPercentage: number // ~22%
  dietaryFiberGrams: number // ~8-12g
  dominantRasa: string
}

export interface DailyMacronutrientGoals {
  dailyTdeeKcal: number
  targetCarbsGrams: number
  targetProteinGrams: number
  targetFatsGrams: number
  targetFiberGrams: number
  mealBreakdown: {
    breakfast: MealMacronutrients
    lunch: MealMacronutrients // 45% Pitta Midday Peak
    dinner: MealMacronutrients
    snack: MealMacronutrients
  }
}

export interface NityaSevaniyaItem {
  id: string
  sanskritName: string
  englishName: string
  nutrientCategory: 'Carbohydrates' | 'Protein' | 'Healthy Fats' | 'Micronutrients / Vitamin C' | 'Soluble Fiber' | 'Hydration' | 'Enzymes & Bio-Scrapers' | 'Minerals'
  classicalBenefit: string
  consumedToday: boolean
}

/**
 * 10 Classical Daily Mandatory Essentials (Nitya Sevaniya Ahara - Charaka Sutra 5.12)
 * Foods that Charaka states must be consumed daily for lifetime immunity, vitality, and cellular renewal.
 */
export const NITYA_SEVANIYA_ESSENTIALS: Omit<NityaSevaniyaItem, 'consumedToday'>[] = [
  {
    id: 'shashtika_shali',
    sanskritName: 'षष्टिक शाली (Shashtika Shali)',
    englishName: 'Aged Harvest Rice / Clean Red-White Rice',
    nutrientCategory: 'Carbohydrates',
    classicalBenefit: 'Supreme clean carbohydrate. Easy to digest (Laghu), builds stamina (Balya), does not block channels.',
  },
  {
    id: 'mudga',
    sanskritName: 'मुद्ग (Mudga / Green Gram)',
    englishName: 'Split Yellow / Green Moong Dal',
    nutrientCategory: 'Protein',
    classicalBenefit: 'Supreme vegetarian protein. Builds muscle (Mamsa Dhatu) without causing abdominal gas or Vata vitiation.',
  },
  {
    id: 'saindhava',
    sanskritName: 'सैन्धव लवण (Saindhava Lavana)',
    englishName: 'Himalayan Rock Salt (Pink Salt)',
    nutrientCategory: 'Minerals',
    classicalBenefit: 'Tridoshic salt. Protects eyesight (Chakshushya), ignites Agni without aggravating blood pressure or burning Pitta.',
  },
  {
    id: 'amalaki',
    sanskritName: 'आमलकी (Amalaki / Indian Gooseberry)',
    englishName: 'Fresh Amla / Amla Powder',
    nutrientCategory: 'Micronutrients / Vitamin C',
    classicalBenefit: 'Supreme Rasayana. Highest natural Vitamin C and polyphenols. Slows aging, regenerates all 7 bodily Dhatus.',
  },
  {
    id: 'yava',
    sanskritName: 'यव (Yava / Barley)',
    englishName: 'Aged Roasted Barley (Sattu / Khichdi)',
    nutrientCategory: 'Soluble Fiber',
    classicalBenefit: 'Supreme beta-glucan fiber. Scrapes cholesterol, unclogs lymphatic vessels (Medo-hara), balances blood sugar.',
  },
  {
    id: 'antariksha_jala',
    sanskritName: 'अन्तरिक्ष जल / उष्णोदक (Ushnodaka)',
    englishName: 'Pure Clean Boiled Warm Water',
    nutrientCategory: 'Hydration',
    classicalBenefit: 'Spark of gastric fire. Absorbed into tissues in 45 minutes; breaks down metabolic endotoxins (Ama).',
  },
  {
    id: 'sarpi_ghrita',
    sanskritName: 'सर्पिः / गव्य घृत (A2 Cow Ghee)',
    englishName: 'Grass-Fed Pure Cow Ghee',
    nutrientCategory: 'Healthy Fats',
    classicalBenefit: 'Supreme healthy lipid (Sneha-uttamam). Carries fat-soluble vitamins (A, D, E, K), enhances intellect (Medhya) and Agni.',
  },
  {
    id: 'jangala_rasa',
    sanskritName: 'जाङ्गल रस / मुद्ग यूष (Jangala Mamsa / Dal Broth)',
    englishName: 'Wild Plant / Legume Protein Soup (Yusha)',
    nutrientCategory: 'Protein',
    classicalBenefit: 'Immediate bio-available amino acids. Sustains Ojas (immunity) without burdening digestion.',
  },
  {
    id: 'madhu',
    sanskritName: 'मधु (Raw Unheated Honey)',
    englishName: 'Pure Raw Honey (Never Heated)',
    nutrientCategory: 'Enzymes & Bio-Scrapers',
    classicalBenefit: 'Natural astringent-sweet scraper (Lekhana). Reduces fat and phlegm; enhances drug penetration (Yogavahi).',
  },
  {
    id: 'trikatu_spices',
    sanskritName: 'दीपन पाचन द्रव्य (Ginger, Cumin, Pepper)',
    englishName: 'Culinary Digestive Spices (Jeera, Adrak, Maricha)',
    nutrientCategory: 'Micronutrients / Vitamin C',
    classicalBenefit: 'Enzyme activators. Destroys cold fermentation and eliminates gas in the intestines.',
  },
]

/**
 * Generates the authentic 3-Course Plate Serving Order (Bhojana Krama)
 * Matching the classical literature and the user's personal rice-bowl tradition.
 */
export function getBhojanaKramaCourses(profile?: UserProfile | null): BhojanaKramaCourse[] {
  const dosha: Dosha = profile?.doshaType || 'Pitta'

  return [
    {
      courseNumber: 1,
      sanskritName: 'अग्र भोजन (Agra Bhojana - Madhura & Snigdha)',
      englishName: 'First Course: Rice + Herbal Leaf & Dal Podis + Cow Ghee',
      platePortion: '1st One-Third of Rice Bowl (~90g Rice + 15g Podi + 1 tsp Ghee)',
      traditionalIngredients: [
        'Steamed aged rice (clean carbohydrates)',
        'Moringa/Drumstick leaf powder (Shigru - rich in calcium & iron)',
        'Hummingbird tree leaf powder (Agastya - relieves pitta & night-blindness)',
        'Curry leaf powder (Kaidarya - stimulates pancreatic enzymes & liver)',
        'Roasted Toor Dal / Roasted Moong Dal powder (clean plant protein)',
        'Pure warm A2 Cow Ghee (Ghrita - gastric mucosal buffer)',
      ],
      gastrointestinalPurpose:
        'The empty stomach at meal start has high hydrochloric acid and reactive bile. Eating warm rice coated in A2 ghee and digestive herb powder forms a protective mucosal shield, activates salivary amylase, and ignites Jatharagni without causing heartburn or acid reflux.',
      classicalCitation: '“पूर्वं मधुरमश्नीयात् स्निग्धं च गुरु च...” — Sushruta Sutra 46.460 & Charaka Vimana 1.24',
    },
    {
      courseNumber: 2,
      sanskritName: 'मध्य भोजन (Madhya Bhojana - Amla & Lavana)',
      englishName: 'Second Course: Rice + Vegetable Curry / Sambar + Ghee',
      platePortion: '2nd One-Third of Rice Bowl (~90g Rice + 120g Cooked Curry/Sambar)',
      traditionalIngredients: [
        'Steamed aged rice',
        'Seasonal vegetable curry (Ash gourd, snake gourd, carrots, ridge gourd)',
        'Toor dal / Moong dal sambar tempered with cumin, hing, and mustard seeds',
        'Half tsp cow ghee to carry fat-soluble beta-carotenes and lutein',
      ],
      gastrointestinalPurpose:
        'In the middle of the meal, digestive heat is at its zenith. The combination of gentle sour (Amla from tamarind or amla) and mild rock salt (Lavana) accelerates gastric juice and bile flow, thoroughly breaking down complex dietary proteins and fibrous vegetables.',
      classicalCitation: '“मध्येऽम्ललवणौ... अन्नं पच्यते सुतरां वह्निना...” — Sushruta Sutra 46.461',
    },
    {
      courseNumber: 3,
      sanskritName: 'अन्त भोजन (Anta Bhojana - Katu, Tikta, Kashaya & Drava)',
      englishName: 'Third Course: Rice + Digestive Rasam / Spiced Buttermilk + Pickles',
      platePortion: '3rd One-Third of Rice Bowl (~90g Rice + 100ml Rasam or Spiced Takra + 1 tsp Pickle)',
      traditionalIngredients: [
        'Steamed aged rice',
        'Hot digestive Rasam (black pepper, roasted cumin, crushed garlic, coriander, tamarind/lemon)',
        'Alternative: Spiced Churned Buttermilk (Takra with roasted hing & curry leaf)',
        'Small licking condiment / pickle (Avaleha - ginger/lemon/mango with rock salt)',
      ],
      gastrointestinalPurpose:
        'Finishing with liquid astringent, pungent, and bitter tastes (pepper, cumin, garlic, buttermilk) accomplishes two vital tasks: it clears residual Kapha mucus from the tongue and stomach, stimulates pancreatic lipase, prevents post-meal lethargy (Tandra), and seals the pyloric sphincter for optimal churn.',
      classicalCitation: '“अन्ते तु तिक्तकटुकषायान्... कफप्रशमनाय च...” — Sushruta Sutra 46.462',
    },
  ]
}

/**
 * Calculates complete modern and Ayurvedic macronutrient breakdown
 * (Carbs, Protein, Healthy Fats, Fiber, and Calories) for each meal and daily total.
 */
export function calculateMealMacronutrients(profile: UserProfile): DailyMacronutrientGoals {
  const metabolism = calculateAyurvedicMetabolism(profile)
  const tdee = metabolism.dailyTdeeKcal

  // Macro Caloric Distribution:
  // Carbs: ~50% of TDEE (4 kcal/g)
  // Protein: ~18% of TDEE (4 kcal/g) -> ~1.0 - 1.2g per kg body weight
  // Fats: ~22% of TDEE (9 kcal/g) -> predominantly Ghee & cold-pressed oils
  // Fiber: ~30g per day

  const totalCarbsGrams = Math.round((tdee * 0.50) / 4)
  const totalProteinGrams = Math.round((tdee * 0.18) / 4)
  const totalFatsGrams = Math.round((tdee * 0.22) / 9)
  const totalFiberGrams = Math.round(tdee / 75) // ~30g for 2250 kcal

  const buildMealMacros = (fraction: number, dominantRasa: string, fiberFraction = fraction): MealMacronutrients => {
    const mealKcal = Math.round(tdee * fraction)
    return {
      caloriesKcal: mealKcal,
      carbohydratesGrams: Math.round(totalCarbsGrams * fraction),
      carbsPercentage: 50,
      proteinGrams: Math.round(totalProteinGrams * fraction),
      proteinPercentage: 18,
      healthyFatsGrams: Math.round(totalFatsGrams * fraction),
      fatsPercentage: 22,
      dietaryFiberGrams: Math.round(totalFiberGrams * fiberFraction),
      dominantRasa,
    }
  }

  return {
    dailyTdeeKcal: tdee,
    targetCarbsGrams: totalCarbsGrams,
    targetProteinGrams: totalProteinGrams,
    targetFatsGrams: totalFatsGrams,
    targetFiberGrams: totalFiberGrams,
    mealBreakdown: {
      breakfast: buildMealMacros(0.25, 'Madhura & Tikta (Gentle Warming)'),
      lunch: buildMealMacros(0.45, 'Shad Rasa (All 6 Tastes - Agni Peak)', 0.50), // Main fiber & nutrient density
      dinner: buildMealMacros(0.25, 'Laghu Madhura & Kashaya (Light & Digestible)'),
      snack: buildMealMacros(0.05, 'Tikta & Madhura (Herbal Tea & Nuts)'),
    },
  }
}

/**
 * Returns classical Ayurvedic cooking instructions (Samskara) for any meal.
 */
export function getAyurvedicCookingInstructions(
  mealName: string,
  dosha: Dosha = 'Pitta'
): CookingInstruction {
  const isRiceOrGrain = mealName.toLowerCase().includes('rice') || mealName.toLowerCase().includes('khichdi') || mealName.toLowerCase().includes('cheela')

  if (isRiceOrGrain) {
    return {
      prepPhase: {
        washingAndSoaking:
          'Wash grains in cold water 3 times until the water runs clear. Soak white/red rice for 30 minutes, or millets/barley for 2 hours in 3x water.',
        scientificAyurvedicReason:
          'Charaka Vimana 1: Toya-sannikarsha (water soaking) softens tough outer seed coats, activates latent enzymes, and washes away heavy anti-nutrients (phytates and lectins) that cause bloating.',
      },
      agniProcessing: {
        cookingMethod: 'Open Pot Boiling (Laghu)',
        waterRatio: '1 cup grain : 2.5 cups water (for rice) or 1:4 (for khichdi/gruel)',
        durationMinutes: 20,
        fireIntensity: 'Medium (Madhyamagni)',
      },
      ghritaSamskaraTadka: {
        fatUsed: 'Pure A2 Cow Ghee (Supreme Yogavahi)',
        spiceOrder: [
          '1. Heat 1 tbsp Cow Ghee in a small iron/steel pan over medium-low heat.',
          '2. Add mustard seeds (Sarshapa) — allow them to fully crackle.',
          '3. Add cumin seeds (Jeera) and a pinch of Asafoetida (Hing) to dispel Vata gas.',
          '4. Add grated fresh ginger (Adrak) and fresh torn curry leaves (Kaidarya).',
          '5. Add 1/4 tsp turmeric (Haridra) and immediately pour the sizzling tadka over the cooked grain.',
        ],
        medicinalPurpose:
          'Ghee acts as a bio-carrier (Yogavahi), delivering curcumin and gingerol directly across cellular membranes while protecting stomach walls from inflammatory irritation.',
      },
      servingRule:
        'Eat while warm (Ushnam Ashniyat). Food that has gone cold loses its Prana and creates toxic sludge (Ama) in the gut.',
    }
  }

  // General vegetable curry / dal instructions
  return {
    prepPhase: {
      washingAndSoaking:
        'Rinse vegetables thoroughly. Soak lentils (toor or moong dal) in lukewarm water for at least 45 minutes.',
      scientificAyurvedicReason:
        'Soaking legumes dissolves gas-forming complex sugars and reduces cooking time, preserving vital heat-sensitive vitamins.',
    },
    agniProcessing: {
      cookingMethod: 'Slow Simmer (Mandagni)',
      waterRatio: '1 cup lentils : 3 cups water',
      durationMinutes: 25,
      fireIntensity: 'Mild (Mandagni)',
    },
    ghritaSamskaraTadka: {
      fatUsed: 'Pure A2 Cow Ghee (Supreme Yogavahi)',
      spiceOrder: [
        '1. Warm 1 tbsp ghee in saucepan.',
        '2. Add crushed coriander seeds and cumin.',
        '3. Add a generous pinch of rock salt (Saindhava).',
        '4. Simmer until the aroma fills the room.',
      ],
      medicinalPurpose:
        'Coriander and cumin cool internal Pitta while stimulating bile salts for effortless fat emulsion.',
    },
    servingRule:
      'Serve freshly cooked. Never consume reheated leftovers from previous days (Paryushita Ahara).',
  }
}
