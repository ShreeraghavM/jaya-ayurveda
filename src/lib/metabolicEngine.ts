// src/lib/metabolicEngine.ts
// Comprehensive Ayurvedic Metabolic Rate (BMR/TDEE), Ardha-Shakti Exercise Capacity, and Vasanta Ritu (Spring) Bio-Shield Engine
// Grounded in Charaka Samhita: Vimana Sthana 8 (Ahara & Vyayama Shakti), Sutra Sthana 5, 6 & 7 (Matrashiteeya, Tasyashiteeya & Ardha-Shakti)

import type { Dosha, UserProfile, Season } from './data'
import { getSeason } from './data'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active'

export const AGNI_METABOLIC_MODIFIERS = {
  Pitta: 1.10, // Tikshnagni (+10% hyper-catabolic)
  Kapha: 0.92, // Mandagni (-8% slow turnover / storage)
  Vata: 1.00,  // Vishamagni (erratic baseline)
  Sama: 1.05,  // Samagni (optimal equilibrium)
}

export interface AyurvedicMetabolicResult {
  // Anthropometrics & Standard Metrics
  weightKg: number
  heightCm: number
  age: number
  gender: 'male' | 'female'
  
  // Basal Metabolic Rate (BMR)
  baselineBmrKcal: number
  ayurvedicAgniType: 'Tikshnagni (Pitta - Rapid Catabolism)' | 'Mandagni (Kapha - Slow Metabolism)' | 'Vishamagni (Vata - Irregular Burn)' | 'Samagni (Balanced)'
  agniMultiplier: number
  ayurvedicBmrKcal: number

  // Total Daily Energy Expenditure (TDEE)
  activityLevel: ActivityLevel
  physicalActivityMultiplier: number
  dailyTdeeKcal: number

  // Caloric & Meal Portion Distribution (Trividha Kukshi Alignment)
  mealPortionsKcal: {
    breakfastKcal: number // ~25%
    lunchKcal: number // ~45% (Pitta Midday Peak)
    dinnerKcal: number // ~25% (Kapha Sunset Light)
    snackKcal: number // ~5%
  }

  // Exercise Capacity (Ardha-Shakti Rule - Charaka Sutra 7.31-35)
  exerciseCapacity: {
    maxHeartRateBpm: number // 220 - Age
    ardhaShaktiMinHr: number // 50% HR max
    ardhaShaktiMaxHr: number // 70% HR max
    ardhaShaktiTargetZoneBpm: {
      minBpm: number // 50% HR max
      targetBpm: number // ~65% HR max
      maxSafeBpm: number // 70% HR max (Stop limit)
    }
    maxSafeWorkoutCaloriesKcal: number // ~18-20% of TDEE
    recommendedDailyWorkoutMinutes: number
    classicalArdhaShaktiSigns: {
      signSanskrit: string
      signEnglish: string
      actionRequired: string
    }[]
    overtrainingWarning: string
  }

  // Spring Season (Vasanta Ritu) Bio-Shield Adaptation (Charaka Sutra 6.22-26)
  springBioShield: {
    isSpringActive: boolean
    vasantaRituActive: boolean
    kaphaLiquefactionSeverity: 'Mild' | 'Moderate' | 'High'
    seasonName: string
    sanskritName: string
    pathologyAlert: string
    dousedAgniExplanation: string
    dietaryAdjustments: {
      heavyFatReductionPct: number // -15%
      bitterPungentIncreasePct: number // +25%
      keySpringSuperfoods: string[]
      strictlyAvoidFoods: string[]
    }
    strictProhibitions: {
      rule: string
      classicalReason: string
    }[]
    springDinacharyaProtocols: {
      protocolName: string
      sanskritTerm: string
      instructions: string
      benefit: string
    }[]
  }
}

/**
 * Calculates complete Ayurvedic Metabolic Rate (BMR & TDEE), Ardha-Shakti Exercise Capacity,
 * and Spring Seasonal Bio-Shield adaptations.
 */
export function calculateAyurvedicMetabolism(
  profile: UserProfile,
  activityLevelOverride?: ActivityLevel,
  forceSpringSeason?: boolean
): AyurvedicMetabolicResult {
  const weight = profile.weight && profile.weight > 30 ? profile.weight : 75
  const height = profile.height && profile.height > 100 ? profile.height : 175
  const age = profile.age && profile.age > 5 ? profile.age : 28
  const gender: 'male' | 'female' = profile.gender === 'female' ? 'female' : 'male'
  const dosha: Dosha = profile.doshaType || 'Pitta'

  // 1. Baseline BMR (Mifflin-St Jeor Formula)
  let baseBmr = 10 * weight + 6.25 * height - 5 * age
  if (gender === 'male') {
    baseBmr += 5
  } else {
    baseBmr -= 161
  }
  const baselineBmrKcal = Math.round(baseBmr)

  // 2. Ayurvedic Agni-Bala Multiplier (Charaka Vimana 8.120 - Jarana Shakti)
  let agniType: AyurvedicMetabolicResult['ayurvedicAgniType'] = 'Samagni (Balanced)'
  let agniMultiplier = 1.05

  if (dosha === 'Pitta') {
    agniType = 'Tikshnagni (Pitta - Rapid Catabolism)'
    agniMultiplier = 1.10 // +10% higher cellular oxidation & gastric emptying
  } else if (dosha === 'Kapha') {
    agniType = 'Mandagni (Kapha - Slow Metabolism)'
    agniMultiplier = 0.92 // Slower baseline expenditure, higher fat conservation
  } else if (dosha === 'Vata') {
    agniType = 'Vishamagni (Vata - Irregular Burn)'
    agniMultiplier = 1.00 // Erratic, variable baseline
  }

  const ayurvedicBmrKcal = Math.round(baselineBmrKcal * agniMultiplier)

  // 3. Activity Level & TDEE
  const activityLevel: ActivityLevel = activityLevelOverride || mapProfessionToActivity(profile.profession)
  const palMap: Record<ActivityLevel, number> = {
    sedentary: 1.20,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  }
  const physicalActivityMultiplier = palMap[activityLevel]
  const dailyTdeeKcal = Math.round(ayurvedicBmrKcal * physicalActivityMultiplier)

  // 4. Meal Calorie Allocation according to Jatharagni Peak (Charaka Sutra 5)
  // Midday lunch receives ~45% when the sun and Pitta Agni peak
  const mealPortionsKcal = {
    breakfastKcal: Math.round(dailyTdeeKcal * 0.25),
    lunchKcal: Math.round(dailyTdeeKcal * 0.45),
    dinnerKcal: Math.round(dailyTdeeKcal * 0.25),
    snackKcal: Math.round(dailyTdeeKcal * 0.05),
  }

  // 5. Ardha-Shakti Exercise Capacity (Charaka Sutra 7.31-35)
  const maxHeartRate = 220 - age
  const minSafeBpm = Math.round(maxHeartRate * 0.50)
  const targetBpm = Math.round(maxHeartRate * 0.65)
  const maxSafeBpm = Math.round(maxHeartRate * 0.70)
  const maxSafeWorkoutCalories = Math.round(dailyTdeeKcal * 0.18)

  let recommendedWorkoutMinutes = 35
  if (dosha === 'Kapha') recommendedWorkoutMinutes = 45 // Kapha benefits from slightly longer, vigorous workouts to break stagnation
  if (dosha === 'Vata') recommendedWorkoutMinutes = 25 // Vata must keep workouts restorative and gentle
  if (dosha === 'Pitta') recommendedWorkoutMinutes = 35 // Pitta needs cooling, non-competitive endurance

  const exerciseCapacity: AyurvedicMetabolicResult['exerciseCapacity'] = {
    maxHeartRateBpm: maxHeartRate,
    ardhaShaktiMinHr: minSafeBpm,
    ardhaShaktiMaxHr: maxSafeBpm,
    ardhaShaktiTargetZoneBpm: {
      minBpm: minSafeBpm,
      targetBpm: targetBpm,
      maxSafeBpm: maxSafeBpm,
    },
    maxSafeWorkoutCaloriesKcal: maxSafeWorkoutCalories,
    recommendedDailyWorkoutMinutes: recommendedWorkoutMinutes,
    classicalArdhaShaktiSigns: [
      {
        signSanskrit: 'हृदि स्थानस्थितो वायुर्यदा वक्त्रं प्रपद्यते (Vaktram Prapadyate)',
        signEnglish: 'Nasal-to-Mouth Breathing Switch',
        actionRequired: 'When pure nasal breathing can no longer sustain your pace and you involuntarily gasp through the mouth, half-capacity is reached. Immediately lower exertion.',
      },
      {
        signSanskrit: 'ललाटे स्वेदप्रवृत्तिः (Lalate Sveda)',
        signEnglish: 'Forehead & Joint Perspiration',
        actionRequired: 'Beads of sweat forming on the brow, nose bridge, and axillae signify cellular heat has peaked. Transition to cool-down stretching.',
      },
      {
        signSanskrit: 'हृदयानुपरोधः (Hridaya Anuparodha)',
        signEnglish: 'Cardiac Rhythm Ease',
        actionRequired: 'Pulse must remain rhythmic without chest pounding or pain. If pulse exceeds 70% HR max, stop immediately to preserve Ojas (immune vigor).',
      },
    ],
    overtrainingWarning: 'Charaka explicitly cautions: Exceeding half-capacity burns through muscle tissues (Mamsa Dhatu Kshaya), vitiates internal Vata, causes chronic fatigue, and weakens cardiac resilience.',
  }

  // 6. Vasanta Ritu (Spring Season) Bio-Shield (Charaka Sutra 6.22-26)
  const realSeason = getSeason()
  const isSpring = forceSpringSeason !== undefined ? forceSpringSeason : realSeason === 'spring'

  const springBioShield: AyurvedicMetabolicResult['springBioShield'] = {
    isSpringActive: isSpring,
    vasantaRituActive: isSpring,
    kaphaLiquefactionSeverity: dosha === 'Kapha' ? 'High' : dosha === 'Pitta' ? 'Moderate' : 'Mild',
    seasonName: isSpring ? 'Spring (Vasanta Ritu)' : `${realSeason.charAt(0).toUpperCase() + realSeason.slice(1)} Season`,
    sanskritName: 'वसन्त ऋतु (Vasanta Ritu)',
    pathologyAlert:
      'In Spring, the ascending warm sun rays melt the dense Kapha that solidified in tissues during cold winter (Surya-padaih Pratapitah). This liquefied cold mucus floods the stomach and douses the metabolic fire (Hanti Kayagnim), triggering spring allergies, sinusitis, brain fog, and sluggish metabolism.',
    dousedAgniExplanation:
      'When liquefied Kapha floods the Amashaya (stomach), Jatharagni acts like a fire being smothered by cold wet logs. Eating heavy, sweet, or oily winter foods in spring causes severe endotoxin (Ama) accumulation and rapid weight gain.',
    dietaryAdjustments: {
      heavyFatReductionPct: 15,
      bitterPungentIncreasePct: 25,
      keySpringSuperfoods: [
        'Aged Roasted Barley (Purana Yava Khichdi / Sattu) — Supreme Kapha scraper',
        'Dry-Roasted Yellow Moong Dal with Cumin & Ginger',
        'Raw Unheated Honey (Madhu) — Supreme drying (Lekhana) agent',
        'Bitter Spring Greens: Methi (Fenugreek), Neem Leaves, Radish',
        'Digestive Spices: Shunti (Dry Ginger), Maricha (Black Pepper), Pippali (Long Pepper - Trikatu)',
      ],
      strictlyAvoidFoods: [
        'Cold smoothies, iced water, and refrigerated leftovers',
        'Heavy dairy: Curd / Yogurt (Dadhi), paneer, and rich cream',
        'Deep-fried snacks, heavy unctuous sweets, and refined wheat',
        'Excess sour and salty fermented foods',
      ],
    },
    strictProhibitions: [
      {
        rule: '🚫 Absolute Ban on Daytime Napping (Diva-swapna Nishiddha)',
        classicalReason:
          'Charaka Sutra 6.26 commands: Sleeping during the daytime in Spring immediately solidifies the liquefied Kapha in the micro-channels, blocking liver and sinus circulation, and causing acute allergies, headache, and lymphatic edema.',
      },
      {
        rule: '🚫 Ban on Cold Unctuous Drinks',
        classicalReason:
          'Drinking cold water in spring permanently snuffs out the already fragile Jatharagni. All water in spring must be warm, boiled with dry ginger or coriander seeds.',
      },
    ],
    springDinacharyaProtocols: [
      {
        protocolName: 'Triphala & Chickpea Dry Powder Scrub',
        sanskritTerm: 'उद्वर्तन (Udvartana)',
        instructions: 'Vigorously rub dry herbal chickpea or Triphala powder upward over the skin before your morning warm shower.',
        benefit: 'Breaks down subcutaneous fat deposits, stimulates sluggish lymphatic flow, and firms muscle tone.',
      },
      {
        protocolName: 'Anti-Allergy Nasal Herbal Coating',
        sanskritTerm: 'नस्य (Nasya with Anu Taila)',
        instructions: 'Instill 2 warm drops of Anu Taila into each nostril every morning after brushing and gargling.',
        benefit: 'Coats nasal mucosal membranes, blocking seasonal tree pollens, dust mites, and histamine allergic flare-ups.',
      },
      {
        protocolName: 'Morning Kapha-Sweating Exertion',
        sanskritTerm: 'प्रातः व्यायाम (Pratah Vyayama)',
        instructions: 'Engage in brisk morning walking, Surya Namaskar, or cycling up to your 50% Ardha-Shakti threshold.',
        benefit: 'Sweats out liquefied Kapha before the midday heat can cause sinus congestion or brain fog.',
      },
    ],
  }

  return {
    weightKg: weight,
    heightCm: height,
    age,
    gender,
    baselineBmrKcal,
    ayurvedicAgniType: agniType,
    agniMultiplier,
    ayurvedicBmrKcal,
    activityLevel,
    physicalActivityMultiplier,
    dailyTdeeKcal,
    mealPortionsKcal,
    exerciseCapacity,
    springBioShield,
  }
}

/**
 * Maps user profession into estimated physical activity level (PAL).
 */
function mapProfessionToActivity(professionId?: string): ActivityLevel {
  if (!professionId) return 'light'
  const sedentaryIds = ['software_engineer', 'desk_worker', 'writer', 'accountant', 'lawyer']
  const lightIds = ['teacher', 'designer', 'manager', 'student']
  const moderateIds = ['doctor', 'nurse', 'chef', 'retail', 'sales']
  const activeIds = ['athlete', 'fitness_trainer', 'construction', 'farmer']

  if (sedentaryIds.includes(professionId)) return 'sedentary'
  if (lightIds.includes(professionId)) return 'light'
  if (moderateIds.includes(professionId)) return 'moderate'
  if (activeIds.includes(professionId)) return 'very_active'
  return 'light'
}
