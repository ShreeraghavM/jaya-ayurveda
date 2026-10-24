// scripts/test-metabolic.mjs
// Test suite for Ayurvedic Metabolic Rate (BMR/TDEE), Ardha-Shakti, and Spring Bio-Shield

import { calculateAyurvedicMetabolism } from '../src/lib/metabolicEngine.ts'

console.log('======================================================')
console.log('🔥 AYURVEDIC METABOLIC (BMR/TDEE), ARDHA-SHAKTI & SPRING SUITE')
console.log('======================================================\n')

let passed = 0
let failed = 0

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`)
    passed++
  } else {
    console.error(`  ✗ FAIL: ${testName}`)
    failed++
  }
}

// ─── SUITE 1: Anthropometrics, BMR & Agni Multiplier ───────────────────────
console.log('► Suite 1: Anthropometrics, Baseline BMR & Agni Multiplier')
const arjunProfile = {
  name: 'Arjun',
  weight: 75,
  height: 175,
  age: 28,
  gender: 'male',
  doshaType: 'Pitta',
  profession: 'software_engineer',
}

const arjunMeta = calculateAyurvedicMetabolism(arjunProfile)
assert(arjunMeta.baselineBmrKcal === 1709, `Arjun baseline BMR is 1709 kcal (got ${arjunMeta.baselineBmrKcal})`)
assert(arjunMeta.agniMultiplier === 1.10, 'Pitta receives Tikshnagni 1.10 multiplier (+10% metabolic rate)')
assert(arjunMeta.ayurvedicBmrKcal === 1880, `Pitta-adjusted BMR is 1880 kcal (got ${arjunMeta.ayurvedicBmrKcal})`)

const priyaProfile = {
  name: 'Priya',
  weight: 52,
  height: 162,
  age: 26,
  gender: 'female',
  doshaType: 'Vata',
  profession: 'teacher',
}
const priyaMeta = calculateAyurvedicMetabolism(priyaProfile)
// Female formula: 10*52 + 6.25*162 - 5*26 - 161 = 520 + 1012.5 - 130 - 161 = 1241.5 -> 1242
assert(priyaMeta.baselineBmrKcal === 1242, `Priya female baseline BMR is 1242 kcal (got ${priyaMeta.baselineBmrKcal})`)
assert(priyaMeta.agniMultiplier === 1.00, 'Vata receives Vishamagni 1.00 baseline multiplier')

const rajeshProfile = {
  name: 'Rajesh',
  weight: 88,
  height: 172,
  age: 45,
  gender: 'male',
  doshaType: 'Kapha',
  profession: 'desk_worker',
}
const rajeshMeta = calculateAyurvedicMetabolism(rajeshProfile)
assert(rajeshMeta.agniMultiplier === 0.92, 'Kapha receives Mandagni 0.92 multiplier reflecting slower basal energy expenditure')

// ─── SUITE 2: Total Daily Energy Expenditure (TDEE) & Meal Allocation ──────
console.log('\n► Suite 2: TDEE & Jatharagni Peak Meal Portioning')
assert(arjunMeta.activityLevel === 'sedentary', 'Software engineer is categorized as sedentary (1.20 PAL)')
assert(arjunMeta.dailyTdeeKcal === 2256, `Arjun daily TDEE is 2256 kcal (got ${arjunMeta.dailyTdeeKcal})`)
assert(arjunMeta.mealPortionsKcal.lunchKcal > arjunMeta.mealPortionsKcal.breakfastKcal, 'Lunch receives peak caloric share (45%) corresponding to Pitta peak Agni')
assert(arjunMeta.mealPortionsKcal.lunchKcal === 1015, `Lunch portion is 1015 kcal (got ${arjunMeta.mealPortionsKcal.lunchKcal})`)

// ─── SUITE 3: Ardha-Shakti Exercise Capacity (Charaka Sutra 7) ─────────────
console.log('\n► Suite 3: Ardha-Shakti Exercise Capacity & Safe Heart Rate Zone')
assert(arjunMeta.exerciseCapacity.maxHeartRateBpm === 192, `Max HR for age 28 is 192 bpm (got ${arjunMeta.exerciseCapacity.maxHeartRateBpm})`)
assert(arjunMeta.exerciseCapacity.ardhaShaktiTargetZoneBpm.minBpm === 96, '50% HR threshold is 96 bpm')
assert(arjunMeta.exerciseCapacity.ardhaShaktiTargetZoneBpm.maxSafeBpm === 134, '70% safe limit is 134 bpm')
assert(arjunMeta.exerciseCapacity.classicalArdhaShaktiSigns.length === 3, 'Includes 3 classical Ardha-Shakti signs (Breathing switch, Forehead sweat, Cardiac ease)')

// ─── SUITE 4: Vasanta Ritu (Spring Season) Bio-Shield (Charaka Sutra 6) ────
console.log('\n► Suite 4: Vasanta Ritu (Spring) Kapha Liquefaction Bio-Shield')
const springMeta = calculateAyurvedicMetabolism(arjunProfile, undefined, true)
assert(springMeta.springBioShield.isSpringActive === true, 'Spring mode active')
assert(springMeta.springBioShield.dietaryAdjustments.heavyFatReductionPct === 15, 'Reduces heavy fats by 15% in spring')
assert(springMeta.springBioShield.dietaryAdjustments.keySpringSuperfoods.some(s => s.includes('Barley')), 'Prescribes Aged Barley (Yava) to scrape liquefied Kapha')
assert(springMeta.springBioShield.dietaryAdjustments.keySpringSuperfoods.some(s => s.includes('Honey')), 'Prescribes Raw Honey (Madhu) as supreme drying scraper')
assert(springMeta.springBioShield.strictProhibitions.some(p => p.rule.includes('Daytime Napping')), 'Strictly prohibits daytime naps (Diva-swapna Nishiddha) in spring')
assert(springMeta.springBioShield.springDinacharyaProtocols.some(p => p.sanskritTerm.includes('Nasya')), 'Prescribes Anu Taila Nasya for seasonal pollen/allergy defense')

console.log('\n======================================================')
console.log(`✨ TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) process.exit(1)
