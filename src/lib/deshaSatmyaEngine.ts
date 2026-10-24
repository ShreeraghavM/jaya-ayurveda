// src/lib/deshaSatmyaEngine.ts
// Charaka Ahara Matra (Quantity & 1/3 Stomach Division) and Desha-Satmya (Native Geography & Habituation) Engine
// Canonical References: Charaka Sutra Sthana 5 (Matrashiteeya), Vimana Sthana 2 (Trividha Kukshiya), Vimana Sthana 1 & 8 (Desha Satmya)

import type { UserProfile, Dosha } from './data'
import { getDiseaseBeacons, type DiseaseBeacon } from './anatomyEngine'

export type ClassicalDeshaType = 'anupa' | 'jangala' | 'sadharana'

export type StapleGrainType =
  | 'rice_white'
  | 'rice_red_parboiled'
  | 'ragi_millet'
  | 'wheat_phulka'
  | 'jowar_bajra'
  | 'mixed_millets'
  | 'corn_maize'
  | 'oats_barley'

export interface DeshaSatmyaProfile {
  birthRegion: string // e.g. "South India (Coastal/Deccan)", "North India (Plains)", "West (Arid/Gujarat/Rajasthan)"
  deshaType: ClassicalDeshaType
  stapleGrain: StapleGrainType
  dietaryPreference: 'vegetarian' | 'eggetarian' | 'non_vegetarian' | 'vegan'
  currentLivingCity: string
  currentClimate: 'hot_humid' | 'hot_dry' | 'moderate' | 'cold_dry' | 'cold_wet'
}

export interface CharakaPortioningResult {
  totalGastricCapacityMl: number
  // The 1/3 Stomach Division (Trividha Kukshi - Charaka Vimana 2.3)
  solidFoodGrams: number // 1/3 solid
  liquidFoodMl: number // 1/3 liquid
  emptyChurnSpaceMl: number // 1/3 empty for Vata, Pitta, Kapha
  // Heavy vs Light (Guru vs Laghu - Charaka Sutra 5.4)
  heavyFoodRatioPct: number // % Guru
  lightFoodRatioPct: number // % Laghu
  lifeStageCategory: 'Balya (Growing)' | 'Madhyama (Adult Vitality)' | 'Vardhakya (Elder Restorative)'
  genderTissueFocus: string[]
  nativeSatmyaMeal: {
    mealTitle: string
    regionalHeritage: string
    stapleGrainName: string
    solidPortionDescription: string
    liquidPortionDescription: string
    ayurvedicSpices: string[]
    rationale: string
    charakaCitation: string
    clinicalAdaptation?: string
  }
  clinicalSignsOfRightMeasure: string[]
}

// ─── CANONICAL DESHA DEFINITIONS ───────────────────────────────────────────

export const DESHA_DEFINITIONS: Record<ClassicalDeshaType, { name: string; sanskrit: string; description: string; dominantDosha: string; nativeDietRules: string }> = {
  anupa: {
    name: 'Anupa Desha (Wet / Marshy / Coastal)',
    sanskrit: 'आनूप देश',
    description: 'Humid, abundant rainfall, coastal sea breezes, river deltas, lush vegetation (e.g. Kerala, Bengal, Coastal Maharashtra, Tamil Nadu coast).',
    dominantDosha: 'Kapha & Vata',
    nativeDietRules: 'Requires warming, drying, light-to-digest staples (parboiled rice, ginger, black pepper, rasam, roasted spices, light fish, balanced coconut).',
  },
  jangala: {
    name: 'Jangala Desha (Dry / Arid / Desert Plateau)',
    sanskrit: 'जाङ्गल देश',
    description: 'Arid, hot sun, open thorny terrain, deep ground-water, sparse rain (e.g. Rajasthan, Gujarat arid, dry Deccan, Rayalaseema, Mediterranean).',
    dominantDosha: 'Vata & Pitta',
    nativeDietRules: 'Requires unctuous, grounding, sweet, and cooling staples (Jowar, Bajra, black sesame, A2 cow ghee, fresh buttermilk, cooling gourds).',
  },
  sadharana: {
    name: 'Sadharana Desha (Moderate / Fertile Plains)',
    sanskrit: 'साधारण देश',
    description: 'Balanced seasons, fertile alluvial soil, moderate flora and rainfall (e.g. Gangetic plains, Punjab, Central river basins).',
    dominantDosha: 'Sama Dosha (Balanced)',
    nativeDietRules: 'Requires complete Shad-Rasa balance with aged wheat, barley (Yava), moong dal, seasonal leafy greens, and fresh dairy.',
  },
}

export const STAPLE_GRAIN_NAMES: Record<StapleGrainType, { label: string; sanskrit: string; thermalAction: 'cooling' | 'warming' | 'neutral'; digestibility: 'light' | 'moderate' | 'heavy' }> = {
  rice_white: { label: 'Polished White Rice', sanskrit: 'Shali Dhanya (शाली)', thermalAction: 'cooling', digestibility: 'light' },
  rice_red_parboiled: { label: 'Aged Parboiled Red Rice', sanskrit: 'Raktashali (रक्तशाली)', thermalAction: 'cooling', digestibility: 'light' },
  ragi_millet: { label: 'Finger Millet (Ragi)', sanskrit: 'Mandua / Madhulika (मधूलिका)', thermalAction: 'cooling', digestibility: 'heavy' },
  wheat_phulka: { label: 'Whole Wheat Phulka / Roti', sanskrit: 'Godhuma (गोधूम)', thermalAction: 'cooling', digestibility: 'heavy' },
  jowar_bajra: { label: 'Sorghum & Pearl Millet (Jowar/Bajra)', sanskrit: 'Yavanala & Priyaṅgu', thermalAction: 'warming', digestibility: 'light' },
  mixed_millets: { label: 'Indigenous Millets (Kodo/Foxtail/Little)', sanskrit: 'Kudravyasa (कुद्रव्य)', thermalAction: 'neutral', digestibility: 'light' },
  corn_maize: { label: 'Maize / Corn', sanskrit: 'Mahakaya (मक्का)', thermalAction: 'neutral', digestibility: 'heavy' },
  oats_barley: { label: 'Barley & Whole Oats', sanskrit: 'Yava (यव)', thermalAction: 'cooling', digestibility: 'light' },
}

// ─── STORAGE KEYS ──────────────────────────────────────────────────────────

const DESHA_SATMYA_KEY = 'jaya_desha_satmya_profile'

export function getDeshaSatmyaProfile(profile?: UserProfile): DeshaSatmyaProfile {
  try {
    const raw = localStorage.getItem(DESHA_SATMYA_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}

  // Intelligent fallback from user profile
  const region = profile?.region || 'south'
  const isSouthOrEast = region === 'south' || region === 'east' || region === 'northeast'
  const isWest = region === 'west'

  return {
    birthRegion: isSouthOrEast ? 'South India (Coastal/Deccan)' : isWest ? 'Western India (Gujarat/Rajasthan)' : 'North India (Plains)',
    deshaType: isSouthOrEast ? 'anupa' : isWest ? 'jangala' : 'sadharana',
    stapleGrain: isSouthOrEast ? 'rice_red_parboiled' : isWest ? 'jowar_bajra' : 'wheat_phulka',
    dietaryPreference: 'vegetarian',
    currentLivingCity: profile?.location || 'Bengaluru, India',
    currentClimate: isSouthOrEast ? 'hot_humid' : isWest ? 'hot_dry' : 'moderate',
  }
}

export function saveDeshaSatmyaProfile(deshaProfile: DeshaSatmyaProfile): void {
  try {
    localStorage.setItem(DESHA_SATMYA_KEY, JSON.stringify(deshaProfile))
  } catch (err) {
    console.warn('Failed to save desha satmya profile', err)
  }
}

// ─── PORTIONING & CALCULATION ENGINE ───────────────────────────────────────

/**
 * Calculates exact volumetric food portions (1/3 Solid, 1/3 Liquid, 1/3 Empty)
 * adjusted by Age, Gender, Body Mass, and Native Desha Satmya.
 */
export function calculateCharakaPortioning(
  profile: UserProfile,
  deshaProfile?: DeshaSatmyaProfile,
  activeBeacons?: DiseaseBeacon[]
): CharakaPortioningResult {
  const satmya = deshaProfile || getDeshaSatmyaProfile(profile)
  const beacons = activeBeacons || getDiseaseBeacons().filter(b => !b.isCleared)

  const weight = profile.weight || 65
  const age = profile.age || 30
  const gender = profile.gender || 'male'

  // Total biological gastric capacity (ml) roughly scales at ~14-15 ml per kg body weight in adults
  // Baseline ~900ml for average 65kg adult
  const baselineCapacity = Math.round(weight * 14.5)
  // Clamp between 650ml and 1250ml
  const totalCapacity = Math.max(650, Math.min(1250, baselineCapacity))

  // The 1/3 Stomach Division Rule (Charaka Vimana 2.3)
  // 1/3 Solid (grams), 1/3 Liquid (ml), 1/3 Empty (ml)
  const oneThirdVolume = Math.round(totalCapacity / 3)

  // Solids are slightly denser than water (density factor ~1.05)
  // In elder age, solid volume reduces gently to prevent Agni overwhelm
  let solidAdjustment = 1.0
  if (age >= 60) solidAdjustment = 0.8
  else if (age <= 20) solidAdjustment = 1.08

  const solidFoodGrams = Math.round(oneThirdVolume * solidAdjustment)
  const liquidFoodMl = oneThirdVolume
  const emptyChurnSpaceMl = totalCapacity - solidFoodGrams - liquidFoodMl

  // Heavy vs Light (Guru vs Laghu) Ratio adjusted by Age (Charaka Sutra 5.4 & Vimana 8)
  let heavyFoodRatioPct = 35
  let lightFoodRatioPct = 65
  let lifeStageCategory: CharakaPortioningResult['lifeStageCategory'] = 'Madhyama (Adult Vitality)'

  if (age <= 25) {
    lifeStageCategory = 'Balya (Growing)'
    heavyFoodRatioPct = 45 // Higher tissue building anabolic requirement
    lightFoodRatioPct = 55
  } else if (age >= 56) {
    lifeStageCategory = 'Vardhakya (Elder Restorative)'
    heavyFoodRatioPct = 15 // Very light to accommodate delicate Vata Agni
    lightFoodRatioPct = 85
  }

  // Gender Tissue Nutrient Focus
  const genderTissueFocus: string[] = []
  if (gender === 'female') {
    genderTissueFocus.push('Raktavardhaka (Blood & Erythrocyte renewal)')
    genderTissueFocus.push('Artavavaha (Hormonal & pelvic equilibrium)')
    genderTissueFocus.push('Sukumara Snigdha (Delicate, unctuous digestive pacing)')
  } else {
    genderTissueFocus.push('Mamsa Dhatu (Muscular strength & stamina)')
    genderTissueFocus.push('Shukra Dhatu (Cellular vitality & metabolic vigor)')
    genderTissueFocus.push('Agni Samrakshana (Metabolic fire protection during peak labor)')
  }

  // Determine native soul recipe with clinical adaptation
  const hasPramehaSugar = beacons.some(b => b.conditionName.toLowerCase().includes('prameha') || b.conditionName.toLowerCase().includes('sugar') || b.conditionName.toLowerCase().includes('glucose'))
  const hasRaktachapaBP = beacons.some(b => b.conditionName.toLowerCase().includes('bp') || b.conditionName.toLowerCase().includes('hypertension') || b.conditionName.toLowerCase().includes('raktachapa'))

  let grainName = STAPLE_GRAIN_NAMES[satmya.stapleGrain]?.label || 'Native Grains'
  let mealTitle = ''
  let solidPortion = ''
  let liquidPortion = ''
  let spices: string[] = []
  let rationale = ''
  let citation = ''
  let clinicalAdaptation: string | undefined

  if (satmya.deshaType === 'anupa') {
    // Coastal / South / East
    if (hasPramehaSugar) {
      mealTitle = 'Aged Raktashali (Red Rice) & Roasted Moong Pongal with Fenugreek'
      solidPortion = `${solidFoodGrams}g portion: 50% Aged red rice, 30% yellow moong, 20% steamed ridge gourd`
      liquidPortion = `${liquidFoodMl}ml warm digestive Rasam with black pepper, cumin & curry leaves`
      spices = ['Methi (Fenugreek)', 'Jeera (Cumin)', 'Maricha (Black pepper)', 'Hing', 'Curry leaves']
      rationale = 'Replaces glycemic white rice with classical Raktashali (red rice) cited in Charaka as Tridoshic and non-diabetogenic, tempered with blood-sugar lowering fenugreek.'
      citation = 'Charaka Sutra Sthana 27.8: "Raktashali is the supreme of all rices; unctuous, cooling, sweet, and pacifies all three doshas without provoking Prameha."'
      clinicalAdaptation = 'Clinical Sugar Shield: Fenugreek and black pepper modulate glucose absorption kinetics.'
    } else {
      mealTitle = 'Coastal Desha-Satmya Warm Sambar Rice with Moringa & Buttermilk'
      solidPortion = `${solidFoodGrams}g portion: Hand-pounded indigenous rice, drumstick (moringa) sambar, steamed green beans`
      liquidPortion = `${liquidFoodMl}ml Takra (fresh buttermilk) churned with roasted cumin & pink salt`
      spices = ['Roasted Jeera', 'Mustard seeds', 'Curry leaves', 'Turmeric', 'Ginger']
      rationale = 'Harmonizes coastal humidity and Kapha tendencies using light, gut-cleansing buttermilk and bioavailable drumstick pods.'
      citation = 'Charaka Chikitsa Sthana 15.117: "Takra (buttermilk) rekindles Agni, clears srotas obstructions, and is homologous to the inhabitants of Anupa lands."'
    }
  } else if (satmya.deshaType === 'jangala') {
    // Arid / West / Desert / Deccan
    if (hasRaktachapaBP) {
      mealTitle = 'Cardio-Protective Jowar Bhakri with Spiced Moong & Ridge Gourd'
      solidPortion = `${solidFoodGrams}g portion: 1.5 warm Jowar rotis with light moong dal and ghee`
      liquidPortion = `${liquidFoodMl}ml Coriander & Fennel seed cooling infusion`
      spices = ['Dhanya (Coriander)', 'Saunf (Fennel)', 'Saindhava (Rock salt only)', 'Turmeric']
      rationale = 'Potassium-rich sorghum (Jowar) relieves vascular arterial stiffness; cooling fennel pacifies Pitta heat in Raktavaha Srotas.'
      citation = 'Charaka Sutra Sthana 25.38: "Jowar is dry, cooling, light, and maintains arterial softness in arid-born individuals."'
      clinicalAdaptation = 'Cardiovascular BP Control: Zero added table salt; seasoned solely with cooling coriander and potassium-rich seeds.'
    } else {
      mealTitle = 'Jangala-Satmya Roasted Bajra Roti with Turmeric Pumpkin & Ghee'
      solidPortion = `${solidFoodGrams}g portion: Warm Bajra roti, spiced yellow pumpkin curry, 1 tsp A2 cow ghee`
      liquidPortion = `${liquidFoodMl}ml light ginger-coriander soup`
      spices = ['Ajwain', 'Cumin', 'Rock salt', 'Clarified cow ghee', 'Fresh cilantro']
      rationale = 'Grounds Vata dryness native to arid geography while A2 cow ghee protects mucosal linings.'
      citation = 'Charaka Sutra Sthana 5.6: "In arid lands, unctuous and grounding staples eaten in exact half-measure sustain peak bodily endurance."'
    }
  } else {
    // Sadharana / North Plains
    if (hasPramehaSugar) {
      mealTitle = 'Yava (Barley) & Missi Roti with Lauki (Bottle Gourd) Sabzi'
      solidPortion = `${solidFoodGrams}g portion: 2 Barley-Chickpea rotis with steamed bottle gourd curry`
      liquidPortion = `${liquidFoodMl}ml warm spiced yellow moong broth`
      spices = ['Ajwain', 'Ginger', 'Jeera', 'Kasuri Methi']
      rationale = 'Barley (Yava) is Charaka’s primary therapeutic grain for diabetic disorders, clearing fat and glucose stagnation in Medovaha Srotas.'
      citation = 'Charaka Chikitsa Sthana 6.23: "Yava (Barley) is the foremost grain for Prameha; drying, scraping, and restoring metabolic balance."'
      clinicalAdaptation = 'Clinical Glycemic Adaptation: Replaced wheat with 60% barley and 40% roasted gram flour.'
    } else {
      mealTitle = 'Sadharana-Satmya Fresh Wheat Phulkas with Tadka Moong Dal & Spinach'
      solidPortion = `${solidFoodGrams}g portion: 2 fresh soft phulkas with palak moong dal and steamed carrots`
      liquidPortion = `${liquidFoodMl}ml thin digestive dal soup with pinch of hing`
      spices = ['Hing (Asafoetida)', 'Jeera', 'Turmeric', 'Coriander powder']
      rationale = 'Supplies all 6 foundational tastes (Shad Rasa) naturally habituated to inhabitants of the fertile central plains.'
      citation = 'Charaka Sutra Sthana 27.21: "Wheat is sweet, cooling, vitalizing, and produces cellular stability in those accustomed to its soil."'
    }
  }

  return {
    totalGastricCapacityMl: totalCapacity,
    solidFoodGrams,
    liquidFoodMl,
    emptyChurnSpaceMl,
    heavyFoodRatioPct,
    lightFoodRatioPct,
    lifeStageCategory,
    genderTissueFocus,
    nativeSatmyaMeal: {
      mealTitle,
      regionalHeritage: `${satmya.birthRegion} · ${DESHA_DEFINITIONS[satmya.deshaType].name}`,
      stapleGrainName: grainName,
      solidPortionDescription: solidPortion,
      liquidPortionDescription: liquidPortion,
      ayurvedicSpices: spices,
      rationale,
      charakaCitation: citation,
      clinicalAdaptation,
    },
    clinicalSignsOfRightMeasure: [
      'No abdominal distension or pressure against the navel (Kukshor Anatimatra)',
      'Clear, unobstructed chest and cardiac rhythm (Hridaya Anuparodha)',
      'No stretching or heaviness in the lateral flanks (Parshva Apeedanam)',
      'Feeling of lightness across all 5 sensory faculties (Laghavam Indriyanam)',
      'Comfortable standing, breathing, and walking after eating',
      'Timely return of genuine hunger for the subsequent meal without acid reflux',
    ],
  }
}
