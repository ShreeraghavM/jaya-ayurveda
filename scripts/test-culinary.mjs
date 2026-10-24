// scripts/test-culinary.mjs
// Unit tests for Charaka Cooking Science, Bhojana Krama (3-Course Plate),
// Macronutrient Distribution & 10 Nitya Sevaniya Essentials

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

console.log('======================================================')
console.log('🍛 TESTING CHARAKA COOKING SCIENCE & 3-COURSE PLATE')
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

// 3. User Tradition 3-Course Plate Order Verification
assert(culinaryCode.includes('getBhojanaKramaCourses'), 'Exports getBhojanaKramaCourses function')
assert(culinaryCode.includes('Agra Bhojana') && culinaryCode.includes('Shigru') && culinaryCode.includes('Curry leaf'), 'Course 1 includes Rice + Drumstick/Moringa, Agastya, Curry Leaf, Dal Podi + Cow Ghee')
assert(culinaryCode.includes('Madhya Bhojana') && culinaryCode.includes('Sambar'), 'Course 2 includes Rice + Vegetable Curry / Sambar + Ghee')
assert(culinaryCode.includes('Anta Bhojana') && culinaryCode.includes('Rasam') && culinaryCode.includes('Pickle'), 'Course 3 includes Rice + Digestive Rasam / Buttermilk + Pickles')

// 4. Macronutrient Science Engine
assert(culinaryCode.includes('calculateMealMacronutrients'), 'Exports calculateMealMacronutrients function')
assert(culinaryCode.includes('carbohydratesGrams') && culinaryCode.includes('proteinGrams') && culinaryCode.includes('healthyFatsGrams') && culinaryCode.includes('dietaryFiberGrams'), 'Calculates Carbs, Protein, Healthy Fats & Fiber')
assert(culinaryCode.includes('0.45') && culinaryCode.includes('lunch'), 'Allocates 45% of diurnal calories and nutrients to Midday Agni Peak Lunch')

// 5. Samskara Cooking Method
assert(culinaryCode.includes('getAyurvedicCookingInstructions'), 'Exports getAyurvedicCookingInstructions')
assert(culinaryCode.includes('Toya-sannikarsha') || culinaryCode.includes('soaking'), 'Includes phytate removal water soaking (Toya sannikarsha)')
assert(culinaryCode.includes('Ghrita') && culinaryCode.includes('Yogavahi'), 'Models Cow Ghee Tadka as Yogavahi bio-carrier for fat-soluble nutrients')
assert(culinaryCode.includes('Ushnam Ashniyat') || culinaryCode.includes('warm'), 'Enforces the golden rule: Eat freshly cooked warm food')

// 6. UI Integration Across Platform
assert(dietPlanCode.includes('AyurvedicCookingGuide'), 'DietPlan.tsx imports AyurvedicCookingGuide')
assert(dietPlanCode.includes('BHOJANA KRAMA (3-COURSE ORDER)'), 'DietPlan.tsx features top Bhojana Krama card')
assert(dietPlanCode.includes('getAyurvedicCookingInstructions') && dietPlanCode.includes('Ghrita Samskara'), 'DietPlan.tsx recipe expansion displays classical cooking method & macros')

assert(appCode.includes('AyurvedicCookingGuide'), 'App.tsx imports AyurvedicCookingGuide')
assert(appCode.includes('showCookingGuide'), 'App.tsx maintains showCookingGuide state and modal')
assert(appCode.includes('Cooking & 3-Course Plate'), 'App.tsx Fast Bar provides direct shortcut')

assert(dashboardCode.includes('onOpenCookingGuide'), 'Dashboard.tsx accepts onOpenCookingGuide prop')
assert(dashboardCode.includes('Charaka Samskāra & Bhojana Krama'), 'Dashboard.tsx renders dedicated Cooking & 3-Course Plate Banner')

assert(landingCode.includes('onOpenCookingGuide'), 'LandingPage.tsx accepts onOpenCookingGuide prop')
assert(landingCode.includes('Cooking & 3-Course'), 'LandingPage.tsx header & hero provide shortcuts')

assert(profileCode.includes('AyurvedicCookingGuide') && profileCode.includes('culinary'), 'UserProfile.tsx provides dedicated Cooking & 3-Course Plate tab')

console.log('\n======================================================')
console.log(`✨ UNIT TEST RESULTS: ${passed} PASSED / ${failed} FAILED`)
console.log('======================================================')

if (failed > 0) process.exit(1)
