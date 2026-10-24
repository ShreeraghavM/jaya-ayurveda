// src/lib/anatomyEngine.ts
// Comprehensive Ayurvedic Human Anatomy & Srotas Digital Twin Engine
// Maps modern 13 anatomical systems to classical Charaka Samhita Sharira Sthana, Srotamsi & Dhatus

import { todayKey, getTodayLog, getMealConfirmation, getRoutineProgress, type DailyLog } from './store'
import type { Dosha, UserProfile } from './data'

export type AnatomicalSystemId =
  | 'circulatory'
  | 'respiratory'
  | 'digestive'
  | 'urinary'
  | 'skeletal'
  | 'muscular'
  | 'nervous'
  | 'endocrine'
  | 'integumentary'
  | 'lymphatic'
  | 'reproductive'
  | 'immune'
  | 'exocrine'

export interface AnatomicalOrgan {
  id: string
  name: string
  sanskritName: string
  locationDescription: string
  x: number // percentage on 2D body SVG 0-100
  y: number // percentage on 2D body SVG 0-100
  size: number
}

export interface AnatomicalSystemMeta {
  id: AnatomicalSystemId
  name: string
  sanskritSrotas: string
  governingDhatu: string
  classicalShlokaReference: string
  icon: string
  color: string
  description: string
  primaryOrgans: AnatomicalOrgan[]
  ayurvedicFunction: string
  keyNutrientsAndRasas: string[]
  recommendedFoodsFor100: string[]
}

export interface SystemNourishmentStatus {
  systemId: AnatomicalSystemId
  name: string
  sanskritSrotas: string
  icon: string
  color: string
  percentage: number // 0 to 100%
  status: 'critical' | 'moderate' | 'optimal' | 'complete'
  contributingActions: string[]
  missingFor100: string[]
  recommendedRemedyOrFood: string
}

export interface DiseaseBeacon {
  id: string
  conditionName: string
  sanskritName: string
  systemId: AnatomicalSystemId
  organId?: string
  reportedDate: string
  severity: 'mild' | 'moderate' | 'severe'
  projectedReliefDays: number
  expectedDailyPainReductionPct: number
  charakaReference: string
  targetBiomarkers: string
  prescribedDiet: string[]
  prescribedRemedy: string
  prescribedYoga: string
  isCleared: boolean
  clearedDate?: string
}

export interface BedtimePainCheckinRecord {
  id: string
  date: string
  conditionId: string
  conditionName: string
  projectedReductionPct: number
  actualReductionPct: number
  reliefCategory: 'significant' | 'noticeable' | 'mild' | 'unchanged' | 'worse'
  painScore: number // 0 (no pain) to 10 (extreme)
  userNotes: string
  verifiedDietCompliance: boolean
}

export interface ClinicalLabReport {
  id: string
  date: string
  patientName: string
  testType: 'blood_glucose' | 'lipid_profile' | 'blood_pressure' | 'cbc' | 'thyroid' | 'kidney_liver' | 'other'
  fastingBloodSugarMgDl?: number
  postPrandialBloodSugarMgDl?: number
  hba1cPct?: number
  systolicBpMmHg?: number
  diastolicBpMmHg?: number
  pulseBpm?: number
  totalCholesterolMgDl?: number
  triglyceridesMgDl?: number
  ldlCholesterolMgDl?: number
  hdlCholesterolMgDl?: number
  hemoglobinGDl?: number
  esrMmHr?: number
  wbcCountPerMcl?: number
  tshUiuMl?: number
  serumCreatinineMgDl?: number
  sgptAltUL?: number
  doctorNotes?: string
  clinicalCorrelation?: string
  dietaryRecalibration?: string[]
}

// ─── 13 FOUNDATIONAL ANATOMICAL SYSTEMS DEFINITIONS ─────────────────────────

export const ANATOMICAL_SYSTEMS: Record<AnatomicalSystemId, AnatomicalSystemMeta> = {
  circulatory: {
    id: 'circulatory',
    name: 'Circulatory System',
    sanskritSrotas: 'Raktavaha Srotas (रक्तवह स्रोतस्)',
    governingDhatu: 'Rakta Dhatu (Blood & Hemoglobin)',
    classicalShlokaReference: 'Charaka Sutra Sthana 24.4 (Vidhi Shonitiya)',
    icon: '❤️',
    color: '#ef4444',
    description: 'Heart, arterial matrix, veins, and microcirculatory perfusion carrying oxygen and prana.',
    ayurvedicFunction: 'Jeevana (Vitalizing all tissues, thermoregulation, nutrient conveyance).',
    keyNutrientsAndRasas: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Iron', 'Nitrates', 'Antioxidants'],
    recommendedFoodsFor100: ['Fresh Pomegranate (Dadima)', 'Beetroot soup', 'Munakka (Raisins)', 'Arjuna bark decoction'],
    primaryOrgans: [
      { id: 'heart', name: 'Heart', sanskritName: 'Hridaya (हृदय)', locationDescription: 'Center-left chest, seated between lungs', x: 50, y: 32, size: 14 },
      { id: 'arteries', name: 'Aorta & Arteries', sanskritName: 'Dhamani (धमनी)', locationDescription: 'Thoracic & abdominal aorta branching throughout torso', x: 50, y: 42, size: 8 },
    ],
  },
  respiratory: {
    id: 'respiratory',
    name: 'Respiratory System',
    sanskritSrotas: 'Pranavaha Srotas (प्राणवह स्रोतस्)',
    governingDhatu: 'Prana Vayu & Avalambaka Kapha',
    classicalShlokaReference: 'Charaka Vimana Sthana 5.7',
    icon: '🫁',
    color: '#38bdf8',
    description: 'Nasal passages, trachea, bronchial tree, and lung alveoli governing oxygenation and cellular prana.',
    ayurvedicFunction: 'Prana-dharana (Uptake of cosmic vital energy and elimination of metabolic carbon gases).',
    keyNutrientsAndRasas: ['Katu (Pungent)', 'Tikta (Bitter)', 'Warm steam', 'Eucalyptus', 'Tulsi volatile oils'],
    recommendedFoodsFor100: ['Warm Tulsi-Ginger infusion', 'Black pepper with raw honey', 'Adhatoda vasica (Vasa) tea', 'Warm golden milk'],
    primaryOrgans: [
      { id: 'lungs', name: 'Lungs', sanskritName: 'Phupphusa (फुप्फुस)', locationDescription: 'Bilateral pleural cavity across chest', x: 45, y: 30, size: 18 },
      { id: 'trachea', name: 'Trachea & Bronchi', sanskritName: 'Shwasanalika (श्वासनालिका)', locationDescription: 'Midline neck descending to bronchial bifurcations', x: 50, y: 22, size: 6 },
    ],
  },
  digestive: {
    id: 'digestive',
    name: 'Digestive System',
    sanskritSrotas: 'Annavaha & Purishavaha Srotas (अन्नवह स्रोतस्)',
    governingDhatu: 'Jatharagni (Gastric & Metabolic Fire)',
    classicalShlokaReference: 'Charaka Chikitsa Sthana 15 (Grahani Dosha Chikitsa)',
    icon: '🥣',
    color: '#f59e0b',
    description: 'Stomach, small intestine, colon, liver, gallbladder, and pancreatic enzymes.',
    ayurvedicFunction: 'Ahara Parinama (Enzymatic breakdown, rasa extraction, waste formation).',
    keyNutrientsAndRasas: ['Deepana (Appetizers)', 'Pachana (Digestants)', 'Soluble fiber', 'Zingiberene', 'Probiotics'],
    recommendedFoodsFor100: ['Warm Kitchari with ghee & cumin', 'Buttermilk with roasted jeera', 'Triphala churnam', 'Ginger chew before meals'],
    primaryOrgans: [
      { id: 'stomach', name: 'Stomach', sanskritName: 'Amashaya (आमाशय)', locationDescription: 'Upper left quadrant of abdomen beneath diaphragm', x: 53, y: 39, size: 12 },
      { id: 'liver', name: 'Liver & Gallbladder', sanskritName: 'Yakrit & Pittashaya (यकृत्)', locationDescription: 'Upper right abdominal quadrant', x: 44, y: 38, size: 13 },
      { id: 'pancreas', name: 'Pancreas', sanskritName: 'Agnyashaya (अग्न्याशय)', locationDescription: 'Retroperitoneal behind stomach, spanning midline', x: 50, y: 41, size: 9 },
      { id: 'intestines', name: 'Small & Large Intestines', sanskritName: 'Pakvashaya (पक्वाशय)', locationDescription: 'Central and lower abdominal cavity', x: 50, y: 49, size: 16 },
    ],
  },
  urinary: {
    id: 'urinary',
    name: 'Urinary System',
    sanskritSrotas: 'Mutravaha Srotas (मूत्रवह स्रोतस्)',
    governingDhatu: 'Kleda (Fluid Metabolic Waste) & Apana Vayu',
    classicalShlokaReference: 'Charaka Siddhi Sthana 9.6 (Trimarmiya Siddhi)',
    icon: '💧',
    color: '#06b6d4',
    description: 'Kidneys, ureters, bladder, and urethra maintaining osmolarity, electrolytes, and urea clearance.',
    ayurvedicFunction: 'Kleda Vahana (Elimination of watery metabolic wastes and toxic metabolites).',
    keyNutrientsAndRasas: ['Madhura (Sweet)', 'Sheeta (Cooling)', 'Potassium', 'Alkaline hydration'],
    recommendedFoodsFor100: ['Coconut water', 'Barley (Yava) water', 'Gokshura tea', 'Coriander seed cold infusion'],
    primaryOrgans: [
      { id: 'kidneys', name: 'Kidneys', sanskritName: 'Vrikka (वृक्क)', locationDescription: 'Bilateral posterior flank beneath lower ribs', x: 44, y: 43, size: 10 },
      { id: 'bladder', name: 'Urinary Bladder', sanskritName: 'Basti (बस्ति)', locationDescription: 'Lower midline pelvic basin', x: 50, y: 56, size: 11 },
    ],
  },
  skeletal: {
    id: 'skeletal',
    name: 'Skeletal System',
    sanskritSrotas: 'Asthivaha Srotas (अस्थिवह स्रोतस्)',
    governingDhatu: 'Asthi Dhatu (Bones, Joints & Cartilage)',
    classicalShlokaReference: 'Charaka Sharira Sthana 7.6 (Sharira Sankhya)',
    icon: '🦴',
    color: '#e2e8f0',
    description: '206 articulated bones, synovial joints, spinal vertebrae, and structural cartilage.',
    ayurvedicFunction: 'Dharana (Structural support, protection of vital marmas, marrow containment).',
    keyNutrientsAndRasas: ['Madhura (Grounding)', 'Calcium', 'Phosphorus', 'Sesamin', 'Vitamin D3'],
    recommendedFoodsFor100: ['Black sesame seeds (Tila)', 'Moringa (Shigru) leaves', 'Warm spiced almond milk', 'Cissus quadrangularis (Hadjod)'],
    primaryOrgans: [
      { id: 'spine', name: 'Spinal Column', sanskritName: 'Merudanda (मेरुदण्ड)', locationDescription: 'Midline posterior axial framework from skull to sacrum', x: 50, y: 35, size: 24 },
      { id: 'knees', name: 'Knee & Major Joints', sanskritName: 'Janu Sandhi (जानु सन्धि)', locationDescription: 'Bilateral knee joints, hips, shoulders', x: 46, y: 72, size: 9 },
    ],
  },
  muscular: {
    id: 'muscular',
    name: 'Muscular System',
    sanskritSrotas: 'Mamsavaha Srotas (मांसवह स्रोतस्)',
    governingDhatu: 'Mamsa Dhatu (Muscles & Tendons)',
    classicalShlokaReference: 'Charaka Sharira Sthana 7.9',
    icon: '💪',
    color: '#f97316',
    description: 'Skeletal musculature, postural stabilizers, and smooth muscle layers enabling movement.',
    ayurvedicFunction: 'Lepana (Enveloping skeleton, mechanical force production, physical vigor).',
    keyNutrientsAndRasas: ['Madhura (Sweet)', 'Protein amino acids', 'Magnesium', 'Zinc'],
    recommendedFoodsFor100: ['Moong dal soup with cumin', 'Sprouted lentils', 'Warm pumpkin seeds', 'Ashwagandha root paste'],
    primaryOrgans: [
      { id: 'torso_muscles', name: 'Thoracic & Core Muscles', sanskritName: 'Uras & Udara Peshi (उरो मांस)', locationDescription: 'Pectorals, abdominals, and latissimus dorsi', x: 50, y: 36, size: 17 },
      { id: 'limb_muscles', name: 'Limb Musculature', sanskritName: 'Shakha Peshi (शाखा पेशी)', locationDescription: 'Biceps, quadriceps, calves', x: 38, y: 65, size: 14 },
    ],
  },
  nervous: {
    id: 'nervous',
    name: 'Nervous System',
    sanskritSrotas: 'Majjavaha Srotas (मज्जावह स्रोतस्)',
    governingDhatu: 'Majja Dhatu & Prana / Udana Vayu',
    classicalShlokaReference: 'Charaka Siddhi Sthana 9.4 (Shiras as Supreme Marma)',
    icon: '🧠',
    color: '#a855f7',
    description: 'Brain, cerebral cortex, spinal cord, cranial nerves, and autonomous peripheral plexus.',
    ayurvedicFunction: 'Poorana & Jnana (Cognitive sensation, motor coordination, neural calm, marrow fullness).',
    keyNutrientsAndRasas: ['Medhya (Nootropics)', 'Omega-3 fatty acids', 'Choline', 'Lecithin'],
    recommendedFoodsFor100: ['Walnuts (Akshota)', 'Ghee processed with Brahmi', 'Gotu Kola infusion', 'Warm chamomile with saffron'],
    primaryOrgans: [
      { id: 'brain', name: 'Brain & Cerebrum', sanskritName: 'Shiras & Mastishka (मस्तिष्क)', locationDescription: 'Cranial vault seated in skull', x: 50, y: 13, size: 15 },
      { id: 'vagus_nerve', name: 'Vagus & Autonomic Cord', sanskritName: 'Sushumna & Nadi (सुषुम्णा नाडी)', locationDescription: 'Spinal cord branching autonomic plexus', x: 50, y: 28, size: 10 },
    ],
  },
  endocrine: {
    id: 'endocrine',
    name: 'Endocrine System',
    sanskritSrotas: 'Agni-granthis & Rasavaha Axis',
    governingDhatu: 'Pitta & Ojas Balance',
    classicalShlokaReference: 'Charaka Sharira Sthana 6.15',
    icon: '⚡',
    color: '#ec4899',
    description: 'Thyroid, parathyroid, pituitary, adrenal glands, and endocrine pancreatic islets.',
    ayurvedicFunction: 'Dhatu Dhatri (Hormonal rhythm, circadian clocks, metabolic pacing, stress regulation).',
    keyNutrientsAndRasas: ['Selenium', 'Iodine', 'Adaptogenic withanolides', 'B-complex'],
    recommendedFoodsFor100: ['Brazil nuts (1-2 daily)', 'Ashwagandha', 'Kanchanara guggulu', 'Flaxseed meal with warm water'],
    primaryOrgans: [
      { id: 'thyroid', name: 'Thyroid & Parathyroid', sanskritName: 'Jatru Granthi (गल ग्रन्थि)', locationDescription: 'Anterior neck below Adam’s apple', x: 50, y: 20, size: 7 },
      { id: 'adrenals', name: 'Adrenal Glands', sanskritName: 'Vrikka-upagranthi (अधिवृक्क)', locationDescription: 'Superior pole of both kidneys', x: 44, y: 40, size: 6 },
    ],
  },
  integumentary: {
    id: 'integumentary',
    name: 'Integumentary System',
    sanskritSrotas: 'Svedavaha & Twak Srotas (त्वक् स्रोतस्)',
    governingDhatu: 'Twak (7 Epidermal & Dermal Layers) & Bhrajaka Pitta',
    classicalShlokaReference: 'Charaka Sharira Sthana 7.4 (Sapta Twacha)',
    icon: '✨',
    color: '#fb7185',
    description: 'Skin epidermal barrier, dermis, hair follicles, sebaceous glands, and fingernails.',
    ayurvedicFunction: 'Chhadana & Sparshana (Environmental defense, cutaneous tactile sensation, radiance).',
    keyNutrientsAndRasas: ['Tikta (Bitter)', 'Aloe vera polysaccharides', 'Zinc', 'Vitamin E'],
    recommendedFoodsFor100: ['Fresh Aloe Vera pulp', 'Neem-Turmeric micro-dose', 'Cucumber with skin', 'Virgin sesame oil Abhyanga'],
    primaryOrgans: [
      { id: 'skin_barrier', name: 'Cutaneous Dermal Sheet', sanskritName: 'Twak Mandala (त्वचा)', locationDescription: 'Whole body outer envelopment', x: 50, y: 50, size: 30 },
    ],
  },
  lymphatic: {
    id: 'lymphatic',
    name: 'Lymphatic System',
    sanskritSrotas: 'Rasavaha Srotas (रसवह स्रोतस्)',
    governingDhatu: 'Rasa Dhatu (Primary Nutrient Plasma & Lymph)',
    classicalShlokaReference: 'Charaka Vimana Sthana 5.8',
    icon: '🛡️',
    color: '#10b981',
    description: 'Lymph nodes, thoracic duct, lymphatic vessels, and spleen filtering cellular fluid.',
    ayurvedicFunction: 'Preenana (Nourishing all downstream tissues, immune cellular surveillance).',
    keyNutrientsAndRasas: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Circulatory motion', 'Hydration'],
    recommendedFoodsFor100: ['Manjistha decoction', 'Warm water with lemon', 'Grapefruit (in season)', 'Dry ginger water'],
    primaryOrgans: [
      { id: 'spleen', name: 'Spleen', sanskritName: 'Pleeha (प्लीहा)', locationDescription: 'Left upper hypochondrium lateral to stomach', x: 58, y: 39, size: 9 },
      { id: 'lymph_nodes', name: 'Cervical & Inguinal Nodes', sanskritName: 'Lasika Granthi (लसिका ग्रन्थि)', locationDescription: 'Neck, armpits, and groin clusters', x: 50, y: 24, size: 8 },
    ],
  },
  reproductive: {
    id: 'reproductive',
    name: 'Reproductive System',
    sanskritSrotas: 'Shukravaha & Artavavaha Srotas (शुक्रवह / आर्तववह)',
    governingDhatu: 'Shukra / Artava Dhatu (Quintessence of Tissue Metabolism)',
    classicalShlokaReference: 'Charaka Sharira Sthana 2.4 (Garbhavakranti)',
    icon: '🌸',
    color: '#d946ef',
    description: 'Ovaries, fallopian tubes, uterus / testes, prostate, and reproductive endocrine secretions.',
    ayurvedicFunction: 'Garbhotpadana & Dhairya (Fertility, longevity, emotional courage, deep vitality).',
    keyNutrientsAndRasas: ['Madhura (Nourishing)', 'Zinc', 'Shatavarin glycosides', 'Healthy lipids'],
    recommendedFoodsFor100: ['Shatavari churnam', 'Gokshura', 'Fresh dates soaked in milk', 'Raw pumpkin seeds'],
    primaryOrgans: [
      { id: 'uterus_prostate', name: 'Uterus / Pelvic Organs', sanskritName: 'Garbhashaya / Mutrashaya', locationDescription: 'Deep pelvic basin', x: 50, y: 54, size: 11 },
    ],
  },
  immune: {
    id: 'immune',
    name: 'Immune System',
    sanskritSrotas: 'Ojas & Vyadhikshamatva (ओजस् स्रोतस्)',
    governingDhatu: 'Param Ojas (Biological Immunity Essence)',
    classicalShlokaReference: 'Charaka Sutra Sthana 28.7 & Sutra 17.75',
    icon: '🔮',
    color: '#14b8a6',
    description: 'White blood cells, antibody production, gut-associated lymphoid tissue (GALT), and cellular resistance.',
    ayurvedicFunction: 'Vyadhikshamatva (Preventing manifestation of disease and neutralizing pathogen invasion).',
    keyNutrientsAndRasas: ['Rasayana (Rejuvenators)', 'Vitamin C', 'Polyphenols', 'Ghee lipids'],
    recommendedFoodsFor100: ['Chyawanprash (1 tsp morning)', 'Amla (Indian Gooseberry)', 'Pure cow ghee', 'Guduchi (Tinospora cordifolia)'],
    primaryOrgans: [
      { id: 'thymus_ojas', name: 'Thymus & Heart Ojas Seat', sanskritName: 'Para Ojas Sthana (ओज स्थान)', locationDescription: 'Retro-sternal mediastinum behind heart', x: 50, y: 29, size: 10 },
    ],
  },
  exocrine: {
    id: 'exocrine',
    name: 'Exocrine System',
    sanskritSrotas: 'Svedavaha & Koshtha Srotas (स्वेदवह स्रोतस्)',
    governingDhatu: 'Sveda & Bodhaka Kapha (Sweat, Saliva & Enzymes)',
    classicalShlokaReference: 'Charaka Vimana Sthana 5.22',
    icon: '🧪',
    color: '#84cc16',
    description: 'Sweat glands, salivary glands, bile ducts, and pancreatic exocrine acini.',
    ayurvedicFunction: 'Svedana & Kledana (Thermal equilibrium through sweat, salivary predigestion).',
    keyNutrientsAndRasas: ['Electrolyte water', 'Sour citrus', 'Himalayan pink salt'],
    recommendedFoodsFor100: ['Electrolyte water with lime & rock salt', 'Fennel seed tea', 'Warm ginger water'],
    primaryOrgans: [
      { id: 'salivary', name: 'Salivary Glands', sanskritName: 'Lala Granthi (लाला ग्रन्थि)', locationDescription: 'Parotid and submandibular base of mouth', x: 50, y: 18, size: 6 },
    ],
  },
}

// ─── STORAGE KEYS ──────────────────────────────────────────────────────────

const DISEASE_BEACONS_KEY = 'jaya_disease_beacons'
const BEDTIME_PAIN_LOGS_KEY = 'jaya_bedtime_pain_logs'
const LAB_REPORTS_KEY = 'jaya_clinical_lab_reports'

// ─── PERSISTENCE HELPERS ───────────────────────────────────────────────────

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key: string, val: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.warn('Storage write failed', e)
  }
}

// ─── NOURISHMENT CALCULATION ENGINE ────────────────────────────────────────

/**
 * Computes today's real-time nourishment percentage (0% - 100%) for each of the 13 anatomical systems
 * based on user logs: meals confirmed, water intake, yoga, pranayama, sleep, and routine steps completed.
 */
export function calculateSystemNourishment(date: string = todayKey()): Record<AnatomicalSystemId, SystemNourishmentStatus> {
  const log: DailyLog = getTodayLog()
  const meals = getMealConfirmation(date)
  const routine = getRoutineProgress(date)

  // Count actions
  const mealsDoneCount = Object.values(meals.slots).filter(s => s === 'done').length
  const routineDoneCount = Object.values(routine).filter(s => s === 'done').length
  const waterGlasses = log.waterIntake || 0
  const yogaMin = log.yogaMinutes || 0
  const pranayamaMin = log.pranayamaMinutes || 0
  const sleepHours = log.sleepHours || 7

  const results = {} as Record<AnatomicalSystemId, SystemNourishmentStatus>

  const systems = Object.keys(ANATOMICAL_SYSTEMS) as AnatomicalSystemId[]

  for (const sysId of systems) {
    const meta = ANATOMICAL_SYSTEMS[sysId]
    let pct = 0
    const contributingActions: string[] = []

    // 1. Water contribution
    if (waterGlasses > 0) {
      if (['urinary', 'lymphatic', 'exocrine'].includes(sysId)) {
        const added = Math.min(35, waterGlasses * 5)
        pct += added
        contributingActions.push(`${waterGlasses} glasses of water (+${added}%)`)
      } else if (['circulatory', 'integumentary', 'digestive'].includes(sysId)) {
        const added = Math.min(20, waterGlasses * 3)
        pct += added
        contributingActions.push(`Hydration (+${added}%)`)
      }
    }

    // 2. Meal confirmations
    if (mealsDoneCount > 0) {
      if (['digestive', 'exocrine'].includes(sysId)) {
        const added = Math.min(50, mealsDoneCount * 25)
        pct += added
        contributingActions.push(`${mealsDoneCount} mindful meal(s) confirmed (+${added}%)`)
      }
      if (['muscular', 'circulatory', 'immune'].includes(sysId)) {
        const added = Math.min(40, mealsDoneCount * 18)
        pct += added
        contributingActions.push(`Macro-nutrient tissue assimilation (+${added}%)`)
      }
      if (['skeletal', 'reproductive'].includes(sysId)) {
        const added = Math.min(30, mealsDoneCount * 15)
        pct += added
        contributingActions.push(`Deep dhatu building nutrition (+${added}%)`)
      }
    }

    // 3. Pranayama
    if (pranayamaMin > 0) {
      if (['respiratory', 'nervous'].includes(sysId)) {
        const added = Math.min(45, pranayamaMin * 3)
        pct += added
        contributingActions.push(`${pranayamaMin}m Pranayama breath control (+${added}%)`)
      }
      if (['immune', 'endocrine', 'circulatory'].includes(sysId)) {
        const added = Math.min(25, pranayamaMin * 2)
        pct += added
        contributingActions.push(`Autonomic vagal regulation (+${added}%)`)
      }
    }

    // 4. Yoga / Physical Movement
    if (yogaMin > 0) {
      if (['skeletal', 'muscular'].includes(sysId)) {
        const added = Math.min(45, yogaMin * 2.5)
        pct += added
        contributingActions.push(`${yogaMin}m Asana postural work (+${added}%)`)
      }
      if (['lymphatic', 'circulatory'].includes(sysId)) {
        const added = Math.min(30, yogaMin * 1.5)
        pct += added
        contributingActions.push(`Lymphatic muscle pump (+${added}%)`)
      }
    }

    // 5. Routine Steps (Dinacharya)
    if (routineDoneCount > 0) {
      if (['nervous', 'endocrine', 'immune'].includes(sysId)) {
        const added = Math.min(35, routineDoneCount * 6)
        pct += added
        contributingActions.push(`${routineDoneCount} Dinacharya habit(s) (+${added}%)`)
      }
      if (['integumentary'].includes(sysId)) {
        const added = Math.min(40, routineDoneCount * 7)
        pct += added
        contributingActions.push(`Skin / hygiene care habits (+${added}%)`)
      }
    }

    // 6. Restorative Sleep
    if (sleepHours >= 7) {
      if (['nervous', 'immune', 'endocrine'].includes(sysId)) {
        const added = 20
        pct += added
        contributingActions.push(`Nocturnal cell regeneration (+${added}%)`)
      }
    }

    // Clamp 0 to 100
    const finalPct = Math.min(100, Math.round(pct))

    let status: SystemNourishmentStatus['status'] = 'critical'
    if (finalPct >= 90) status = 'complete'
    else if (finalPct >= 65) status = 'optimal'
    else if (finalPct >= 35) status = 'moderate'

    // Determine missing items
    const missingFor100: string[] = []
    if (finalPct < 100) {
      if (['respiratory'].includes(sysId) && pranayamaMin === 0) {
        missingFor100.push('10 min Anulom Vilom Pranayama')
      }
      if (['skeletal', 'muscular'].includes(sysId) && yogaMin === 0) {
        missingFor100.push('15 min gentle Asana movement')
      }
      if (['urinary', 'lymphatic'].includes(sysId) && waterGlasses < 6) {
        missingFor100.push(`Hydration: ${Math.max(1, 6 - waterGlasses)} more glasses warm water`)
      }
      if (['digestive'].includes(sysId) && mealsDoneCount < 2) {
        missingFor100.push('Warm Agni-supportive meal with spices')
      }
      if (missingFor100.length === 0) {
        missingFor100.push(`Prescribed food: ${meta.recommendedFoodsFor100[0]}`)
      }
    }

    results[sysId] = {
      systemId: sysId,
      name: meta.name,
      sanskritSrotas: meta.sanskritSrotas,
      icon: meta.icon,
      color: meta.color,
      percentage: finalPct,
      status,
      contributingActions,
      missingFor100,
      recommendedRemedyOrFood: meta.recommendedFoodsFor100[0] || 'Warm grounding spices',
    }
  }

  return results
}

/**
 * Returns overall full-body composite vitality score (average of all 13 systems)
 */
export function getOverallBodyVitalityScore(nourishment: Record<AnatomicalSystemId, SystemNourishmentStatus>): number {
  const vals = Object.values(nourishment)
  if (!vals.length) return 0
  const sum = vals.reduce((acc, curr) => acc + curr.percentage, 0)
  return Math.round(sum / vals.length)
}

// ─── DYNAMIC MEAL GENERATION FROM ANATOMICAL DEFICITS ──────────────────────

export interface DeficitMealRecommendation {
  headline: string
  focusSystems: string[]
  recommendedMealTitle: string
  rationale: string
  ingredients: string[]
  charakaCitation: string
}

export function generateDeficitBalancingMeal(
  nourishment: Record<AnatomicalSystemId, SystemNourishmentStatus>,
  dosha: Dosha = 'Vata'
): DeficitMealRecommendation {
  // Find lowest 2 systems
  const sorted = Object.values(nourishment).sort((a, b) => a.percentage - b.percentage)
  const lowest = sorted.slice(0, 2)

  const sysNames = lowest.map(s => s.name).join(' and ')

  if (lowest[0].systemId === 'digestive' || lowest[0].systemId === 'exocrine') {
    return {
      headline: `Targeting ${sysNames} (Currently at ${lowest[0].percentage}%)`,
      focusSystems: lowest.map(s => s.name),
      recommendedMealTitle: 'Deepana-Pachana Warm Moong Kitchari with Cumin & Rock Salt',
      rationale: 'Stimulates digestive Agni and resets gastrointestinal mucosal lining without overburdening the metabolic fire.',
      ingredients: ['Split yellow moong dal', 'Aged basmati or barley', 'Clarified cow ghee', 'Fresh grated ginger', 'Roasted cumin seeds', 'Pinch of saindhava salt'],
      charakaCitation: 'Charaka Chikitsa Sthana 15.197: "Ghee rekindles the digestive fire like oil upon embers."',
    }
  }

  if (lowest[0].systemId === 'respiratory' || lowest[0].systemId === 'nervous') {
    return {
      headline: `Targeting ${sysNames} (Currently at ${lowest[0].percentage}%)`,
      focusSystems: lowest.map(s => s.name),
      recommendedMealTitle: 'Medhya Saffron Spiced Golden Broth with Almonds',
      rationale: 'Grounds turbulent Vata in Majjavaha Srotas, soothing cranial nerves and dilating bronchial passages.',
      ingredients: ['Blanched crushed almonds', 'Kashmiri saffron threads', 'Cardamom pods', 'Pinch of nutmeg', 'Warm A2 milk or oat milk', '1 tsp honey (added warm, not boiling)'],
      charakaCitation: 'Charaka Siddhi Sthana 9.8: "The head is the root of the tree of the body; soothe the root to nourish all branches."',
    }
  }

  if (lowest[0].systemId === 'skeletal' || lowest[0].systemId === 'muscular') {
    return {
      headline: `Targeting ${sysNames} (Currently at ${lowest[0].percentage}%)`,
      focusSystems: lowest.map(s => s.name),
      recommendedMealTitle: 'Asthi-Balancing Drumstick (Moringa) Lentil Stew with Sesame',
      rationale: 'Provides bioavailable calcium, amino acids, and sesamin to replenish Asthi and Mamsa dhatus.',
      ingredients: ['Fresh drumstick pods (Shigru)', 'Toasted black sesame powder', 'Turmeric', 'Coriander leaves', 'Moong dal base', 'Cold-pressed sesame oil'],
      charakaCitation: 'Charaka Sharira Sthana 7.6: "Bones find strength through unctuous, mineral-dense earth elements."',
    }
  }

  if (lowest[0].systemId === 'circulatory' || lowest[0].systemId === 'lymphatic') {
    return {
      headline: `Targeting ${sysNames} (Currently at ${lowest[0].percentage}%)`,
      focusSystems: lowest.map(s => s.name),
      recommendedMealTitle: 'Rakta-Prasadana Pomegranate, Beet & Munakka Reduction',
      rationale: 'Cooling bitter-sweet astringency cleanses liver heat and promotes healthy erythropoiesis and lymphatic drainage.',
      ingredients: ['Fresh wild pomegranate arils', 'Steamed beet slices', 'Soaked raisins (Munakka)', 'Rose water drops', 'Mint leaves'],
      charakaCitation: 'Charaka Sutra Sthana 24.38: "Pure blood maintains complexion, strength, happiness, and long life."',
    }
  }

  // Fallback balanced restorative meal
  return {
    headline: `Holistic Restorative Dinner for ${dosha} Constitution`,
    focusSystems: lowest.map(s => s.name),
    recommendedMealTitle: 'Tri-Dosha Balancing Warm Vegetable Stew with Quinoa & Ghee',
    rationale: 'Supplies all 6 foundational tastes (Shad Rasa) to bring daily system nourishment to 100%.',
    ingredients: ['Zucchini', 'Carrots', 'Quinoa', 'Ghee', 'Cumin & Fennel seeds', 'Fresh cilantro'],
    charakaCitation: 'Charaka Sutra Sthana 25.40: "Wholesome food is the root cause of growth and vitality."',
  }
}

// ─── DISEASE BEACONS ON ANATOMICAL ORGANS ──────────────────────────────────

export const PRESET_DISEASE_ANATOMY_MAPPINGS: Record<string, { systemId: AnatomicalSystemId; organId: string; charaka: string; targetBiomarker: string }> = {
  'prameha-sugar': {
    systemId: 'digestive',
    organId: 'pancreas',
    charaka: 'Charaka Nidana Sthana 4 (Prameha Nidana) & Chikitsa 6',
    targetBiomarker: 'Fasting Blood Sugar < 100 mg/dL; HbA1c < 6.5%',
  },
  'raktachapa-bp': {
    systemId: 'circulatory',
    organId: 'heart',
    charaka: 'Charaka Sutra Sthana 24 (Vidhi Shonitiya)',
    targetBiomarker: 'Blood Pressure < 120/80 mmHg; Pulse 60-75 bpm',
  },
  'raktapradara': {
    systemId: 'reproductive',
    organId: 'uterus_prostate',
    charaka: 'Charaka Chikitsa Sthana 30.209 (Yonivyapat Chikitsa)',
    targetBiomarker: 'Hemoglobin > 12.0 g/dL; Menstrual cycle 28-30 days without flood clots',
  },
  'sandhivata-joints': {
    systemId: 'skeletal',
    organId: 'knees',
    charaka: 'Charaka Chikitsa Sthana 28.37 (Vatavyadhi Chikitsa)',
    targetBiomarker: 'VAS Pain Score < 2/10; Joint flexion > 120 deg with zero morning stiffness',
  },
  'amlapitta-acid': {
    systemId: 'digestive',
    organId: 'stomach',
    charaka: 'Charaka Chikitsa Sthana 15.115 & Madhava Nidana 51',
    targetBiomarker: 'Zero retrosternal heartburn episodes; normal gastric pH',
  },
  'anidra-insomnia': {
    systemId: 'nervous',
    organId: 'brain',
    charaka: 'Charaka Sutra Sthana 21.35 (Ashtaninditiya - Nidra Vidhi)',
    targetBiomarker: 'Sleep latency < 15 min; 7.5 hours continuous restorative deep sleep',
  },
}

export function getDiseaseBeacons(): DiseaseBeacon[] {
  return readLocal<DiseaseBeacon[]>(DISEASE_BEACONS_KEY, [
    // Pre-populate with demonstration beacon if none exists
    {
      id: 'beacon-prameha-demo',
      conditionName: 'Metabolic Glucose Imbalance (Prameha)',
      sanskritName: 'प्रमेह (Prameha)',
      systemId: 'digestive',
      organId: 'pancreas',
      reportedDate: todayKey(),
      severity: 'moderate',
      projectedReliefDays: 45,
      expectedDailyPainReductionPct: 15,
      charakaReference: 'Charaka Chikitsa Sthana 6 (Prameha Chikitsa)',
      targetBiomarkers: 'Fasting Blood Sugar < 100 mg/dL; HbA1c < 6.0%',
      prescribedDiet: ['Barley (Yava) roti', 'Bitter gourd (Karela) curry', 'Amla-turmeric shot morning'],
      prescribedRemedy: '3g Fenugreek seeds soaked overnight + 500mg Gudmar churna before lunch',
      prescribedYoga: 'Mandukasana (Frog Pose) 5 mins + Kapalabhati 5 mins',
      isCleared: false,
    },
  ])
}

export function saveDiseaseBeacon(beacon: DiseaseBeacon): void {
  const all = getDiseaseBeacons()
  const idx = all.findIndex(b => b.id === beacon.id)
  if (idx >= 0) all[idx] = beacon
  else all.push(beacon)
  writeLocal(DISEASE_BEACONS_KEY, all)
}

export function clearDiseaseBeacon(id: string): void {
  const all = getDiseaseBeacons()
  const found = all.find(b => b.id === id)
  if (found) {
    found.isCleared = true
    found.clearedDate = todayKey()
    writeLocal(DISEASE_BEACONS_KEY, all)
  }
}

// ─── BEDTIME PAIN & SYMPTOM FEEDBACK CHECK-IN ──────────────────────────────

export function getBedtimePainLogs(): BedtimePainCheckinRecord[] {
  return readLocal<BedtimePainCheckinRecord[]>(BEDTIME_PAIN_LOGS_KEY, [
    {
      id: 'pain-log-sample-1',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      conditionId: 'beacon-prameha-demo',
      conditionName: 'Metabolic Glucose Imbalance (Prameha)',
      projectedReductionPct: 15,
      actualReductionPct: 20,
      reliefCategory: 'noticeable',
      painScore: 3,
      userNotes: 'Took fenugreek and mandukasana as prescribed. Energy felt significantly clearer in late afternoon.',
      verifiedDietCompliance: true,
    },
  ])
}

export function saveBedtimePainLog(log: BedtimePainCheckinRecord): void {
  const all = getBedtimePainLogs()
  const idx = all.findIndex(l => l.id === log.id || (l.date === log.date && l.conditionId === log.conditionId))
  if (idx >= 0) all[idx] = log
  else all.unshift(log)
  writeLocal(BEDTIME_PAIN_LOGS_KEY, all)
}

// ─── DOCTOR-STYLE CLINICAL LAB REPORTS ─────────────────────────────────────

export function getClinicalLabReports(): ClinicalLabReport[] {
  return readLocal<ClinicalLabReport[]>(LAB_REPORTS_KEY, [
    {
      id: 'lab-sample-1',
      date: todayKey(),
      patientName: 'Arjun',
      testType: 'blood_glucose',
      fastingBloodSugarMgDl: 138,
      postPrandialBloodSugarMgDl: 182,
      hba1cPct: 6.9,
      systolicBpMmHg: 128,
      diastolicBpMmHg: 84,
      pulseBpm: 72,
      doctorNotes: 'Mild impaired glucose tolerance consistent with sedentary desk posture and late heavy dinners.',
      clinicalCorrelation: 'Charaka diagnosis: Kaphaja Prameha with Medovaha Srotorodha (fat/glucose channel congestion). Agni is Mandagni (sluggish enzyme fire).',
      dietaryRecalibration: [
        'Shift primary carbohydrate from white polished rice to aged Yava (Barley) and roasted millets.',
        'Strictly eliminate refined sugars and cold curd at night.',
        'Drink 1 glass warm water with 1/2 tsp roasted cinnamon and fenugreek prior to primary midday meal.',
      ],
    },
  ])
}

export function saveClinicalLabReport(report: ClinicalLabReport): void {
  const all = getClinicalLabReports()
  const idx = all.findIndex(r => r.id === report.id)
  if (idx >= 0) all[idx] = report
  else all.unshift(report)
  writeLocal(LAB_REPORTS_KEY, all)
}

/**
 * Automatically interprets doctor lab numbers and computes clinical correlation & dietary recalibration
 */
export function analyzeLabReportNumbers(report: Partial<ClinicalLabReport>): { correlation: string; recommendations: string[] } {
  const recs: string[] = []
  const correlations: string[] = []

  if (report.fastingBloodSugarMgDl && report.fastingBloodSugarMgDl > 100) {
    correlations.push(`Elevated Fasting Glucose (${report.fastingBloodSugarMgDl} mg/dL) points to Medovaha channel sluggishness and nocturnal hepatic glycogen leakage.`)
    recs.push('Replace heavy wheat/white rice dinners with roasted barley (Yava) broth or mung soup.')
    recs.push('Add 3g overnight soaked Fenugreek seeds before breakfast.')
  }

  if (report.hba1cPct && report.hba1cPct > 6.0) {
    correlations.push(`HbA1c of ${report.hba1cPct}% indicates chronic erythrocyte glycation over past 90 days.`)
    recs.push('Take Gudmar (Gymnema sylvestre) 500mg with warm water 15 minutes prior to carbohydrate-containing meals.')
  }

  if (report.systolicBpMmHg && report.systolicBpMmHg > 130) {
    correlations.push(`Systolic BP of ${report.systolicBpMmHg} mmHg demonstrates Pitta-Vata arterial resistance in Raktavaha Srotas.`)
    recs.push('Reduce added sodium; replace table salt with mineralized Himalayan pink salt (Saindhava).')
    recs.push('Practice 10 minutes of Sheetali (cooling breath) or Nadi Shodhana at 5:00 PM.')
  }

  if (report.totalCholesterolMgDl && report.totalCholesterolMgDl > 200) {
    correlations.push(`Elevated Cholesterol (${report.totalCholesterolMgDl} mg/dL) indicates Ama (metabolic toxins) bonding with Medas.`)
    recs.push('Incorporate Guggulu (500mg) and garlic infused warm water to scour arterial plaques.')
  }

  if (correlations.length === 0) {
    correlations.push('Biomarkers reflect balanced homeostasis across Dhatus and Srotamsi (Sama Dhatu state).')
    recs.push('Maintain seasonal Ritucharya routine and balanced Shad Rasa diet.')
  }

  return {
    correlation: correlations.join(' '),
    recommendations: recs,
  }
}
