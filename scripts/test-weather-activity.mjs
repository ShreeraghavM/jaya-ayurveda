// scripts/test-weather-activity.mjs
// Unit tests for Real-Time Weather & Health Activity Tracking (Walking, Running & Environmental Bio-Adaptation)

import {
  calculateDoshaClimateImpact,
  interpretWmoCode,
  PRESET_WEATHER_LOCATIONS,
} from '../src/lib/weatherEngine.ts'

import {
  getDoshaStepGoal,
  calculateSafeHeartRateZone,
  calculateWorkoutCalories,
} from '../src/lib/activityEngine.ts'

console.log('======================================================')
console.log('🌦️ TEST SUITE: WEATHER & HEALTH ACTIVITY ENGINE')
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

// ─── SECTION 1: Weather & Environmental Dosha Engine ───────────────────────
console.log('► Section 1: Weather & Environmental Climate Diagnostic')

// 1. Vata Wind & Cold Test
const vataWeather = {
  city: 'Chilly Windy Valley',
  temperatureC: 12, // Cold
  humidityPct: 35, // Dry
  windSpeedKmh: 24, // High wind
  uvIndex: 2,
  aqi: 30,
  weatherCode: 3,
  weatherDescription: 'Overcast & Cold Wind',
  weatherIcon: '💨',
  isDay: true,
}
const vataImpact = calculateDoshaClimateImpact(vataWeather, { doshaType: 'Vata' })
assert(vataImpact.vataIndex >= 50, `Vata index elevated in cold/wind (got ${vataImpact.vataIndex})`)
assert(vataImpact.dominantAggravation === 'Vata', `Dominant aggravation is Vata (got ${vataImpact.dominantAggravation})`)
assert(vataImpact.climateAlertTitle.includes('Vata'), 'Alert title identifies Vata condition')
assert(vataImpact.hydrationAndDietShield.waterTemperature === 'Warm Boiled', 'Prescribes warm boiled water for Vata wind')

// 2. Pitta Heat & Solar Radiation Test
const pittaWeather = {
  city: 'Scorching Desert Town',
  temperatureC: 36, // Extreme heat
  humidityPct: 40,
  windSpeedKmh: 8,
  uvIndex: 9, // High UV
  aqi: 45,
  weatherCode: 0,
  weatherDescription: 'Blazing Sun',
  weatherIcon: '☀️',
  isDay: true,
}
const pittaImpact = calculateDoshaClimateImpact(pittaWeather, { doshaType: 'Pitta' })
assert(pittaImpact.pittaIndex >= 60, `Pitta index elevated in heat/UV (got ${pittaImpact.pittaIndex})`)
assert(pittaImpact.dominantAggravation === 'Pitta', `Dominant climate aggravation is Pitta`)
assert(pittaImpact.hydrationAndDietShield.waterTemperature === 'Clay Pot Cool', 'Prescribes clay pot cool water for Pitta heat')
assert(pittaImpact.recommendedExerciseWindow.exerciseType === 'Cool Twilight Walk', 'Recommends cool twilight walk avoiding midday sun')

// 3. Kapha Humidity & Sluggishness Test
const kaphaWeather = {
  city: 'Damp Coastal Plains',
  temperatureC: 22,
  humidityPct: 84, // Very humid
  windSpeedKmh: 10,
  uvIndex: 4,
  aqi: 40,
  weatherCode: 61,
  weatherDescription: 'Damp Rain',
  weatherIcon: '🌧️',
  isDay: true,
}
const kaphaImpact = calculateDoshaClimateImpact(kaphaWeather, { doshaType: 'Kapha' })
assert(kaphaImpact.kaphaIndex >= 55, `Kapha index elevated in damp humidity (got ${kaphaImpact.kaphaIndex})`)
assert(kaphaImpact.dominantAggravation === 'Kapha', `Dominant climate is Kapha`)
assert(kaphaImpact.hydrationAndDietShield.superfoodAntidote.includes('barley') || kaphaImpact.hydrationAndDietShield.superfoodAntidote.includes('sattu'), 'Recommends drying barley/sattu for Kapha')

// 4. AQI Pranavaha Srotas (Respiratory) Test
const smogWeather = {
  city: 'Industrial Metro',
  temperatureC: 25,
  humidityPct: 55,
  windSpeedKmh: 6,
  uvIndex: 4,
  aqi: 165, // Unhealthy AQI
  weatherCode: 45,
  weatherDescription: 'Heavy Smog Mist',
  weatherIcon: '🌫️',
  isDay: true,
}
const aqiImpact = calculateDoshaClimateImpact(smogWeather)
assert(aqiImpact.respiratoryAqiRisk.includes('Pranavaha Srotas Alert'), 'Flags Pranavaha Srotas bronchial alert when AQI > 100')
assert(aqiImpact.recommendedExerciseWindow.exerciseType.includes('Indoor'), 'Recommends indoor exercise during poor AQI')

// 5. WMO Weather Code Interpreter
assert(interpretWmoCode(0).description === 'Clear Skies', 'WMO 0 is Clear Skies')
assert(interpretWmoCode(61).icon === '🌧️', 'WMO 61 has rain icon')

// 6. Preset Locations
assert(PRESET_WEATHER_LOCATIONS.delhi !== undefined, 'Delhi preset exists')
assert(PRESET_WEATHER_LOCATIONS.bangalore !== undefined, 'Bangalore preset exists')
assert(PRESET_WEATHER_LOCATIONS.london !== undefined, 'London preset exists')

// ─── SECTION 2: Health Activity, Walking, Running & Ardha-Shakti ──────────
console.log('\n► Section 2: Physical Activity, Walking/Running & Ardha-Shakti')

// 7. Dosha Step Goals
assert(getDoshaStepGoal('Kapha') === 10000, 'Kapha daily goal is 10,000 steps')
assert(getDoshaStepGoal('Pitta') === 7500, 'Pitta daily goal is 7,500 steps')
assert(getDoshaStepGoal('Vata') === 6000, 'Vata daily goal is 6,000 steps')

// 8. Ardha-Shakti Safe Heart Rate Zone (Age 28)
const safeZone = calculateSafeHeartRateZone(28)
assert(safeZone.maxHr === 192, `Max HR for age 28 is 192 (got ${safeZone.maxHr})`)
assert(safeZone.minHr === 96, `Min safe HR (50%) is 96 bpm (got ${safeZone.minHr})`)
assert(safeZone.maxSafeHr === 134, `Max safe Ardha-Shakti limit (70%) is 134 bpm (got ${safeZone.maxSafeHr})`)

// 9. Calorie Burning Calculations
const walkCal = calculateWorkoutCalories('walking', 30, 70)
const runCal = calculateWorkoutCalories('running', 30, 70)
assert(walkCal > 100 && walkCal < 150, `30 min walk burns ~123 kcal (got ${walkCal})`)
assert(runCal > 230 && runCal < 290, `30 min run burns ~263 kcal (got ${runCal})`)
assert(runCal > walkCal * 1.8, 'Running burns more than 1.8x calories compared to walking')

console.log('\n======================================================')
console.log(`✨ SECTION SUMMARY: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) process.exit(1)
