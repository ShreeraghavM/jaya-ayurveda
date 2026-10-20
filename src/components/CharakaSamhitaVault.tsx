import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CharakaExplorer from './CharakaExplorer'

interface Shloka {
  id: string
  chapter: string
  verse: string
  title: string
  category: 'Dinacharya' | 'Agni & Diet' | 'Ritucharya' | 'Longevity'
  devanagari: string
  transliteration: string
  translation: string
  clinicalApplication: string
  doshaAffinity: 'All' | 'Vata' | 'Pitta' | 'Kapha'
}

const CLASSICAL_SHLOKAS: Shloka[] = [
  {
    id: 'brahma-muhurta',
    chapter: 'Charaka Samhita · Sutrasthana',
    verse: 'Adhyaya 5, Verse 103',
    title: 'Brahma Muhurta — Sacred Waking Window',
    category: 'Dinacharya',
    devanagari: 'ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः ।',
    transliteration: 'Brāhme muhūrte uttiṣṭhet svastho rakṣārtham āyuṣaḥ |',
    translation: 'A healthy person should awaken during the Brahma Muhurta (approximately 96 minutes before sunrise) to preserve and protect longevity.',
    clinicalApplication: 'Atmospheric nascent oxygen (ozone) and Sattvic neuro-calm are highest. Cortisol awakening response occurs smoothly without adrenal shock.',
    doshaAffinity: 'All',
  },
  {
    id: 'matrashiteeya',
    chapter: 'Charaka Samhita · Sutrasthana',
    verse: 'Adhyaya 5, Verse 3-4',
    title: 'Matrashiteeya — The Rule of Digestion (Agni)',
    category: 'Agni & Diet',
    devanagari: 'मात्राशी स्यात् । आहारमात्रा पुनरग्निबलापेक्षिणी ॥',
    transliteration: 'Mātrāśī syāt | Āhāramātrā punar agnibalāpekṣiṇī ||',
    translation: 'One must always eat in measured quantity. The proper measure of food depends upon the strength of the individual digestive fire (Agni).',
    clinicalApplication: 'Fill stomach 1/2 with solid food, 1/4 with liquid, and leave 1/4 empty for the free circulation of Samana Vayu and digestive enzymes.',
    doshaAffinity: 'All',
  },
  {
    id: 'abhyanga',
    chapter: 'Charaka Samhita · Sutrasthana',
    verse: 'Adhyaya 5, Verse 88-89',
    title: 'Abhyanga — Warm Oil Self-Massage',
    category: 'Dinacharya',
    devanagari: 'दृष्टिप्रसादं पुष्टिं च सुखं स्वप्नं सुत्वक्त्वम् । अभ्यङ्गात् सतताभ्यासात् कुर्याद् बलमसंशयम् ॥',
    transliteration: 'Dṛṣṭiprasādaṁ puṣṭiṁ ca sukhaṁ svapnaṁ sutvaktvam | Abhyaṅgāt satatābhyāsāt kuryād balam asaṁśayam ||',
    translation: 'By regular practice of oil massage, the eyes become clear, body nourished, sleep peaceful, skin soft, and overall physical vitality undeniably strengthened.',
    clinicalApplication: 'Warm sesame oil (for Vata) or coconut oil (for Pitta) penetrates the stratum corneum, dampens systemic sympathetic tone, and stimulates oxytocin release.',
    doshaAffinity: 'Vata',
  },
  {
    id: 'gandusha',
    chapter: 'Charaka Samhita · Sutrasthana',
    verse: 'Adhyaya 5, Verse 78',
    title: 'Kavala & Gandusha — Daily Oil Pulling',
    category: 'Dinacharya',
    devanagari: 'हनुबलं स्वरबलं वदनोपचयः परः । रसज्ञानं च दन्तहर्षं च नास्य दन्ताः क्षयं यान्ति ॥',
    transliteration: 'Hanubalaṁ svarabalaṁ vadanopacayaḥ paraḥ | Rasajñānaṁ ca dantaharṣaṁ ca nāsya dantāḥ kṣayaṁ yānti ||',
    translation: 'Holding warm sesame oil in the mouth strengthens jawbones, speech resonance, taste acuity, prevents tooth decay, and roots teeth firmly.',
    clinicalApplication: 'Lipophilic sesame oil saponifies oral plaques, reduces anaerobic Streptococcus mutans bacterial colonies, and supports salivary immunoglobulin.',
    doshaAffinity: 'All',
  },
  {
    id: 'ritucharya',
    chapter: 'Charaka Samhita · Sutrasthana',
    verse: 'Adhyaya 6, Verse 6',
    title: 'Tasyashiteeya — Seasonal Bio-Rhythm Adaptation',
    category: 'Ritucharya',
    devanagari: 'यस्य यस्य हि रूपस्य कालस्योदर्कलक्षणम् । तत्तद् रूपं समासाद्य दोषा वृद्धिं प्रकुर्वते ॥',
    transliteration: 'Yasya yasya hi rūpasya kālasyodarkalakṣaṇam | Tattad rūpaṁ samāsādya doṣā vṛddhiṁ prakurvate ||',
    translation: 'As seasonal qualities change in the environment, corresponding doshas accumulate and provoke inside the human physiology if regimens are not adapted.',
    clinicalApplication: 'Summer (Grishma) increases Pitta heat requiring cooling melons and mint; Autumn (Sharad) purges residual heat; Winter demands nourishing warm soups.',
    doshaAffinity: 'Pitta',
  },
  {
    id: 'swastha',
    chapter: 'Sushruta & Charaka Samhita',
    verse: 'Sutra Sthana 15.41',
    title: 'True Definition of Swastha (Health)',
    category: 'Longevity',
    devanagari: 'समदोषः समाग्निश्च समधातुमलक्रियः । प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते ॥',
    transliteration: 'Samadoṣaḥ samāgniśca samadhātumalakriyaḥ | Prasannātmendriyamanāḥ svastha ityabhidhīyate ||',
    translation: 'One who has balanced doshas, balanced digestive fire, balanced tissue metabolism, balanced excretion, and whose soul, senses, and mind are blissfully joyful is termed Swastha (truly healthy).',
    clinicalApplication: 'Health is not merely the absence of lab pathology, but the active state of energetic equilibrium, digestive clarity, and subjective joy.',
    doshaAffinity: 'All',
  },
]

export default function CharakaSamhitaVault() {
  const [viewMode, setViewMode] = useState<'shlokas' | '120chapters'>('shlokas')
  const [activeFilter, setActiveFilter] = useState<'All' | 'Dinacharya' | 'Agni & Diet' | 'Ritucharya' | 'Longevity'>('All')

  const filtered = activeFilter === 'All'
    ? CLASSICAL_SHLOKAS
    : CLASSICAL_SHLOKAS.filter(s => s.category === activeFilter)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono uppercase">
            Classical Sanskrit Manuscripts
          </Badge>
          <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>📜</span> Charaka Samhita Digital Sthana
          </h3>
          <p className="text-xs text-emerald-400/70">
            Ancient chronobiological principles verified against modern clinical physiology.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 rounded-xl bg-black/50 border border-emerald-900/60 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('shlokas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'shlokas'
                ? 'bg-amber-600/40 text-amber-200 border border-amber-500/50 shadow-sm'
                : 'text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            Key Shlokas
          </button>
          <button
            onClick={() => setViewMode('120chapters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === '120chapters'
                ? 'bg-emerald-600/40 text-emerald-200 border border-emerald-500/50 shadow-sm'
                : 'text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            120 Chapters Explorer
          </button>
        </div>
      </div>

      {viewMode === '120chapters' ? (
        <CharakaExplorer />
      ) : (
        <>
          {/* Category Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {['All', 'Dinacharya', 'Agni & Diet', 'Ritucharya', 'Longevity'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                  activeFilter === cat
                    ? 'bg-amber-600/30 text-amber-200 border-amber-500/60 shadow-sm'
                    : 'bg-black/30 text-emerald-400/60 border-emerald-900/40 hover:text-emerald-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Shloka Cards */}
          <div className="space-y-3">
            {filtered.map(s => (
              <Card
                key={s.id}
                className="p-5 bg-gradient-to-br from-[#0c1c11] to-[#07150c] border border-emerald-800/40 rounded-3xl space-y-3 shadow-lg"
              >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-400/90 font-semibold">{s.chapter} · {s.verse}</span>
              <Badge variant="outline" className="border-emerald-700/40 text-emerald-300 text-[10px]">
                {s.category}
              </Badge>
            </div>

            <h4 className="text-base font-bold text-white tracking-tight">{s.title}</h4>

            {/* Original Sanskrit Verse */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-900/60">
              <p className="text-sm font-medium text-amber-200 font-serif leading-relaxed text-center">
                {s.devanagari}
              </p>
              <p className="text-[11px] text-emerald-400/70 italic text-center mt-1.5 font-mono">
                {s.transliteration}
              </p>
            </div>

            {/* Classical Translation */}
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              <span className="text-emerald-400 font-semibold">Classical Meaning: </span>
              {s.translation}
            </p>

            {/* Modern Clinical Takeaway */}
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300/80">
              <span className="font-semibold text-emerald-200 block mb-1">🔬 Modern Chronobiological Mechanism:</span>
              {s.clinicalApplication}
            </div>
          </Card>
        ))}
      </div>
      </>
      )}
    </div>
  )
}
