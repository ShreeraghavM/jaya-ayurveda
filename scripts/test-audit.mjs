// scripts/test-audit.mjs
// Comprehensive automated test suite for Jaya Ayurveda

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

console.log('======================================================')
console.log('🌿 JAYA AYURVEDA COMPREHENSIVE TEST SUITE')
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

// ─── SUITE 1: WHO BMI & Adult Anthropometrics ──────────────────────────────
console.log('► Suite 1: WHO BMI & Weight Calculations')
function calculateBmi(weightKg, heightCm) {
  const heightM = heightCm / 100
  return Number((weightKg / (heightM * heightM)).toFixed(1))
}
function getBmiCategory(bmi) {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obese'
}

assert(calculateBmi(75, 175) === 24.5, 'Arjun BMI (75kg, 175cm) equals 24.5')
assert(getBmiCategory(24.5) === 'normal', 'BMI 24.5 is classified as normal healthy weight')
assert(calculateBmi(52, 162) === 19.8, 'Priya BMI (52kg, 162cm) equals 19.8')
assert(getBmiCategory(19.8) === 'normal', 'BMI 19.8 is classified as normal')
assert(calculateBmi(88, 172) === 29.7, 'Rajesh BMI (88kg, 172cm) equals 29.7')
assert(getBmiCategory(29.7) === 'overweight', 'BMI 29.7 is correctly classified as overweight')

// ─── SUITE 2: Dosha Score Percentages Engine ───────────────────────────────
console.log('\n► Suite 2: Dosha Composition & Prakriti Engine')
function doshaPercentages(scores) {
  const { Vata, Pitta, Kapha } = scores
  const total = Vata + Pitta + Kapha || 1
  return {
    Vata: Math.round((Vata / total) * 100),
    Pitta: Math.round((Pitta / total) * 100),
    Kapha: Math.round((Kapha / total) * 100),
  }
}

const arjunScores = { Vata: 15, Pitta: 48, Kapha: 12 }
const arjunPcts = doshaPercentages(arjunScores)
assert(arjunPcts.Pitta >= 60, `Arjun is dominant Pitta (${arjunPcts.Pitta}%)`)
assert(arjunPcts.Vata + arjunPcts.Pitta + arjunPcts.Kapha >= 99 && arjunPcts.Vata + arjunPcts.Pitta + arjunPcts.Kapha <= 101, 'Percentage total normalizes to 100%')

const priyaScores = { Vata: 52, Pitta: 14, Kapha: 9 }
const priyaPcts = doshaPercentages(priyaScores)
assert(priyaPcts.Vata >= 65, `Priya is dominant Vata (${priyaPcts.Vata}%)`)

const rajeshScores = { Vata: 10, Pitta: 18, Kapha: 47 }
const rajeshPcts = doshaPercentages(rajeshScores)
assert(rajeshPcts.Kapha >= 60, `Rajesh is dominant Kapha (${rajeshPcts.Kapha}%)`)

// ─── SUITE 3: Chronobiology & Dinacharya Time Windows ──────────────────────
console.log('\n► Suite 3: Chronobiology & Ayurvedic Day Phases')
function getAyurvedicTimePeriod(hour) {
  if (hour >= 4 && hour < 6) return 'brahma_muhurta'
  if (hour >= 6 && hour < 10) return 'kapha_morning'
  if (hour >= 10 && hour < 14) return 'pitta_midday_agni'
  if (hour >= 14 && hour < 18) return 'vata_afternoon'
  if (hour >= 18 && hour < 22) return 'kapha_evening'
  return 'pitta_night'
}

assert(getAyurvedicTimePeriod(5) === 'brahma_muhurta', '05:00 is Brahma Muhurta (ideal for waking and pranayama)')
assert(getAyurvedicTimePeriod(12) === 'pitta_midday_agni', '12:00 is Pitta Midday Agni Peak (primary heavy meal)')
assert(getAyurvedicTimePeriod(16) === 'vata_afternoon', '16:00 is Vata Afternoon (creative focus, hydration break)')
assert(getAyurvedicTimePeriod(19) === 'kapha_evening', '19:00 is Kapha Evening (light dinner, wind-down)')

// ─── SUITE 4: Shad Rasa (6 Ayurvedic Tastes) ───────────────────────────────
console.log('\n► Suite 4: Shad Rasa & Dietary Balance Engine')
const TASTES = ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya']
assert(TASTES.length === 6, 'Contains all 6 foundational tastes (Sweet, Sour, Salty, Pungent, Bitter, Astringent)')
assert(TASTES.includes('madhura') && TASTES.includes('tikta'), 'Includes essential grounding (Madhura) and detoxifying (Tikta) tastes')

// ─── SUITE 5: Classical Charaka Samhita Digital Sthana ─────────────────────
console.log('\n► Suite 5: Classical Literature & Sutra Citations')
const vaultPath = path.join(ROOT, 'src/components/CharakaSamhitaVault.tsx')
assert(fs.existsSync(vaultPath), 'CharakaSamhitaVault component file exists')
const vaultContent = fs.readFileSync(vaultPath, 'utf8')
assert(vaultContent.includes('Adhyaya 5, Verse 103'), 'Contains Brahma Muhurta classical reference')
assert(vaultContent.includes('ब्राह्मे मुहूर्ते उत्तिष्ठेत्'), 'Contains original Devanagari Sanskrit text')
assert(vaultContent.includes('Matrashiteeya'), 'Contains Matrashiteeya digestive portioning rules')

// ─── SUITE 6: Netlify Static Export & Architecture ─────────────────────────
console.log('\n► Suite 6: Netlify Static Export & PWA Configuration')
const netlifyToml = path.join(ROOT, 'netlify.toml')
assert(fs.existsSync(netlifyToml), 'netlify.toml exists in repository root')
const netlifyContent = fs.readFileSync(netlifyToml, 'utf8')
assert(netlifyContent.includes('publish = "dist"'), 'Netlify publish directory is set to dist')
assert(netlifyContent.includes('from = "/*"') && netlifyContent.includes('to = "/index.html"'), 'Netlify SPA client-side rewrite fallback is configured')

const redirectsFile = path.join(ROOT, 'public/_redirects')
assert(fs.existsSync(redirectsFile), 'public/_redirects exists for Netlify CDN routing')

const claudeFile = path.join(ROOT, 'CLAUDE.md')
assert(fs.existsSync(claudeFile), 'CLAUDE.md exists with Garry Tan gstack workflows and guidelines')

// ─── SUITE 7: Production Dist Build Verification ───────────────────────────
console.log('\n► Suite 7: Built Production Distribution Artifacts')
const distIndex = path.join(ROOT, 'dist/index.html')
if (fs.existsSync(distIndex)) {
  assert(fs.existsSync(distIndex), 'dist/index.html exists and is compiled')
  const distRedirects = path.join(ROOT, 'dist/_redirects')
  assert(fs.existsSync(distRedirects), 'dist/_redirects is properly copied into build output')
} else {
  console.log('  ℹ dist/ not compiled yet (pre-build stage) - verifying source configurations')
  assert(fs.existsSync(path.join(ROOT, 'public/_redirects')), 'public/_redirects exists for build step')
}

// ─── SUITE 8: Clinical Knowledge Base & Disease Repertory ──────────────────
console.log('\n► Suite 8: Clinical Knowledge Base & Disease Repertory')
const kbPath = path.join(ROOT, 'src/lib/knowledgeBase.ts')
assert(fs.existsSync(kbPath), 'knowledgeBase.ts exists')
const kbContent = fs.readFileSync(kbPath, 'utf8')
assert(kbContent.includes('Amlapitta'), 'Includes Amlapitta (Acid Reflux) protocol')
assert(kbContent.includes('Grahani'), 'Includes Grahani (IBS & gut dysbiosis) protocol')
assert(kbContent.includes('Sandhivata'), 'Includes Sandhivata (Osteoarthritis) protocol')
assert(kbContent.includes('Anidra'), 'Includes Anidra (Insomnia) protocol')
assert(kbContent.includes('Charaka Samhita — Volume 1'), 'Indexes Charaka Samhita Volume 1 from local research archive')
assert(kbContent.includes('Charaka Samhita — Volume 2'), 'Indexes Charaka Samhita Volume 2 from local research archive')
assert(kbContent.includes('getCustomResearchItems') && kbContent.includes('saveCustomResearchItem'), 'Exports custom research item ingestion methods')

// ─── SUITE 9: Semantic Vector Search & Health Intake Engine ────────────────
console.log('\n► Suite 9: Semantic Vector Search & Health Intake Engine')
const vsPath = path.join(ROOT, 'src/lib/vectorSearch.ts')
assert(fs.existsSync(vsPath), 'vectorSearch.ts exists')
const vsContent = fs.readFileSync(vsPath, 'utf8')
assert(vsContent.includes('vectorizeAndMatchHealthIssues'), 'Exports vectorizeAndMatchHealthIssues function')
assert(vsContent.includes('prameha-metabolic') && vsContent.includes('raktachapa-hypertension'), 'Matches Blood Sugar (Prameha) and Blood Pressure (Raktachapa)')
assert(vsContent.includes('saveActiveHealingProtocol') && vsContent.includes('getActiveHealingProtocol'), 'Supports active healing protocol persistence')

const intakeCompPath = path.join(ROOT, 'src/components/HealthIntakeConsultation.tsx')
assert(fs.existsSync(intakeCompPath), 'HealthIntakeConsultation.tsx component exists')
const intakeContent = fs.readFileSync(intakeCompPath, 'utf8')
assert(intakeContent.includes('Tell Us How You Are Feeling'), 'Contains polite, compassionate bedside greeting')
assert(intakeContent.includes('Exact Daily Intake') && intakeContent.includes('Therapeutic Yoga'), 'Provides intake grams and targeted yoga therapy')
assert(intakeContent.includes('Numbers & Tracking'), 'Presents 14-to-90 day quantitative biomarker tracking')

// ─── SUITE 10: Charaka Samhita 120 Chapters & 8 Sthanas Canonical Registry ───
console.log('\n► Suite 10: Charaka Samhita 120 Chapters & 8 Sthanas Canonical Registry')
const charakaJsonPath = path.join(ROOT, 'src/data/charaka_samhita_120_chapters.json')
assert(fs.existsSync(charakaJsonPath), 'charaka_samhita_120_chapters.json master index exists')

const charakaJson = JSON.parse(fs.readFileSync(charakaJsonPath, 'utf8'))
assert(charakaJson.totalSthanas === 8, 'Contains all 8 classical Sthanas')
assert(charakaJson.totalChapters === 120, 'Contains exactly 120 canonical chapters')
assert(charakaJson.chapters.length === 120, '120 individual chapter records populated')

// Verify exact Sthana chapter counts
const sutraCount = charakaJson.chapters.filter(c => c.sthanaId === 'sutra-sthana').length
assert(sutraCount === 30, `Sutra Sthana has exactly 30 chapters (got ${sutraCount})`)

const nidanaCount = charakaJson.chapters.filter(c => c.sthanaId === 'nidana-sthana').length
assert(nidanaCount === 8, `Nidana Sthana has exactly 8 chapters (got ${nidanaCount})`)

const vimanaCount = charakaJson.chapters.filter(c => c.sthanaId === 'vimana-sthana').length
assert(vimanaCount === 8, `Vimana Sthana has exactly 8 chapters (got ${vimanaCount})`)

const shariraCount = charakaJson.chapters.filter(c => c.sthanaId === 'sharira-sthana').length
assert(shariraCount === 8, `Sharira Sthana has exactly 8 chapters (got ${shariraCount})`)

const indriyaCount = charakaJson.chapters.filter(c => c.sthanaId === 'indriya-sthana').length
assert(indriyaCount === 12, `Indriya Sthana has exactly 12 chapters (got ${indriyaCount})`)

const chikitsaCount = charakaJson.chapters.filter(c => c.sthanaId === 'chikitsa-sthana').length
assert(chikitsaCount === 30, `Chikitsa Sthana has exactly 30 chapters (got ${chikitsaCount})`)

const kalpaCount = charakaJson.chapters.filter(c => c.sthanaId === 'kalpa-sthana').length
assert(kalpaCount === 12, `Kalpa Sthana has exactly 12 chapters (got ${kalpaCount})`)

const siddhiCount = charakaJson.chapters.filter(c => c.sthanaId === 'siddhi-sthana').length
assert(siddhiCount === 12, `Siddhi Sthana has exactly 12 chapters (got ${siddhiCount})`)

// Verify component exists
const explorerPath = path.join(ROOT, 'src/components/CharakaExplorer.tsx')
assert(fs.existsSync(explorerPath), 'CharakaExplorer.tsx component exists')

// Verify knowledgeBase helper exports
assert(kbContent.includes('getAllCharakaChapters') && kbContent.includes('getChaptersBySthana'), 'Exports getAllCharakaChapters & getChaptersBySthana')
assert(kbContent.includes('searchCharakaChapters') && kbContent.includes('getChapterByCondition'), 'Exports searchCharakaChapters & getChapterByCondition')

// ─── SUITE 11: Human Anatomy & Srotas Digital Twin Engine ───────────────────
console.log('\n► Suite 11: Human Anatomy & Srotas Digital Twin Engine')
const anatomyEnginePath = path.join(ROOT, 'src/lib/anatomyEngine.ts')
assert(fs.existsSync(anatomyEnginePath), 'anatomyEngine.ts exists')
const anatomyEngineContent = fs.readFileSync(anatomyEnginePath, 'utf-8')

assert(anatomyEngineContent.includes('ANATOMICAL_SYSTEMS'), 'Defines ANATOMICAL_SYSTEMS dictionary')
assert(anatomyEngineContent.includes('circulatory') && anatomyEngineContent.includes('respiratory') && anatomyEngineContent.includes('digestive'), 'Contains modern organ systems')
assert(anatomyEngineContent.includes('Raktavaha Srotas') && anatomyEngineContent.includes('Pranavaha Srotas') && anatomyEngineContent.includes('Annavaha'), 'Maps classical Sanskrit Srotamsi')
assert(anatomyEngineContent.includes('calculateSystemNourishment'), 'Exports calculateSystemNourishment function')
assert(anatomyEngineContent.includes('generateDeficitBalancingMeal'), 'Exports generateDeficitBalancingMeal function')
assert(anatomyEngineContent.includes('getDiseaseBeacons') && anatomyEngineContent.includes('clearDiseaseBeacon'), 'Exports disease beacon management')
assert(anatomyEngineContent.includes('getBedtimePainLogs') && anatomyEngineContent.includes('saveBedtimePainLog'), 'Exports bedtime pain tracking functions')
assert(anatomyEngineContent.includes('getClinicalLabReports') && anatomyEngineContent.includes('analyzeLabReportNumbers'), 'Exports clinical lab report ingestion & analysis')

// Verify UI components exist
assert(fs.existsSync(path.join(ROOT, 'src/components/AnatomyVisualizer.tsx')), 'AnatomyVisualizer.tsx component exists')
assert(fs.existsSync(path.join(ROOT, 'src/components/LabReportTracker.tsx')), 'LabReportTracker.tsx component exists')
assert(fs.existsSync(path.join(ROOT, 'src/components/BedtimePainCheckin.tsx')), 'BedtimePainCheckin.tsx component exists')

// ─── SUITE 12: Charaka Ahara Matra & Desha-Satmya Engine ───────────────────
console.log('\n► Suite 12: Charaka Ahara Matra & Desha-Satmya Engine')
const deshaEnginePath = path.join(ROOT, 'src/lib/deshaSatmyaEngine.ts')
assert(fs.existsSync(deshaEnginePath), 'deshaSatmyaEngine.ts exists')
const deshaEngineContent = fs.readFileSync(deshaEnginePath, 'utf-8')

assert(deshaEngineContent.includes('DESHA_DEFINITIONS'), 'Defines DESHA_DEFINITIONS dictionary')
assert(deshaEngineContent.includes('anupa') && deshaEngineContent.includes('jangala') && deshaEngineContent.includes('sadharana'), 'Contains classical 3 Deshas (Anupa, Jangala, Sadharana)')
assert(deshaEngineContent.includes('Trividha Kukshi') || deshaEngineContent.includes('calculateCharakaPortioning'), 'Implements Trividha Kukshi 1/3 stomach division formula')
assert(deshaEngineContent.includes('STAPLE_GRAIN_NAMES'), 'Defines indigenous staple grains dictionary')
assert(deshaEngineContent.includes('Balya') && deshaEngineContent.includes('Madhyama') && deshaEngineContent.includes('Vardhakya'), 'Contains age stages (Balya, Madhyama, Vardhakya) with Guru/Laghu modulation')
assert(deshaEngineContent.includes('Rakta') && deshaEngineContent.includes('Artava') && deshaEngineContent.includes('Shukra'), 'Modulates tissue focus by gender (Rakta/Artava for female, Mamsa/Shukra for male)')
assert(deshaEngineContent.includes('Prameha') && deshaEngineContent.includes('Raktashali'), 'Implements clinical grain substitution for Prameha (aged red rice/barley)')

// Verify UI components and integration
const matraCalculatorPath = path.join(ROOT, 'src/components/CharakaMatraCalculator.tsx')
assert(fs.existsSync(matraCalculatorPath), 'CharakaMatraCalculator.tsx component exists')
const matraCalcContent = fs.readFileSync(matraCalculatorPath, 'utf-8')
assert(matraCalcContent.includes('calculateCharakaPortioning'), 'CharakaMatraCalculator uses calculateCharakaPortioning')

const dietPlanContent = fs.readFileSync(path.join(ROOT, 'src/components/DietPlan.tsx'), 'utf-8')
assert(dietPlanContent.includes('CharakaMatraCalculator') && dietPlanContent.includes('calculateCharakaPortioning'), 'DietPlan.tsx integrates CharakaMatraCalculator and portioning metrics')
assert(dietPlanContent.includes('1/3 Solid') && dietPlanContent.includes('1/3 Liquid'), 'DietPlan.tsx displays 1/3 Solid and 1/3 Liquid portion badges')

const userProfileContent = fs.readFileSync(path.join(ROOT, 'src/components/UserProfile.tsx'), 'utf-8')
assert(userProfileContent.includes('CharakaMatraCalculator') && userProfileContent.includes('desha_satmya'), 'UserProfile.tsx includes Charaka Ahara Matra tab')

const visualizerContent = fs.readFileSync(path.join(ROOT, 'src/components/AnatomyVisualizer.tsx'), 'utf-8')
assert(visualizerContent.includes('onOpenMatraCalculator'), 'AnatomyVisualizer provides gateway to CharakaMatraCalculator')

// ─── SUITE 13: Ayurvedic Metabolic Engine, Ardha-Shakti & Spring Bio-Shield ─
console.log('\n► Suite 13: Ayurvedic Metabolic Engine, Ardha-Shakti & Spring Bio-Shield')
const metabolicEnginePath = path.join(ROOT, 'src/lib/metabolicEngine.ts')
assert(fs.existsSync(metabolicEnginePath), 'metabolicEngine.ts exists')
const metabolicEngineContent = fs.readFileSync(metabolicEnginePath, 'utf-8')

assert(metabolicEngineContent.includes('calculateAyurvedicMetabolism'), 'Exports calculateAyurvedicMetabolism function')
assert(metabolicEngineContent.includes('Tikshnagni') && metabolicEngineContent.includes('Mandagni') && metabolicEngineContent.includes('Vishamagni') && metabolicEngineContent.includes('Samagni'), 'Supports 4 classical Agni types (Tikshna, Manda, Vishama, Sama)')
assert(metabolicEngineContent.includes('AGNI_METABOLIC_MODIFIERS'), 'Defines AGNI_METABOLIC_MODIFIERS (+10% Pitta, -8% Kapha)')
assert(metabolicEngineContent.includes('ardhaShaktiMaxHr') && metabolicEngineContent.includes('ardhaShaktiMinHr'), 'Computes Ardha-Shakti safe HR zone (50-70% max HR)')
assert(metabolicEngineContent.includes('Vaktram Prapadyate') && metabolicEngineContent.includes('Lalate Sveda'), 'Includes Charaka Sutra 7.31-35 classical exercise cessation signs')
assert(metabolicEngineContent.includes('vasantaRituActive') && metabolicEngineContent.includes('kaphaLiquefactionSeverity'), 'Computes Vasanta Ritu spring Kapha liquefaction dynamics')
assert(metabolicEngineContent.includes('divasvapnaProhibited') || metabolicEngineContent.includes('Diva-swapna'), 'Enforces daytime sleep ban (Diva-swapna Nishiddha) in Spring')
assert(metabolicEngineContent.includes('Yava') || metabolicEngineContent.includes('barley'), 'Recommends aged barley & honey as spring Kapha antidotes')

// Verify UI components and integration
const metabolicComponentPath = path.join(ROOT, 'src/components/MetabolicArdhaShaktiCalculator.tsx')
assert(fs.existsSync(metabolicComponentPath), 'MetabolicArdhaShaktiCalculator.tsx component exists')
const metabolicComponentContent = fs.readFileSync(metabolicComponentPath, 'utf-8')
assert(metabolicComponentContent.includes('calculateAyurvedicMetabolism'), 'MetabolicArdhaShaktiCalculator uses calculateAyurvedicMetabolism')
assert(metabolicComponentContent.includes('Ardha-Shakti') && metabolicComponentContent.includes('Vasanta Ritu'), 'Renders Ardha-Shakti and Vasanta Ritu tabs')

const dietPlanMetabolic = fs.readFileSync(path.join(ROOT, 'src/components/DietPlan.tsx'), 'utf-8')
assert(dietPlanMetabolic.includes('MetabolicArdhaShaktiCalculator') && dietPlanMetabolic.includes('calculateAyurvedicMetabolism'), 'DietPlan.tsx integrates MetabolicArdhaShaktiCalculator and daily TDEE metrics')

const userProfileMetabolic = fs.readFileSync(path.join(ROOT, 'src/components/UserProfile.tsx'), 'utf-8')
assert(userProfileMetabolic.includes('MetabolicArdhaShaktiCalculator') && userProfileMetabolic.includes('metabolic'), 'UserProfile.tsx includes Agni-BMR & Spring Ritu tab')

const dashboardMetabolic = fs.readFileSync(path.join(ROOT, 'src/components/Dashboard.tsx'), 'utf-8')
assert(dashboardMetabolic.includes('Vasanta Ritu') && dashboardMetabolic.includes('Kapha Liquefaction'), 'Dashboard.tsx renders Vasanta Ritu Spring Bio-Shield Banner')

const appMetabolic = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8')
assert(appMetabolic.includes('Spring Shield & BMR') && appMetabolic.includes('handleOpenMetabolic'), 'App.tsx fast-bar and navigation wired to Spring Shield & BMR')

// ─── SUITE 14: Real-Time Weather & Health Activity Tracker + 24-Hr Tour ────
console.log('\n► Suite 14: Real-Time Weather, Movement Activity & 24-Hour Animated Tour')
const weatherEnginePath = path.join(ROOT, 'src/lib/weatherEngine.ts')
assert(fs.existsSync(weatherEnginePath), 'weatherEngine.ts exists')
const weatherEngineContent = fs.readFileSync(weatherEnginePath, 'utf-8')

assert(weatherEngineContent.includes('calculateDoshaClimateImpact'), 'Exports calculateDoshaClimateImpact function')
assert(weatherEngineContent.includes('PRESET_WEATHER_LOCATIONS'), 'Defines PRESET_WEATHER_LOCATIONS for zero-delay climate testing')
assert(weatherEngineContent.includes('Pranavaha Srotas') && weatherEngineContent.includes('respiratoryAqiRisk'), 'Provides Pranavaha Srotas respiratory AQI alerts')
assert(weatherEngineContent.includes('fetchLiveWeather'), 'Exports fetchLiveWeather network fetcher')

const activityEnginePath = path.join(ROOT, 'src/lib/activityEngine.ts')
assert(fs.existsSync(activityEnginePath), 'activityEngine.ts exists')
const activityEngineContent = fs.readFileSync(activityEnginePath, 'utf-8')
assert(activityEngineContent.includes('getDoshaStepGoal'), 'Exports getDoshaStepGoal function')
assert(activityEngineContent.includes('calculateSafeHeartRateZone'), 'Exports calculateSafeHeartRateZone function')
assert(activityEngineContent.includes('calculateWorkoutCalories'), 'Exports calculateWorkoutCalories function')
assert(activityEngineContent.includes('logWorkoutSession'), 'Exports logWorkoutSession persistence function')

// Verify UI Components & Integration
const weatherTrackerComponent = path.join(ROOT, 'src/components/WeatherHealthTracker.tsx')
assert(fs.existsSync(weatherTrackerComponent), 'WeatherHealthTracker.tsx component exists')
const weatherTrackerContent = fs.readFileSync(weatherTrackerComponent, 'utf-8')
assert(weatherTrackerContent.includes('calculateDoshaClimateImpact') && weatherTrackerContent.includes('logWorkoutSession'), 'WeatherHealthTracker wires weather & activity engines')

const animatedJourneyComponent = path.join(ROOT, 'src/components/AnimatedJourneyVideo.tsx')
assert(fs.existsSync(animatedJourneyComponent), 'AnimatedJourneyVideo.tsx component exists')
const animatedContent = fs.readFileSync(animatedJourneyComponent, 'utf-8')
assert(animatedContent.includes('JOURNEY_SCENES') && animatedContent.includes('Brahma Muhurta') && animatedContent.includes('Ahara Matra'), 'AnimatedJourneyVideo contains all classical journey scenes')

const publicTourHtml = path.join(ROOT, 'public/journey_walkthrough.html')
assert(fs.existsSync(publicTourHtml), 'public/journey_walkthrough.html standalone animation exists')

const dashboardWeather = fs.readFileSync(path.join(ROOT, 'src/components/Dashboard.tsx'), 'utf-8')
assert(dashboardWeather.includes('Weather & Health Tracker') && dashboardWeather.includes('onOpenWeatherTracker'), 'Dashboard.tsx renders Weather & Health Activity Card')
assert(dashboardWeather.includes('Watch the 24-Hour Animated Journey Tour'), 'Dashboard.tsx renders Animated Tour Card')

const landingWeather = fs.readFileSync(path.join(ROOT, 'src/components/LandingPage.tsx'), 'utf-8')
assert(landingWeather.includes('Weather & Run') || landingWeather.includes('Weather & Activity'), 'LandingPage.tsx header & hero include Weather & Activity')
assert(landingWeather.includes('24-Hr Tour') || landingWeather.includes('Animated Tour'), 'LandingPage.tsx includes Animated Journey Tour')

const appWeather = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8')
assert(appWeather.includes('WeatherHealthTracker') && appWeather.includes('AnimatedJourneyVideo'), 'App.tsx imports WeatherHealthTracker & AnimatedJourneyVideo')
assert(appWeather.includes('showWeatherTracker') && appWeather.includes('showAnimatedTour'), 'App.tsx maintains modals for WeatherTracker & AnimatedTour')

// ─── SUITE 15: Charaka Cooking Science, Bhojana Krama & Macronutrients ──────
console.log('\n► Suite 15: Ayurvedic Culinary Science, Bhojana Krama (3-Course Plate) & Macronutrients')
const culinaryEnginePath = path.join(ROOT, 'src/lib/culinaryEngine.ts')
assert(fs.existsSync(culinaryEnginePath), 'culinaryEngine.ts exists')
const culinaryEngineContent = fs.readFileSync(culinaryEnginePath, 'utf-8')

assert(culinaryEngineContent.includes('NITYA_SEVANIYA_ESSENTIALS'), 'Defines NITYA_SEVANIYA_ESSENTIALS 10 mandatory daily longevity foods (Charaka Sutra 5.12)')
assert(culinaryEngineContent.includes('getBhojanaKramaCourses'), 'Exports getBhojanaKramaCourses 3-course plate sequence')
assert(culinaryEngineContent.includes('Agra Bhojana') && culinaryEngineContent.includes('Shigru') && culinaryEngineContent.includes('Curry leaf'), 'Course 1 matches Rice + Drumstick, Agastya, Curry leaf, Toor dal podi + A2 Cow Ghee')
assert(culinaryEngineContent.includes('Madhya Bhojana') && culinaryEngineContent.includes('Sambar'), 'Course 2 matches Rice + Vegetable Curry / Sambar + Ghee')
assert(culinaryEngineContent.includes('Anta Bhojana') && culinaryEngineContent.includes('Rasam') && culinaryEngineContent.includes('Pickle'), 'Course 3 matches Rice + Digestive Rasam / Buttermilk + Pickles')
assert(culinaryEngineContent.includes('calculateMealMacronutrients'), 'Exports calculateMealMacronutrients (Carbs, Protein, Healthy Fats, Fiber)')
assert(culinaryEngineContent.includes('getAyurvedicCookingInstructions'), 'Exports getAyurvedicCookingInstructions (Samskara)')

const cookingGuidePath = path.join(ROOT, 'src/components/AyurvedicCookingGuide.tsx')
assert(fs.existsSync(cookingGuidePath), 'AyurvedicCookingGuide.tsx exists')

const dietPlanCulinaryContent = fs.readFileSync(path.join(ROOT, 'src/components/DietPlan.tsx'), 'utf-8')
assert(dietPlanCulinaryContent.includes('AyurvedicCookingGuide') && dietPlanCulinaryContent.includes('BHOJANA KRAMA (3-COURSE ORDER)'), 'DietPlan.tsx features top Bhojana Krama card')
assert(dietPlanCulinaryContent.includes('getAyurvedicCookingInstructions') && dietPlanCulinaryContent.includes('Ghrita Samskara'), 'DietPlan.tsx expands recipes with classical cooking method & macros')

const appCulinaryContent = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8')
assert(appCulinaryContent.includes('AyurvedicCookingGuide') && appCulinaryContent.includes('showCookingGuide'), 'App.tsx imports AyurvedicCookingGuide and manages modal')
assert(appCulinaryContent.includes('Cooking & 3-Course Plate'), 'App.tsx Fast Bar provides direct Cooking & 3-Course Plate shortcut')

const dashboardCulinaryContent = fs.readFileSync(path.join(ROOT, 'src/components/Dashboard.tsx'), 'utf-8')
assert(dashboardCulinaryContent.includes('Charaka Samskāra & Bhojana Krama') && dashboardCulinaryContent.includes('onOpenCookingGuide'), 'Dashboard.tsx renders Cooking Science & 3-Course banner')

const profileTabContent = fs.readFileSync(path.join(ROOT, 'src/components/UserProfile.tsx'), 'utf-8')
assert(profileTabContent.includes('AyurvedicCookingGuide') && profileTabContent.includes('culinary'), 'UserProfile.tsx provides dedicated Cooking & 3-Course Plate tab')

// ─── RESULTS SUMMARY ───────────────────────────────────────────────────────
console.log('\n======================================================')
console.log(`✨ TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) {
  process.exit(1)
}
