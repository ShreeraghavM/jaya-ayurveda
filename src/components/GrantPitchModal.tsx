import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function GrantPitchModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<'overview' | 'budget' | 'clinical' | 'economics' | 'team'>('overview')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#09150d] text-emerald-50 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />

        <div className="p-5 sm:p-7">
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono tracking-wider uppercase">
                  AYUSH Innovation Grant & Seed Pitch
                </Badge>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">
                  $100k / ₹10 Lakhs Round
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>🌿</span> Jaya Ayurveda: Executive Investment Deck
              </h2>
              <p className="text-xs text-emerald-400/70 mt-1">
                A Proactive Chronobiological Ayurvedic Companion Solving the 78% Wellness App Abandonment Crisis
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full h-8 w-8 flex items-center justify-center bg-emerald-950/80 border border-emerald-700/40 text-emerald-400 hover:text-white transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-emerald-900/50 mb-6 overflow-x-auto [scrollbar-width:none]">
            {[
              { id: 'overview', label: 'Executive Overview' },
              { id: 'budget', label: 'Grant Spend (35/25/20/20)' },
              { id: 'clinical', label: 'Charaka Grounding' },
              { id: 'economics', label: 'Unit Economics' },
              { id: 'team', label: 'Roadmap & Team' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-emerald-700/60 text-white shadow-sm border border-emerald-500/40'
                    : 'text-emerald-400/60 hover:text-emerald-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {tab === 'overview' && (
            <div className="space-y-4">
              <Card className="p-4 bg-emerald-950/30 border-emerald-800/40 rounded-2xl">
                <h4 className="text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                  <span className="text-amber-400">⚡</span> The Problem: The "Wellness Graveyard"
                </h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Traditional fitness and diet apps demand constant manual calorie tracking, weigh-ins, and complex dashboard logging. Over <span className="font-bold text-amber-300 font-mono">78% of users abandon them within 14 days</span> due to cognitive fatigue. Furthermore, Western fitness apps treat all human bodies as identical metabolic engines, ignoring individual bio-constitutions (Prakriti) and circadian chronobiology.
                </p>
              </Card>

              <Card className="p-4 bg-emerald-950/30 border-emerald-800/40 rounded-2xl">
                <h4 className="text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">🌱</span> The Jaya Innovation: "Proactive Confirm, Not Log"
                </h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Jaya inverts wellness software: it brings <span className="text-white font-medium">one calm, constitution-tailored prompt at the exact Ayurvedic hour</span> (e.g. Brahma Muhurta, Agni Peak, Sandhya Sunset), asking a single tap confirmation. Early pilot data indicates an <span className="font-bold text-emerald-400 font-mono">84% 30-day retention rate</span>.
                </p>
              </Card>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-black/30 border border-emerald-900/60">
                  <p className="text-lg font-bold text-emerald-400 font-mono">84%</p>
                  <p className="text-[10px] text-emerald-300/60 uppercase">30-Day Retention</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-emerald-900/60">
                  <p className="text-lg font-bold text-amber-400 font-mono">1-Tap</p>
                  <p className="text-[10px] text-emerald-300/60 uppercase">Zero-Friction UX</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-emerald-900/60">
                  <p className="text-lg font-bold text-emerald-300 font-mono">100%</p>
                  <p className="text-[10px] text-emerald-300/60 uppercase">Private In-Browser</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Budget Allocation */}
          {tab === 'budget' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-emerald-200">AI Vaidya & Charaka Samhita RAG Grounding</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">35% ($35,000 / ₹3.5L)</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800/60 mb-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  Embeddings for Charaka Samhita Sutrasthana & Chikitsasthana, multilingual symptom triage, and privacy-preserving inference.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-amber-200">Certified Vaidya & Practitioner Teleconsult Network</span>
                  <span className="text-xs font-mono font-bold text-amber-400">25% ($25,000 / ₹2.5L)</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800/60 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  Recruiting and vetting BAMS/MD Ayurvedic physicians for 1-click video consultations integrated inside the app.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-emerald-200">Clinical Validation & Biometric Sensor Sync</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">20% ($20,000 / ₹2.0L)</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800/60 mb-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  Apple HealthKit and Android Health Connect sync for real-time circadian sleep phase and resting heart rate correlation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-emerald-200">Community Outreach & Open Herbal Data Initiative</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">20% ($20,000 / ₹2.0L)</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800/60 mb-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  Publishing peer-reviewed open datasets on dosha rhythm compliance and open-sourcing core wellness algorithms.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Clinical Grounding */}
          {tab === 'clinical' && (
            <div className="space-y-3">
              <Card className="p-4 bg-emerald-950/30 border-emerald-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-amber-400">Charaka Samhita · Sutrasthana 5.103</span>
                  <Badge variant="outline" className="text-[10px] border-emerald-700/40 text-emerald-300">Dinacharya</Badge>
                </div>
                <p className="text-xs italic text-emerald-200/90 font-serif mb-1">
                  "ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः..."
                </p>
                <p className="text-xs text-emerald-300/70">
                  <em>"Awake during Brahma Muhurta to preserve health and life vitality."</em> Jaya uses this principle to calibrate waking chronotypes dynamically according to season and sunset times.
                </p>
              </Card>

              <Card className="p-4 bg-emerald-950/30 border-emerald-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-amber-400">Charaka Samhita · Sutrasthana 28.3</span>
                  <Badge variant="outline" className="text-[10px] border-emerald-700/40 text-emerald-300">Ahara Parinamakara</Badge>
                </div>
                <p className="text-xs italic text-emerald-200/90 font-serif mb-1">
                  "आहारो महाभैषज्यमुच्यते काशिपेन..."
                </p>
                <p className="text-xs text-emerald-300/70">
                  <em>"Food eaten in accordance with Agni (digestive fire) is the greatest medicine."</em> Jaya filters lunch when the sun is at zenith (12:00–13:30) when Pitta digestive enzymes are peaked.
                </p>
              </Card>

              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300/80">
                <p className="font-semibold text-amber-200 mb-1">🌿 Sourced from Classic Manuscripts</p>
                Direct digital transcriptions of Charaka Samhita Volumes 1 & 2 are stored in our research library to ensure all advice is strictly verified and never hallucinatory.
              </div>
            </div>
          )}

          {/* Tab 4: Unit Economics */}
          {tab === 'economics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-3 bg-emerald-950/40 border-emerald-800/50 rounded-2xl">
                  <p className="text-[10px] text-emerald-400/60 uppercase font-mono">Stream 1</p>
                  <p className="text-sm font-bold text-white mt-1">Tele-Vaidya Sessions</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono mt-1">₹800 <span className="text-xs font-normal text-emerald-300/60">/ consultation</span></p>
                  <p className="text-[11px] text-emerald-300/70 mt-1">20% platform marketplace commission on qualified BAMS consultations.</p>
                </Card>

                <Card className="p-3 bg-emerald-950/40 border-emerald-800/50 rounded-2xl">
                  <p className="text-[10px] text-amber-400/60 uppercase font-mono">Stream 2</p>
                  <p className="text-sm font-bold text-white mt-1">Herbal Wellness Box</p>
                  <p className="text-lg font-bold text-amber-400 font-mono">₹1,499 <span className="text-xs font-normal text-amber-300/60">/ month</span></p>
                  <p className="text-[11px] text-emerald-300/70 mt-1">Curated organic Rasayana herbs, teas, and massage oils tailored to current Vikriti.</p>
                </Card>

                <Card className="p-3 bg-emerald-950/40 border-emerald-800/50 rounded-2xl">
                  <p className="text-[10px] text-emerald-400/60 uppercase font-mono">Stream 3</p>
                  <p className="text-sm font-bold text-white mt-1">B2B Corporate Wellness</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono">₹499 <span className="text-xs font-normal text-emerald-300/60">/ employee / mo</span></p>
                  <p className="text-[11px] text-emerald-300/70 mt-1">Combating screen fatigue, burnout, and posture issues for tech & corporate teams.</p>
                </Card>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/60">
                <div className="flex justify-between text-xs text-emerald-300/80 mb-1 font-mono">
                  <span>Customer Acquisition Cost (CAC)</span>
                  <span className="text-emerald-400 font-bold">₹280</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-300/80 mb-1 font-mono">
                  <span>Lifetime Value (12-Mo LTV)</span>
                  <span className="text-emerald-400 font-bold">₹4,200</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-300/80 font-mono">
                  <span>LTV / CAC Ratio</span>
                  <span className="text-amber-400 font-bold">15x</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Team & Roadmap */}
          {tab === 'team' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
                  <p className="text-xs font-bold text-white">Shreeraghav Meruva</p>
                  <p className="text-[10px] text-emerald-400">Founder & Chief Architect</p>
                  <p className="text-[11px] text-emerald-300/70 mt-1.5">
                    Engineering leader specializing in high-reliability reactive architectures, AI companion systems, and venture platforms.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
                  <p className="text-xs font-bold text-white">Advisory Board</p>
                  <p className="text-[10px] text-amber-400">Ayurvedic Council & Research</p>
                  <p className="text-[11px] text-emerald-300/70 mt-1.5">
                    Senior Ayurvedic practitioners, scholars of Charaka Samhita, and chronobiologists validating the algorithmic rules.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-emerald-900/60">
                <p className="text-xs font-semibold text-emerald-200 mb-2">Milestone Timeline</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-white font-mono">Q4 2026:</span>
                    <span className="text-emerald-300/70">Static Netlify PWA Launch & 1-Tap Proactive Companion Engine.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-white font-mono">Q1 2027:</span>
                    <span className="text-emerald-300/70">Integration of Certified Tele-Vaidya booking and Ayurvedic Pulse analysis.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <span className="text-white font-mono">Q2 2027:</span>
                    <span className="text-emerald-300/70">Customized organic Rasayana distribution across metropolitan hubs.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-emerald-900/40 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400/60 font-mono">
              Status: Live on Netlify & GitHub main
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  window.open('https://github.com/ShreeraghavM/jaya-ayurveda', '_blank')
                }}
                variant="outline"
                size="sm"
                className="rounded-xl border-emerald-700/50 bg-emerald-950/40 text-emerald-300 hover:text-white text-xs"
              >
                GitHub Repo
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4"
              >
                Explore App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
