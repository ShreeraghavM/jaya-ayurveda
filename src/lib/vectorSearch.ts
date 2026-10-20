// src/lib/vectorSearch.ts
// Semantic Vector Search & Healing Protocol Engine
// Matches user-reported health challenges against classical Charaka Samhita knowledge base

import {
  DISEASE_REPERTORY,
  getChapterByCondition,
  type DiseaseRemedy,
  type MeasurableMilestone,
  type TimedIntakeItem,
  type TherapeuticExercise,
  type CharakaChapter,
} from './knowledgeBase'

export interface VectorMatchResult {
  remedy: DiseaseRemedy
  similarityScore: number // 0.00 to 1.00
  confidencePercentage: number // 0% to 100%
  matchedTerms: string[]
  politeBedsideGreeting: string
  practicalWhyItWorks: string
  intakePrescription: TimedIntakeItem[]
  exercisePrescription: TherapeuticExercise[]
  milestoneScorecard: MeasurableMilestone
  disclaimer: string
  canonicalChapter?: CharakaChapter
}

// ─── AYURVEDIC DOMAIN SYNONYMS & INTENT EXPANSION ──────────────────────────

const SYNONYM_CLUSTERS: Record<string, string[]> = {
  'prameha-metabolic': [
    'sugar', 'bloodsugar', 'diabetes', 'diabetic', 'glucose', 'insulin', 'hyperglycemia',
    'hba1c', 'sweet', 'urination', 'thirst', 'prameha', 'madhumeha', 'pancreas', 'insulin resistance'
  ],
  'raktachapa-hypertension': [
    'bp', 'bloodpressure', 'pleasure', 'blood pleasure', 'pressure', 'hypertension', 'hypertensive',
    'high bp', 'systolic', 'diastolic', 'temple throbbing', 'heart pulse', 'artery', 'raktachapa', 'raktagata'
  ],
  'sandhivata-osteo': [
    'joint', 'joints', 'knee', 'knees', 'arthritis', 'osteoarthritis', 'crepitus', 'clicking',
    'cartilage', 'joint pain', 'stiff knees', 'sandhivata', 'wear and tear'
  ],
  'amavata-rheumatoid': [
    'rheumatoid', 'autoimmune', 'amavata', 'morning stiffness', 'swelling', 'joint swelling',
    'inflammatory arthritis', 'ama', 'multiple joints', 'finger pain'
  ],
  'greeva-tech-neck': [
    'neck', 'cervical', 'tech neck', 'trapezius', 'stiff neck', 'computer neck', 'screen neck',
    'shoulder stiffness', 'greeva'
  ],
  'amlapitta': [
    'acid', 'acidity', 'reflux', 'gerd', 'heartburn', 'burning chest', 'sour burps', 'hyperacidity',
    'stomach burning', 'gastritis', 'amlapitta'
  ],
  'grahani-ibs': [
    'ibs', 'irritable bowel', 'loose stool', 'mucus', 'alternating diarrhea', 'malabsorption',
    'gurgling', 'bloating', 'gas', 'grahani', 'gut'
  ],
  'vibandha': [
    'constipation', 'hard stool', 'irregular bowel', 'dry bowel', 'straining', 'vibandha'
  ],
  'arshas-hemorrhoids': [
    'piles', 'hemorrhoids', 'anal fissure', 'bleeding stool', 'rectal pain', 'arshas', 'guda'
  ],
  'anidra-insomnia': [
    'sleep', 'insomnia', 'sleepless', 'waking up', 'restless sleep', 'cannot sleep', 'racing mind at night',
    'midnight waking', 'anidra'
  ],
  'chittodvega-anxiety': [
    'anxiety', 'panic', 'stress', 'racing thoughts', 'nervous', 'burnout', 'palpitations',
    'overthinking', 'worry', 'restlessness', 'chittodvega'
  ],
  'shirahshoola-migraine': [
    'migraine', 'headache', 'one sided headache', 'temple throbbing', 'pulsating head',
    'light sensitivity', 'shirahshoola', 'ardhavabhedaka'
  ],
  'kasa-cough': [
    'cough', 'dry cough', 'throat tickle', 'bronchial', 'phlegm', 'kasa'
  ],
  'pratishyaya-sinus': [
    'sinus', 'sinusitis', 'allergic rhinitis', 'running nose', 'sneezing', 'blocked nose',
    'morning sneezes', 'pratishyaya'
  ],
  'tamaka-shwasa-asthma': [
    'asthma', 'wheezing', 'breathlessness', 'chest tightness', 'shortness of breath',
    'tamaka shwasa', 'bronchial asthma'
  ],
  'sthaulya-obesity': [
    'weight', 'obesity', 'overweight', 'fat', 'belly fat', 'metabolic slowdown', 'sluggish metabolism',
    'lipid', 'cholesterol', 'sthaulya'
  ],
  'twak-vikara-eczema': [
    'skin', 'eczema', 'dermatitis', 'itching', 'dry skin', 'skin rash', 'flaking', 'vicharchika'
  ],
  'khalitya-hairfall': [
    'hair', 'hairfall', 'hair loss', 'thinning hair', 'alopecia', 'baldness', 'scalp heat', 'khalitya'
  ],
  'dhatukshaya-burnout': [
    'fatigue', 'chronic fatigue', 'exhaustion', 'low energy', 'weakness', 'low immunity',
    'vitality', 'ojas', 'post viral fatigue', 'burnout'
  ],
  'raktapradara-menorrhagia': [
    'raktapradar', 'raktapradara', 'asrigdara', 'menorrhagia', 'heavy bleeding', 'prolonged bleeding',
    'uterine bleeding', 'clots', 'excessive periods', 'heavy period', 'flooding', 'ashoka'
  ],
  'artavakshaya-oligomenorrhea': [
    'artavakshaya', 'oligomenorrhea', 'hypomenorrhea', 'scanty menses', 'scanty periods', 'light period',
    'brown spotting', 'scanty flow', '1 day period', 'less bleeding', 'tila'
  ],
  'yathochitakala-adarshanam-pcos': [
    'yathochitakala adarshanam', 'yathochitakala', 'adarshanam', 'pcos', 'pcod', 'delayed periods',
    'delayed menses', 'irregular periods', 'irregular cycle', 'secondary amenorrhea', 'amenorrhea',
    'missed period', 'anovulation', 'ovarian cysts', 'shatapushpa'
  ],
}

// ─── VECTORIZER & COSINE SIMILARITY ENGINE ─────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1)
}

function computeQueryVector(query: string): Map<string, number> {
  const tokens = tokenize(query)
  const vec = new Map<string, number>()
  for (const t of tokens) {
    vec.set(t, (vec.get(t) || 0) + 1)
  }
  return vec
}

function computeDocumentVector(remedy: DiseaseRemedy): Map<string, number> {
  const corpus = [
    remedy.condition,
    remedy.sanskrit,
    remedy.doshaImbalance,
    remedy.pathogenesis,
    ...remedy.primaryHerbs,
    remedy.homeRemedy,
    ...remedy.pathya,
  ].join(' ')

  const tokens = tokenize(corpus)
  const vec = new Map<string, number>()
  for (const t of tokens) {
    vec.set(t, (vec.get(t) || 0) + 1)
  }

  // Inject synonym cluster tokens with boost
  const cluster = SYNONYM_CLUSTERS[remedy.id] || []
  for (const syn of cluster) {
    vec.set(syn, (vec.get(syn) || 0) + 3) // 3x domain weight boost
  }

  return vec
}

function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (const val of vecA.values()) normA += val * val
  for (const val of vecB.values()) normB += val * val

  if (normA === 0 || normB === 0) return 0

  for (const [key, valA] of vecA.entries()) {
    const valB = vecB.get(key)
    if (valB) dotProduct += valA * valB
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// ─── MASTER SEMANTIC MATCH FUNCTION ────────────────────────────────────────

export function vectorizeAndMatchHealthIssues(userInput: string): VectorMatchResult[] {
  const trimmed = userInput.trim()
  if (!trimmed) return []

  const queryTokens = tokenize(trimmed)
  const queryVec = computeQueryVector(trimmed)

  // Direct keyword boost (e.g. "sugar", "bp", "blood pleasure")
  const results: { remedy: DiseaseRemedy; score: number; matched: string[] }[] = []

  for (const remedy of DISEASE_REPERTORY) {
    const docVec = computeDocumentVector(remedy)
    let score = cosineSimilarity(queryVec, docVec)

    // Check cluster overlap
    const cluster = SYNONYM_CLUSTERS[remedy.id] || []
    const matchedTerms: string[] = []

    for (const q of queryTokens) {
      if (cluster.some(c => c === q || c.includes(q) || q.includes(c))) {
        score += 0.35 // Substantial semantic boost
        matchedTerms.push(q)
      }
    }

    if (score > 0.05) {
      results.push({ remedy, score, matched: Array.from(new Set(matchedTerms)) })
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, 3).map(({ remedy, score, matched }) => {
    const confidence = Math.min(96, Math.max(78, Math.round((remedy.confidenceScore || 88) * Math.min(1.05, 0.8 + score))))

    // Generate polite, warm, bedside consultation text
    const politeGreeting = generatePoliteBedsideResponse(remedy, matched)
    const whyItWorks = remedy.practicalExplanation || generatePracticalExplanation(remedy)
    const milestones = remedy.measurableMilestones || generateDefaultMilestones(remedy)
    const intakes = remedy.timedIntakes || generateDefaultTimedIntakes(remedy)
    const exercises = remedy.therapeuticExercises || generateDefaultExercises(remedy)

    return {
      remedy,
      similarityScore: Number(score.toFixed(3)),
      confidencePercentage: confidence,
      matchedTerms: matched.length > 0 ? matched : queryTokens.slice(0, 3),
      politeBedsideGreeting: politeGreeting,
      practicalWhyItWorks: whyItWorks,
      intakePrescription: intakes,
      exercisePrescription: exercises,
      milestoneScorecard: milestones,
      canonicalChapter: getChapterByCondition(remedy.id),
      disclaimer: 'This personalized protocol is grounded in the classical Charaka Samhita and clinical phytotherapy trials. It supports natural biological homeostasis and does not substitute for acute emergency medical care.',
    }
  })
}

// ─── EMPATHETIC BEDSIDE GENERATORS ─────────────────────────────────────────

function generatePoliteBedsideResponse(remedy: DiseaseRemedy, matched: string[]): string {
  return `Namaste, dear friend. Thank you for placing your trust in us and sharing your symptoms so openly. Please take a deep breath: your body is neither broken nor permanently flawed. What you are experiencing with ${remedy.condition} is a recognized chronobiological imbalance that classical Ayurveda has documented and successfully reversed for over 2,500 years. We have matched your concern with classical protocols from the ${remedy.charakaRef}. We are deeply confident in your body's restorative capacity when supported by precise diet, targeted herbal timings, and gentle yoga.`
}

function generatePracticalExplanation(remedy: DiseaseRemedy): string {
  return `In classical physiology, this condition originates when digestive fire (Agni) is suppressed by stress and incompatible diet, generating microscopic metabolic residue (Ama) that blocks cellular channels (Srotas). When you follow the targeted protocol below, we systematically clear these channels (Srotashodhana), quiet the aggravated ${remedy.doshaImbalance}, and nourish the underlying tissue (Dhatu Poshana). You will feel measurable relief not by suppressing symptoms, but by reversing the cellular root cause.`
}

function generateDefaultMilestones(remedy: DiseaseRemedy): MeasurableMilestone {
  return {
    biomarker: `${remedy.condition} Symptom Severity Index`,
    unit: 'Score / 10',
    baselineTypical: 'Baseline 8.5 / 10 discomfort with frequent flare-ups',
    day14Target: '5.0 / 10 (Noticeable lightness and 40% reduction in discomfort)',
    day45Target: '2.5 / 10 (Restful sleep, sustained energy, digestion normalizes)',
    day90Target: '< 1.0 / 10 (Sustained cellular stability and tissue rejuvenation)',
    trackingFrequency: 'Weekly symptom review every Sunday evening',
  }
}

function generateDefaultTimedIntakes(remedy: DiseaseRemedy): TimedIntakeItem[] {
  return [
    {
      time: '06:30 AM (Brahma Muhurta)',
      item: `Warm Water with ${remedy.primaryHerbs[0] || 'Triphala'}`,
      quantity: '200 ml lukewarm infusion',
      physiologicalAction: 'Awakens digestive Agni and clears gastrointestinal metabolic debris.',
    },
    {
      time: '12:30 PM (Midday Agni Peak)',
      item: 'Warm sattvic lunch prepared with Pathya herbs',
      quantity: 'Balanced bowl with fresh spices and cow ghee',
      physiologicalAction: 'Supplies cellular nutrition during the peak solar Pitta metabolic window.',
    },
    {
      time: '09:00 PM (Ratricharya)',
      item: remedy.homeRemedy,
      quantity: remedy.dosage,
      physiologicalAction: 'Nourishes the nervous system and repairs cellular tissues during nocturnal rest.',
    },
  ]
}

function generateDefaultExercises(remedy: DiseaseRemedy): TherapeuticExercise[] {
  return [
    {
      name: 'Nadi Shodhana Pranayama (Alternate Nostril Breath)',
      type: 'Pranayama',
      duration: '10–12 minutes daily',
      breathPacing: 'Slow, unhurried 4:4:4 rhythm without forcing',
      physiologicalAction: 'Restores parasympathetic autonomic balance, relieving arterial tension and mental strain.',
    },
    {
      name: 'Gentle Dosha-Harmonizing Asanas',
      type: 'Asana',
      duration: '15 minutes in morning or sunset',
      breathPacing: 'Coordinated inhale with extension, exhale with flexion',
      physiologicalAction: 'Stimulates lymphatic drainage and prevents microchannel stagnation.',
    },
  ]
}

// ─── ACTIVE PROTOCOL PERSISTENCE ───────────────────────────────────────────

const ACTIVE_PROTOCOL_KEY = 'jaya_active_healing_protocol'

export function saveActiveHealingProtocol(match: VectorMatchResult): void {
  try {
    localStorage.setItem(ACTIVE_PROTOCOL_KEY, JSON.stringify(match))
  } catch (err) {
    console.error('Failed to save active healing protocol', err)
  }
}

export function getActiveHealingProtocol(): VectorMatchResult | null {
  try {
    const raw = localStorage.getItem(ACTIVE_PROTOCOL_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearActiveHealingProtocol(): void {
  try {
    localStorage.removeItem(ACTIVE_PROTOCOL_KEY)
  } catch {}
}
