// src/components/HealthIntakeConsultation.tsx
// Polite Ayurvedic Health Intake, Semantic Vector Matching & Clinical Healing Plan Engine

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  vectorizeAndMatchHealthIssues,
  saveActiveHealingProtocol,
  getActiveHealingProtocol,
  clearActiveHealingProtocol,
  type VectorMatchResult,
} from '../lib/vectorSearch'
import type { UserProfile } from '../lib/data'

interface Props {
  profile: UserProfile
  onClose?: () => void
  onNavigateTab?: (tab: string) => void
}

const COMMON_CONCERNS = [
  { label: '🩸 Blood Sugar / Diabetes', query: 'I have high blood sugar, fasting glucose spikes, and diabetes symptoms.' },
  { label: '🩺 High Blood Pressure / BP', query: 'I suffer from high blood pressure (hypertension) and temple throbbing.' },
  { label: '🦴 Joint Pain & Arthritis', query: 'My knees and joints are stiff, creaking, and painful when walking.' },
  { label: '🍵 Acid Reflux & GERD', query: 'I have frequent acid reflux, burning chest, and sour burping after meals.' },
  { label: '🌙 Insomnia & Restless Sleep', query: 'I cannot sleep at night, wake up at 2 AM with a racing mind, and feel tired.' },
  { label: '⚖️ Weight & Sluggish Agni', query: 'I am struggling with excess belly fat, sluggish metabolism, and weight gain.' },
  { label: '😰 Anxiety & Work Burnout', query: 'I feel chronic anxiety, panic, heart palpitations, and nervous exhaustion.' },
  { label: '🫁 Asthma & Wheezing', query: 'I have bronchial asthma, coughing at night, and paroxysmal wheezing.' },
  { label: '🩸 Raktapradara / Heavy Bleeding', query: 'I have raktapradar with heavy menstrual bleeding, prolonged cycle, and clots.' },
  { label: '🌸 Artavakshaya / Scanty Flow', query: 'I have artavakshaya with scanty periods, brown spotting, and pelvic ache.' },
  { label: '🔄 Yathochitakala Adarshanam / PCOS', query: 'I suffer from yathochitakala adarshanam with delayed periods, missed cycles, and PCOS.' },
]

export default function HealthIntakeConsultation({ profile, onClose, onNavigateTab }: Props) {
  const [userInput, setUserInput] = useState('')
  const [results, setResults] = useState<VectorMatchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedResult, setSelectedResult] = useState<VectorMatchResult | null>(null)
  const [activePlanTab, setActivePlanTab] = useState<'why' | 'intake' | 'yoga' | 'numbers'>('why')
  const [adoptedSuccess, setAdoptedSuccess] = useState(false)
  const [activeSavedProtocol, setActiveSavedProtocol] = useState<VectorMatchResult | null>(getActiveHealingProtocol())

  const handleSearch = (queryToUse?: string) => {
    const q = (queryToUse ?? userInput).trim()
    if (!q) return
    const matches = vectorizeAndMatchHealthIssues(q)
    setResults(matches)
    setHasSearched(true)
    if (matches.length > 0) {
      setSelectedResult(matches[0])
    } else {
      setSelectedResult(null)
    }
  }

  const handleTagClick = (query: string) => {
    setUserInput(query)
    handleSearch(query)
  }

  const handleAdoptProtocol = (match: VectorMatchResult) => {
    saveActiveHealingProtocol(match)
    setActiveSavedProtocol(match)
    setAdoptedSuccess(true)
    setTimeout(() => setAdoptedSuccess(false), 5000)
  }

  const handleClearProtocol = () => {
    clearActiveHealingProtocol()
    setActiveSavedProtocol(null)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* ─── HEADER BANNER (Polite & Reassuring Bedside Opening) ─── */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-950/70 via-[#0a1f12] to-black/80 border border-emerald-700/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-mono uppercase tracking-wider px-3 py-1">
            🌿 Vedic Clinical Intake & Vector AI
          </Badge>
          {onClose && (
            <button
              onClick={onClose}
              className="text-emerald-400/60 hover:text-emerald-200 text-sm font-mono px-2 py-1 rounded-lg border border-emerald-800/30"
            >
              ✕ Close
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-50 tracking-tight mb-2">
          Tell Us How You Are Feeling, Friend.
        </h1>
        <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
          Namaste, {profile.name || 'Friend'}. Healing begins with being heard with zero judgment. 
          Share any ongoing health concerns, discomforts, or doctor diagnoses below. Our clinical vector engine 
          will analyze your symptoms against the 2,500-year-old <span className="text-amber-300 font-medium">Charaka Samhita</span> and 
          modern clinical phytotherapy trials to build an exact, measurable healing plan.
        </p>

        {/* Active Saved Protocol Indicator */}
        {activeSavedProtocol && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-900/30 border border-emerald-600/40 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎯</span>
              <div>
                <p className="text-emerald-300 text-xs font-mono uppercase tracking-wider">Active Healing Protocol</p>
                <p className="text-emerald-100 font-semibold text-sm">{activeSavedProtocol.remedy.condition}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                {activeSavedProtocol.confidencePercentage}% Confidence
              </Badge>
              <button
                onClick={handleClearProtocol}
                className="text-[11px] text-emerald-400/60 hover:text-red-400 underline font-mono ml-2"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── QUICK SELECTOR TAGS ─── */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider px-1">
          Common Clinical Inquiries (Tap to Select):
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_CONCERNS.map((c, i) => (
            <button
              key={i}
              onClick={() => handleTagClick(c.query)}
              className="text-xs px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/30 hover:border-emerald-600/50 text-emerald-200 transition-all shadow-sm"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── FREEFORM INPUT & SEARCH BAR ─── */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            rows={3}
            placeholder="Describe your health challenges in your own words... (e.g., 'My blood sugar levels spike in the morning, and my blood pressure is around 145/95. I also feel exhausted by 3 PM...')"
            className="w-full rounded-2xl bg-black/50 border border-emerald-800/50 p-4 text-sm text-emerald-100 placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed font-sans resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-emerald-400/50 font-mono">
            ⚡ In-browser semantic vectorization (zero data leaves your device)
          </span>
          <Button
            onClick={() => handleSearch()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 rounded-xl shadow-lg shadow-emerald-900/40 transition-all text-xs"
          >
            🔍 Analyze & Match Protocol
          </Button>
        </div>
      </div>

      {/* ─── SEARCH RESULTS & PROTOCOL DOSSIER ─── */}
      {hasSearched && (
        <div className="space-y-6 pt-4">
          {results.length === 0 ? (
            <Card className="p-8 text-center bg-emerald-950/30 border-emerald-800/30">
              <span className="text-3xl mb-2 block">🌿</span>
              <h3 className="text-emerald-200 font-semibold mb-1">No direct protocol match found</h3>
              <p className="text-emerald-400/60 text-xs max-w-md mx-auto">
                Try searching for specific terms like "Blood Sugar", "Blood Pressure", "Joint Pain", "Acidity", or "Insomnia".
              </p>
            </Card>
          ) : (
            <>
              {/* Primary Match Card */}
              {selectedResult && (
                <div className="rounded-3xl border border-emerald-600/40 bg-gradient-to-b from-[#081a0e] to-[#040e08] shadow-2xl overflow-hidden animate-in fade-in duration-300">
                  {/* Top Bar with Confidence Gauge */}
                  <div className="p-5 border-b border-emerald-800/40 bg-emerald-950/40 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider">
                          Matched Classical Protocol
                        </span>
                        <span className="text-emerald-600 text-xs">•</span>
                        <span className="text-emerald-300/80 text-xs font-mono">
                          Cosine Sim: {selectedResult.similarityScore}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-emerald-50">
                        {selectedResult.remedy.condition}
                      </h2>
                      <p className="text-emerald-300/60 text-xs font-serif italic">
                        {selectedResult.remedy.sanskrit} · {selectedResult.remedy.charakaRef}
                      </p>
                      {selectedResult.canonicalChapter && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-[11px] font-mono">
                          <span>📜</span>
                          <span className="text-emerald-300 font-bold">
                            {selectedResult.canonicalChapter.sthanaName} · #{selectedResult.canonicalChapter.chapterNumber}
                          </span>
                          <span className="text-emerald-400/80">({selectedResult.canonicalChapter.sanskritTitle})</span>
                          <a
                            href={selectedResult.canonicalChapter.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-300 hover:text-amber-200 underline ml-1 font-semibold"
                          >
                            Canonical Shlokas ↗
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Confidence Score Pill */}
                    <div className="text-right bg-emerald-900/30 border border-emerald-500/40 rounded-2xl px-4 py-2.5">
                      <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                        Clinical Confidence
                      </p>
                      <p className="text-2xl font-bold text-emerald-100 font-mono">
                        {selectedResult.confidencePercentage}%
                      </p>
                      <p className="text-[10px] text-emerald-400/60">Remission Potential</p>
                    </div>
                  </div>

                  {/* Bedside Greeting Alert */}
                  <div className="p-5 bg-emerald-950/20 border-b border-emerald-900/40">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">🙏</span>
                      <p className="text-emerald-200/90 text-sm leading-relaxed font-light italic">
                        "{selectedResult.politeBedsideGreeting}"
                      </p>
                    </div>
                  </div>

                  {/* Tab Navigation for Healing Plan */}
                  <div className="px-5 pt-4">
                    <div className="flex gap-2 border-b border-emerald-800/40 pb-2 overflow-x-auto [scrollbar-width:none]">
                      {[
                        { id: 'why', label: '🔬 The Science (Why It Works)' },
                        { id: 'intake', label: '🍽️ Exact Daily Intake (Grams & Times)' },
                        { id: 'yoga', label: '🧘 Therapeutic Yoga & Breath' },
                        { id: 'numbers', label: '📊 Numbers & Tracking (14-90 Days)' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActivePlanTab(t.id as any)}
                          className={`text-xs font-medium py-2 px-3 rounded-xl transition-all whitespace-nowrap ${
                            activePlanTab === t.id
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-emerald-400/60 hover:text-emerald-200 bg-emerald-950/30'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-5">
                    {/* TAB 1: WHY IT WORKS (PRACTICAL MECHANISM) */}
                    {activePlanTab === 'why' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/30">
                          <h4 className="text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
                            Cellular & Chronobiological Mechanism:
                          </h4>
                          <p className="text-emerald-100/90 text-sm leading-relaxed">
                            {selectedResult.practicalWhyItWorks}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-900/40">
                            <span className="text-xs font-mono text-emerald-400 block mb-1">🌿 Primary Classical Herbs:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedResult.remedy.primaryHerbs.map((h, i) => (
                                <Badge key={i} className="bg-emerald-950/60 text-emerald-200 border-emerald-700/30 text-[11px]">
                                  {h}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-900/40">
                            <span className="text-xs font-mono text-emerald-400 block mb-1">⚖️ Classical Etiology (Dosha):</span>
                            <p className="text-emerald-200 text-xs font-medium">
                              {selectedResult.remedy.doshaImbalance}
                            </p>
                            <p className="text-emerald-400/60 text-[11px] mt-1">
                              Severity tier: <span className="capitalize">{selectedResult.remedy.severity}</span>
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/80 leading-relaxed">
                          ⚠️ <span className="font-semibold text-amber-200">Clinical Safety Precaution:</span> {selectedResult.remedy.precautions}
                        </div>
                      </div>
                    )}

                    {/* TAB 2: EXACT TIMED INTAKE (GRAMS & TIMINGS) */}
                    {activePlanTab === 'intake' && (
                      <div className="space-y-3">
                        <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider mb-1">
                          Hour-by-Hour Nutritional & Herbal Protocol:
                        </p>
                        <div className="space-y-2.5">
                          {selectedResult.intakePrescription.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 flex items-start gap-3"
                            >
                              <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl px-2.5 py-1 text-center shrink-0">
                                <span className="text-emerald-300 font-mono text-xs font-semibold block">{item.time}</span>
                              </div>
                              <div className="flex-1">
                                <h5 className="text-emerald-100 font-medium text-sm">{item.item}</h5>
                                <p className="text-emerald-300/80 text-xs font-mono mt-0.5">Amount: {item.quantity}</p>
                                <p className="text-emerald-400/60 text-xs mt-1 leading-relaxed">
                                  Action: {item.physiologicalAction}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/30">
                            <span className="text-emerald-300 font-mono text-xs block mb-1">✅ Beneficial Diet (Pathya):</span>
                            <ul className="text-emerald-200/80 text-xs space-y-1 list-disc list-inside">
                              {selectedResult.remedy.pathya.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 rounded-2xl bg-red-950/20 border border-red-900/30">
                            <span className="text-red-300 font-mono text-xs block mb-1">🚫 Aggravating Foods (Apathya):</span>
                            <ul className="text-red-200/80 text-xs space-y-1 list-disc list-inside">
                              {selectedResult.remedy.apathya.map((a, i) => (
                                <li key={i}>{a}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: THERAPEUTIC YOGA & EXERCISE */}
                    {activePlanTab === 'yoga' && (
                      <div className="space-y-3">
                        <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider mb-1">
                          Targeted Physical & Breath Therapy:
                        </p>
                        <div className="space-y-2.5">
                          {selectedResult.exercisePrescription.map((ex, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 flex items-start gap-3"
                            >
                              <span className="text-2xl mt-0.5">
                                {ex.type === 'Pranayama' ? '🫁' : ex.type === 'Asana' ? '🧘' : '🚶'}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="text-emerald-100 font-medium text-sm">{ex.name}</h5>
                                  <Badge className="bg-emerald-900/50 text-emerald-300 text-[10px] font-mono">
                                    {ex.type}
                                  </Badge>
                                </div>
                                <p className="text-emerald-300/80 text-xs font-mono">Pacing: {ex.duration}</p>
                                <p className="text-emerald-400/70 text-xs mt-0.5">Breath: {ex.breathPacing}</p>
                                <p className="text-emerald-400/60 text-xs mt-1 leading-relaxed">
                                  Physiological Effect: {ex.physiologicalAction}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {onNavigateTab && (
                          <div className="pt-2">
                            <Button
                              onClick={() => onNavigateTab('yoga')}
                              variant="outline"
                              className="w-full border-emerald-700/40 text-emerald-300 hover:bg-emerald-900/40 text-xs"
                            >
                              Open Interactive Guided Breathing Studio 🧘
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: NUMBERS & TRACKING (14 TO 90 DAYS) */}
                    {activePlanTab === 'numbers' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-emerald-200 font-semibold text-sm">
                              {selectedResult.milestoneScorecard.biomarker}
                            </h4>
                            <Badge className="bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                              Unit: {selectedResult.milestoneScorecard.unit}
                            </Badge>
                          </div>
                          <p className="text-emerald-400/60 text-xs font-mono mb-4">
                            Cadence: {selectedResult.milestoneScorecard.trackingFrequency}
                          </p>

                          {/* Progress Roadmap with numbers */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            <div className="p-3 rounded-xl bg-black/40 border border-emerald-900/40">
                              <span className="text-[10px] font-mono text-emerald-500 uppercase block">Day 0 (Baseline)</span>
                              <p className="text-emerald-100 font-bold text-xs mt-1">
                                {selectedResult.milestoneScorecard.baselineTypical}
                              </p>
                              <span className="text-[10px] text-emerald-400/50 mt-1 block">Pre-treatment</span>
                            </div>

                            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/40">
                              <span className="text-[10px] font-mono text-emerald-300 uppercase block">Day 14 (Early Shift)</span>
                              <p className="text-emerald-200 font-bold text-xs mt-1">
                                {selectedResult.milestoneScorecard.day14Target}
                              </p>
                              <span className="text-[10px] text-emerald-400/60 mt-1 block">Inflammation drops</span>
                            </div>

                            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-600/40">
                              <span className="text-[10px] font-mono text-emerald-300 uppercase block">Day 45 (Reset)</span>
                              <p className="text-emerald-100 font-bold text-xs mt-1">
                                {selectedResult.milestoneScorecard.day45Target}
                              </p>
                              <span className="text-[10px] text-emerald-400/60 mt-1 block">Cellular sensitivity</span>
                            </div>

                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border border-emerald-400/40 shadow-sm">
                              <span className="text-[10px] font-mono text-amber-300 uppercase block font-semibold">Day 90 (Homeostasis)</span>
                              <p className="text-white font-bold text-xs mt-1">
                                {selectedResult.milestoneScorecard.day90Target}
                              </p>
                              <span className="text-[10px] text-emerald-200/70 mt-1 block">Tissue rejuvenation</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/30 border border-emerald-900/30 text-xs text-emerald-400/70 leading-relaxed font-mono">
                          ℹ️ All milestone targets are modeled from peer-reviewed clinical trials indexed in the National AYUSH Portal (NAMASTE) and PubMed Central.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-5 border-t border-emerald-800/40 bg-emerald-950/40 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-emerald-400/60 font-mono">
                      Ready to start your structured recovery roadmap?
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleAdoptProtocol(selectedResult)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 rounded-xl shadow-lg transition-all text-xs"
                      >
                        🌿 Adopt this Protocol into My Daily Routine
                      </Button>
                    </div>
                  </div>

                  {adoptedSuccess && (
                    <div className="p-3 bg-emerald-800/80 text-white text-center text-xs font-mono animate-in fade-in">
                      ✨ Protocol successfully saved! Your daily routine and Smart Popups are now aligned with this healing plan.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
