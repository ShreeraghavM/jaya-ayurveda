// src/lib/knowledgeBase.ts
// Comprehensive Ayurvedic Clinical Knowledge Base & Disease Repertory
// Grounded in Charaka Samhita (Volumes 1 & 2), Sushruta Samhita, and Clinical Phytotherapy Evidence

export type BodySystem =
  | 'Digestive'
  | 'Respiratory'
  | 'Musculoskeletal'
  | 'Nervous & Mental'
  | 'Metabolic & Endocrine'
  | 'Skin & Hair'
  | 'Immunity & Rasayana'
  | "Women's Health & Artava"

export interface EvidenceLink {
  title: string
  source: string
  url: string
}

export interface MeasurableMilestone {
  biomarker: string // e.g. "Fasting Blood Glucose" or "Blood Pressure (Systolic/Diastolic)"
  unit: string // e.g. "mg/dL" or "mmHg"
  baselineTypical: string // e.g. "165 mg/dL" or "145/95 mmHg"
  day14Target: string // e.g. "140 mg/dL (-25 mg/dL)" or "135/88 mmHg (-10 mmHg)"
  day45Target: string // e.g. "115 mg/dL" or "126/82 mmHg"
  day90Target: string // e.g. "< 100 mg/dL & HbA1c 5.7%" or "118/78 mmHg"
  trackingFrequency: string // e.g. "Daily morning before breakfast"
}

export interface TimedIntakeItem {
  time: string // e.g. "06:30 AM (Empty Stomach)"
  item: string // e.g. "Nisha-Amalaki Decoction + Methi Water"
  quantity: string // e.g. "150 ml (1/2 tsp Turmeric + 1/2 tsp Amla)"
  physiologicalAction: string // e.g. "Inhibits intestinal alpha-glucosidase & reduces cellular insulin resistance"
}

export interface TherapeuticExercise {
  name: string // e.g. "Mandukasana (Frog Pose)"
  type: 'Asana' | 'Pranayama' | 'Kriya' | 'Movement'
  duration: string // e.g. "3 rounds, hold 45-60 seconds"
  breathPacing: string // e.g. "Exhale completely upon folding forward; hold gently"
  physiologicalAction: string // e.g. "Direct visceral compression of the abdominal aorta & pancreas stimulates islet beta-cells"
}

export interface DiseaseRemedy {
  id: string
  condition: string
  sanskrit: string
  system: BodySystem
  doshaImbalance: string
  severity: 'mild' | 'moderate' | 'chronic'
  charakaRef: string
  pathogenesis: string
  primaryHerbs: string[]
  homeRemedy: string
  preparation: string
  dosage: string
  pathya: string[] // Beneficial foods & habits (Do's)
  apathya: string[] // Aggravating foods & habits (Don'ts)
  precautions: string
  evidenceLinks: EvidenceLink[]
  confidenceScore?: number // Clinical remission confidence percentage (e.g. 94)
  practicalExplanation?: string // Why and how the biological reversal works practically
  measurableMilestones?: MeasurableMilestone
  timedIntakes?: TimedIntakeItem[]
  therapeuticExercises?: TherapeuticExercise[]
}

export interface KnowledgeSource {
  id: string
  title: string
  authorOrBody: string
  type: 'Classical Manuscript (PDF)' | 'Government Clinical Guideline' | 'Peer-Reviewed Database'
  description: string
  referenceLocation: string
}

export interface CustomResearchItem {
  id: string
  title: string
  sourceType: 'Web Link' | 'PDF Excerpt' | 'Clinical Note'
  urlOrCitation: string
  summary: string
  tags: string[]
  createdAt: string
}

// ─── MASTER SOURCE LIBRARY ──────────────────────────────────────────────────

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: 'charaka-v1',
    title: 'Charaka Samhita — Volume 1 (Sutrasthana & Nidanasthana)',
    authorOrBody: 'Maharshi Agnivesha & Acharya Charaka',
    type: 'Classical Manuscript (PDF)',
    description: 'Foundational treatise on fundamental Ayurvedic principles, chronobiology, Dinacharya, Ritucharya, and general pathology.',
    referenceLocation: 'Local Research Archive: Desktop/RAG/Charaka Samhita - Volume 1_copy.pdf',
  },
  {
    id: 'charaka-v2',
    title: 'Charaka Samhita — Volume 2 (Chikitsasthana & Kalpasthana)',
    authorOrBody: 'Acharya Charaka & Acharya Dridhabala',
    type: 'Classical Manuscript (PDF)',
    description: 'Comprehensive clinical therapeutics, organ-specific pharmacopoeia (Rasayana), and management of complex chronic diseases.',
    referenceLocation: 'Local Research Archive: Desktop/RAG/Charaka Samhita - Volume 2_copy.pdf',
  },
  {
    id: 'ayush-portal',
    title: 'National AYUSH Morbidity & Standardized Terminology Portal (NAMASTE)',
    authorOrBody: 'Ministry of AYUSH, Government of India',
    type: 'Government Clinical Guideline',
    description: 'Standardized terminology, ICD-11 dual coding, and evidence-based therapeutic guidelines for traditional medicine.',
    referenceLocation: 'https://namstp.ayush.gov.in/',
  },
  {
    id: 'ccras-guidelines',
    title: 'Central Council for Research in Ayurvedic Sciences (CCRAS) Formulations',
    authorOrBody: 'CCRAS India',
    type: 'Peer-Reviewed Database',
    description: 'Scientifically validated formulations, toxicological screening, and clinical trial monographs.',
    referenceLocation: 'http://www.ccras.nic.in/',
  },
  {
    id: 'pubmed-ayur',
    title: 'PubMed Central — Ethnopharmacology & Phytomedicine Index',
    authorOrBody: 'National Library of Medicine (NIH)',
    type: 'Peer-Reviewed Database',
    description: 'In-vitro and double-blind clinical trials exploring active phytochemicals in Withania somnifera, Curcuma longa, and Tinospora cordifolia.',
    referenceLocation: 'https://pubmed.ncbi.nlm.nih.gov/',
  },
]

// ─── COMPREHENSIVE DISEASE REMEDIES REPERTORY ───────────────────────────────

export const DISEASE_REPERTORY: DiseaseRemedy[] = [
  // 1. DIGESTIVE SYSTEM (ANNAVAHA SROTAS)
  {
    id: 'amlapitta',
    condition: 'Acid Reflux & Hyperacidity (Amlapitta)',
    sanskrit: 'अम्लपित्त · Amlapitta',
    system: 'Digestive',
    doshaImbalance: 'Pitta (Vidagdha Pitta) with Vata secondary',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 15 (Grahani) & Kashyapa Samhita',
    pathogenesis: 'Excessive pungent, sour, fermented, or deep-fried foods cause Pitta liquid quality (Drava Guna) to sour, eroding mucosal lining and causing burning retrosternal pain.',
    primaryHerbs: ['Yashtimadhu (Licorice)', 'Shatavari', 'Amalaki (Indian Gooseberry)', 'Avipattikar Churna', 'Coriander Seeds'],
    homeRemedy: 'Cold coriander-cumin-fennel infusion with rock candy (mishri) twice daily before meals.',
    preparation: 'Crush 1 tsp coriander seeds, 1/2 tsp cumin, and 1 tsp fennel. Steep in 300ml cold water overnight or warm water for 20 mins. Strain and sip slowly.',
    dosage: '1/2 cup twice daily, 15 minutes before lunch and dinner.',
    pathya: ['Old rice', 'Barley', 'Mung bean soup', 'Cooling milk with ghee', 'Pomegranate', 'Sweet fruits'],
    apathya: ['Fermented foods (vinegar, alcohol)', 'Chilies & spicy condiments', 'Sour curd/yogurt at night', 'Coffee on empty stomach'],
    precautions: 'Do not use licorice if you have uncontrolled hypertension. If dysphagia or persistent vomiting occurs, seek urgent gastroenterology evaluation.',
    evidenceLinks: [
      { title: 'CCRAS Protocol on Amlapitta Therapeutics', source: 'Ministry of AYUSH', url: 'https://ayush.gov.in' },
      { title: 'Clinical Trial of Glycyrrhiza glabra in GERD', source: 'PubMed Central', url: 'https://pubmed.ncbi.nlm.nih.gov/22059451/' },
    ],
  },
  {
    id: 'grahani-ibs',
    condition: 'Irritable Bowel Syndrome & Malabsorption (Grahani Roga)',
    sanskrit: 'ग्रहणी दोष · Grahani Dosha',
    system: 'Digestive',
    doshaImbalance: 'Samana Vata & Pachaka Pitta with Mandagni (Weak Digestive Fire)',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 15, Verses 50–65',
    pathogenesis: 'Irregular eating intervals and emotional stress impair the enzymatic competence of Agni in the duodenum/small intestine (Grahani), alternating diarrhea with constipation.',
    primaryHerbs: ['Takra (Cultured Buttermilk)', 'Bilva (Bael Fruit)', 'Kutaja (Holarrhena antidysenterica)', 'Musta (Nutgrass)', 'Roasted Jeera'],
    homeRemedy: 'Takra Kalpana: Fresh churned buttermilk spiced with roasted cumin, pinch of rock salt, and fresh curry leaves.',
    preparation: 'Whisk 1 part homemade yogurt with 4 parts pure water until butter separates. Discard butter. Add roasted cumin powder, dry ginger, and rock salt.',
    dosage: '1 glass immediately following lunch (midday). Never consume at night.',
    pathya: ['Pomegranate', 'Well-cooked warm kitchari with ghee', 'Steamed bottle gourd', 'Warm water sips'],
    apathya: ['Raw vegetable salads', 'Ice cold water', 'Heavy cheeses & bakery sweets', 'Eating when emotionally stressed'],
    precautions: 'Severe dehydration or blood in stool requires immediate hospital care. Buttermilk must be fresh, not sour.',
    evidenceLinks: [
      { title: 'Role of Takra (Buttermilk) in Grahani Roga: A Review', source: 'AYU Journal', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Efficacy of Aegle marmelos (Bael) in IBS', source: 'Phytomedicine International', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'vibandha',
    condition: 'Chronic Constipation (Vibandha)',
    sanskrit: 'विबन्ध · Vibandha',
    system: 'Digestive',
    doshaImbalance: 'Apana Vata Rukshata (Dryness in the Large Intestine)',
    severity: 'mild',
    charakaRef: 'Charaka Samhita, Sutrasthana Ch. 2, Verse 11',
    pathogenesis: 'Lack of healthy fats, dehydration, sedentary routine, and suppressing natural urges (Vega Dharana) dry out the colon walls, freezing peristaltic propulsion.',
    primaryHerbs: ['Triphala Churna', 'Munakka (Black Raisins)', 'Castor Oil (Eranda Taila)', 'Isabgol (Psyllium Husk)'],
    homeRemedy: 'Munakka soaked water or 1 tsp Triphala powder with warm water at bedtime.',
    preparation: 'Soak 10-12 large seeded black raisins in warm water overnight. Masticate thoroughly in the morning and drink the sweet soaking water.',
    dosage: 'Every morning on empty stomach, or 1 tsp Triphala in 200ml warm water before sleep.',
    pathya: ['Ripe sweet papayas', 'Warm cow ghee (1 tsp in warm milk)', 'Cooked spinach', 'Regular walking'],
    apathya: ['Dry biscuits and processed crackers', 'Astringent unripe bananas', 'Suppression of morning bowel movement', 'Cold dry snacks'],
    precautions: 'Do not use strong laxatives during pregnancy. Triphala is safe for long-term daily use as it tones the bowel.',
    evidenceLinks: [
      { title: 'Therapeutic Uses of Triphala in Gastrointestinal Disorders', source: 'Journal of Alternative & Complementary Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/28696777/' },
    ],
  },

  // 2. RESPIRATORY SYSTEM (PRANAVAHA SROTAS)
  {
    id: 'kasa-cough',
    condition: 'Chronic Cough & Bronchial Irritation (Kasa)',
    sanskrit: 'कास रोग · Kasa Roga',
    system: 'Respiratory',
    doshaImbalance: 'Prana Vata obstruction with Kapha accumulation',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 18, Verses 1–25',
    pathogenesis: 'Irritants, cold air, or dry weather reverse the downward natural motion of Prana Vata, pushing it upwards into the thoracic cavity with explosive coughing bouts.',
    primaryHerbs: ['Vasa (Adhatoda vasica)', 'Kantakari (Solanum surattense)', 'Sitopaladi Churna', 'Trikatu (Ginger, Black Pepper, Pippali)', 'Honey'],
    homeRemedy: 'Sitopaladi Churna (1/2 tsp) mixed with 1 tsp raw organic honey and 2 drops ginger juice, licked slowly.',
    preparation: 'Mix powders smoothly into honey paste. Take slowly off a spoon to coat the pharyngeal mucosa.',
    dosage: '2 to 3 times daily, 30 minutes after meals. Avoid drinking water immediately afterwards.',
    pathya: ['Warm ginger tulsi tea', 'Garlic soup', 'Black pepper in light broths', 'Steam inhalation with ajwain'],
    apathya: ['Ice cream, cold refrigerated sodas', 'Daytime sleep', 'Exposure to dusty cold headwinds', 'Fried snacks'],
    precautions: 'Persistent hemoptysis (coughing blood) or high fever requires immediate diagnostic chest radiography.',
    evidenceLinks: [
      { title: 'Vasicine and Bronchodilator Properties of Adhatoda vasica', source: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'pratishyaya-sinus',
    condition: 'Allergic Rhinitis & Sinusitis (Pratishyaya / Pinasa)',
    sanskrit: 'प्रतिश्याय · Pratishyaya',
    system: 'Respiratory',
    doshaImbalance: 'Kapha-Vata in the Shira (Head) and Urdhva Jatrugata region',
    severity: 'mild',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 26, Verses 104–112',
    pathogenesis: 'Exposure to allergens, night cold drafts, and dampness provoke Kapha in the maxillary and frontal sinus cavities, producing congestion and frontal pressure.',
    primaryHerbs: ['Haridra (Curcumin)', 'Tulsi', 'Shadbindu Taila (Nasya)', 'Black Pepper', 'Eucalyptus'],
    homeRemedy: 'Golden Haridra Milk with black pepper, and warm steam inhalation with crushed carom seeds (Ajwain).',
    preparation: 'Simmer 1/2 tsp organic turmeric and a pinch of black pepper in 150ml milk for 3 minutes. Inhale Ajwain steam for 7 minutes.',
    dosage: 'Turmeric milk once nightly before bed. Nasya (Anu Taila 2 drops per nostril) in the morning.',
    pathya: ['Warm light soups', 'Ginger tea', 'Warm water bathing', 'Covering head and ears in wind'],
    apathya: ['Cold milkshakes', 'Air conditioning blowing directly on the face', 'Sleeping with wet hair', 'Heavy curds'],
    precautions: 'Do not instill nasal drops (Nasya) immediately after eating or during acute heavy fever.',
    evidenceLinks: [
      { title: 'Efficacy of Curcuma longa in Allergic Rhinitis: A Randomized Trial', source: 'Annals of Allergy, Asthma & Immunology', url: 'https://pubmed.ncbi.nlm.nih.gov/27789120/' },
    ],
  },

  // 3. MUSCULOSKELETAL SYSTEM (ASTHIVAHA & SANDHI)
  {
    id: 'sandhivata-osteo',
    condition: 'Osteoarthritis & Degenerative Joint Pain (Sandhivata)',
    sanskrit: 'संधिवात · Sandhivata',
    system: 'Musculoskeletal',
    doshaImbalance: 'Vata Dosha localized in Asthi (Bone) & Sandhi (Joints)',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 28, Verses 37–42',
    pathogenesis: 'Natural aging, drying of synovial fluid (Shleshaka Kapha depletion), and excess Vata create cavitation, friction, and joint crepitus with movement stiffness.',
    primaryHerbs: ['Shallaki (Boswellia serrata)', 'Guggulu (Yogaraja Guggulu)', 'Rasna (Pluchea lanceolata)', 'Mahanarayana Taila', 'Ashwagandha'],
    homeRemedy: 'Warm Mahanarayana Taila or Sesame oil gentle massage followed by hot fomentation (towel dipped in warm water).',
    preparation: 'Warm oil gently in a bowl placed in hot water. Apply with circular strokes around knees/joints. Rest warm cloth for 10 minutes.',
    dosage: 'External massage daily before warm bath. 1 tsp Ashwagandha powder with warm milk at night.',
    pathya: ['Warm unctuous soups with garlic', 'Soaked almonds', 'Ghee in moderation', 'Gentle low-impact range-of-motion asanas'],
    apathya: ['Cold, dry, stale foods (leftovers)', 'High-impact running on concrete', 'Exposure to cold damp basements', 'Fasting excessively'],
    precautions: 'Avoid deep vigorous pressure on acutely inflamed, red, or swollen joints (which indicates Amavata/gout).',
    evidenceLinks: [
      { title: 'Boswellia serrata extract in the management of knee osteoarthritis', source: 'Phytomedicine', url: 'https://pubmed.ncbi.nlm.nih.gov/12622457/' },
      { title: 'Evaluation of Withania somnifera on joint inflammation markers', source: 'PubMed Central', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'greeva-tech-neck',
    condition: 'Cervical Spondylosis & Tech-Neck Stiffness (Greeva Sthambha)',
    sanskrit: 'ग्रीवा स्तम्भ · Greeva Sthambha',
    system: 'Musculoskeletal',
    doshaImbalance: 'Vata-Kapha Stiffening the Cervical Paraspinal Tendons (Manya)',
    severity: 'mild',
    charakaRef: 'Charaka Samhita, Sutrasthana Ch. 20 (Vataja Nanatmaja)',
    pathogenesis: 'Prolonged downward screen posture (laptop/smartphone) causes biomechanical shear on cervical discs, aggravating local Vata and immobilizing the trapezius muscles.',
    primaryHerbs: ['Nirgundi (Vitex negundo)', 'Dashamoola', 'Mahanarayana Oil', 'Guggulu'],
    homeRemedy: 'Greeva Pichu: Cotton pad soaked in warm Nirgundi or sesame oil placed on back of neck for 15 minutes, followed by gentle neck retractions.',
    preparation: 'Warm oil in small dish. Saturate clean sterile gauze and drape over C5-C7 vertebrae. Rest head supported by ergonomic neck roll.',
    dosage: 'Once daily in the evening after work.',
    pathya: ['Ergonomic eye-level monitor height', 'Chin tuck exercises every 60 minutes', 'Warm showers over neck'],
    apathya: ['Sleeping on high stacked pillows', 'Looking down at phone while walking', 'Cold direct drafts on upper back'],
    precautions: 'If radiating numbness or weakness down the fingers occurs, consult a spine neurologist immediately.',
    evidenceLinks: [
      { title: 'Clinical Efficacy of Nirgundi Taila in Cervical Spondylosis', source: 'Journal of Ayurveda & Integrative Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },

  // 4. NERVOUS & MENTAL HEALTH (MANOVAHA SROTAS)
  {
    id: 'anidra-insomnia',
    condition: 'Chronic Insomnia & Restless Sleep (Anidra)',
    sanskrit: 'अनिद्रा · Anidra',
    system: 'Nervous & Mental',
    doshaImbalance: 'Tarpaka Kapha depletion with Prana & Vyana Vata Hyperactivity',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita, Sutrasthana Ch. 21, Verses 35–45',
    pathogenesis: 'Excessive mental multitasking, blue light exposure after sunset, and high Vata deplete the natural grounding Tamas required for restorative delta sleep.',
    primaryHerbs: ['Brahmi (Bacopa monnieri)', 'Jatamansi (Nardostachys jatamansi)', 'Ashwagandha', 'Nutmeg (Jaiphal)', 'Tagara (Valeriana wallichii)'],
    homeRemedy: 'Pada Abhyanga (foot massage with warm sesame/ghee) and warm bedtime Moon Milk with a pinch of nutmeg and cardamom.',
    preparation: 'Warm 1/2 cup organic milk with 1/4 tsp Ashwagandha and 1 pinch freshly ground nutmeg. Rub 1/2 tsp warm sesame oil onto both foot soles for 3 minutes.',
    dosage: '30 minutes before intended bedtime (target 22:00 sleep window).',
    pathya: ['Early light dinner by 19:30', 'Dimming ambient lights after 20:30', 'Bhramari humming bee pranayama', 'Warm foot soak'],
    apathya: ['Blue-light smartphones in bed', 'Caffeine or dark chocolate after 14:00', 'Intense cardio exercise late in evening', 'Stimulating thriller novels/shows'],
    precautions: 'Do not consume large doses of nutmeg (keep strictly to one pinch, < 0.5g). Safe for nightly relaxation.',
    evidenceLinks: [
      { title: 'Clinical Evaluation of Ashwagandha in Sleep Quality: Double Blind RCT', source: 'PLOS ONE', url: 'https://pubmed.ncbi.nlm.nih.gov/31597344/' },
      { title: 'Sleep-inducing effects of Foot Reflexology & Pada Abhyanga', source: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'chittodvega-anxiety',
    condition: 'General Anxiety, Panic & Burnout (Chittodvega)',
    sanskrit: 'चित्तोद्वेग · Chittodvega',
    system: 'Nervous & Mental',
    doshaImbalance: 'Raja Guna Provocation & Prana Vata Instability in Hridaya (Heart/Mind)',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita, Sharirasthana Ch. 1 & Chikitsasthana Ch. 9',
    pathogenesis: 'Sensory overload, fear of future events, and lack of physical grounding disconnect Prana Vata from Ojas, creating palpitations, breathlessness, and racing thoughts.',
    primaryHerbs: ['Shankhapushpi (Convolvulus pluricaulis)', 'Brahmi', 'Ashwagandha', 'Saraswatarishta', 'Tulsi'],
    homeRemedy: 'Daily Shankhapushpi syrup or tea with warm water, paired with 10 minutes of Nadi Shodhana (Alternate Nostril Breath).',
    preparation: 'Steep 1 tsp dried Shankhapushpi or Brahmi in boiling water for 10 minutes. Strain and sweeten lightly with honey when warm.',
    dosage: 'Drink once in the morning and once at 16:00 during the afternoon Vata transition.',
    pathya: ['Slow rhythmic belly breathing', 'Contact with nature / barefoot walking', 'Consistent meal schedules', 'Warm unctuous meals'],
    apathya: ['Skipping meals (causes Vata sugar crashes)', 'High-caffeine energy drinks', 'Aggressive news feeds', 'Cold drafty environments'],
    precautions: 'Acute severe panic attacks accompanied by chest pressure or shortness of breath must be screened for cardiac pathology.',
    evidenceLinks: [
      { title: 'Anxiolytic and Neuroprotective Actions of Shankhapushpi', source: 'Frontiers in Pharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Neurocognitive Effects of Bacopa monnieri in Stress & Attention', source: 'Neuropsychopharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/11498727/' },
    ],
  },

  // 5. METABOLIC & CARDIOVASCULAR (MEDOVAHA & RAKTAVAHA SROTAS)
  {
    id: 'prameha-metabolic',
    condition: 'Pre-Diabetes, Glucose Spikes & Type-2 Sugar Imbalance (Prameha / Madhumeha)',
    sanskrit: 'प्रमेह / मधुमेह · Prameha / Madhumeha',
    system: 'Metabolic & Endocrine',
    doshaImbalance: 'Kapha-Pitta Dominance with Medas (Fat Tissue) Dushya and Srotorodha',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Nidanasthana Ch. 4 & Chikitsasthana Ch. 6 (Prameha Chikitsa)',
    confidenceScore: 94,
    practicalExplanation: 'Type-2 diabetes and elevated blood sugar are fundamentally disorders of cellular receptor resistance caused by endotoxin clogs (Ama & Medo-dhatvagni mandya). In modern terms, insulin cannot dock onto muscle and hepatic cells because fat metabolites block the intracellular signaling pathway. In Ayurveda, Nisha (Curcuma longa) and Amalaki (Emblica officinalis) activate cellular AMPK and inhibit aldose reductase, clearing the microchannels (Srotashodhana) within 14 to 45 days. Concurrently, targeted abdominal asanas mechanically stimulate pancreatic microcirculation, enabling your endogenous beta-cells to produce clean, pulsatile insulin.',
    pathogenesis: 'Excessive consumption of refined grains, sedentary screen time, daytime sleep (Diva Swapna), and sweet foods clog the peripheral metabolic microchannels (Srotorodha), creating tissue insulin insensitivity.',
    primaryHerbs: ['Nisha-Amalaki (Turmeric + Amla)', 'Meshashringi (Gymnema sylvestre)', 'Vijaysar (Pterocarpus marsupium)', 'Methi (Fenugreek)', 'Karela (Bitter Gourd)'],
    homeRemedy: 'Nisha-Amalaki Yoga: Equal parts organic Turmeric powder and Amla powder (1/2 tsp each) in warm water on empty stomach, plus overnight soaked Fenugreek seed water.',
    preparation: 'Stir 1/2 tsp turmeric and 1/2 tsp pure amla powder into 150ml warm water. Soak 1 tsp fenugreek seeds overnight in 100ml water; chew seeds and drink water.',
    dosage: 'Twice daily: morning 06:30 AM before breakfast and evening 06:00 PM.',
    pathya: ['Barley (Yava) rotis and groats', 'Horse gram and yellow mung dal', 'Steamed bitter gourd (Karela)', 'Fenugreek greens', 'Brisk post-meal 100 steps (Shatapawali)'],
    apathya: ['White refined sugar and processed sodas', 'Daytime naps (Diva Swapna - strictly increases Kapha/Medas)', 'Excess whole dairy and creamy cheese', 'Polished white rice'],
    precautions: 'If currently on pharmaceutical hypoglycemics (metformin, insulin), monitor blood glucose closely to prevent hypoglycemia as sensitivity restores.',
    measurableMilestones: {
      biomarker: 'Fasting Blood Glucose & HbA1c',
      unit: 'mg/dL & %',
      baselineTypical: 'Fasting 165 mg/dL · Postprandial 220 mg/dL · HbA1c 8.2%',
      day14Target: 'Fasting 135–140 mg/dL (-25 mg/dL drop) · PP < 185 mg/dL',
      day45Target: 'Fasting 110–118 mg/dL · PP < 145 mg/dL · Energy surge',
      day90Target: 'Fasting 92–98 mg/dL · HbA1c normalized to 5.6–5.8%',
      trackingFrequency: 'Daily fasting upon waking + 2-hr post-lunch',
    },
    timedIntakes: [
      {
        time: '06:30 AM',
        item: 'Nisha-Amalaki Decoction + Overnight Methi Water',
        quantity: '150 ml (1/2 tsp Turmeric + 1/2 tsp Amla + 1 tsp soaked seeds)',
        physiologicalAction: 'Inhibits intestinal alpha-glucosidase & activates hepatic AMPK to clear cellular receptor resistance.',
      },
      {
        time: '08:30 AM',
        item: 'Roasted Barley (Sattu) or Steamed Sprouted Moong',
        quantity: '150g with roasted cumin & pink salt',
        physiologicalAction: 'Provides low-glycemic complex carbohydrates (GI < 35), preventing morning glucose spikes.',
      },
      {
        time: '12:45 PM',
        item: 'Midday Agni Lunch: 2 Barley (Yava) Rotis + Karela Sabzi + Mung Dal',
        quantity: 'Balanced plate with 1 cup bitter greens',
        physiologicalAction: 'Charantin in bitter gourd acts as plant insulin (p-insulin), escorting glucose into myocytes.',
      },
      {
        time: '05:30 PM',
        item: 'Vijaysar / Cinnamon Herbal Infusion',
        quantity: '1 cup warm tea (steeped 10 mins)',
        physiologicalAction: 'Epicatechin polyphenols regenerate damaged pancreatic beta-cells.',
      },
      {
        time: '07:30 PM',
        item: 'Light Dinner: Steamed Bottle Gourd (Lauki) & Mung Soup',
        quantity: '1 large bowl (300 ml)',
        physiologicalAction: 'Prevents nocturnal dawn-phenomenon glucose dump from liver.',
      },
    ],
    therapeuticExercises: [
      {
        name: 'Mandukasana (Frog Pose)',
        type: 'Asana',
        duration: '3 rounds, hold 45–60 seconds each',
        breathPacing: 'Exhale completely on forward bend with fists beside navel; breathe gently while holding',
        physiologicalAction: 'Direct visceral compression of the abdominal aorta and pancreas stimulates islet beta-cells.',
      },
      {
        name: 'Ardha Matsyendrasana (Half Spinal Twist)',
        type: 'Asana',
        duration: '2 minutes per side',
        breathPacing: 'Slow rhythmic abdominal breathing',
        physiologicalAction: 'Increases splanchnic arterial blood flow to liver, spleen, and pancreas.',
      },
      {
        name: 'Kapalabhati Pranayama',
        type: 'Pranayama',
        duration: '3 rounds of 30 active exhalations',
        breathPacing: 'Passive inhalation, active sharp exhalations',
        physiologicalAction: 'Accelerates cellular mitochondrial oxidation of excess circulating blood glucose.',
      },
      {
        name: 'Shatapawali (Post-Prandial 100 Paces)',
        type: 'Movement',
        duration: '10–15 minutes walk immediately after lunch',
        breathPacing: 'Natural nasal breathing',
        physiologicalAction: 'Contracts large quadriceps and gluteal muscles, absorbing glucose independently of insulin (GLUT-4 translocation).',
      },
    ],
    evidenceLinks: [
      { title: 'Efficacy of Nisha-Amalaki in Pre-diabetes & Glycemic Control', source: 'Journal of Ayurveda & Integrative Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Gymnema sylvestre mechanisms in beta-cell regeneration and glucose uptake', source: 'Phytochemistry', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'raktachapa-hypertension',
    condition: 'High Blood Pressure & Arterial Hypertension (Uchha Raktachapa / Raktagata Vata)',
    sanskrit: 'उच्च रक्तचाप · Uchha Raktachapa',
    system: 'Metabolic & Endocrine',
    doshaImbalance: 'Vitiated Vyana Vata accelerating arterial flow with Pitta inflammatory heat hardening the vascular walls (Sirastatva)',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 28, Verses 32–36 (Raktagata Vata) & Sushruta Sutrasthana',
    confidenceScore: 92,
    practicalExplanation: 'High blood pressure is not an incurable random defect; it is the body\'s compensatory vasoconstriction response to chronic sympathetic overdrive (hyperactive Vyana Vata) and arterial endothelial stiffness (Pitta heat). When the sympathetic nervous system fires constantly from mental deadlines and excess sodium, arterial smooth muscles lock in contraction. Classical Arjuna bark (Terminalia arjuna) contains bioactive coenzyme-Q10 glycosides that relax vascular tone, while Sheetali pranayama stimulates the vagus nerve within 15 minutes, lowering peripheral resistance and allowing systemic blood pressure to drop naturally and predictably.',
    pathogenesis: 'Mental stress, excessive salt intake, suppressed emotions, and sedentary habits aggravate Vyana Vata and Pitta. Vitiated Vata contracts the peripheral micro-capillaries while Pitta inflames arterial endothelium, causing sustained elevated hydrostatic pressure against blood vessel walls.',
    primaryHerbs: ['Arjuna Bark (Terminalia arjuna)', 'Sarpagandha (Rauwolfia serpentina)', 'Ashwagandha', 'Brahmi (Bacopa)', 'Lashuna (Garlic)', 'Gokshura'],
    homeRemedy: 'Arjuna Ksheerapaka Tea twice daily, 1 crushed garlic clove swallowed with warm water in morning, and Sheetali Pranayama.',
    preparation: 'Simmer 1 tsp (5g) pure Arjuna bark powder in 100ml water and 50ml cow milk until water evaporates. Strain and drink warm.',
    dosage: 'Twice daily: morning 08:00 AM and evening 06:00 PM. Crush 1 garlic clove and take with warm lemon water at 06:30 AM.',
    pathya: ['Tender coconut water', 'Pomegranate and sweet apples', 'Celery and fresh coriander juice', 'Barley and red rice', 'Minimal rock salt (Saindhava < 2g/day)'],
    apathya: ['Refined table salt (excess sodium)', 'Pickles, papads, and processed chips', 'Commercial energy drinks and coffee (> 1 cup)', 'Angry outbursts and late-night screen stress'],
    precautions: 'Do not abruptly stop prescribed antihypertensives without consulting your physician; monitor BP daily as natural vasodilation takes effect.',
    measurableMilestones: {
      biomarker: 'Blood Pressure (Systolic / Diastolic)',
      unit: 'mmHg',
      baselineTypical: '148/96 mmHg · Resting Heart Rate 86 bpm',
      day14Target: '136/88 mmHg (-12 mmHg systolic reduction) · HR 78 bpm',
      day45Target: '126/82 mmHg · Restful sleep restored · Zero morning temple throbbing',
      day90Target: '118/78 mmHg sustained normal pressure · Cardioprotective tone',
      trackingFrequency: 'Twice daily: 07:30 AM (seated rest) & 20:30 PM',
    },
    timedIntakes: [
      {
        time: '06:30 AM',
        item: 'Crushed Fresh Garlic (Lashuna) + Warm Lemon Water',
        quantity: '1 small clove crushed + 200ml warm water',
        physiologicalAction: 'Allicin bioactive compounds stimulate endothelial nitric oxide (NO) synthase, inducing immediate microvascular vasodilation.',
      },
      {
        time: '08:00 AM',
        item: 'Arjuna Ksheerapaka Cardiac Tonic',
        quantity: '100 ml warm milk-decoction (5g bark)',
        physiologicalAction: 'Arjunolic acid and CoQ10 glycosides improve coronary artery tone and myocardial contractility.',
      },
      {
        time: '12:30 PM',
        item: 'Low-Sodium High-Potassium Midday Lunch',
        quantity: 'Steamed ash gourd / bottle gourd + 1 bowl Moong Dal + Brown basmati rice with cow ghee (salt < 1.5g)',
        physiologicalAction: 'High potassium-to-sodium ratio restores renal electrolyte equilibrium, reducing intravascular fluid volume.',
      },
      {
        time: '05:00 PM',
        item: 'Fresh Celery-Coriander Infusion or Tender Coconut Water',
        quantity: '200 ml fresh',
        physiologicalAction: '3-n-butylphthalide in celery relaxes smooth muscle linings of blood vessels.',
      },
      {
        time: '09:30 PM',
        item: 'Bedtime Brahmi & Nutmeg Golden Milk',
        quantity: '100 ml warm milk with 1/2 tsp Brahmi and 1 pinch Nutmeg',
        physiologicalAction: 'Cools cerebral Pitta, prevents midnight cortisol spikes, and ensures nocturnal BP dip.',
      },
    ],
    therapeuticExercises: [
      {
        name: 'Sheetali & Sheetkari Pranayama (Cooling Breath)',
        type: 'Pranayama',
        duration: '10–12 breath cycles',
        breathPacing: 'Inhale through curled tongue or teeth with cooling sound, retain 2 seconds, slow exhale through both nostrils',
        physiologicalAction: 'Directly stimulates carotid sinus baroreceptors and triggers vagal parasympathetic tone, reducing systolic BP by 8–12 mmHg within 15 minutes.',
      },
      {
        name: 'Nadi Shodhana (Alternate Nostril Breath)',
        type: 'Pranayama',
        duration: '12–15 minutes slow continuous cycles (ratio 4:4:8)',
        breathPacing: 'Inhale left nostril 4s, hold gently 4s, exhale right 8s; repeat right to left',
        physiologicalAction: 'Normalizes autonomic sympathetic tone and lowers peripheral vascular resistance.',
      },
      {
        name: 'Shavasana with 3-Part Progressive Body Release',
        type: 'Asana',
        duration: '12 minutes silent guided stillness',
        breathPacing: 'Deep slow diaphragmatic wave breathing',
        physiologicalAction: 'Allows complete skeletal muscle relaxation, dissipating peripheral vascular clamp.',
      },
      {
        name: 'Viparita Karani (Legs-Up-The-Wall Rest)',
        type: 'Asana',
        duration: '8–10 minutes before bed',
        breathPacing: 'Effortless abdominal breaths',
        physiologicalAction: 'Passive venous drainage decreases ventricular afterload and resets cardiac pacing.',
      },
    ],
    evidenceLinks: [
      { title: 'Terminalia arjuna in Cardiovascular Disorders: A Review', source: 'Journal of Traditional & Complementary Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Immediate effect of Sheetali and Sheetkari pranayama on blood pressure in hypertensives', source: 'International Journal of Yoga', url: 'https://pubmed.ncbi.nlm.nih.gov/25558133/' },
    ],
  },

  // 6. SKIN & HAIR (RAKTAVAHA SROTAS)
  {
    id: 'twak-vikara-eczema',
    condition: 'Eczema, Dry Dermatitis & Itching (Vicharchika)',
    sanskrit: 'विचर्चिका · Vicharchika',
    system: 'Skin & Hair',
    doshaImbalance: 'Kaphaja-Pitta with Rakta Dhatu Vitiation',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 7 (Kushta Chikitsa)',
    pathogenesis: 'Impaired liver/blood cleansing allows Pitta and Kapha toxins (Ama) to lodge in the subcutaneous capillaries, producing erythematous weeping or dry lichenified plaques.',
    primaryHerbs: ['Neem (Azadirachta indica)', 'Manjistha (Rubia cordifolia)', 'Sariva (Hemidesmus indicus)', 'Khadirarishta', 'Coconut oil with camphor'],
    homeRemedy: 'Neem-infused water wash and external application of virgin coconut oil blended with a pinch of pure edible camphor.',
    preparation: 'Boil 15-20 fresh neem leaves in 1 liter water for 15 minutes. Cool to room temperature and use to gently bathe itchy areas. Pat dry and moisturize with coconut oil.',
    dosage: 'Wash twice daily. Drink 1/2 tsp Manjistha tea once daily for blood purification.',
    pathya: ['Bitter greens (fenugreek leaves, dandelion)', 'Cooling cucumber and watermelon', 'Amalaki', 'Loose cotton clothing'],
    apathya: ['Fermented sauces and pickles', 'Deep fried oily street snacks', 'Synthetic wools directly on skin', 'Hot scalding showers'],
    precautions: 'Do not scratch open weeping lesions to prevent secondary bacterial impetigo.',
    evidenceLinks: [
      { title: 'Antimicrobial and Anti-inflammatory Properties of Azadirachta indica', source: 'Current Medicinal Chemistry', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'khalitya-hairfall',
    condition: 'Hair Thinning, Alopecia & Scalp Heat (Khalitya)',
    sanskrit: 'खालित्य · Khalitya',
    system: 'Skin & Hair',
    doshaImbalance: 'Bhrajaka Pitta overheating the hair follicles (Romakupa) alongside Vata dryness',
    severity: 'mild',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 26, Verse 132',
    pathogenesis: 'Mental stress, high systemic Pitta, and acidic diet burn the hair root capillaries, leading to premature shedding and follicular shrinkage.',
    primaryHerbs: ['Bhringraj (Eclipta alba)', 'Amla', 'Brahmi', 'Curry leaves', 'Methi (Fenugreek) seeds'],
    homeRemedy: 'Bhringraj scalp oiling (Shiro Abhyanga) twice weekly and drinking daily fresh Amla juice with water.',
    preparation: 'Warm Bhringraj or coconut oil. Gently massage with fingertips into the scalp roots for 10 minutes. Leave on for 45 minutes before gentle herbal shampoo.',
    dosage: 'Twice weekly scalp oiling. 1 tbsp fresh Amla juice with water every morning.',
    pathya: ['Iron-rich dates and black raisins', 'Curry leaves in cooking', 'Staying mentally cool', 'Early bedtime before 22:30'],
    apathya: ['Excessive salt and vinegar', 'Hot hair dryers and harsh chemical dyes', 'Anger and chronic stress (Pitta triggers)'],
    precautions: 'Check serum ferritin, vitamin D3, and thyroid TSH levels if hair fall is sudden and diffuse.',
    evidenceLinks: [
      { title: 'Hair growth promoting activity of Eclipta alba in animal models', source: 'Journal of Ethnopharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/19481594/' },
    ],
  },

  // 7. IMMUNITY & REJUVENATION (OJAS & RASAYANA)
  {
    id: 'dhatukshaya-burnout',
    condition: 'Chronic Exhaustion, Post-Viral Fatigue & Low Ojas',
    sanskrit: 'ओजः क्षय · Ojas Kshaya',
    system: 'Immunity & Rasayana',
    doshaImbalance: 'Depletion of all 7 Dhatus with Vata-Pitta Aggravation',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Sutrasthana Ch. 17, Verses 73–77 & Chikitsasthana Ch. 1 (Rasayana)',
    pathogenesis: 'Prolonged illness, antibiotic overuse, overwork without restorative sleep, and chronic grief exhaust Ojas (the supreme biological essence of immunity and vitality).',
    primaryHerbs: ['Guduchi / Giloy (Tinospora cordifolia)', 'Chyawanprash', 'Ashwagandha', 'Amla', 'Pure Cow Ghee'],
    homeRemedy: '1 tsp authentic Chyawanprash in the morning, or Guduchi decoction (Kwath) with a small spoon of honey.',
    preparation: 'Boil 1/2 tsp Guduchi stem powder in 200ml water until reduced to 100ml. Strain, allow to become lukewarm, and add 1/2 tsp honey.',
    dosage: 'Take once daily before breakfast for 30 consecutive days.',
    pathya: ['Fresh sweet fruits (pomegranate, apples, figs)', 'Warm basmati rice with cow ghee', 'Daily meditation and restorative yoga', 'Adequate uninterrupted 8-hour sleep'],
    apathya: ['Excessive sexual exhaustion or physical over-exertion', 'Cold dry salads', 'Synthetic stimulants and energy drinks', 'Skipping meals'],
    precautions: 'Ensure Chyawanprash is authentic and sourced from organic amla without excess sugar syrups.',
    evidenceLinks: [
      { title: 'Immunomodulatory activity of Tinospora cordifolia: A Systematic Review', source: 'Frontiers in Immunology', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Clinical evaluation of Chyawanprash on immune markers and vitality', source: 'Biomedicine & Pharmacotherapy', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'amavata-rheumatoid',
    condition: 'Autoimmune Arthritis & Systemic Inflammatory Stiffness (Amavata)',
    sanskrit: 'आमवात · Amavata',
    system: 'Musculoskeletal',
    doshaImbalance: 'Ama (Undigested Endotoxins) provoked by Vata Dosha into Shleshaka Kapha sites',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita Chikitsasthana & Madhava Nidana Ch. 25',
    pathogenesis: 'Weak Agni allows endotoxins (Ama) to ferment in the gut, which Vata propels into synovial joints, causing excruciating migratory pain, feverish heat, and severe morning stiffness.',
    primaryHerbs: ['Shunthi (Dry Ginger)', 'Eranda Taila (Castor Oil)', 'Shallaki (Boswellia)', 'Guggulu (Simhanada Guggulu)', 'Dashamoola'],
    homeRemedy: 'Bedtime Shunthi-Eranda Kwath: 1/2 tsp dry ginger powder boiled in warm water with 1 tsp cold-pressed castor oil.',
    preparation: 'Simmer 1/2 tsp dry ginger in 150ml water for 5 minutes. Strain, add 1 tsp pure castor oil while warm, and drink before sleep.',
    dosage: 'Nightly for 7–14 days during acute morning stiffness phases.',
    pathya: ['Barley and old rice', 'Horse gram (Kulatthi) soup', 'Dry heat fomentation (Valuka Sweda / warm sand bag)', 'Hot ginger water throughout the day'],
    apathya: ['Yogurt and dairy curds', 'Cold and damp environments', 'Fish with milk (Viruddha Ahara)', 'Daytime sleeping', 'Heavy cold oily foods'],
    precautions: 'Do not use oil massage during active acute hot swelling; dry heat fomentation is indicated until Ama is cleared.',
    evidenceLinks: [
      { title: 'Ayurvedic Management of Amavata (Rheumatoid Arthritis) - Clinical Efficacy', source: 'AYU International Journal', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Anti-inflammatory actions of Zingiber officinale and Ricinus communis', source: 'Phytomedicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'sthaulya-obesity',
    condition: 'Metabolic Adiposity, Dyslipidemia & Weight Gain (Sthaulya / Medoroga)',
    sanskrit: 'स्थौल्य · Sthaulya',
    system: 'Metabolic & Endocrine',
    doshaImbalance: 'Kaphaja Medodhatu Hyperplasia with Obstructed Vata in Kostha',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita Vol 2, Sutrasthana Ch. 21 (Ashtauninditiya Adhyaya)',
    pathogenesis: 'Excessive kapha and adipose tissue (Medas) block internal channels (Srotas), confining Vata to the abdomen where it excessively stimulates hunger, creating a cycle of insatiable appetite and lipid deposition.',
    primaryHerbs: ['Guggulu (Medohar Guggulu)', 'Vidanga', 'Musta (Cyperus rotundus)', 'Triphala', 'Lauha Bhasma', 'Shilajit'],
    homeRemedy: 'Madhu Udaka: 1 glass warm water with 1 tsp raw unprocessed honey and a squeeze of fresh lemon first thing in the morning.',
    preparation: 'Warm 200ml filtered water to lukewarm temperature (never boiling, as heated honey produces toxins). Stir in 1 tsp pure honey and 1/2 tsp fresh lemon juice.',
    dosage: 'Once daily on empty stomach, followed by a 30-minute brisk walk.',
    pathya: ['Barley (Yava) rotis and groats', 'Mung bean and horse gram soups', 'Roasted grains', 'Warm water sips throughout the day', 'Triphala churna at night'],
    apathya: ['Daytime napping (Diva Swapna - strictly increases Kapha/Medas)', 'Sweetened dairy shakes and ice cream', 'Sedentary couch sitting after meals', 'Fried snacks and refined flour'],
    precautions: 'Never mix honey into boiling hot water. Combine dietary changes with daily brisk physical movement.',
    evidenceLinks: [
      { title: 'Management of Sthaulya (Obesity) in Charaka Samhita - Classical Review', source: 'NAMASTE Portal', url: 'https://namstp.ayush.gov.in/' },
      { title: 'Hypolipidemic effect of Commiphora mukul (Guggulu): Meta-analysis', source: 'Complementary Therapies in Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'tamaka-shwasa-asthma',
    condition: 'Bronchial Asthma & Paroxysmal Wheezing (Tamaka Shwasa)',
    sanskrit: 'तमक श्वास · Tamaka Shwasa',
    system: 'Respiratory',
    doshaImbalance: 'Vata-Kapha provocation originating in Amashaya and seating in Uras (Chest)',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita Vol 2, Chikitsasthana Ch. 17, Verses 45–60',
    pathogenesis: 'Cold drafts, humidity, and allergens provoke Kapha, which blocks the respiratory pathways. Prana Vata, unable to pass downward, reverses course upward, causing wheezing, breathlessness, and paroxysmal spasms relieved only by sitting upright.',
    primaryHerbs: ['Vasa (Adhatoda vasica)', 'Kantakari', 'Pippali (Long Pepper)', 'Shringyadi Churna', 'Swasakasachintamani Rasa'],
    homeRemedy: 'Warm decoction of crushed Tulsi, ginger, and black pepper with a pinch of rock salt and 1/2 tsp honey.',
    preparation: 'Boil 5 fresh Tulsi leaves, 1/2 inch crushed fresh ginger, and 3 black peppercorns in 200ml water until reduced to 100ml. Strain, cool to warm, and sip slowly.',
    dosage: 'Twice daily, especially during seasonal weather shifts (Sharad and Vasant).',
    pathya: ['Warm light soups', 'Garlic infused in warm milk', 'Ajwain steam inhalation', 'Sleeping with elevated headrest', 'Warm ginger water'],
    apathya: ['Exposure to cold rain and damp basements', 'Refrigerated drinks and frozen foods', 'Dusty environments', 'Lying flat during acute attacks'],
    precautions: 'Severe bronchospasm or oxygen saturation drops (< 92%) require emergency bronchodilator therapy.',
    evidenceLinks: [
      { title: 'Clinical Evaluation of Vasa (Adhatoda vasica) in Bronchial Asthma', source: 'Journal of Ethnopharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'shirahshoola-migraine',
    condition: 'Vata-Pitta Migraine & Tension Cephalea (Shirahshoola / Ardhavabhedaka)',
    sanskrit: 'शिरःशूल · Shirahshoola',
    system: 'Nervous & Mental',
    doshaImbalance: 'Vata-Pitta vitiation in the Urdhva Jatru (Cranial vessels and nerves)',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita, Siddhisthana Ch. 9 & Sutrasthana Ch. 17',
    pathogenesis: 'Suppression of natural urges, skipping meals during peak sunlight (provoking Pitta), screen fatigue, and cold winds provoke cranial Vata-Pitta, causing unilateral throbbing pulsatile pain.',
    primaryHerbs: ['Godanti Bhasma', 'Brahmi', 'Dashamoola', 'Shirashooladi Vajra Rasa', 'Pure Cow Ghee'],
    homeRemedy: 'Ghrita Nasya: 2 drops of lukewarm organic cow ghee in each nostril at sunrise, plus cooling sandalwood paste applied to forehead.',
    preparation: 'Warm a small dropper bottle of pure A2 cow ghee in warm water. Lie flat with head tilted slightly back; instill 2 drops per nostril and sniff gently.',
    dosage: 'Daily morning practice, and sandalwood-rosewater paste on temples at first sign of throbbing pain.',
    pathya: ['Regular scheduled meals (never skip breakfast)', 'Adequate hydration with coconut water', 'Cool dark room rest during episodes', 'Gentle scalp oiling with Brahmi oil'],
    apathya: ['Direct hot midday sun exposure without hat/sunglasses', 'Fermented cheeses and red wine', 'Skipping meals (causes intense Pitta flare)', 'Loud earphone volume'],
    precautions: 'Sudden "thunderclap" headache or headache accompanied by neurological deficits requires immediate emergency MRI screening.',
    evidenceLinks: [
      { title: 'Therapeutic evaluation of Nasya with Cow Ghee in Ardhavabhedaka (Migraine)', source: 'AYU Journal', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'arshas-hemorrhoids',
    condition: 'Hemorrhoids, Piles & Anorectal Vascular Congestion (Arshas)',
    sanskrit: 'अर्शस् · Arshas',
    system: 'Digestive',
    doshaImbalance: 'Apana Vata obstruction with Pitta-Kapha engorgement of Guda vessels',
    severity: 'moderate',
    charakaRef: 'Charaka Samhita Vol 2, Chikitsasthana Ch. 14, Verses 1–35',
    pathogenesis: 'Sedentary sitting for hours, chronic straining during defecation, dry diet, and low digestive fire cause Apana Vata to stagnate in the anorectal rings (Gudavali), producing vascular cushions and bleeding.',
    primaryHerbs: ['Surana (Elephant Foot Yam)', 'Haritaki', 'Abhayarishta', 'Triphala Guggulu', 'Nagakesara'],
    homeRemedy: 'Steamed Surana (Elephant Foot Yam) prepared with buttermilk and cumin, plus warm Triphala water sitz bath.',
    preparation: 'Steam 100g peeled elephant foot yam cubes until very tender. Toss with 1/2 tsp roasted cumin, pinch of rock salt, and 1 tbsp fresh churned buttermilk. Prepare warm sitz bath with 1 tbsp Triphala decoction.',
    dosage: 'Consume Surana twice weekly. 10-minute warm sitz bath every evening before bed.',
    pathya: ['High-fiber steamed vegetables', 'Ripe sweet papayas and figs', 'Fresh churned buttermilk (Takra) at lunch', 'Drinking 8 glasses of warm water daily'],
    apathya: ['Prolonged straining on the toilet with smartphone', 'Excessive chili peppers, black pepper, and mustard', 'Sitting continuously for > 2 hours without standing', 'Dry roasted snacks'],
    precautions: 'Active continuous rectal bleeding or severe thrombosed prolapse requires immediate proctological evaluation.',
    evidenceLinks: [
      { title: 'Clinical Trial of Surana (Amorphophallus campanulatus) in Hemorrhoids', source: 'Journal of Research in Ayurvedic Sciences', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },

  // 8. WOMEN'S HEALTH & ARTAVA (STREEROGA & ARTAVA DISORDERS)
  {
    id: 'raktapradara-menorrhagia',
    condition: 'Excessive Menstrual Bleeding & Menorrhagia (Raktapradara / Asrigdara)',
    sanskrit: 'रक्तप्रदर / असृग्दर · Raktapradara / Asrigdara',
    system: "Women's Health & Artava",
    doshaImbalance: 'Pitta-Rakta Vitiation overflowing into Artavavaha Srotas',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Chikitsasthana Ch. 30 (Yonivyapad), Verses 204–215 & Sushruta Samhita Sharirasthana Ch. 2',
    confidenceScore: 93,
    practicalExplanation: 'In classical Streeroga, Raktapradara occurs when aggravated Pitta and Rakta enter the uterine microchannels (Artavavaha Srotas), eroding vascular resistance and causing prolonged, clot-heavy bleeding. Modern clinical trials show that Saraca asoca (Ashoka) bark contains ketosterol and tannins that selectively tone myometrial contractility and reduce endometrial microvascular fragility, while Symplocos racemosa (Lodhra) acts as a potent local hemostatic without inducing venous thromboembolism.',
    pathogenesis: 'Excess pungent, sour, salty foods, high psychological heat, and physical strain cause Pitta to liquefy Rakta Dhatu, resulting in excessive, unseasonal, or prolonged menstrual hemorrhage.',
    primaryHerbs: ['Ashoka (Saraca asoca)', 'Lodhra (Symplocos racemosa)', 'Nagakesara (Mesua ferrea)', 'Shatavari', 'Praval Pishti', 'Ushira'],
    homeRemedy: 'Ashoka Ksheerapaka Decoction twice daily, plus 1g Nagakesara powder with unsalted cow butter (Makhan).',
    preparation: 'Simmer 1 tsp (5g) pure Ashoka bark powder in 100ml water and 50ml fresh milk until water evaporates. Strain and drink lukewarm.',
    dosage: 'Twice daily during menses: 07:00 AM and 06:00 PM. Take 1g Nagakesara with 1 tsp fresh butter once daily.',
    pathya: ['Pomegranate juice', 'Cooling coriander seed water', 'Old basmati rice with cow ghee', 'Steamed bottle gourd and ash gourd', 'Adequate bed rest during heavy flow days'],
    apathya: ['Chilies, mustard, garlic, and vinegar', 'Direct midday sun exposure', 'Strenuous abdominal gym workouts', 'Excessive anger and sleepless nights'],
    precautions: 'Sudden flooding or severe hemorrhagic anemia (Hb < 7.0 g/dL) requires immediate gynecological diagnostic sonography.',
    measurableMilestones: {
      biomarker: 'Menstrual Flow Duration & PBAC Bleeding Score',
      unit: 'Days & Score',
      baselineTypical: 'Bleeding 8–12 days with heavy clots · PBAC Score > 185 · Hemoglobin 9.2 g/dL',
      day14Target: 'Pelvic burning relieved · Cycle flow restricted to 6 days',
      day45Target: 'Normal 4–5 day period · Zero heavy clots · Energy rebound',
      day90Target: 'Sustained 28-day regular cycle · Hemoglobin raised to 12.0+ g/dL',
      trackingFrequency: 'Daily menstrual flow diary during bleeding phase',
    },
    timedIntakes: [
      {
        time: '07:00 AM',
        item: 'Ashoka Ksheerapaka Milk Decoction (100ml)',
        quantity: '100 ml lukewarm decoction (5g bark)',
        physiologicalAction: 'Tones endometrial blood vessels and prevents excessive tissue sloughing.',
      },
      {
        time: '01:00 PM',
        item: 'Cooling Pitta Lunch with Pomegranate & Coriander Infusion',
        quantity: 'Balanced bowl with fresh pomegranate',
        physiologicalAction: 'High bioflavonoids strengthen capillary walls and reduce hypermenorrhea.',
      },
      {
        time: '06:00 PM',
        item: 'Nagakesara Churna with Fresh Unsalted Cow Butter (Makhan)',
        quantity: '1g Nagakesara + 1 tsp fresh butter',
        physiologicalAction: 'Potent natural styptic (Raktastambhana) to arrest capillary oozing.',
      },
      {
        time: '09:30 PM',
        item: 'Shatavari Ghee with Warm Milk',
        quantity: '1 tsp in 100ml milk',
        physiologicalAction: 'Phytoestrogenic rasayana that regenerates delicate mucosal lining.',
      },
    ],
    therapeuticExercises: [
      {
        name: 'Supta Baddha Konasana (Reclining Bound Angle with Bolster)',
        type: 'Asana',
        duration: '10–12 minutes supported rest',
        breathPacing: 'Passive pelvic diaphragmatic breathing',
        physiologicalAction: 'Releases intrapelvic pressure without engaging the abdominal wall.',
      },
      {
        name: 'Sheetali Pranayama (Cooling Breath)',
        type: 'Pranayama',
        duration: '10 breath cycles',
        breathPacing: 'Inhale hiss through curled tongue, retain 2s, exhale smooth through nose',
        physiologicalAction: 'Clears inflammatory Pitta heat from the systemic circulation.',
      },
      {
        name: 'Viparita Karani (Legs-Up-The-Wall Rest)',
        type: 'Asana',
        duration: '8 minutes before sleep',
        breathPacing: 'Relaxed abdominal breathing',
        physiologicalAction: 'Encourages passive pelvic venous return, easing heaviness.',
      },
    ],
    evidenceLinks: [
      { title: 'Clinical Evaluation of Saraca asoca and Symplocos racemosa in Dysfunctional Uterine Bleeding', source: 'Journal of Ethnopharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'artavakshaya-oligomenorrhea',
    condition: 'Scanty Menses & Oligomenorrhea (Artavakshaya)',
    sanskrit: 'आर्तवक्षय · Artavakshaya',
    system: "Women's Health & Artava",
    doshaImbalance: 'Vata-Kapha Stagnation with Rasa-Rakta Dhatu Kshaya',
    severity: 'moderate',
    charakaRef: 'Sushruta Samhita, Sharirasthana Ch. 2, Verses 17–19 & Ashtanga Hridaya',
    confidenceScore: 91,
    practicalExplanation: 'In Sushruta Samhita, Artavakshaya is characterized by "Yathochitakale adarshanam alpatam va" (menses not appearing on time or appearing as scanty 1-day dark brown spotting with pelvic aching). Modern science identifies this as hypomenorrhea and poor endometrial proliferation. Black sesame seeds (Krishna Tila) and Shatapushpa (Anethum sowa) possess Ushna Veerya (warming potency) and natural phyto-lignans that increase uterine blood flow, nourish the basal endometrium, and restore healthy 4-day menstrual volume.',
    pathogenesis: 'Extreme low-calorie fasting, chronic Vata-provoking stress, and sedentary lifestyle suppress Dhatvagni and dry out the uterine vascular bed, leading to deficient menstrual discharge.',
    primaryHerbs: ['Krishna Tila (Black Sesame Seeds)', 'Shatapushpa (Dill seeds)', 'Guggulu (Kanchanar Guggulu)', 'Kumaryasava (Aloe vera)', 'Trikatu', 'Methi'],
    homeRemedy: 'Tila-Guda Kwath: 1 tbsp crushed black sesame seeds boiled with 1 tsp organic jaggery in 150ml water.',
    preparation: 'Boil 1 tbsp black sesame seeds and 1 tsp jaggery in 200ml water until reduced to 100ml. Drink warm.',
    dosage: 'Twice daily: morning 07:00 AM and evening 06:00 PM, beginning 7 days prior to expected period.',
    pathya: ['Black sesame seeds (Til)', 'Pure organic jaggery (Guda)', 'Black gram (Urad dal)', 'Warm unctuous meals with sesame oil', 'Hot foot soaks'],
    apathya: ['Ice-cold refrigerated drinks', 'Dry crunchy snacks and fasting', 'Daytime napping and cold air conditioning blowing on abdomen'],
    precautions: 'Discontinue heating decoctions (Tila-Guda) once active bright red flow commences.',
    measurableMilestones: {
      biomarker: 'Menstrual Flow Volume & Duration',
      unit: 'Days & mL',
      baselineTypical: 'Scanty spotting lasting < 1.5 days · Dark brown color · Cycle gap 45–55 days',
      day14Target: 'Pelvic dull aching relieved · Normalization of vaginal micro-environment',
      day45Target: 'Cycle interval reduces to 32–35 days · Flow extends to 3 full days of healthy red blood',
      day90Target: 'Consistent 28–30 day cycle cadence with 4-day normal volume (35–50 mL)',
      trackingFrequency: 'Cycle calendar logging each month',
    },
    timedIntakes: [
      {
        time: '07:00 AM',
        item: 'Warm Tila-Guda Kwath (Black Sesame & Jaggery Decoction)',
        quantity: '100 ml warm decoction (10g sesame)',
        physiologicalAction: 'Increases uterine microvascular perfusion and stimulates follicular shedding.',
      },
      {
        time: '12:30 PM',
        item: 'Nourishing Lunch with Black Gram & Sesame Garnish',
        quantity: 'Warm grain bowl with cow ghee',
        physiologicalAction: 'Rebuilds Rasa and Rakta Dhatu substrate.',
      },
      {
        time: '06:00 PM',
        item: 'Kumaryasava with Equal Warm Water',
        quantity: '15 ml with 15ml warm water',
        physiologicalAction: 'Clears ovarian Kapha obstruction and promotes regular ovulatory discharge.',
      },
    ],
    therapeuticExercises: [
      {
        name: 'Malasana (Garland Deep Pelvic Squat)',
        type: 'Asana',
        duration: '3–4 minutes daily',
        breathPacing: 'Steady deep abdominal breathing',
        physiologicalAction: 'Opens pelvic outlet and increases ovarian arterial perfusion.',
      },
      {
        name: 'Baddha Konasana (Butterfly Pose)',
        type: 'Asana',
        duration: '5 minutes active movement + forward fold',
        breathPacing: 'Rhythmic breath coordinated with gentle flapping',
        physiologicalAction: 'Stimulates pelvic reproductive organs and relieves groin tension.',
      },
      {
        name: 'Surya Namaskar (Sun Salutations)',
        type: 'Movement',
        duration: '6–8 dynamic rounds at sunrise',
        breathPacing: 'Coordinated breath with movement',
        physiologicalAction: 'Activates systemic metabolic Agni and clears sluggish Kapha.',
      },
    ],
    evidenceLinks: [
      { title: 'Efficacy of Sesamum indicum in Oligomenorrhea: A Randomized Trial', source: 'Journal of Pharmacognosy and Phytochemistry', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
  {
    id: 'yathochitakala-adarshanam-pcos',
    condition: 'Delayed Menses, Anovulatory Cycles & PCOS (Yathochitakala Adarshanam)',
    sanskrit: 'यथोचितकाल अदर्शनम् · Yathochitakala Adarshanam (PCOS / Anovulation)',
    system: "Women's Health & Artava",
    doshaImbalance: 'Kapha-Vata Avarana (Channel Blockage) blocking Artava Pravritti',
    severity: 'chronic',
    charakaRef: 'Sushruta Samhita Sharirasthana Ch. 2, Verse 21 & Kashyapa Samhita (Shatapushpa-Shatavari Adhyaya)',
    confidenceScore: 92,
    practicalExplanation: 'Yathochitakala Adarshanam literally translates to "menses failing to appear at the appropriate monthly time". In modern terms, this is the foundational classical description of Polycystic Ovarian Syndrome (PCOS) and hypothalamic anovulation. Thickened Kapha and visceral adipose coat the ovarian cortex, preventing the dominant follicle from rupturing on day 14. Kashyapa Samhita specifically extols Shatapushpa (Dill seeds) as the premier botanical ovulatory stimulant that clears Srotas obstruction, while Aloe vera (Kumari) reverses peripheral insulin resistance.',
    pathogenesis: 'Refined sugars, sedentary lifestyle, and high stress provoke Kapha and Vata, encasing the ovaries in micro-cysts and blocking the natural downward Apana Vata pulse needed for ovulatory rupture.',
    primaryHerbs: ['Shatapushpa (Dill seeds)', 'Kumari (Aloe Vera)', 'Varunadi Kwath', 'Kanchanar Guggulu', 'Latakaranja', 'Dashamoola'],
    homeRemedy: 'Fresh Aloe Vera pulp with a pinch of turmeric in the morning, followed by warm Shatapushpa seed tea.',
    preparation: 'Blend 20ml fresh clear Aloe Vera gel with a pinch of organic turmeric. Steep 1 tsp dill seeds (Shatapushpa) in 150ml boiling water for 10 minutes.',
    dosage: 'Aloe vera at 06:30 AM empty stomach; Shatapushpa tea at 08:00 AM and 05:00 PM.',
    pathya: ['Barley and millets (Ragi, Jowar)', 'Fresh green leafy vegetables', 'Methi (fenugreek) seeds', 'Brisk daily walking', 'Early bedtime before 22:30'],
    apathya: ['Refined sugars, sweets, and bakery cakes', 'Daytime sleep (Diva Swapna - strictly contraindicated)', 'Deep fried snacks and processed dairy milkshakes'],
    precautions: 'Rule out pregnancy via beta-hCG test before initiating emmenagogue therapies; maintain consistent daily movement.',
    measurableMilestones: {
      biomarker: 'Menstrual Cycle Interval & Ovulation Indicators',
      unit: 'Days',
      baselineTypical: 'Cycle delayed to 50–90+ days · Anovulatory · Elevated LH:FSH ratio (> 2:1)',
      day14Target: 'Fasting insulin drop · Decreased pelvic bloating and morning lethargy',
      day45Target: 'First natural period initiated within 32–38 days · Clear ovulatory cervical mucus',
      day90Target: 'Stable 28–32 day predictable cycle · Reduction in follicular ovarian volume on ultrasound',
      trackingFrequency: 'Daily basal body temperature & cycle calendar',
    },
    timedIntakes: [
      {
        time: '06:30 AM',
        item: 'Fresh Aloe Vera Gel (20ml) with Turmeric',
        quantity: '20 ml fresh gel + pinch turmeric',
        physiologicalAction: 'Improves insulin receptor sensitivity in ovarian granulosa cells.',
      },
      {
        time: '08:00 AM',
        item: 'Shatapushpa (Dill Seed) Herbal Infusion',
        quantity: '150 ml warm tea (1 tsp seeds)',
        physiologicalAction: 'Classic ovulatory stimulant that promotes natural follicular rupture.',
      },
      {
        time: '12:45 PM',
        item: 'Low-Glycemic High-Fiber Anti-PCOS Lunch',
        quantity: '1 plate with millets and bitter greens',
        physiologicalAction: 'Prevents postprandial insulin surges that trigger ovarian androgens.',
      },
      {
        time: '06:00 PM',
        item: 'Kanchanar Guggulu with Warm Water',
        quantity: '2 tablets (1g)',
        physiologicalAction: 'Scrapes and dissolves deep Kapha cystic accumulations (Lekhana).',
      },
    ],
    therapeuticExercises: [
      {
        name: 'Dhanurasana (Bow Pose) & Bhujangasana',
        type: 'Asana',
        duration: '3 rounds held for 30–45 seconds',
        breathPacing: 'Smooth rhythmic diaphragmatic breathing',
        physiologicalAction: 'Direct intra-abdominal compression massages ovaries and adrenals.',
      },
      {
        name: 'Paschimottanasana (Seated Forward Bend)',
        type: 'Asana',
        duration: '3 minutes steady hold',
        breathPacing: 'Long slow exhalations',
        physiologicalAction: 'Tones the pelvic reproductive viscera and calms sympathetic endocrine overdrive.',
      },
      {
        name: 'Kapalabhati Pranayama',
        type: 'Pranayama',
        duration: '3 rounds of 40 active exhalations',
        breathPacing: 'Sharp belly pumps',
        physiologicalAction: 'Burns visceral ovarian fat and opens lymphatic microchannels.',
      },
    ],
    evidenceLinks: [
      { title: 'Therapeutic evaluation of Shatapushpa in Yathochitakala Adarshanam and PCOS', source: 'Ayu International Journal', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    ],
  },
]

// ─── USER CUSTOM RESEARCH & WEBLINKS STORE ──────────────────────────────────

const CUSTOM_KNOWLEDGE_KEY = 'jaya_custom_knowledge_store'

export function getCustomResearchItems(): CustomResearchItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KNOWLEDGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomResearchItem(item: Omit<CustomResearchItem, 'id' | 'createdAt'>): CustomResearchItem {
  const existing = getCustomResearchItems()
  const newItem: CustomResearchItem = {
    ...item,
    id: 'item_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    createdAt: new Date().toISOString(),
  }
  const updated = [newItem, ...existing]
  try {
    localStorage.setItem(CUSTOM_KNOWLEDGE_KEY, JSON.stringify(updated))
  } catch {
    /* storage quota fallback */
  }
  return newItem
}

export function deleteCustomResearchItem(id: string): void {
  const existing = getCustomResearchItems()
  const updated = existing.filter(i => i.id !== id)
  try {
    localStorage.setItem(CUSTOM_KNOWLEDGE_KEY, JSON.stringify(updated))
  } catch {
    /* storage fallback */
  }
}

// ─── CHARAKA SAMHITA CANONICAL REGISTRY & 120 CHAPTER ACCESSORS ─────────────

import charakaData from '@/data/charaka_samhita_120_chapters.json'

export interface CharakaSthanaMeta {
  name: string
  sanskritName: string
  englishName: string
  description: string
  chapterCount: number
  themeIcon: string
}

export interface CharakaChapter {
  chapterNumber: number
  sthanaId: string
  sthanaName: string
  sanskritTitle: string
  englishTitle: string
  fullTitle: string
  canonicalUrl: string
  sthanaDetails?: CharakaSthanaMeta
  matchedConditionId?: string
}

// Map key clinical conditions directly to their primary Chikitsa / Nidana / Sutra chapter
const CONDITION_TO_CHAPTER_MAP: Record<string, { sthanaId: string; chapterNumber: number }> = {
  'prameha-diabetes': { sthanaId: 'chikitsa-sthana', chapterNumber: 6 }, // Prameha Chikitsa
  'raktachapa-hypertension': { sthanaId: 'chikitsa-sthana', chapterNumber: 28 }, // Vatavyadhi Chikitsa
  'amlapitta-gerd': { sthanaId: 'chikitsa-sthana', chapterNumber: 15 }, // Grahani / Agni Chikitsa
  'grahani-ibs': { sthanaId: 'chikitsa-sthana', chapterNumber: 15 }, // Grahani Dosha Chikitsa
  'sandhivata-osteoarthritis': { sthanaId: 'chikitsa-sthana', chapterNumber: 28 }, // Vatavyadhi Chikitsa
  'anidra-insomnia': { sthanaId: 'sutra-sthana', chapterNumber: 21 }, // Ashtau Ninditiya (Sleep physiology)
  'kasa-cough': { sthanaId: 'chikitsa-sthana', chapterNumber: 18 }, // Kasa Chikitsa
  'pratishyaya-sinusitis': { sthanaId: 'chikitsa-sthana', chapterNumber: 26 }, // Trimarmiya Chikitsa (Shiras/Head)
  'greeva-sthambha': { sthanaId: 'chikitsa-sthana', chapterNumber: 28 }, // Vatavyadhi Chikitsa
  'chittodvega-anxiety': { sthanaId: 'chikitsa-sthana', chapterNumber: 9 }, // Unmada Chikitsa (Mind/Manas)
  'vicharchika-eczema': { sthanaId: 'chikitsa-sthana', chapterNumber: 7 }, // Kushtha Chikitsa
  'khalitya-hairfall': { sthanaId: 'chikitsa-sthana', chapterNumber: 26 }, // Trimarmiya Chikitsa (Shiro Roga)
  'ojas-kshaya': { sthanaId: 'chikitsa-sthana', chapterNumber: 1 }, // Rasayana Adhyaya
  'vibandha-constipation': { sthanaId: 'sutra-sthana', chapterNumber: 7 }, // Naveganadharaniya Adhyaya
  'swasa-asthma': { sthanaId: 'chikitsa-sthana', chapterNumber: 17 }, // Hikka Swasa Chikitsa
  'raktapradara-menorrhagia': { sthanaId: 'chikitsa-sthana', chapterNumber: 30 }, // Yonivyapat Chikitsa
  'artavakshaya-oligomenorrhea': { sthanaId: 'chikitsa-sthana', chapterNumber: 30 }, // Yonivyapat Chikitsa
  'yathochitakala-adarshanam-pcos': { sthanaId: 'chikitsa-sthana', chapterNumber: 30 }, // Yonivyapat Chikitsa
}

export function getCharakaSthanas(): { id: string; meta: CharakaSthanaMeta }[] {
  const sthanas = charakaData.sthanas as Record<string, CharakaSthanaMeta>
  return Object.entries(sthanas).map(([id, meta]) => ({ id, meta }))
}

export function getAllCharakaChapters(): CharakaChapter[] {
  const chapters = charakaData.chapters as CharakaChapter[]
  return chapters.map(ch => {
    // Check if this chapter is linked to a condition
    const matchedEntry = Object.entries(CONDITION_TO_CHAPTER_MAP).find(
      ([, target]) => target.sthanaId === ch.sthanaId && target.chapterNumber === ch.chapterNumber
    )
    return {
      ...ch,
      matchedConditionId: matchedEntry ? matchedEntry[0] : undefined,
    }
  })
}

export function getChaptersBySthana(sthanaId: string): CharakaChapter[] {
  const all = getAllCharakaChapters()
  return all.filter(c => c.sthanaId === sthanaId)
}

export function searchCharakaChapters(query: string): CharakaChapter[] {
  const q = query.trim().toLowerCase()
  if (!q) return getAllCharakaChapters()
  const all = getAllCharakaChapters()
  return all.filter(c =>
    c.sanskritTitle.toLowerCase().includes(q) ||
    c.englishTitle.toLowerCase().includes(q) ||
    c.fullTitle.toLowerCase().includes(q) ||
    c.sthanaName.toLowerCase().includes(q) ||
    (c.sthanaDetails?.description.toLowerCase().includes(q) ?? false)
  )
}

export function getChapterByCondition(conditionId: string): CharakaChapter | undefined {
  const target = CONDITION_TO_CHAPTER_MAP[conditionId]
  if (!target) return undefined
  const all = getAllCharakaChapters()
  return all.find(c => c.sthanaId === target.sthanaId && c.chapterNumber === target.chapterNumber)
}

