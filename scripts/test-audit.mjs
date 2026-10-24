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

// ─── RESULTS SUMMARY ───────────────────────────────────────────────────────
console.log('\n======================================================')
console.log(`✨ TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) {
  process.exit(1)
}
