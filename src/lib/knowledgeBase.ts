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

export interface EvidenceLink {
  title: string
  source: string
  url: string
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

  // 5. METABOLIC & ENDOCRINE (MEDOVAHA SROTAS)
  {
    id: 'prameha-metabolic',
    condition: 'Pre-Diabetes, Glucose Spikes & Metabolic Fatigue (Prameha)',
    sanskrit: 'प्रमेह · Prameha',
    system: 'Metabolic & Endocrine',
    doshaImbalance: 'Kapha-Pitta Dominance with Medas (Fat Tissue) Dushya',
    severity: 'chronic',
    charakaRef: 'Charaka Samhita, Nidanasthana Ch. 4 & Chikitsasthana Ch. 6',
    pathogenesis: 'Excessive consumption of refined grains, sedentary screen time, daytime sleep (Diva Swapna), and sweet foods clog the peripheral metabolic microchannels (Srotorodha).',
    primaryHerbs: ['Nisha-Amalaki (Turmeric + Amla)', 'Meshashringi (Gymnema sylvestre)', 'Vijaysar (Pterocarpus marsupium)', 'Methi (Fenugreek)', 'Karela'],
    homeRemedy: 'Nisha-Amalaki Yoga: Equal parts organic Turmeric powder and Amla powder (1/2 tsp each) in warm water on empty stomach.',
    preparation: 'Stir 1/2 tsp turmeric and 1/2 tsp pure amla powder into a cup of warm water. Drink 20 minutes prior to morning breakfast.',
    dosage: 'Twice daily before breakfast and dinner.',
    pathya: ['Barley (Yava) rotis or soup', 'Mung beans', 'Bitter gourd (Karela)', 'Fenugreek seeds', 'Brisk 30-minute daily walk'],
    apathya: ['White refined sugar and processed sodas', 'Daytime naps (strictly contraindicated in Kapha)', 'Excess dairy and creamy sauces', 'Polished white rice'],
    precautions: 'If currently on pharmaceutical hypoglycemics (metformin, insulin), monitor blood glucose closely to prevent hypoglycemia.',
    evidenceLinks: [
      { title: 'Efficacy of Nisha-Amalaki in Pre-diabetes & Glycemic Control', source: 'Journal of Ayurveda', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { title: 'Gymnema sylvestre mechanisms in beta-cell regeneration and glucose uptake', source: 'Phytochemistry', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
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
