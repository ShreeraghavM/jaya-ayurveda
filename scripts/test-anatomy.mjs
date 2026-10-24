// scripts/test-anatomy.mjs
// Verification suite for Ayurvedic Human Anatomy & Srotas Digital Twin Engine

import {
  ANATOMICAL_SYSTEMS,
  calculateSystemNourishment,
  getOverallBodyVitalityScore,
  generateDeficitBalancingMeal,
  getDiseaseBeacons,
  saveDiseaseBeacon,
  clearDiseaseBeacon,
  getBedtimePainLogs,
  saveBedtimePainLog,
  getClinicalLabReports,
  saveClinicalLabReport,
  analyzeLabReportNumbers,
} from '../src/lib/anatomyEngine.ts'

console.log('======================================================')
console.log('🧬 JAYA AYURVEDA ANATOMY DIGITAL TWIN TEST SUITE')
console.log('======================================================')

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

// Suite 1: 13 Anatomical Systems Definitions
console.log('\n► Suite 1: 13 Anatomical Systems Integrity')
test('All 13 classical-to-modern anatomical systems defined', () => {
  const keys = Object.keys(ANATOMICAL_SYSTEMS)
  if (keys.length !== 13) throw new Error(`Expected 13 systems, found ${keys.length}`)
})

test('Every system contains classical Sanskrit Srotas & Shloka', () => {
  for (const [k, sys] of Object.entries(ANATOMICAL_SYSTEMS)) {
    if (!sys.sanskritSrotas || sys.sanskritSrotas.length < 5) throw new Error(`Missing sanskrit srotas for ${k}`)
    if (!sys.classicalShlokaReference) throw new Error(`Missing shloka reference for ${k}`)
    if (!sys.primaryOrgans || sys.primaryOrgans.length === 0) throw new Error(`Missing primary organs for ${k}`)
    if (!sys.recommendedFoodsFor100 || sys.recommendedFoodsFor100.length === 0) throw new Error(`Missing recommended foods for ${k}`)
  }
})

// Suite 2: Daily Nourishment Calculation & 0-100% Logic
console.log('\n► Suite 2: Daily Nourishment Calculation')
test('calculateSystemNourishment returns nourishment scores for all 13 systems', () => {
  const n = calculateSystemNourishment('2026-10-24')
  const keys = Object.keys(n)
  if (keys.length !== 13) throw new Error(`Expected 13 systems, got ${keys.length}`)
  for (const sys of Object.values(n)) {
    if (sys.percentage < 0 || sys.percentage > 100) throw new Error(`Invalid percentage: ${sys.percentage}`)
  }
})

test('Overall body vitality score averages system scores', () => {
  const n = calculateSystemNourishment('2026-10-24')
  const score = getOverallBodyVitalityScore(n)
  if (score < 0 || score > 100) throw new Error(`Invalid overall score: ${score}`)
})

// Suite 3: Deficit Balancing Meal Engine
console.log('\n► Suite 3: Deficit Balancing Meal Formulation')
test('generateDeficitBalancingMeal produces targeted recipe for lowest systems', () => {
  const n = calculateSystemNourishment('2026-10-24')
  const meal = generateDeficitBalancingMeal(n, 'Pitta')
  if (!meal.recommendedMealTitle) throw new Error('Missing meal title')
  if (!meal.ingredients || meal.ingredients.length === 0) throw new Error('Missing ingredients')
  if (!meal.charakaCitation) throw new Error('Missing Charaka citation')
})

// Suite 4: Disease Beacon & Pathology Pinpointing
console.log('\n► Suite 4: Disease Beacon on Anatomical Organs')
test('getDiseaseBeacons returns active clinical conditions', () => {
  const beacons = getDiseaseBeacons()
  if (!Array.isArray(beacons) || beacons.length === 0) throw new Error('Expected at least 1 beacon')
  const b = beacons[0]
  if (!b.systemId || !b.organId) throw new Error('Missing system or organ id on beacon')
})

// Suite 5: Bedtime Pain Checkin Logging
console.log('\n► Suite 5: Bedtime Pain & Efficacy Logs')
test('Bedtime pain logs record projected vs actual pain relief', () => {
  const logs = getBedtimePainLogs()
  if (!Array.isArray(logs) || logs.length === 0) throw new Error('Expected bedtime logs')
  const l = logs[0]
  if (typeof l.projectedReductionPct !== 'number' || typeof l.actualReductionPct !== 'number') {
    throw new Error('Invalid reduction percentage metrics')
  }
})

// Suite 6: Doctor Diagnostic Lab Analysis
console.log('\n► Suite 6: Clinical Lab Report Analyzer')
test('analyzeLabReportNumbers correlates elevated fasting glucose with Medovaha dushti', () => {
  const analysis = analyzeLabReportNumbers({
    fastingBloodSugarMgDl: 145,
    hba1cPct: 7.2,
    systolicBpMmHg: 135,
  })
  if (!analysis.correlation.includes('Glucose')) throw new Error('Failed to identify glucose correlation')
  if (!analysis.correlation.includes('HbA1c')) throw new Error('Failed to identify HbA1c correlation')
  if (analysis.recommendations.length === 0) throw new Error('Missing dietary recalibration recommendations')
})

console.log('\n======================================================')
console.log(`✨ TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) process.exit(1)
