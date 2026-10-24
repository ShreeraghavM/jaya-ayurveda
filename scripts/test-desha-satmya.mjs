// scripts/test-desha-satmya.mjs
// Verification suite for Charaka Ahara Matra & Desha-Satmya Engine

import {
  calculateCharakaPortioning,
  getDeshaSatmyaProfile,
  saveDeshaSatmyaProfile,
  DESHA_DEFINITIONS,
  STAPLE_GRAIN_NAMES,
} from '../src/lib/deshaSatmyaEngine.ts'

console.log('======================================================')
console.log('🌾 CHARAKA AHARA MATRA & DESHA-SATMYA TEST SUITE')
console.log('======================================================\n')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}:`, err.message)
    failed++
  }
}

// Suite 1: Desha Definitions & Staple Grains
console.log('► Suite 1: Classical Deshas & Native Staple Grains')
test('All 3 Classical Deshas (Anupa, Jangala, Sadharana) defined', () => {
  const keys = Object.keys(DESHA_DEFINITIONS)
  if (keys.length !== 3) throw new Error(`Expected 3 deshas, got ${keys.length}`)
  if (!DESHA_DEFINITIONS.anupa.sanskrit.includes('आनूप')) throw new Error('Missing Sanskrit for Anupa')
  if (!DESHA_DEFINITIONS.jangala.sanskrit.includes('जाङ्गल')) throw new Error('Missing Sanskrit for Jangala')
  if (!DESHA_DEFINITIONS.sadharana.sanskrit.includes('साधारण')) throw new Error('Missing Sanskrit for Sadharana')
})

test('Covers indigenous grains (Red Rice, Ragi, Wheat, Jowar/Bajra, Barley)', () => {
  const grains = Object.keys(STAPLE_GRAIN_NAMES)
  if (grains.length < 7) throw new Error('Expected at least 7 staple grain profiles')
  if (!STAPLE_GRAIN_NAMES.rice_red_parboiled.sanskrit.includes('रक्तशाली')) throw new Error('Missing Raktashali')
})

// Suite 2: The 1/3 Stomach Division Rule (Trividha Kukshi)
console.log('\n► Suite 2: The 1/3 Stomach Division Rule (Charaka Vimana 2.3)')
test('Accurately divides stomach into 1/3 Solid, 1/3 Liquid, 1/3 Empty', () => {
  const sampleProfile = {
    name: 'Arjun',
    age: 28,
    gender: 'male',
    weight: 75,
    height: 175,
    doshaType: 'Pitta',
    doshaScores: { Vata: 15, Pitta: 45, Kapha: 15 },
    wakeTime: '06:00',
    sleepTime: '22:00',
    location: 'Bengaluru',
    region: 'south',
    healthGoals: [],
    allergies: [],
    activityLevel: 'moderate',
    completedOnboarding: true,
    createdAt: new Date().toISOString(),
  }

  const result = calculateCharakaPortioning(sampleProfile)

  // Verify solid, liquid, empty are approximately equal thirds of total capacity
  const total = result.totalGastricCapacityMl
  if (total < 700 || total > 1300) throw new Error(`Unexpected total capacity: ${total}ml`)

  if (Math.abs(result.solidFoodGrams - total / 3) > 50) {
    throw new Error(`Solid food (${result.solidFoodGrams}g) deviates from 1/3 of ${total}ml`)
  }
  if (Math.abs(result.liquidFoodMl - total / 3) > 30) {
    throw new Error(`Liquid food (${result.liquidFoodMl}ml) deviates from 1/3 of ${total}ml`)
  }
  if (result.emptyChurnSpaceMl <= 0) {
    throw new Error('Empty churn space must be positive')
  }
})

// Suite 3: Age-Modulated Heavy vs Light (Guru vs Laghu)
console.log('\n► Suite 3: Age-Modulated Heavy vs Light Ratio (Charaka Sutra 5.4)')
test('Senior citizens (60+) receive 85% light food (Laghu) to protect Vata Agni', () => {
  const elderProfile = {
    name: 'Elder',
    age: 68,
    gender: 'female',
    weight: 58,
    height: 160,
    doshaType: 'Vata',
    doshaScores: { Vata: 50, Pitta: 20, Kapha: 10 },
    wakeTime: '06:00',
    sleepTime: '21:30',
    location: 'Chennai',
    region: 'south',
    healthGoals: [],
    allergies: [],
    activityLevel: 'light',
    completedOnboarding: true,
    createdAt: new Date().toISOString(),
  }

  const result = calculateCharakaPortioning(elderProfile)
  if (result.lightFoodRatioPct !== 85) throw new Error(`Expected 85% light food, got ${result.lightFoodRatioPct}%`)
  if (result.heavyFoodRatioPct !== 15) throw new Error(`Expected 15% heavy food, got ${result.heavyFoodRatioPct}%`)
  if (result.lifeStageCategory !== 'Vardhakya (Elder Restorative)') throw new Error('Incorrect life stage')
})

// Suite 4: Gender Biological Tissue Requirements
console.log('\n► Suite 4: Gender Biological Tissue Adaptation')
test('Female physiology prioritizes Rakta (Blood) & Artava (Hormonal) tissue replenishment', () => {
  const femaleProfile = {
    name: 'Priya',
    age: 26,
    gender: 'female',
    weight: 54,
    height: 162,
    doshaType: 'Vata',
    doshaScores: { Vata: 40, Pitta: 20, Kapha: 15 },
    wakeTime: '06:00',
    sleepTime: '22:00',
    location: 'Hyderabad',
    region: 'south',
    healthGoals: [],
    allergies: [],
    activityLevel: 'moderate',
    completedOnboarding: true,
    createdAt: new Date().toISOString(),
  }

  const result = calculateCharakaPortioning(femaleProfile)
  const focusJoined = result.genderTissueFocus.join(' ')
  if (!focusJoined.includes('Raktavardhaka') || !focusJoined.includes('Artavavaha')) {
    throw new Error('Missing Rakta/Artava focus in female prescription')
  }
})

// Suite 5: Clinical Adaptation with Active Disease Beacons
console.log('\n► Suite 5: Clinical Sugar (Prameha) Desha Adaptation')
test('Replaces white rice with Raktashali / Yava Pongal when Prameha is active', () => {
  const diabeticProfile = {
    name: 'Rajesh',
    age: 48,
    gender: 'male',
    weight: 82,
    height: 172,
    doshaType: 'Kapha',
    doshaScores: { Vata: 10, Pitta: 20, Kapha: 50 },
    wakeTime: '06:00',
    sleepTime: '22:00',
    location: 'Kochi',
    region: 'south',
    healthGoals: [],
    allergies: [],
    activityLevel: 'sedentary',
    completedOnboarding: true,
    createdAt: new Date().toISOString(),
  }

  const activeBeacons = [
    {
      id: 'beacon-sugar',
      conditionName: 'Metabolic Glucose Imbalance (Prameha)',
      sanskritName: 'प्रमेह',
      systemId: 'digestive',
      organId: 'pancreas',
      reportedDate: '2026-10-24',
      severity: 'moderate',
      projectedReliefDays: 45,
      expectedDailyPainReductionPct: 15,
      charakaReference: 'Charaka Chikitsa 6',
      targetBiomarkers: 'Fasting Sugar < 100',
      prescribedDiet: [],
      prescribedRemedy: 'Fenugreek',
      prescribedYoga: 'Mandukasana',
      isCleared: false,
    },
  ]

  const result = calculateCharakaPortioning(diabeticProfile, undefined, activeBeacons)
  if (!result.nativeSatmyaMeal.mealTitle.includes('Raktashali') && !result.nativeSatmyaMeal.mealTitle.includes('Yava')) {
    throw new Error('Did not apply clinical Raktashali/Yava grain adaptation for Prameha')
  }
  if (!result.nativeSatmyaMeal.clinicalAdaptation) {
    throw new Error('Missing clinical adaptation callout')
  }
})

console.log('\n======================================================')
console.log(`✨ TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) process.exit(1)
