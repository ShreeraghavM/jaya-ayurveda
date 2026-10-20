import fs from 'fs';

// Read parsed chapters
const raw = fs.readFileSync('scripts/parsed_all_120_chapters.json', 'utf-8');
const chapters = JSON.parse(raw);

// Enhance chapters with metadata, core themes and clinical tags
const sthanaDetails = {
  'sutra-sthana': {
    name: 'Sutra Sthana',
    sanskritName: 'सूत्रस्थानम्',
    englishName: 'Section on Fundamental Principles',
    description: 'Foundational philosophy of health, 6 tastes (Shad Rasa), daily regimen (Dinacharya), seasonal regimen (Ritucharya), dietetics, non-suppressible natural urges, and the four pillars of healthcare.',
    chapterCount: 30,
    themeIcon: '📜'
  },
  'nidana-sthana': {
    name: 'Nidana Sthana',
    sanskritName: 'निदानस्थानम्',
    englishName: 'Section on Diagnostic Principles & Pathology',
    description: 'Comprehensive etiology, pathogenesis (Samprapti), prodromal symptoms (Poorvaroopa), and clinical manifestations of major diseases (Fever, Diabetes, Skin, Phthisis, etc.).',
    chapterCount: 8,
    themeIcon: '🔬'
  },
  'vimana-sthana': {
    name: 'Vimana Sthana',
    sanskritName: 'विमानस्थानम्',
    englishName: 'Section on Specific Medical Principles & Dietetics',
    description: 'Quantitative pharmacology, dosha assessment, gastric capacity rules, microchannels (Srotas), epidemiology (Janapadodhvamsa), and clinical examination methodology.',
    chapterCount: 8,
    themeIcon: '⚖️'
  },
  'sharira-sthana': {
    name: 'Sharira Sthana',
    sanskritName: 'शारीरस्थानम्',
    englishName: 'Section on Human Anatomy, Embryology & Genesis',
    description: 'Creation of human life, embryogenesis, maternal care, macrocosm-microcosm relationship, anatomical enumerations, and psycho-somatic doshic prakriti.',
    chapterCount: 8,
    themeIcon: '🧬'
  },
  'indriya-sthana': {
    name: 'Indriya Sthana',
    sanskritName: 'इन्द्रियस्थानम्',
    englishName: 'Section on Sensorial Prognosis & Clinical Signs',
    description: 'Prognostic assessment, sensory cues, olfactory/visual changes, aura shifts, and indicators of vitality or terminal state.',
    chapterCount: 12,
    themeIcon: '👁️'
  },
  'chikitsa-sthana': {
    name: 'Chikitsa Sthana',
    sanskritName: 'चिकित्सास्थानम्',
    englishName: 'Section on Therapeutic Principles & Disease Management',
    description: 'The master therapeutic heart of Ayurveda: comprehensive clinical management, herbal formulations, dietary therapy, Rasayana longevity, and Vajikarana fertility for 30 clinical disorders.',
    chapterCount: 30,
    themeIcon: '🌿'
  },
  'kalpa-sthana': {
    name: 'Kalpa Sthana',
    sanskritName: 'कल्पस्थानम्',
    englishName: 'Section on Pharmaceutical Preparations & Formulations',
    description: 'Formulation pharmacy, processing, decoctions, medicated ghee/oils, and safe administration of therapeutic emetics and purgatives.',
    chapterCount: 12,
    themeIcon: '🧪'
  },
  'siddhi-sthana': {
    name: 'Siddhi Sthana',
    sanskritName: 'सिद्धिस्थानम्',
    englishName: 'Section on Therapeutic Procedures & Panchakarma Management',
    description: 'Successful outcomes in Panchakarma (Basti, Vamana, Virechana), prevention of procedural complications, and management of emergencies in vital organs (Marmas).',
    chapterCount: 12,
    themeIcon: '✨'
  }
};

const fullIndex = {
  source: 'Charaka Samhita Online (carakasamhitaonline.com)',
  totalSthanas: 8,
  totalChapters: 120,
  sthanas: sthanaDetails,
  chapters: chapters.map(c => ({
    ...c,
    sthanaDetails: sthanaDetails[c.sthanaId]
  }))
};

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/charaka_samhita_120_chapters.json', JSON.stringify(fullIndex, null, 2));
console.log('Successfully written src/data/charaka_samhita_120_chapters.json with 120 chapters!');
