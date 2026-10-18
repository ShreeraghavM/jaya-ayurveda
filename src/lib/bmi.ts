import type { Dosha, UserProfile } from './data'

/**
 * World Health Organization adult BMI classification.
 * BMI = weight (kg) / height (m)^2
 * Reference: WHO Technical Report Series 894 (2000) and WHO Europe BMI factsheet.
 */
export type BmiCategoryId =
  | 'severe_thinness'
  | 'moderate_thinness'
  | 'mild_thinness'
  | 'normal'
  | 'overweight'
  | 'obese_1'
  | 'obese_2'
  | 'obese_3'

export interface BmiCategory {
  id: BmiCategoryId
  label: string
  range: string
  min: number
  max: number
  color: string
  healthy: boolean
  summary: string
}

export const BMI_CATEGORIES: BmiCategory[] = [
  {
    id: 'severe_thinness',
    label: 'Severe thinness',
    range: '< 16.0',
    min: 0,
    max: 16,
    color: '#f87171',
    healthy: false,
    summary: 'Significant underweight. Please speak with a doctor before making large dietary changes.',
  },
  {
    id: 'moderate_thinness',
    label: 'Moderate thinness',
    range: '16.0 – 16.9',
    min: 16,
    max: 17,
    color: '#fb923c',
    healthy: false,
    summary: 'Underweight. Your body needs nourishing, warm, regular meals to rebuild strength.',
  },
  {
    id: 'mild_thinness',
    label: 'Mild thinness',
    range: '17.0 – 18.4',
    min: 17,
    max: 18.5,
    color: '#fbbf24',
    healthy: false,
    summary: 'Slightly below the healthy range. A gentle, nourishing routine will close the gap.',
  },
  {
    id: 'normal',
    label: 'Healthy range',
    range: '18.5 – 24.9',
    min: 18.5,
    max: 25,
    color: '#34d399',
    healthy: true,
    summary: 'You are within the WHO healthy range. Focus on maintaining balance and routine.',
  },
  {
    id: 'overweight',
    label: 'Overweight',
    range: '25.0 – 29.9',
    min: 25,
    max: 30,
    color: '#fbbf24',
    healthy: false,
    summary: 'Above the healthy range. Small, consistent changes to meals and movement work best.',
  },
  {
    id: 'obese_1',
    label: 'Obese class I',
    range: '30.0 – 34.9',
    min: 30,
    max: 35,
    color: '#fb923c',
    healthy: false,
    summary: 'Obesity class I. A structured daily routine and professional guidance are recommended.',
  },
  {
    id: 'obese_2',
    label: 'Obese class II',
    range: '35.0 – 39.9',
    min: 35,
    max: 40,
    color: '#f87171',
    healthy: false,
    summary: 'Obesity class II. Please involve a healthcare professional in your plan.',
  },
  {
    id: 'obese_3',
    label: 'Obese class III',
    range: '≥ 40.0',
    min: 40,
    max: 100,
    color: '#ef4444',
    healthy: false,
    summary: 'Obesity class III. Medical supervision is strongly advised alongside daily habits.',
  },
]

export interface BmiResult {
  bmi: number
  category: BmiCategory
  healthyMinKg: number
  healthyMaxKg: number
  deltaToHealthyKg: number
  needsGoal: boolean
}

export function calculateBmi(weightKg: number, heightCm: number): number | null {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return null
  if (weightKg <= 0 || heightCm <= 0) return null
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  if (!Number.isFinite(bmi)) return null
  return Math.round(bmi * 10) / 10
}

export function categorizeBmi(bmi: number): BmiCategory {
  const found = BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max)
  return found ?? BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
}

export function getBmiResult(weightKg: number, heightCm: number): BmiResult | null {
  const bmi = calculateBmi(weightKg, heightCm)
  if (bmi === null) return null
  const heightM = heightCm / 100
  const category = categorizeBmi(bmi)
  const healthyMinKg = Math.round(18.5 * heightM * heightM * 10) / 10
  const healthyMaxKg = Math.round(24.9 * heightM * heightM * 10) / 10
  let deltaToHealthyKg = 0
  if (weightKg > healthyMaxKg) deltaToHealthyKg = Math.round((weightKg - healthyMaxKg) * 10) / 10
  if (weightKg < healthyMinKg) deltaToHealthyKg = Math.round((weightKg - healthyMinKg) * 10) / 10
  return {
    bmi,
    category,
    healthyMinKg,
    healthyMaxKg,
    deltaToHealthyKg,
    needsGoal: !category.healthy,
  }
}

export function getBmiGoal(profile: UserProfile): string | null {
  const result = getBmiResult(profile.weight, profile.height)
  if (!result || !result.needsGoal) return null
  if (result.deltaToHealthyKg > 0) {
    return `Reach a BMI of 24.9 by gently losing ${result.deltaToHealthyKg} kg`
  }
  return `Reach a BMI of 18.5 by gently gaining ${Math.abs(result.deltaToHealthyKg)} kg`
}

/** Dosha-aware, non-clinical first steps toward the healthy BMI band. */
export function getBmiGuidance(dosha: Dosha, result: BmiResult): string[] {
  const losing = result.deltaToHealthyKg > 0
  if (losing) {
    const byDosha: Record<Dosha, string[]> = {
      Vata: [
        'Eat warm, oiled, grounding meals at fixed times — never skip lunch.',
        'Choose nourishing calorie deficits over fasting; Vata crashes quickly.',
        'Favour strength and slow yoga over long cardio.',
      ],
      Pitta: [
        'Keep meals cooling and regular; avoid skipping meals then overeating.',
        'Swap fried and spicy food for steamed vegetables and sweet grains.',
        'Swimming and evening walks keep the metabolism calm, not inflamed.',
      ],
      Kapha: [
        'Wake before 6 AM and move vigorously — this is your strongest lever.',
        'Favour light, warm, pungent food; reduce dairy, sugar and cold drinks.',
        'Take the 10-minute post-meal walk every single day.',
      ],
    }
    return byDosha[dosha]
  }
  const byDosha: Record<Dosha, string[]> = {
    Vata: [
      'Add nourishing snacks: dates, soaked almonds, warm milk with ghee.',
      'Keep every meal warm, moist and oiled.',
      'Strength-building yoga and early sleep help you hold onto weight.',
    ],
    Pitta: [
      'Add nourishing but cooling foods: rice, ghee, avocado, sweet fruits.',
      'Eat five smaller meals rather than three large ones.',
      'Avoid over-exercising in heat, which burns through your reserves.',
    ],
    Kapha: [
      'Add dense nourishment without cold heaviness: nuts, ghee, cooked grains.',
      'Keep breakfast substantial and warm — do not run on tea alone.',
      'Strength training builds healthy mass rather than stagnation.',
    ],
  }
  return byDosha[dosha]
}

export function bmiPercent(bmi: number): number {
  const clamped = Math.max(14, Math.min(42, bmi))
  return ((clamped - 14) / (42 - 14)) * 100
}
