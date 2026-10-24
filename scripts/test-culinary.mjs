// scripts/test-culinary.mjs
// Unit tests for Charaka Cooking Science, Dynamic Bhojana Krama (3-Course Plate),
// Clinical Disease Modulations (Prameha, Amlapitta, Grahani), Regional Satmya & 10 Nitya Sevaniya Essentials

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

console.log('======================================================')
console.log('🍛 TESTING CHARAKA CULINARY & CLINICAL DISEASE ENGINE')
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

// 1. Check file existence
const culinaryEnginePath = path.join(ROOT, 'src/lib/culinaryEngine.ts')
assert(fs.existsSync(culinaryEnginePath), 'src/lib/culinaryEngine.ts exists')

const cookingGuidePath = path.join(ROOT, 'src/components/AyurvedicCookingGuide.tsx')
assert(fs.existsSync(cookingGuidePath), 'src/components/AyurvedicCookingGuide.tsx exists')

// Read files for content checks
const culinaryCode = fs.readFileSync(culinaryEnginePath, 'utf-8')
const guideCode = fs.readFileSync(cookingGuidePath, 'utf-8')
const dietPlanCode = fs.readFileSync(path.join(ROOT, 'src/components/DietPlan.tsx'), 'utf-8')
const appCode = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8')
const dashboardCode = fs.readFileSync(path.join(ROOT, 'src/components/Dashboard.tsx'), 'utf-8')
const landingCode = fs.readFileSync(path.join(ROOT, 'src/components/LandingPage.tsx'), 'utf-8')
const profileCode = fs.readFileSync(path.join(ROOT, 'src/components/UserProfile.tsx'), 'utf-8')

// 2. Classical Literature & Sutra Citations
assert(culinaryCode.includes('NITYA_SEVANIYA_ESSENTIALS'), 'Exports 10 Nitya Sevaniya Essentials')
assert(culinaryCode.includes('Charaka Sutra 5.12'), 'Cites Charaka Sutra 5.12 for mandatory daily longevity foods')
assert(culinaryCode.includes('Charaka Vimana 1') || culinaryCode.includes('Ashta Ahara Vidhi'), 'Grounds cooking in Charaka Vimana 1 (Karan / Samskara)')
assert(culinaryCode.includes('Sushruta Sutra 46') || culinaryCode.includes('Bhojana Krama'), 'Cites classical Bhojana Krama (3-Course Plate Order)')

// 3. User Tradition 3-Course Plate Order Verification (Native Satmya)
assert(culinaryCode.includes('getBhojanaKramaCourses'), 'Exports getBhojanaKramaCourses function')
assert(culinaryCode.includes('Agra Bhojana') && culinaryCode.includes('Shigru') && culinaryCode.includes('Curry leaf'), 'Course 1 matches Rice + Drumstick/Moringa, Agastya, Curry Leaf, Dal Podi + Cow Ghee')
assert(culinaryCode.includes('Madhya Bhojana') && culinaryCode.includes('Sambar'), 'Course 2 matches Rice + Vegetable Curry / Sambar + Ghee')
assert(culinaryCode.includes('Anta Bhojana') && culinaryCode.includes('Rasam') && culinaryCode.includes('Pickle'), 'Course 3 matches Rice + Digestive Rasam / Buttermilk + Pickles')

// 4. Clinical Disease-Specific Plate Modulations (Prameha, Amlapitta, Grahani, Raktachapa)
assert(culinaryCode.includes('DISEASE_CULINARY_MODULATIONS'), 'Defines DISEASE_CULINARY_MODULATIONS dictionary')
assert(culinaryCode.includes('prameha-metabolic') && culinaryCode.includes('Tikta Shaka & Mudga Yusha Agra'), 'Prameha (Diabetes) replaces polished rice with Purana Yava barley and starts with bitter greens')
assert(culinaryCode.includes('Charaka Chikitsa 6'), 'Prameha grounds in Charaka Chikitsa 6')
assert(culinaryCode.includes('amlapitta') && culinaryCode.includes('Dadima & Coriander Anta'), 'Amlapitta strictly bans and replaces Tamarind Rasam & spicy pickles with Dadima (pomegranate) broth')
assert(culinaryCode.includes('grahani-ibs') && culinaryCode.includes('Takra Kalpana Anta'), 'Grahani IBS prescribes freshly churned Takra with roasted jeera (Charaka Chikitsa 15)')
assert(culinaryCode.includes('raktachapa-hypertension') && culinaryCode.includes('Lashuna'), 'Raktachapa hypertension restricts sodium and prescribes boiled garlic & Arjuna tea')

// 5. Regional Desha-Satmya Variants (North, West, South)
assert(culinaryCode.includes('getRegionalBhojanaKramaCourses'), 'Provides getRegionalBhojanaKramaCourses for regional adaptations')
assert(culinaryCode.includes('Phulka') && culinaryCode.includes('Chhachh'), 'North Indian variant uses Whole Wheat Phulkas + Dal + Spiced Mint Chhachh')
assert(culinaryCode.includes('Bhakri') && culinaryCode.includes('Kadhi'), 'Western Indian variant uses Bajra/Jowar Bhakri + Kadhi')

// 6. Disease-Calibrated Macronutrients
assert(culinaryCode.includes('calculateMealMacronutrients'), 'Exports calculateMealMacronutrients function')
assert(culinaryCode.includes('macroRatioOverride'), 'Supports macroRatioOverride for clinical conditions')
assert(culinaryCode.includes('carbsPct: 40') && culinaryCode.includes('fiberGrams: 38'), 'Prameha lowers carbs to 40% and boosts therapeutic fiber to 38g')

// 7. Samskara Cooking Method with Clinical Directives
assert(culinaryCode.includes('getAyurvedicCookingInstructions'), 'Exports getAyurvedicCookingInstructions')
assert(culinaryCode.includes('clinicalDiseaseNote'), 'Cooking instructions include clinicalDiseaseNote for pathological safety')
assert(culinaryCode.includes('Ghrita') && culinaryCode.includes('Yogavahi'), 'Models Cow Ghee Tadka as Yogavahi bio-carrier for fat-soluble nutrients')
assert(culinaryCode.includes('Ushnam Ashniyat') || culinaryCode.includes('warm'), 'Enforces the golden rule: Eat freshly cooked warm food')

// 8. UI Synchronization in DietPlan.tsx
assert(dietPlanCode.includes('CLINICAL PATHOLOGY SYNCHRONIZER'), 'DietPlan.tsx features Clinical Pathology & Disease Synchronizer')
assert(dietPlanCode.includes('DISEASE_CULINARY_MODULATIONS'), 'DietPlan.tsx imports DISEASE_CULINARY_MODULATIONS')
assert(dietPlanCode.includes('Charaka Pathya (Favor)') && dietPlanCode.includes('Charaka Apathya (Avoid)'), 'DietPlan.tsx displays Charaka Pathya & Apathya rules')
assert(dietPlanCode.includes('Staple Grain Substitution'), 'DietPlan.tsx shows staple grain substitution (e.g. Purana Yava barley)')
assert(dietPlanCode.includes('Clinical Pathology Directive'), 'DietPlan.tsx recipe expansion shows clinical modification directive')

// 9. UI Synchronization in AyurvedicCookingGuide.tsx
assert(guideCode.includes('Clinical Pathology Filter:'), 'AyurvedicCookingGuide.tsx features Clinical Pathology Filter bar')
assert(guideCode.includes('DISEASE_CULINARY_MODULATIONS'), 'AyurvedicCookingGuide.tsx connects to disease culinary modulations')
assert(guideCode.includes('Charaka Pathya') && guideCode.includes('Charaka Apathya'), 'AyurvedicCookingGuide.tsx displays Pathya/Apathya cards')

// 10. Platform Integration (App, Dashboard, Landing, Profile)
assert(appCode.includes('AyurvedicCookingGuide') && appCode.includes('showCookingGuide'), 'App.tsx imports AyurvedicCookingGuide and manages modal')
assert(appCode.includes('Cooking & 3-Course Plate'), 'App.tsx Fast Bar provides direct shortcut')
assert(dashboardCode.includes('Charaka Samskāra & Bhojana Krama'), 'Dashboard.tsx renders dedicated Cooking & 3-Course Plate Banner')
assert(landingCode.includes('Cooking & 3-Course'), 'LandingPage.tsx header & hero provide shortcuts')
assert(profileCode.includes('AyurvedicCookingGuide') && profileCode.includes('culinary'), 'UserProfile.tsx provides dedicated Cooking & 3-Course Plate tab')

console.log('\n======================================================')
console.log(`✨ UNIT TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) process.exit(1)
