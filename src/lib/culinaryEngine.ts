// src/lib/culinaryEngine.ts
// Charaka Samhita Cooking Science (Karan / Samskara), Dynamic Bhojana Krama (3-Course Plate Sequence),
// Macronutrient Distribution (Carbs, Protein, Fats, Fiber), and Daily Mandatory Essentials (Nitya Sevaniya Ahara)
// Grounded in: Charaka Vimana 1.21-24 (Ashta Ahara Vidhi & Karan), Charaka Sutra 5.12 (Nitya Sevaniya),
// Charaka Chikitsa 6 (Prameha Pathya-Apathya), Charaka Chikitsa 15 (Grahani Takra Kalpana),
// Charaka Chikitsa 28 (Vatavyadhi), and Sushruta Sutra 46 (Bhojana Krama).

import type { UserProfile, Dosha, RegionId } from './data'
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
  clinicalDiseaseNote?: string
}

export interface BhojanaKramaCourse {
  courseNumber: 1 | 2 | 3
  sanskritName: string
  englishName: string
  platePortion: string
  traditionalIngredients: string[]
  gastrointestinalPurpose: string
  classicalCitation: string
  diseaseModulationNote?: string
  regionalVariant?: string
}

export interface MealMacronutrients {
  caloriesKcal: number
  carbohydratesGrams: number
  carbsPercentage: number
  proteinGrams: number
  proteinPercentage: number
  healthyFatsGrams: number
  fatsPercentage: number
  dietaryFiberGrams: number
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

export interface DiseaseCulinaryModulation {
  conditionId: string
  conditionName: string
  sanskritName: string
  charakaCitation: string
  pathyaFoods: string[] // Beneficial foods to favor
  apathyaFoods: string[] // Forbidden foods to avoid
  stapleGrainSubstitute: string
  bhojanaKramaModificationRationale: string
  courses: BhojanaKramaCourse[]
  macroRatioOverride?: {
    carbsPct: number
    proteinPct: number
    fatsPct: number
    fiberGrams: number
  }
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
 * Classical Disease-Specific Culinary Modulations
 * Grounded in Charaka Samhita Chikitsa Sthana.
 * When a disease is active, the standard plate order, grains, and spices morph to become therapeutic medicine (Ahara-Chikitsa).
 */
export const DISEASE_CULINARY_MODULATIONS: Record<string, DiseaseCulinaryModulation> = {
  'prameha-metabolic': {
    conditionId: 'prameha-metabolic',
    conditionName: 'Pre-Diabetes, Glucose Spikes & Type-2 Sugar Imbalance',
    sanskritName: 'प्रमेह / मधुमेह · Prameha / Madhumeha',
    charakaCitation: 'Charaka Chikitsasthana Ch. 6 (Prameha Chikitsa)',
    stapleGrainSubstitute: 'Purana Yava (Aged Roasted Barley) & Aged Red Shashtika Rice (Polished white rice strictly forbidden)',
    bhojanaKramaModificationRationale:
      'Starting with high-glycemic carbohydrates causes acute insulin demand and pancreatic beta-cell fatigue. In Prameha, Course 1 MUST start with bitter and astringent greens (Tikta-Kashaya) and moong dal broth to stimulate intestinal alpha-glucosidase inhibition and activate AMPK before carbohydrates enter.',
    pathyaFoods: [
      'Aged roasted barley (Purana Yava)',
      'Yellow moong dal broth (Mudga Yusha)',
      'Steamed bitter gourd (Karela)',
      'Fenugreek greens (Methi)',
      'Amla & Turmeric (Nisha-Amalaki)',
      'Horse gram (Kulattha)',
    ],
    apathyaFoods: [
      'Polished white rice (causes rapid glycemic spike)',
      'Refined white sugar and jaggery',
      'Whole sweet curd / yogurt (Diva-swapna & Dadhi strictly forbidden)',
      'Sweet fruits (mango, banana, sapota)',
      'Deep-fried snacks & processed flours (Maida)',
    ],
    macroRatioOverride: {
      carbsPct: 40,
      proteinPct: 25,
      fatsPct: 20,
      fiberGrams: 38,
    },
    courses: [
      {
        courseNumber: 1,
        sanskritName: 'तिक्त शाक अग्र भोजन (Tikta Shaka & Mudga Yusha Agra)',
        englishName: 'Course 1: Steamed Bitter Greens + Moong Dal Broth + Roasted Barley',
        platePortion: '1/3 Plate (~60g Purana Yava Roti/Aged Red Rice + 100ml Moong Yusha + Methi Greens)',
        traditionalIngredients: [
          'Aged roasted barley flour (Purana Yava) or aged red rice (GI < 45)',
          'Steamed fenugreek leaves (Methi) & Moringa leaf powder (Shigru)',
          'Clear yellow moong dal broth seasoned with roasted cumin and turmeric',
          'Half tsp A2 cow ghee (limited to prevent insulin receptor lipid blocking)',
        ],
        gastrointestinalPurpose:
          'Starting with bitter polyphenols (charantin & trigonelline) triggers intestinal peptide release and delays gastric emptying, blunting the glycemic response of the subsequent meal.',
        classicalCitation: '“तिक्तेन शमयेत् कफपित्तम्... पुराणा यवाः प्रमेहिणां पथ्यतमाः...” — Charaka Chikitsa 6.21',
        diseaseModulationNote: 'Polished white rice replaced with Purana Yava; sweet opening replaced with bitter greens.',
      },
      {
        courseNumber: 2,
        sanskritName: 'शमिधान्य मध्य भोजन (Shamidhanya & Karela Madhya)',
        englishName: 'Course 2: Steamed Bitter Gourd + Spiced Moong Dal Sambar (Zero Sugar)',
        platePortion: '1/3 Plate (~120g Steamed Karela Subzi + 80ml Low-Fat Moong Sambar)',
        traditionalIngredients: [
          'Steamed bitter gourd (Karela) sauteed with mustard seeds and dry ginger',
          'Yellow moong dal sambar tempered with hing and cumin (zero added sugar/jaggery)',
          'Cucumber and steamed ash gourd slices',
        ],
        gastrointestinalPurpose:
          'Midday Agni metabolizes vegetable plant insulin (p-insulin), escorting cellular glucose uptake into myocytes independently of sluggish insulin receptors.',
        classicalCitation: '“मुद्गाढकी कुलत्थाश्च... कारवेल्लकं च प्रमेहे प्रशस्यते...” — Charaka Chikitsa 6.24',
        diseaseModulationNote: 'Curry prepared without potato or sugar; plant-protein emphasized.',
      },
      {
        courseNumber: 3,
        sanskritName: 'तक्र कल्पना अन्त भोजन (Takra Kalpana & Vijaysar Anta)',
        englishName: 'Course 3: Thin Spiced Buttermilk / Vijaysar Infusion + Low-Sodium Pickle',
        platePortion: '1/3 Plate (~120ml Churned Takra + 1 tsp Low-Sodium Lemon-Ginger Pickle)',
        traditionalIngredients: [
          'Thin freshly churned buttermilk (Takra - 1 part curd : 4 parts water, butter fat removed)',
          'Seasoned with roasted cumin powder, dry ginger, and a pinch of pink rock salt',
          'Alternative: Warm Vijaysar or Cinnamon herbal tea infusion',
          'Licking condiment: Fresh ginger and lemon juice with rock salt (no oil)',
        ],
        gastrointestinalPurpose:
          'Finishing with astringent buttermilk and cinnamon stimulates pancreatic microcirculation without adding glycemic load, sealing digestion and clearing post-lunch lethargy.',
        classicalCitation: '“तक्रं कफवातघ्नं दीपनं प्रमेहनाशनम्...” — Charaka Chikitsa 6.32',
        diseaseModulationNote: 'Whole curd and sugary sweets strictly eliminated; light churned Takra only.',
      },
    ],
  },

  'amlapitta': {
    conditionId: 'amlapitta',
    conditionName: 'Acid Reflux, Heartburn & GERD (Amlapitta)',
    sanskritName: 'अम्लपित्त · Amlapitta',
    charakaCitation: 'Charaka Chikitsasthana Ch. 15 (Grahani-Amlapitta) & Kashyapa Samhita',
    stapleGrainSubstitute: 'Aged Harvest Rice (Shashtika Shali) or Barley (Purana Yava) cooked soft with Ghee',
    bhojanaKramaModificationRationale:
      'In Amlapitta, the liquid and sour qualities of Pitta (Drava & Amla Pitta) are pathologically inflamed. Finishing with hot tamarind rasam or spicy pickles burns the esophagus and erodes the stomach lining. Course 3 MUST replace tamarind and spicy pickles with cooling Dadima (Pomegranate broth) or coriander-fennel water.',
    pathyaFoods: [
      'Aged harvest white/red rice (Shashtika Shali)',
      'Pure grass-fed A2 cow ghee (supreme gastric buffer)',
      'Sweet pomegranate (Dadima)',
      'Snake gourd (Patola) & Ash gourd (Kushmanda)',
      'Coriander & fennel seed infusions',
      'Cooling boiled milk with ghee (at bedtime)',
    ],
    apathyaFoods: [
      'Tamarind (Chincha) — strictly eliminated',
      'Hot green/red chilies & black pepper overload',
      'Fermented vinegar, alcohol, and stale bakery dough',
      'Sour curd / yogurt at night',
      'Excessively salty or deep-fried pickles',
    ],
    macroRatioOverride: {
      carbsPct: 52,
      proteinPct: 18,
      fatsPct: 22,
      fiberGrams: 28,
    },
    courses: [
      {
        courseNumber: 1,
        sanskritName: 'स्निग्ध मधुर शाली अग्र (Snigdha Madhura Shali Agra)',
        englishName: 'Course 1: Steamed Aged Rice + A2 Cow Ghee + Cooling Moong Broth',
        platePortion: '1/3 Plate (~90g Soft Aged Rice + 1.5 tsp A2 Cow Ghee + 60ml Mild Moong Broth)',
        traditionalIngredients: [
          'Soft-boiled aged rice (Shashtika Shali - gentle on stomach mucosa)',
          'Pure warm A2 cow ghee (neutralizes excess hydrochloric acid)',
          'Split yellow moong dal broth seasoned with cooling coriander and cumin (no chili)',
        ],
        gastrointestinalPurpose:
          'A2 cow ghee and soft rice form a soothing lipid barrier across inflamed gastric mucosa, preventing burning epigastric discomfort when gastric juices surge.',
        classicalCitation: '“घृतं पित्तप्रशमनं... मधुरं शीतलं गुरु...” — Charaka Sutra 27.231',
        diseaseModulationNote: 'Spicy leaf powders replaced with cooling coriander-ghee buffer.',
      },
      {
        courseNumber: 2,
        sanskritName: 'पटोल कूष्माण्ड मध्य (Patola & Kushmanda Madhya)',
        englishName: 'Course 2: Steamed Snake Gourd / Ash Gourd Curry with Ghee (Zero Chili)',
        platePortion: '1/3 Plate (~130g Cooked Ash Gourd or Ridge Gourd Subzi + 60g Soft Rice)',
        traditionalIngredients: [
          'Steamed ash gourd (Kushmanda), snake gourd (Patola), or ridge gourd',
          'Cooked in pure cow ghee with crushed coriander seeds and a pinch of pink salt',
          'Mild moong dal gravy (no tomato, no tamarind, zero chili powder)',
        ],
        gastrointestinalPurpose:
          'Kushmanda and Patola are classical cooling bitter-sweets (Shita Virya) that cool mucosal burning while providing effortless cellular hydration.',
        classicalCitation: '“कूष्माण्डकं पटोलं च... अम्लपित्ते विशेषेण हितम्...” — Kashyapa Samhita Amlapitta',
        diseaseModulationNote: 'Tomato, tamarind, and hot spices eliminated; alkaline gourds used.',
      },
      {
        courseNumber: 3,
        sanskritName: 'दाडिम धनिया अन्त (Dadima & Coriander Anta — Tamarind Replaced)',
        englishName: 'Course 3: Sweet Pomegranate Broth or Cooling Coriander-Fennel Infusion',
        platePortion: '1/3 Plate (~120ml Dadima Yusha / Coriander-Fennel Infusion + 50g Rice)',
        traditionalIngredients: [
          'Fresh sweet pomegranate broth (Dadima Yusha) lightly simmered with cumin',
          'Alternative: Coriander-fennel infusion with a pinch of rock sugar (Mishri)',
          'NO TAMARIND: Tamarind rasam is completely substituted with cooling Dadima',
          'NO HOT PICKLE: Substituted with sweet amla preserve (Amlaki Murabba) or zero condiment',
        ],
        gastrointestinalPurpose:
          'Dadima is an astringent-sweet pitta pacifier (Hridya & Pittahara) that binds excess stomach acid, closes the gastroesophageal junction, and eliminates acid reflux.',
        classicalCitation: '“दाडिमाम्लरसं शीतं... पित्तं नात्युदीरयेत्...” — Charaka Sutra 27.147',
        diseaseModulationNote: 'Tamarind Rasam and spicy pickles strictly replaced with Pomegranate broth.',
      },
    ],
  },

  'grahani-ibs': {
    conditionId: 'grahani-ibs',
    conditionName: 'Irritable Bowel Syndrome, Gut Dysbiosis & Malabsorption',
    sanskritName: 'ग्रहणी दोष · Grahani Dosha',
    charakaCitation: 'Charaka Chikitsasthana Ch. 15 (Grahani Roga Chikitsa)',
    stapleGrainSubstitute: 'Aged Red Rice / Light Moong Khichdi prepared with Ghee and Hing',
    bhojanaKramaModificationRationale:
      'In Grahani, digestive fire (Agni) in the duodenum is erratic (Mandagni). Raw salads and heavy whole curd cause immediate abdominal bloating, mucus in stool, and cramping. Freshly churned Takra with roasted cumin is the primary therapeutic nectar for Grahani.',
    pathyaFoods: [
      'Fresh churned buttermilk (Takra Kalpana)',
      'Cooked Moong dal khichdi with cow ghee',
      'Bilva (Bael fruit) pulp and pomegranate',
      'Warm water sips during meals',
      'Bottle gourd (Lauki) cooked soft',
      'Roasted cumin & asafoetida (Hing)',
    ],
    apathyaFoods: [
      'Raw vegetable salads (aggravates Vata colic)',
      'Whole unchurned curd / Greek yogurt (channel-blocking Abhishyandi)',
      'Ice-cold refrigerated water',
      'Heavy oily bakery items and pulses (black urad dal)',
    ],
    macroRatioOverride: {
      carbsPct: 48,
      proteinPct: 20,
      fatsPct: 22,
      fiberGrams: 26,
    },
    courses: [
      {
        courseNumber: 1,
        sanskritName: 'दीपन खिच्चडी अग्र (Deepana Khichdi & Hing Agra)',
        englishName: 'Course 1: Soft Moong Khichdi + Ghee + Roasted Asafoetida',
        platePortion: '1/3 Plate (~120g Soft Kitchari + 1 tsp Ghee + Pinch of Hing)',
        traditionalIngredients: [
          'Soft-cooked split yellow moong and aged rice (1:1 ratio)',
          'Tempered with cow ghee, freshly grated ginger, and roasted hing',
        ],
        gastrointestinalPurpose:
          'Hing and ginger ignite the digestive fire (Deepana) and dispel colonic gas before heavier digestion begins.',
        classicalCitation: '“दीपनीयानि चान्नानि ग्राहिणीनि च संसृजेत्...” — Charaka Chikitsa 15.68',
        diseaseModulationNote: 'Separate grains replaced with easily absorbable Khichdi.',
      },
      {
        courseNumber: 2,
        sanskritName: 'बिल्व दाडिम मध्य (Bilva & Cooked Bottle Gourd Madhya)',
        englishName: 'Course 2: Steamed Bottle Gourd + Bilva / Pomegranate Reduction',
        platePortion: '1/3 Plate (~110g Steamed Lauki Subzi + 20g Bilva Reduction)',
        traditionalIngredients: [
          'Steamed bottle gourd (Lauki) sauteed with cumin and pink salt',
          'Tender Bilva fruit or pomegranate reduction to tone intestinal villi',
        ],
        gastrointestinalPurpose:
          'Bilva restores gut mucosal integrity, stops abnormal peristaltic spasms, and normalizes stool consistency.',
        classicalCitation: '“ग्रहणीदोषिणां तक्रं बिल्वं चैव परं हितम्...” — Charaka Chikitsa 15.72',
        diseaseModulationNote: 'Raw salads strictly forbidden; steamed astringent fruits used.',
      },
      {
        courseNumber: 3,
        sanskritName: 'तक्र परमामृत अन्त (Takra Kalpana Anta — Supreme Grahani Nectar)',
        englishName: 'Course 3: Freshly Churned Buttermilk (Takra) with Roasted Jeera & Rock Salt',
        platePortion: '1/3 Plate (~150ml Fresh Churned Takra + Curry Leaf)',
        traditionalIngredients: [
          'Freshly churned buttermilk (1 part homemade curd : 4 parts water, butter fat removed)',
          'Infused with roasted cumin powder, dry ginger powder, and rock salt',
        ],
        gastrointestinalPurpose:
          'Takra is the supreme medicine for Grahani: it provides gut flora, stimulates enzymes, and binds loose stools without causing constipation.',
        classicalCitation: '“न तथा वर्तते तक्रं यथा ग्रहण्यां... तक्रं तु पाचकं दीपनं ग्राही...” — Charaka Chikitsa 15.117',
        diseaseModulationNote: 'Unchurned curd replaced with churned Takra.',
      },
    ],
  },

  'raktachapa-hypertension': {
    conditionId: 'raktachapa-hypertension',
    conditionName: 'High Blood Pressure & Arterial Strain (Raktachapa)',
    sanskritName: 'रक्तचाप / रक्तगत वात · Raktachapa',
    charakaCitation: 'Charaka Sutrasthana Ch. 24 (Vidhisohonitiya) & Chikitsasthana Ch. 28',
    stapleGrainSubstitute: 'Aged Barley (Yava) & Shashtika Rice with low sodium',
    bhojanaKramaModificationRationale:
      'Excess sodium chloride and heavy sour condiments constrict peripheral arterioles. Pickles and high-salt sambar must be substituted with garlic-infused broths and Arjuna/coriander teas.',
    pathyaFoods: [
      'Garlic (Lashuna) in moderate boiled form',
      'Arjuna bark tea infusion',
      'Ash gourd and cucumber',
      'Low-sodium Himalayan pink salt (strictly < 2g/day)',
      'Split green moong dal',
    ],
    apathyaFoods: [
      'Commercial high-sodium pickles & papads',
      'Table salt shaker usage',
      'Fermented cheese and processed savory snacks',
      'Excess red chili and caffeine',
    ],
    macroRatioOverride: {
      carbsPct: 50,
      proteinPct: 20,
      fatsPct: 18,
      fiberGrams: 34,
    },
    courses: [
      {
        courseNumber: 1,
        sanskritName: 'लशुन मुद्ग अग्र (Lashuna & Moong Yusha Agra)',
        englishName: 'Course 1: Steamed Rice/Barley + Boiled Garlic & Moong Broth',
        platePortion: '1/3 Plate (~90g Grains + 2 cloves boiled garlic + 100ml Moong broth)',
        traditionalIngredients: [
          'Aged rice or barley cooked with 2 soft cloves of garlic (Lashuna)',
          'Clear yellow moong dal soup with minimal pink rock salt',
          '1 tsp A2 cow ghee',
        ],
        gastrointestinalPurpose:
          'Boiled garlic releases allicin gently without irritating stomach acid, dilating peripheral blood vessels and lowering systolic pressure.',
        classicalCitation: '“लशुनं वातहरं स्निग्धं... रक्तवाहिनि शोधनम्...” — Charaka Kalpasthana',
        diseaseModulationNote: 'High-sodium podis replaced with boiled garlic-moong broth.',
      },
      {
        courseNumber: 2,
        sanskritName: 'कूष्माण्ड मध्य (Kushmanda & Bottle Gourd Madhya)',
        englishName: 'Course 2: Steamed Ash Gourd Subzi + Low-Salt Sambar',
        platePortion: '1/3 Plate (~120g Ash gourd subzi + 60ml Sambar)',
        traditionalIngredients: [
          'Ash gourd (Kushmanda) cooked with cumin and curry leaves',
          'Low-salt moong sambar (strictly no papad, no salty condiments)',
        ],
        gastrointestinalPurpose:
          'High natural potassium in ash gourd balances sodium and relieves cardiac arterial pressure.',
        classicalCitation: '“रक्तपित्तप्रशमनं कूष्माण्डं शीतलम्...” — Charaka Sutra 27',
        diseaseModulationNote: 'Commercial salt restricted; potassium-rich gourd used.',
      },
      {
        courseNumber: 3,
        sanskritName: 'अर्जुन धन्यक अन्त (Arjuna & Coriander Infusion Anta — No Salt Pickle)',
        englishName: 'Course 3: Warm Arjuna-Coriander Infusion + Low-Sodium Takra',
        platePortion: '1/3 Plate (~120ml Diluted Buttermilk or Arjuna tea)',
        traditionalIngredients: [
          'Diluted churned buttermilk with zero added salt, seasoned with roasted jeera',
          'Alternative: Warm Arjuna bark tea with coriander and cardamom',
          'NO SALTY PICKLES: Commercial pickles strictly removed',
        ],
        gastrointestinalPurpose:
          'Arjuna tone cardiac muscle fibers (*Hridya*) while coriander gently promotes diuresis, removing fluid overload.',
        classicalCitation: '“कषायान्तं भोजनं कुर्यात्... हृदयानुकूलम्...” — Charaka Chikitsa 28',
        diseaseModulationNote: 'Salty pickles and heavy tamarind rasam replaced with Arjuna tea/Takra.',
      },
    ],
  },
}

/**
 * Regional Variations when No Acute Disease is Active (Desha-Satmya)
 */
function getRegionalBhojanaKramaCourses(region: RegionId = 'south'): BhojanaKramaCourse[] {
  if (region === 'north') {
    return [
      {
        courseNumber: 1,
        sanskritName: 'फुल्का घृत अग्र भोजन (Phulka, Ghee & Moong Dal Agra)',
        englishName: 'Course 1: Fresh Whole Wheat Phulkas + Yellow Moong Dal + Cow Ghee',
        platePortion: '1/3 Plate (1-2 Warm Phulkas + 100ml Dal Tadka + 1 tsp Ghee)',
        traditionalIngredients: [
          'Freshly rolled whole wheat phulkas / rotis (unfermented)',
          'Split yellow moong dal tempered with cumin, ginger, and hing in pure cow ghee',
        ],
        gastrointestinalPurpose:
          'Warm phulka coated in A2 ghee forms a protective mucosal buffer and awakens salivary amylase without excessive heaviness.',
        classicalCitation: '“गोधूमो मधुरः शीतो गुरुः... स्निग्धो वातपित्तहरो...” — Charaka Sutra 27.21',
        regionalVariant: 'North Indian Native Satmya (Wheat & Moong Staple)',
      },
      {
        courseNumber: 2,
        sanskritName: 'ऋतु शाक मध्य भोजन (Seasonal Green Subzi & Dal Madhya)',
        englishName: 'Course 2: Phulka + Seasonal Vegetable Curry (Lauki / Palak / Gobhi) + Ghee',
        platePortion: '1/3 Plate (1 Phulka + 120g Cooked Seasonal Subzi)',
        traditionalIngredients: [
          'Seasonal green vegetable (Bottle gourd, spinach, carrots, or peas)',
          'Cooked with mild coriander, turmeric, and rock salt',
        ],
        gastrointestinalPurpose:
          'Midday Agni metabolizes dietary vegetable fiber and plant proteins with optimal enzymatic secretion.',
        classicalCitation: '“मध्येऽम्ललवणौ... अन्नं पच्यते सुतरां वह्निना...” — Sushruta Sutra 46.461',
        regionalVariant: 'North Indian Native Satmya',
      },
      {
        courseNumber: 3,
        sanskritName: 'पुदीना छाछ अन्त भोजन (Spiced Mint Chhachh / Chaas Anta)',
        englishName: 'Course 3: Fresh Spiced Mint Buttermilk (Chhachh) with Roasted Jeera',
        platePortion: '1/3 Plate (~150ml Churned Chaas + 1 tsp Amla Murabba or Ginger pickle)',
        traditionalIngredients: [
          'Fresh churned buttermilk (Chhachh) with crushed fresh mint leaves, roasted jeera, and rock salt',
          'Small tasting condiment of lemon-ginger or amla preserve',
        ],
        gastrointestinalPurpose:
          'Mint and roasted cumin stimulate pancreatic lipase, sweep residual Kapha from the tongue, and prevent post-lunch sluggishness.',
        classicalCitation: '“तक्रं दीपनं लघु... भोजनस्यान्ते प्रशस्यते...” — Charaka Sutra 27',
        regionalVariant: 'North Indian Native Satmya',
      },
    ]
  }

  if (region === 'west') {
    return [
      {
        courseNumber: 1,
        sanskritName: 'भाकरी घृत अग्र भोजन (Bajra / Jowar Bhakri & Dal Agra)',
        englishName: 'Course 1: Warm Millet Bhakri + Cow Ghee + Split Legume Dal',
        platePortion: '1/3 Plate (1 Millet Bhakri + 1 tsp Ghee + 80ml Dal)',
        traditionalIngredients: [
          'Hand-flattened roasted Bajra (pearl millet) or Jowar (sorghum) Bhakri',
          'Pure A2 cow ghee to balance the dry (Ruksha) quality of millets',
          'Warm split yellow moong or toor dal',
        ],
        gastrointestinalPurpose:
          'Millets provide complex slow-burning carbohydrates, and ghee buffers the gastrointestinal mucosa.',
        classicalCitation: '“श्यामाककोद्रवादीनि... लेह्यानि च पथ्यानि...” — Charaka Sutra 27',
        regionalVariant: 'Western Indian Native Satmya (Millet Staple)',
      },
      {
        courseNumber: 2,
        sanskritName: 'कढी उसळ मध्य भोजन (Gujarati/Maharashtrian Kadhi & Sprouted Usal)',
        englishName: 'Course 2: Mild Kadhi or Sprouted Bean Curry + Bhakri',
        platePortion: '1/3 Plate (100ml Spiced Kadhi + 80g Sprouted Moong Usal)',
        traditionalIngredients: [
          'Warm digestive Kadhi made with churned buttermilk, besan, curry leaves, and ginger',
          'Steamed sprouted moong or seasonal green subzi',
        ],
        gastrointestinalPurpose:
          'Buttermilk kadhi provides warm bio-available lactobacilli and aids protein assimilation.',
        classicalCitation: '“मध्ये रसाढ्यमश्नीयात्...” — Sushruta Sutra 46',
        regionalVariant: 'Western Indian Native Satmya',
      },
      {
        courseNumber: 3,
        sanskritName: 'मसाला छास अन्त भोजन (Spiced Chaas & Keri Pickle Anta)',
        englishName: 'Course 3: Spiced Chaas with Roasted Cumin + Mild Condiment',
        platePortion: '1/3 Plate (~150ml Chaas + 1 tsp Ginger/Mango pickle)',
        traditionalIngredients: [
          'Light buttermilk seasoned with roasted cumin and rock salt',
          'Small tasting condiment of raw mango/ginger',
        ],
        gastrointestinalPurpose:
          'Astringent and pungent closure seals the pyloric valve and optimizes churning.',
        classicalCitation: '“अन्ते तु तिक्तकटुकषायान्...” — Sushruta Sutra 46.462',
        regionalVariant: 'Western Indian Native Satmya',
      },
    ]
  }

  // Default: South Indian Rice Bowl (Matching User Tradition)
  return [
    {
      courseNumber: 1,
      sanskritName: 'अग्र भोजन (Agra Bhojana - Madhura & Snigdha)',
      englishName: 'Course 1: Rice + Herbal Leaf & Dal Podis + Cow Ghee',
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
      regionalVariant: 'South Indian Native Satmya',
    },
    {
      courseNumber: 2,
      sanskritName: 'मध्य भोजन (Madhya Bhojana - Amla & Lavana)',
      englishName: 'Course 2: Rice + Vegetable Curry / Sambar + Ghee',
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
      regionalVariant: 'South Indian Native Satmya',
    },
    {
      courseNumber: 3,
      sanskritName: 'अन्त भोजन (Anta Bhojana - Katu, Tikta, Kashaya & Drava)',
      englishName: 'Course 3: Rice + Digestive Rasam / Spiced Buttermilk + Pickles',
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
      regionalVariant: 'South Indian Native Satmya',
    },
  ]
}

/**
 * Dynamic Bhojana Krama (3-Course Plate Order)
 * Modulates dynamically based on active clinical disease and regional Satmya.
 */
export function getBhojanaKramaCourses(
  profile?: UserProfile | null,
  conditionId?: string | null
): BhojanaKramaCourse[] {
  // 1. If an active disease protocol is provided, return its tailored 3 courses!
  if (conditionId && DISEASE_CULINARY_MODULATIONS[conditionId]) {
    return DISEASE_CULINARY_MODULATIONS[conditionId].courses
  }

  // 2. Otherwise return regional heritage (North, West, South)
  const region = profile?.region || 'south'
  return getRegionalBhojanaKramaCourses(region)
}

/**
 * Calculates complete modern and Ayurvedic macronutrient breakdown
 * (Carbs, Protein, Healthy Fats, Fiber, and Calories) for each meal and daily total.
 * Adapts dynamically to active clinical conditions (e.g. Lower carbs and higher fiber for Prameha).
 */
export function calculateMealMacronutrients(
  profile: UserProfile,
  conditionId?: string | null
): DailyMacronutrientGoals {
  const metabolism = calculateAyurvedicMetabolism(profile)
  const tdee = metabolism.dailyTdeeKcal

  // Check if clinical disease overrides macro ratios
  const modulation = conditionId ? DISEASE_CULINARY_MODULATIONS[conditionId] : null
  const carbsPct = modulation?.macroRatioOverride?.carbsPct ?? 50
  const proteinPct = modulation?.macroRatioOverride?.proteinPct ?? 18
  const fatsPct = modulation?.macroRatioOverride?.fatsPct ?? 22
  const targetFiber = modulation?.macroRatioOverride?.fiberGrams ?? Math.round(tdee / 75)

  const totalCarbsGrams = Math.round((tdee * (carbsPct / 100)) / 4)
  const totalProteinGrams = Math.round((tdee * (proteinPct / 100)) / 4)
  const totalFatsGrams = Math.round((tdee * (fatsPct / 100)) / 9)
  const totalFiberGrams = targetFiber

  const buildMealMacros = (fraction: number, dominantRasa: string, fiberFraction = fraction): MealMacronutrients => {
    const mealKcal = Math.round(tdee * fraction)
    return {
      caloriesKcal: mealKcal,
      carbohydratesGrams: Math.round(totalCarbsGrams * fraction),
      carbsPercentage: carbsPct,
      proteinGrams: Math.round(totalProteinGrams * fraction),
      proteinPercentage: proteinPct,
      healthyFatsGrams: Math.round(totalFatsGrams * fraction),
      fatsPercentage: fatsPct,
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
 * Returns classical Ayurvedic cooking instructions (Samskara) for any meal,
 * dynamically modulated by active clinical disease.
 */
export function getAyurvedicCookingInstructions(
  mealName: string,
  dosha: Dosha = 'Pitta',
  conditionId?: string | null
): CookingInstruction {
  const isRiceOrGrain =
    mealName.toLowerCase().includes('rice') ||
    mealName.toLowerCase().includes('khichdi') ||
    mealName.toLowerCase().includes('cheela') ||
    mealName.toLowerCase().includes('roti') ||
    mealName.toLowerCase().includes('phulka')

  // Clinical Prameha (Diabetes) override
  if (conditionId === 'prameha-metabolic') {
    return {
      prepPhase: {
        washingAndSoaking:
          'Wash aged roasted barley (Purana Yava) or aged red rice 3 times until water runs clear. Soak barley for at least 2 hours in 3x warm water.',
        scientificAyurvedicReason:
          'Charaka Chikitsa 6: Toya-sannikarsha washes away surface amylose and leaches antinutrients. Prolonged soaking of barley increases soluble beta-glucan availability, slowing glucose absorption.',
      },
      agniProcessing: {
        cookingMethod: 'Open Pot Boiling (Laghu)',
        waterRatio: '1 cup grain : 3 cups water (drain excess starch if using rice)',
        durationMinutes: 25,
        fireIntensity: 'Medium (Madhyamagni)',
      },
      ghritaSamskaraTadka: {
        fatUsed: 'Pure A2 Cow Ghee (Supreme Yogavahi)',
        spiceOrder: [
          '1. Warm only 1/2 tsp cow ghee in iron pan (restricted fat).',
          '2. Add 1/2 tsp fenugreek seeds (Methi) — allow to lightly toast.',
          '3. Add cumin seeds and a generous pinch of asafoetida (Hing).',
          '4. Add fresh grated turmeric (Haridra) and fresh curry leaves.',
          '5. Pour over cooked barley/greens. No sugar or jaggery.',
        ],
        medicinalPurpose:
          'Methi and turmeric activate AMPK pathways and enhance peripheral insulin receptor binding.',
      },
      servingRule:
        'Eat bitter greens (Methi/Karela) FIRST before eating barley carbs. Strictly NO daytime nap (Diva-swapna Nishiddha).',
      clinicalDiseaseNote: 'Prameha Filter: Low-glycemic Purana Yava substituted for white rice; bitter-first rule active.',
    }
  }

  // Clinical Amlapitta (Acid Reflux) override
  if (conditionId === 'amlapitta') {
    return {
      prepPhase: {
        washingAndSoaking:
          'Wash aged Shashtika rice or barley thoroughly. Eliminate all green/red chilies, tamarind, and vinegar from prep.',
        scientificAyurvedicReason:
          'Acidic and pungent agents directly erode the esophageal and gastric mucosal barrier. Preparing with cooling coriander seeds protects the stomach lining.',
      },
      agniProcessing: {
        cookingMethod: 'Slow Simmer (Mandagni)',
        waterRatio: '1 cup rice : 3 cups water (cook very soft and easily digestible)',
        durationMinutes: 22,
        fireIntensity: 'Mild (Mandagni)',
      },
      ghritaSamskaraTadka: {
        fatUsed: 'Pure A2 Cow Ghee (Supreme Yogavahi)',
        spiceOrder: [
          '1. Warm 1 tbsp pure A2 cow ghee over low heat.',
          '2. Add crushed coriander seeds and sweet fennel seeds (Saunf).',
          '3. Add a pinch of Himalayan rock salt (no table salt).',
          '4. Do not overheat or burn the spices; keep aroma gentle and soothing.',
        ],
        medicinalPurpose:
          'Cow ghee and coriander cool excess hydrochloric acid and soothe mucosal inflammation.',
      },
      servingRule:
        'Serve lukewarm (not scalding hot). Strictly NO tamarind rasam and NO spicy pickles. Finish with sweet pomegranate broth or fennel water.',
      clinicalDiseaseNote: 'Amlapitta Filter: Tamarind & chili completely banned; cooling coriander & ghee active.',
    }
  }

  // Clinical Grahani (IBS) override
  if (conditionId === 'grahani-ibs') {
    return {
      prepPhase: {
        washingAndSoaking:
          'Soak yellow moong dal and aged rice together for 45 minutes. Strictly no raw salads or cold vegetables.',
        scientificAyurvedicReason:
          'Grahani requires pre-softened, warm, churnable food to avoid intestinal gas and spastic cramping.',
      },
      agniProcessing: {
        cookingMethod: 'Slow Simmer (Mandagni)',
        waterRatio: '1 cup grain : 4 cups water (Khichdi consistency)',
        durationMinutes: 25,
        fireIntensity: 'Mild (Mandagni)',
      },
      ghritaSamskaraTadka: {
        fatUsed: 'Pure A2 Cow Ghee (Supreme Yogavahi)',
        spiceOrder: [
          '1. Warm 1 tbsp ghee in pot.',
          '2. Add roasted cumin and fresh grated ginger.',
          '3. Add a generous pinch of asafoetida (Hing) to eliminate colonic gas.',
          '4. Add curry leaves and simmer until fragrant.',
        ],
        medicinalPurpose:
          'Ginger and hing rekindle Jatharagni without inflaming the bowel wall.',
      },
      servingRule:
        'Follow immediately with 1 glass of freshly churned Takra with roasted cumin. Strictly NO whole curd/yogurt.',
      clinicalDiseaseNote: 'Grahani Filter: Raw salads banned; Takra nectar protocol active.',
    }
  }

  // Standard rice / grain instructions
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
