// src/components/AnimatedJourneyVideo.tsx
// Animated Cinematic Walkthrough: User Journey from Register to Sleep
// Showcasing all features, classical Charaka science, and clinical wellness benefits

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Scene {
  id: number
  timeStr: string
  title: string
  sanskritTitle: string
  icon: string
  phase: 'Registration' | 'Morning Ritual' | 'Activity & Weather' | 'Midday Lunch' | 'Anatomy Twin' | 'Spring Shield' | 'Bedtime Review'
  description: string
  keyFeaturesUsed: string[]
  ayurvedicBenefit: string
  visualGraphic: {
    badgeColor: string
    accentColor: string
    illustrationEmoji: string
    metricHighlight: string
    detailPill: string
  }
}

const JOURNEY_SCENES: Scene[] = [
  {
    id: 1,
    timeStr: 'Day 0 · 08:00 AM',
    title: 'Registration & Prakriti Discovery',
    sanskritTitle: 'प्रकृति परीक्षा (Prakriti Pariksha)',
    icon: '📝',
    phase: 'Registration',
    description:
      'The user begins by discovering their unique mind-body constitution (Prakriti) through classical dosha questions, WHO BMI height-weight calibration, and profession analysis (Software Engineer, Doctor, Teacher).',
    keyFeaturesUsed: [
      '3-Dosha Prakriti Score (Vata-Pitta-Kapha %)',
      'WHO Healthy Weight Band & BMI',
      'Profession-specific movement & screen fatigue countermeasures',
      'Charaka Samhita 120 Chapters indexation',
    ],
    ayurvedicBenefit:
      'Eliminates generic advice. Every single recommendation is now personalized to your individual cellular metabolism.',
    visualGraphic: {
      badgeColor: 'border-emerald-500/60 bg-emerald-950/60 text-emerald-200',
      accentColor: 'from-emerald-600 to-teal-500',
      illustrationEmoji: '🧬',
      metricHighlight: 'Pitta 64% · Vata 21% · Kapha 15%',
      detailPill: 'Normal BMI 24.5 · Desk Engineer Calibrated',
    },
  },
  {
    id: 2,
    timeStr: '05:00 AM',
    title: 'Brahma Muhurta & Morning Dinacharya',
    sanskritTitle: 'ब्राह्मे मुहूर्ते उत्तिष्ठेत् (Brahma Muhurta)',
    icon: '🌅',
    phase: 'Morning Ritual',
    description:
      'Jaya gently wakes the user at the auspicious cosmic hour (45 mins before sunrise) when Vata promotes effortless bowel evacuation and mental clarity. Step-by-step Dinacharya guides oral and sensory detox.',
    keyFeaturesUsed: [
      'Proactive Morning Prompt (No searching needed)',
      'Jihva Nirlekhana (Copper tongue scraping to eliminate Ama)',
      'Ushnodaka (Warm water to spark Jatharagni)',
      'Anu Taila Nasya (Herbal nasal oil to shield the brain and sinuses)',
    ],
    ayurvedicBenefit:
      'Clears metabolic endotoxins (Ama) accumulated overnight, preventing morning brain fog and halitosis.',
    visualGraphic: {
      badgeColor: 'border-amber-500/60 bg-amber-950/60 text-amber-200',
      accentColor: 'from-amber-500 to-orange-500',
      illustrationEmoji: '🧘',
      metricHighlight: '05:00 AM · Vata Phase (Active Cleansing)',
      detailPill: 'Jatharagni Ignited · Micro-Channels Cleared',
    },
  },
  {
    id: 3,
    timeStr: '06:30 AM',
    title: 'Live Weather Shield & Ardha-Shakti Walk/Run',
    sanskritTitle: 'ऋतु अनुकूल व्यायाम (Ritu Vyayama & Ardha-Shakti)',
    icon: '🌦️',
    phase: 'Activity & Weather',
    description:
      'The app checks outdoor weather (24°C, 58% humidity, AQI 65) and environmental Dosha impact. It schedules a morning Prātah-Bhramana walk and run, tracking steps and enforcing the ancient Half-Capacity safety ceiling.',
    keyFeaturesUsed: [
      'Real-Time Weather & Air Quality API (Open-Meteo)',
      'Dosha Climate Aggravation Index (Vata/Pitta/Kapha score)',
      'Pedometer with Dosha-calibrated step targets (7,500 steps)',
      'Ardha-Shakti Heart Rate Safety Zone (50%–70% max HR: 100–135 bpm)',
      '3 Stop Signs: Mouth breathing (Vaktram) & brow sweat alert',
    ],
    ayurvedicBenefit:
      'Protects heart resilience, prevents overtraining muscle breakdown (Mamsa Kshaya), and adapts to climate variations.',
    visualGraphic: {
      badgeColor: 'border-sky-500/60 bg-sky-950/60 text-sky-200',
      accentColor: 'from-sky-500 to-emerald-500',
      illustrationEmoji: '🏃',
      metricHighlight: '4,250 Steps · 185 kcal · Pulse 124 bpm',
      detailPill: 'Outdoor Safe Window · Safe Ardha-Shakti Preserved',
    },
  },
  {
    id: 4,
    timeStr: '12:30 PM',
    title: 'Charaka Ahara Matra & Midday Lunch Peak',
    sanskritTitle: 'त्रिविध कुक्षीयाहार मात्रा (Trividha Kukshi Matra)',
    icon: '🌾',
    phase: 'Midday Lunch',
    description:
      'At noon, the sun and biological Pitta digestive fire (Jatharagni) reach their daily maximum. Jaya calculates exact portion weights based on the stomach division rule from Charaka Vimana 2.',
    keyFeaturesUsed: [
      'Trividha Kukshi Calculator: 1/3 Solid (~270g), 1/3 Liquid (~270ml), 1/3 Empty Space for Tridosha Churning',
      'Desha-Satmya Food Matching: Staple grains tuned to native soil (Anupa, Jangala, Sadharana)',
      'Clinical Red Rice & Barley substitution for high blood sugar',
      'Midday Lunch Peak allocation: 45% of daily TDEE (~1,015 kcal)',
    ],
    ayurvedicBenefit:
      'Eliminates post-lunch lethargy, acid reflux, and heavy bloating by never suffocating the gastric fire.',
    visualGraphic: {
      badgeColor: 'border-emerald-500/60 bg-emerald-950/60 text-emerald-200',
      accentColor: 'from-emerald-500 to-lime-500',
      illustrationEmoji: '🍽️',
      metricHighlight: '1/3 Solid 270g · 1/3 Liquid 270ml · 1/3 Space',
      detailPill: 'Jangala Satmya · Roasted Barley & Moong Peak',
    },
  },
  {
    id: 5,
    timeStr: '03:30 PM',
    title: 'Human Anatomy Twin & Organ Nourishment',
    sanskritTitle: 'शारीरिक स्रोतस् डिजिटल ट्विन (Sharira Srotas Twin)',
    icon: '🧬',
    phase: 'Anatomy Twin',
    description:
      'The user opens their 3D holographic Anatomy Visualizer. 13 organ systems (Circulatory, Digestive, Respiratory, Muscular, Nervous...) display real-time 0% to 100% nourishment levels mapped to Ayurvedic Srotamsi.',
    keyFeaturesUsed: [
      'Interactive Human Anatomy with Light Chart & Dark Hologram Modes',
      'Organ Nourishment % (e.g. Digestive 78%, Circulatory 84%)',
      'Active Disease Beacons: Points out pain, inflammation, or metabolic imbalance',
      'Deficit-Balancing Meal Generator: One tap creates a meal targeting lowest organs',
    ],
    ayurvedicBenefit:
      'Visualizes how daily food turns into the 7 bodily tissues (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra).',
    visualGraphic: {
      badgeColor: 'border-indigo-500/60 bg-indigo-950/60 text-indigo-200',
      accentColor: 'from-indigo-500 to-purple-500',
      illustrationEmoji: '🩻',
      metricHighlight: '13 Systems Tracked · Overall Vigor 82%',
      detailPill: 'Annavaha & Raktavaha Srotas Fully Nourished',
    },
  },
  {
    id: 6,
    timeStr: '05:00 PM',
    title: 'Vasanta Ritu (Spring) Bio-Shield',
    sanskritTitle: 'वसन्त ऋतु चर्या (Vasanta Ritu Defense)',
    icon: '🌸',
    phase: 'Spring Shield',
    description:
      'Spring sun rays melt winter-consolidated Kapha into the stomach, dousing Jatharagni. Jaya alerts the user and adjusts their day to prevent spring hay fever, sinus congestion, and fatigue.',
    keyFeaturesUsed: [
      'Kapha Liquefaction Severity Analyzer (Charaka Sutra 6.22-26)',
      '15% Heavy Fat Reduction & +25% Bitter/Pungent Superfoods',
      'Aged Barley (Yava) & Raw Honey (Madhu) lekhana scraping',
      'Strict Prohibition on Daytime Naps (Diva-swapna Nishiddha)',
      'Udvartana dry powder massage prescription',
    ],
    ayurvedicBenefit:
      'Stops spring seasonal allergies before they start. Maintains razor-sharp focus and zero spring sluggishness.',
    visualGraphic: {
      badgeColor: 'border-rose-500/60 bg-rose-950/60 text-rose-200',
      accentColor: 'from-rose-500 to-pink-500',
      illustrationEmoji: '🛡️',
      metricHighlight: 'Kapha Liquefaction Defense Active',
      detailPill: 'Zero Daytime Naps · Purana Yava Antidote',
    },
  },
  {
    id: 7,
    timeStr: '07:30 PM',
    title: 'Sunset Light Dinner & Calorie Tapering',
    sanskritTitle: 'सायं भोजन (Sayam Bhojana)',
    icon: '🥣',
    phase: 'Midday Lunch',
    description:
      'As the sun sets, digestive fire wanes. Jaya prescribes a light, easily digestible evening meal (25% of TDEE) consumed at least 2.5 hours before sleep to prevent toxin formation.',
    keyFeaturesUsed: [
      'Light Moong Khichdi or vegetable broth',
      'Strict ban on curd/yogurt, heavy red meat, and cheese at night',
      'Golden milk with nutmeg and turmeric for nervous system grounding',
      'Evening wind-down reminder',
    ],
    ayurvedicBenefit:
      'Ensures the stomach finishes digestion before bedtime so cellular repair and immune regeneration (Ojas) can occur.',
    visualGraphic: {
      badgeColor: 'border-amber-600/60 bg-amber-950/60 text-amber-200',
      accentColor: 'from-amber-600 to-emerald-600',
      illustrationEmoji: '🍵',
      metricHighlight: 'Dinner 560 kcal (25% TDEE) · 07:30 PM',
      detailPill: 'Laghu Ahara · 100% Digested Before Sleep',
    },
  },
  {
    id: 8,
    timeStr: '09:30 PM',
    title: 'Bedtime Pain Review & Lab Report Check-in',
    sanskritTitle: 'रात्रि समीक्षा व निद्रा (Nidra & Ratri Samiksha)',
    icon: '🌙',
    phase: 'Bedtime Review',
    description:
      'At bedtime, Jaya asks the user to review the effect of today’s remedies on pain/symptoms, checks medical lab counts (blood sugar, BP), and closes the day with deep restorative sleep.',
    keyFeaturesUsed: [
      'Interactive Bedtime Pain & Cure Tracker (0–10 scale check-in)',
      'Quantitative Lab Report Tracker (HbA1c, Fasting Glucose, BP counts)',
      'Automated daily progress card & tomorrow’s prep',
      'Tratak / Brahmari Pranayama wind-down breathing',
    ],
    ayurvedicBenefit:
      'Completes the feedback loop. Adapts tomorrow’s meals and remedies based on real physical pain relief and clinical numbers.',
    visualGraphic: {
      badgeColor: 'border-indigo-400/60 bg-indigo-950/60 text-indigo-200',
      accentColor: 'from-indigo-600 to-blue-700',
      illustrationEmoji: '✨',
      metricHighlight: 'Pain Score: 6/10 ➔ 2/10 (67% Reduction)',
      detailPill: 'Day Closed with Peace · Deep Nidra Ready',
    },
  },
]

interface Props {
  onClose?: () => void
  onStartDemo?: () => void
}

export default function AnimatedJourneyVideo({ onClose, onStartDemo }: Props) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(6000) // 6 seconds per scene

  const currentScene = JOURNEY_SCENES[currentSceneIndex]

  // Automatic Scene Progression Timer
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentSceneIndex(prev => (prev + 1) % JOURNEY_SCENES.length)
    }, playbackSpeed)

    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed])

  const handleNext = () => {
    setCurrentSceneIndex(prev => (prev + 1) % JOURNEY_SCENES.length)
  }

  const handlePrev = () => {
    setCurrentSceneIndex(prev => (prev === 0 ? JOURNEY_SCENES.length - 1 : prev - 1))
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ─── Top Header & Controls ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-950/40 text-xl shadow-md">
            🎬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">A Day in the Life: Register to Sleep</h2>
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/40 text-[10px] font-mono">
                Interactive Animated Tour
              </Badge>
            </div>
            <p className="text-xs text-emerald-300/70">
              Watch how Jaya Ayurveda guides the user through every hour of the 24-hour cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onStartDemo && (
            <Button
              onClick={onStartDemo}
              size="sm"
              className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
            >
              ⚡ Experience Live App
            </Button>
          )}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="rounded-full text-emerald-400 hover:bg-emerald-900/40"
            >
              ✕ Close
            </Button>
          )}
        </div>
      </div>

      {/* ─── Cinematic Player Screen / Stage ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-700/50 bg-gradient-to-br from-[#06180e] via-[#092215] to-[#041108] p-5 sm:p-7 shadow-2xl">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Top Video Stage Bar */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${isPlaying ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-mono text-emerald-300/80 uppercase tracking-widest text-[11px]">
              {isPlaying ? 'PLAYING SCENE' : 'PAUSED'} {currentScene.id} OF {JOURNEY_SCENES.length}
            </span>
          </div>

          <Badge className={`border text-xs px-2.5 py-0.5 font-semibold ${currentScene.visualGraphic.badgeColor}`}>
            {currentScene.timeStr}
          </Badge>
        </div>

        {/* Main Animated Stage Display */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Column: Narrative & Sanskrit Citations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">{currentScene.icon}</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {currentScene.title}
                </h3>
                <p className="text-xs font-mono text-amber-300/90">{currentScene.sanskritTitle}</p>
              </div>
            </div>

            <p className="text-sm text-emerald-100/90 leading-relaxed font-sans">
              {currentScene.description}
            </p>

            {/* Core Features Used in this Scene */}
            <div className="rounded-2xl bg-black/40 border border-emerald-900/60 p-3.5 space-y-1.5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">
                Active System Features Triggered:
              </p>
              <ul className="space-y-1 text-xs text-emerald-200/90 list-disc list-inside">
                {currentScene.keyFeaturesUsed.map((feat, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="font-medium text-white">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ayurvedic Clinical Benefit */}
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/40 flex items-start gap-2 text-xs text-emerald-200">
              <span className="text-base shrink-0">🌿</span>
              <div>
                <span className="font-bold text-emerald-100">Ayurvedic Health Benefit:</span>{' '}
                <span>{currentScene.ayurvedicBenefit}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Holographic Card for this Scene */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${currentScene.visualGraphic.accentColor} opacity-20 blur-xl`} />
            <Card className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-black/70 p-6 backdrop-blur-xl shadow-2xl text-center space-y-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-400/40 bg-emerald-950/60 text-5xl shadow-inner shadow-emerald-500/20 animate-bounce duration-1000">
                {currentScene.visualGraphic.illustrationEmoji}
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-mono">
                  Real-Time Biometric Metrics
                </p>
                <h4 className="mt-1 text-lg font-bold text-white tracking-tight">
                  {currentScene.visualGraphic.metricHighlight}
                </h4>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-xs font-semibold text-emerald-200">
                {currentScene.visualGraphic.detailPill}
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-400/60 border-t border-emerald-900/60 pt-3">
                <span>Phase: {currentScene.phase}</span>
                <span className="font-mono text-emerald-300">Scene {currentScene.id}/8</span>
              </div>
            </Card>
          </div>
        </div>

        {/* ─── Timeline Scrub Bar & Playback Controls ──────────────────── */}
        <div className="mt-7 border-t border-emerald-900/60 pt-4 space-y-3">
          {/* Progress Timeline Indicator */}
          <div className="grid grid-cols-8 gap-1.5">
            {JOURNEY_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentSceneIndex(idx)
                  setIsPlaying(false)
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSceneIndex
                    ? 'bg-amber-400 shadow-md shadow-amber-400/40'
                    : idx < currentSceneIndex
                    ? 'bg-emerald-600'
                    : 'bg-emerald-950 border border-emerald-900/60'
                }`}
                title={`Scene ${scene.id}: ${scene.title}`}
              />
            ))}
          </div>

          {/* Play/Pause & Scene Jump Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Button
                onClick={() => setIsPlaying(p => !p)}
                size="sm"
                className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-sm"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play Auto-Tour'}
              </Button>
              <Button
                onClick={handlePrev}
                size="sm"
                variant="outline"
                className="h-9 px-3 rounded-xl border-emerald-700/60 text-emerald-200 hover:bg-emerald-900/40"
              >
                ⏮ Prev
              </Button>
              <Button
                onClick={handleNext}
                size="sm"
                variant="outline"
                className="h-9 px-3 rounded-xl border-emerald-700/60 text-emerald-200 hover:bg-emerald-900/40"
              >
                Next ⏭
              </Button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 text-[11px] text-emerald-400/80">
              <span>Scene Speed:</span>
              <button
                onClick={() => setPlaybackSpeed(8000)}
                className={`px-2 py-0.5 rounded-lg ${playbackSpeed === 8000 ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-950/60'}`}
              >
                Slow (8s)
              </button>
              <button
                onClick={() => setPlaybackSpeed(5000)}
                className={`px-2 py-0.5 rounded-lg ${playbackSpeed === 5000 ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-950/60'}`}
              >
                Normal (5s)
              </button>
              <button
                onClick={() => setPlaybackSpeed(3000)}
                className={`px-2 py-0.5 rounded-lg ${playbackSpeed === 3000 ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-950/60'}`}
              >
                Fast (3s)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Scene Strip Grid (Instant Click Access to All 8 Scenes) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {JOURNEY_SCENES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentSceneIndex(idx)
              setIsPlaying(false)
            }}
            className={`p-2.5 rounded-2xl border text-left transition ${
              idx === currentSceneIndex
                ? 'bg-emerald-900/80 border-emerald-400 text-white shadow-md'
                : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300/70 hover:bg-emerald-900/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">{s.icon}</span>
              <span className="text-[11px] font-bold truncate">{s.timeStr.split('·')[0]}</span>
            </div>
            <p className="text-[10px] text-emerald-200/80 truncate mt-1">{s.title}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
