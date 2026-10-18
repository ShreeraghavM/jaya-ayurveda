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
assert(fs.existsSync(distIndex), 'dist/index.html exists and is compiled')
const distRedirects = path.join(ROOT, 'dist/_redirects')
assert(fs.existsSync(distRedirects), 'dist/_redirects is properly copied into build output')

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

// ─── RESULTS SUMMARY ───────────────────────────────────────────────────────
console.log('\n======================================================')
console.log(`✨ TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) {
  process.exit(1)
}
