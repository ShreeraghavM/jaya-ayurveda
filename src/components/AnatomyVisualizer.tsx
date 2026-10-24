// src/components/AnatomyVisualizer.tsx
// Interactive Human Anatomy & Srotas Digital Twin Visualizer
// Supports:
// 1. Holographic Digital Twin (Picture 2: Bio-luminescent dark anatomy with floating organ nodes & interactive hotspots)
// 2. Medical Atlas Chart (Picture 1: Classical medical chart view)
// 3. Interactive Vector Diagram (Pure SVG with anterior/posterior views)

import { useState, useMemo } from 'react'
import {
  ANATOMICAL_SYSTEMS,
  calculateSystemNourishment,
  getOverallBodyVitalityScore,
  generateDeficitBalancingMeal,
  getDiseaseBeacons,
  clearDiseaseBeacon,
  type AnatomicalSystemId,
  type DiseaseBeacon,
  type AnatomicalOrgan,
} from '@/lib/anatomyEngine'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Dosha } from '@/lib/data'

interface Props {
  dosha?: Dosha
  onOpenIntake?: () => void
  onOpenLabReports?: () => void
  onOpenMatraCalculator?: () => void
}

export type AnatomyVisualMode = 'hologram' | 'chart' | 'vector'

export default function AnatomyVisualizer({ dosha = 'Pitta', onOpenIntake, onOpenLabReports, onOpenMatraCalculator }: Props) {
  const [visualMode, setVisualMode] = useState<AnatomyVisualMode>('hologram')
  const [selectedSystemId, setSelectedSystemId] = useState<AnatomicalSystemId>('digestive')
  const [selectedOrgan, setSelectedOrgan] = useState<AnatomicalOrgan | null>(null)
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front')
  const [beacons, setBeacons] = useState<DiseaseBeacon[]>(getDiseaseBeacons())
  const [clearingBeaconId, setClearingBeaconId] = useState<string | null>(null)

  // Real-time nourishment status calculated from user logs
  const nourishment = useMemo(() => calculateSystemNourishment(), [])
  const overallVitality = useMemo(() => getOverallBodyVitalityScore(nourishment), [nourishment])
  const deficitMeal = useMemo(() => generateDeficitBalancingMeal(nourishment, dosha), [nourishment, dosha])

  const selectedMeta = ANATOMICAL_SYSTEMS[selectedSystemId]
  const selectedNourishment = nourishment[selectedSystemId]

  // Active uncleared beacons
  const activeBeacons = useMemo(() => beacons.filter(b => !b.isCleared), [beacons])

  const handleClearBeacon = (beaconId: string) => {
    clearDiseaseBeacon(beaconId)
    setBeacons(getDiseaseBeacons())
    setClearingBeaconId(null)
  }

  // Quick organ hotspot click
  const selectOrganHotspot = (systemId: AnatomicalSystemId, organIndex: number = 0) => {
    setSelectedSystemId(systemId)
    setSelectedOrgan(ANATOMICAL_SYSTEMS[systemId].primaryOrgans[organIndex] || null)
  }

  return (
    <div className="space-y-6">
      {/* ─── COMPOSITE VITALITY HEADER ─── */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c2317] via-[#08180f] to-[#040e08] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧬</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-mono">
                SHARIRA & SROTAS DIGITAL TWIN
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-mono">
                13 ANATOMICAL SYSTEMS
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-50">
              Interactive Human Anatomy & Vitality
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/70 mt-1 max-w-xl">
              Real-time biological nourishment mapping. See how your daily meals, water, and breath directly power your 13 organ systems from 0% to 100%.
            </p>
          </div>

          {/* Full-Body Vitality Ring */}
          <div className="flex items-center gap-4 bg-emerald-950/60 border border-emerald-800/40 rounded-2xl p-3 sm:px-4 sm:py-3 shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-emerald-900/60"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray={`${overallVitality}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold font-mono text-emerald-100">{overallVitality}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-200">Full-Body Ojas</div>
              <div className="text-[10px] text-emerald-400/60 font-mono">13 Systems Composite</div>
              <div className="text-[10px] text-amber-300 font-medium mt-0.5">
                {overallVitality >= 80 ? 'Optimal Tissue State' : overallVitality >= 50 ? 'Moderate Nourishment' : 'Replenishment Needed'}
              </div>
            </div>
          </div>
        </div>

        {/* ─── DISPLAY MODE TOGGLE ─── */}
        <div className="mt-4 pt-4 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-emerald-800/40">
            <button
              onClick={() => setVisualMode('hologram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 ${
                visualMode === 'hologram'
                  ? 'bg-emerald-500 text-white font-bold shadow-md'
                  : 'text-emerald-400/70 hover:text-white'
              }`}
            >
              <span>✨ Holographic Twin</span>
              <span className="text-[9px] bg-emerald-950/80 px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                Recommended
              </span>
            </button>
            <button
              onClick={() => setVisualMode('chart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1 ${
                visualMode === 'chart'
                  ? 'bg-emerald-500 text-white font-bold shadow-md'
                  : 'text-emerald-400/70 hover:text-white'
              }`}
            >
              <span>📖 Medical Atlas</span>
            </button>
            <button
              onClick={() => setVisualMode('vector')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1 ${
                visualMode === 'vector'
                  ? 'bg-emerald-500 text-white font-bold shadow-md'
                  : 'text-emerald-400/70 hover:text-white'
              }`}
            >
              <span>📐 Vector Diagram</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLabReports && (
              <button
                onClick={onOpenLabReports}
                className="px-3 py-1.5 rounded-full border border-emerald-700/50 bg-emerald-900/30 text-emerald-200 hover:bg-emerald-800/40 text-xs font-mono transition flex items-center gap-1.5"
              >
                <span>🔬 Doctor Lab Counts</span>
              </button>
            )}
            {onOpenIntake && (
              <button
                onClick={onOpenIntake}
                className="px-3 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 text-xs font-mono transition flex items-center gap-1.5"
              >
                <span>🩺 Report Symptom</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── ACTIVE DISEASE BEACONS ALERT BANNER ─── */}
      {activeBeacons.length > 0 && (
        <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-[#1e0a0a] to-[#120404] p-4 shadow-xl animate-in fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5 animate-pulse">🚨</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-mono">
                  ACTIVE PATHOLOGY BEACON
                </Badge>
                <span className="text-rose-200 text-xs font-semibold">
                  {activeBeacons.length} Organ System(s) In Active Cure Protocol
                </span>
              </div>

              <div className="space-y-2 mt-2">
                {activeBeacons.map(beacon => (
                  <div
                    key={beacon.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-rose-900/50"
                  >
                    <div>
                      <p className="text-xs font-semibold text-rose-100 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        {beacon.conditionName}
                        <span className="text-[10px] text-rose-300/70 font-mono">({beacon.sanskritName})</span>
                      </p>
                      <p className="text-[11px] text-rose-200/70 mt-0.5">
                        Target: <span className="text-rose-100 font-mono">{beacon.targetBiomarkers}</span> · Scheduled for{' '}
                        {beacon.projectedReliefDays} days
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedSystemId(beacon.systemId)}
                        className="h-7 text-[10px] font-mono bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-lg"
                      >
                        Locate on Body ➔
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setClearingBeaconId(beacon.id)}
                        className="h-7 text-[10px] font-mono border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 rounded-lg"
                      >
                        ✓ Mark Cleared
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for clearing a beacon */}
      {clearingBeaconId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="max-w-md w-full bg-[#0d1a10] border-emerald-600/50 p-6 rounded-3xl shadow-2xl text-emerald-50">
            <h3 className="text-base font-bold text-emerald-100 mb-2">Confirm Pathology Resolution</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-4">
              Have your symptoms completely resolved, or have diagnostic lab counts returned to normal ranges? Marking as cleared will cease the active cure protocol on your anatomy silhouette.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClearingBeaconId(null)}
                className="border-emerald-800 text-emerald-300 hover:bg-emerald-950"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleClearBeacon(clearingBeaconId)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                Yes, Condition Cleared ✓
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── MAIN TWO-COLUMN ANATOMICAL VIEW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE BODY SILHOUETTE (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-emerald-800/40 bg-gradient-to-b from-[#08170d] to-[#040c07] p-4 sm:p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              {visualMode === 'hologram'
                ? 'Holographic Bio-Luminescent Twin'
                : visualMode === 'chart'
                ? 'Color Anatomical Chart'
                : `Vector Silhouette · ${viewAngle === 'front' ? 'Ventral' : 'Dorsal'}`}
            </span>
            <span className="text-[10px] text-emerald-500/70 font-mono">Tap organ to inspect</span>
          </div>

          {/* ─── MODE 1: HOLOGRAPHIC BIO-LUMINESCENT TWIN (PICTURE 2) ─── */}
          {visualMode === 'hologram' && (
            <div className="relative w-full aspect-[9/16] max-w-[340px] mx-auto rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#030705] shadow-2xl">
              <img
                src="./anatomy/anatomy_dark_hologram.webp"
                alt="Holographic Anatomy Digital Twin"
                className="w-full h-full object-contain select-none"
              />

              {/* OVERLAY HOTSPOT BUTTONS DIRECTLY ON ORGANS */}
              {/* Brain / Crown (Majjavaha Srotas) */}
              <button
                onClick={() => selectOrganHotspot('nervous', 0)}
                style={{ top: '8%', left: '49%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition shadow-lg ${
                  selectedSystemId === 'nervous'
                    ? 'bg-purple-500 text-white ring-4 ring-purple-400 scale-110 z-20'
                    : 'bg-purple-950/80 border border-purple-400/60 text-purple-200 hover:scale-110 z-10'
                }`}
                title="Brain & Cranial Nerves (Majjavaha Srotas)"
              >
                🧠
              </button>

              {/* Lungs & Airway (Pranavaha Srotas) */}
              <button
                onClick={() => selectOrganHotspot('respiratory', 0)}
                style={{ top: '27%', left: '46%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition shadow-lg ${
                  selectedSystemId === 'respiratory'
                    ? 'bg-sky-500 text-white ring-4 ring-sky-400 scale-110 z-20'
                    : 'bg-sky-950/80 border border-sky-400/60 text-sky-200 hover:scale-110 z-10'
                }`}
                title="Lungs & Bronchial Tree (Pranavaha Srotas)"
              >
                🫁
              </button>

              {/* Heart (Raktavaha Srotas & Hridaya) */}
              <button
                onClick={() => selectOrganHotspot('circulatory', 0)}
                style={{ top: '28%', left: '54%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition shadow-lg ${
                  selectedSystemId === 'circulatory'
                    ? 'bg-red-500 text-white ring-4 ring-red-400 scale-110 z-20'
                    : 'bg-red-950/80 border border-red-400/60 text-red-200 hover:scale-110 z-10'
                }`}
                title="Heart & Arteries (Raktavaha Srotas)"
              >
                ❤️
              </button>

              {/* Liver (Yakrit & Pitta) */}
              <button
                onClick={() => selectOrganHotspot('digestive', 1)}
                style={{ top: '35%', left: '44%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition shadow-lg ${
                  selectedSystemId === 'digestive'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-400 scale-110 z-20'
                    : 'bg-amber-950/80 border border-amber-400/60 text-amber-200 hover:scale-110 z-10'
                }`}
                title="Liver & Gallbladder (Yakrit)"
              >
                🩸
              </button>

              {/* Stomach & Jatharagni */}
              <button
                onClick={() => selectOrganHotspot('digestive', 0)}
                style={{ top: '36%', left: '55%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition shadow-lg ${
                  selectedSystemId === 'digestive'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-400 scale-110 z-20'
                    : 'bg-amber-950/80 border border-amber-400/60 text-amber-200 hover:scale-110 z-10'
                }`}
                title="Stomach & Jatharagni (Annavaha Srotas)"
              >
                🥣
              </button>

              {/* Kidneys (Mutravaha Srotas) */}
              <button
                onClick={() => selectOrganHotspot('urinary', 0)}
                style={{ top: '43%', left: '44%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition shadow-lg ${
                  selectedSystemId === 'urinary'
                    ? 'bg-cyan-500 text-white ring-4 ring-cyan-400 scale-110 z-20'
                    : 'bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 hover:scale-110 z-10'
                }`}
                title="Kidneys & Osmoregulation (Mutravaha Srotas)"
              >
                💧
              </button>

              {/* Pelvis & Reproductive (Artavavaha / Shukravaha) */}
              <button
                onClick={() => selectOrganHotspot('reproductive', 0)}
                style={{ top: '56%', left: '50%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition shadow-lg ${
                  selectedSystemId === 'reproductive'
                    ? 'bg-fuchsia-500 text-white ring-4 ring-fuchsia-400 scale-110 z-20'
                    : 'bg-fuchsia-950/80 border border-fuchsia-400/60 text-fuchsia-200 hover:scale-110 z-10'
                }`}
                title="Pelvic Organs & Reproductive Vitality"
              >
                🌸
              </button>

              {/* Knee & Synovial Joints (Asthivaha Srotas) */}
              <button
                onClick={() => selectOrganHotspot('skeletal', 1)}
                style={{ top: '76%', left: '44%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition shadow-lg ${
                  selectedSystemId === 'skeletal'
                    ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-300 scale-110 z-20'
                    : 'bg-slate-900/80 border border-slate-400/60 text-slate-200 hover:scale-110 z-10'
                }`}
                title="Knee & Synovial Articulations (Janu Sandhi)"
              >
                🦴
              </button>

              {/* ACTIVE DISEASE BEACONS ON HOLOGRAPHIC IMAGE */}
              {activeBeacons.map(b => {
                let top = '36%'
                let left = '50%'
                if (b.organId === 'pancreas') {
                  top = '39%'
                  left = '50%'
                } else if (b.organId === 'heart') {
                  top = '28%'
                  left = '54%'
                } else if (b.organId === 'knees') {
                  top = '76%'
                  left = '44%'
                } else if (b.organId === 'uterus_prostate') {
                  top = '56%'
                  left = '50%'
                } else if (b.organId === 'brain') {
                  top = '8%'
                  left = '49%'
                }

                return (
                  <div
                    key={`holo-beacon-${b.id}`}
                    style={{ top, left }}
                    onClick={() => setSelectedSystemId(b.systemId)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 flex items-center justify-center"
                  >
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg border border-white">
                      !
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* ─── MODE 2: MEDICAL ATLAS CHART (PICTURE 1) ─── */}
          {visualMode === 'chart' && (
            <div className="relative w-full aspect-[9/16] max-w-[340px] mx-auto rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#eef7f9] shadow-2xl">
              <img
                src="./anatomy/anatomy_light_chart.webp"
                alt="Colorful Anatomical Body Systems Chart"
                className="w-full h-full object-contain select-none"
              />

              {/* Overlay clickable targets on the colorful chart */}
              <div
                onClick={() => selectOrganHotspot('nervous', 0)}
                style={{ top: '8%', left: '49%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-purple-500"
                title="Cerebrum & Cranial Srotas"
              />
              <div
                onClick={() => selectOrganHotspot('respiratory', 0)}
                style={{ top: '25%', left: '49%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-sky-500"
                title="Lungs (Phupphusa)"
              />
              <div
                onClick={() => selectOrganHotspot('digestive', 0)}
                style={{ top: '38%', left: '49%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-amber-500"
                title="Digestive Tract (Amashaya & Yakrit)"
              />
              <div
                onClick={() => selectOrganHotspot('digestive', 3)}
                style={{ top: '48%', left: '49%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full cursor-pointer hover:ring-2 hover:ring-amber-500"
                title="Intestines (Pakvashaya)"
              />
            </div>
          )}

          {/* ─── MODE 3: VECTOR SILHOUETTE DIAGRAM ─── */}
          {visualMode === 'vector' && (
            <div className="relative w-full aspect-[1/1.9] max-w-[300px] mx-auto flex items-center justify-center py-2">
              <svg
                viewBox="0 0 200 400"
                className="w-full h-full drop-shadow-[0_0_25px_rgba(16,185,129,0.15)] select-none"
              >
                <defs>
                  <linearGradient id="bodyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f2b1a" />
                    <stop offset="50%" stopColor="#081c10" />
                    <stop offset="100%" stopColor="#030c07" />
                  </linearGradient>
                </defs>

                {/* Head */}
                <circle cx="100" cy="45" r="24" fill="url(#bodyGrad2)" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.4" />
                {/* Torso */}
                <path
                  d="M90 82 C70 86 52 100 48 120 L40 180 C38 195 44 205 52 205 L60 205 C62 185 64 150 70 135 L70 215 C70 235 80 245 92 248 L92 265 L108 265 L108 248 C120 245 130 235 130 215 L130 135 C136 150 138 185 140 205 L148 205 C156 205 162 195 160 180 L152 120 C148 100 130 86 110 82 Z"
                  fill="url(#bodyGrad2)"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                />
                {/* Legs */}
                <path
                  d="M72 240 L70 330 C70 350 68 375 66 385 L84 385 C88 375 92 340 94 300 L97 270 L103 270 L106 300 C108 340 112 375 116 385 L134 385 C132 375 130 350 130 330 L128 240 Z"
                  fill="url(#bodyGrad2)"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                />

                {/* Brain */}
                <circle
                  cx="100"
                  cy="45"
                  r="14"
                  fill={selectedSystemId === 'nervous' ? '#a855f7' : '#581c87'}
                  fillOpacity="0.6"
                  stroke="#c084fc"
                  className="cursor-pointer"
                  onClick={() => selectOrganHotspot('nervous', 0)}
                />
                {/* Lungs */}
                <ellipse
                  cx="84"
                  cy="115"
                  rx="14"
                  ry="24"
                  fill={selectedSystemId === 'respiratory' ? '#38bdf8' : '#075985'}
                  fillOpacity="0.6"
                  stroke="#38bdf8"
                  className="cursor-pointer"
                  onClick={() => selectOrganHotspot('respiratory', 0)}
                />
                <ellipse
                  cx="116"
                  cy="115"
                  rx="14"
                  ry="24"
                  fill={selectedSystemId === 'respiratory' ? '#38bdf8' : '#075985'}
                  fillOpacity="0.6"
                  stroke="#38bdf8"
                  className="cursor-pointer"
                  onClick={() => selectOrganHotspot('respiratory', 0)}
                />
                {/* Heart */}
                <circle
                  cx="104"
                  cy="118"
                  r="13"
                  fill={selectedSystemId === 'circulatory' ? '#ef4444' : '#991b1b'}
                  fillOpacity="0.7"
                  stroke="#f87171"
                  className="cursor-pointer"
                  onClick={() => selectOrganHotspot('circulatory', 0)}
                />
                {/* Stomach */}
                <ellipse
                  cx="110"
                  cy="150"
                  rx="13"
                  ry="10"
                  fill={selectedSystemId === 'digestive' ? '#f59e0b' : '#b45309'}
                  fillOpacity="0.7"
                  stroke="#fbbf24"
                  className="cursor-pointer"
                  onClick={() => selectOrganHotspot('digestive', 0)}
                />
              </svg>
            </div>
          )}

          {/* Selected Status footer */}
          <div className="text-center mt-3 pt-3 border-t border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-200">
              Active: <span className="text-white">{selectedMeta.name}</span>
            </span>
            <span className="text-[11px] text-emerald-400/70 block font-mono">
              {selectedMeta.sanskritSrotas} · {selectedNourishment.percentage}% Nourished Today
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: 13 SYSTEMS SELECTOR & DETAILS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* HORIZONTAL SYSTEM CHIPS SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                13 Anatomical Systems & Daily %
              </span>
              <span className="text-[10px] text-emerald-400/60 font-mono">Tap to inspect</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(ANATOMICAL_SYSTEMS) as AnatomicalSystemId[]).map(sysId => {
                const sys = ANATOMICAL_SYSTEMS[sysId]
                const status = nourishment[sysId]
                const isSelected = selectedSystemId === sysId
                const hasBeacon = activeBeacons.some(b => b.systemId === sysId)

                return (
                  <button
                    key={sysId}
                    onClick={() => {
                      setSelectedSystemId(sysId)
                      setSelectedOrgan(sys.primaryOrgans[0])
                    }}
                    className={`relative p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-950/80 shadow-md ring-1 ring-emerald-400/50'
                        : 'border-emerald-900/40 bg-emerald-950/30 hover:border-emerald-700/60 hover:bg-emerald-950/50'
                    }`}
                  >
                    {hasBeacon && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-base">{sys.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-emerald-100 truncate">{sys.name.replace(' System', '')}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {status.percentage}%
                          </span>
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase"
                            style={{
                              backgroundColor: `${status.color}20`,
                              color: status.color,
                            }}
                          >
                            {status.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="mt-2 w-full h-1 bg-emerald-900/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${status.percentage}%`,
                          backgroundColor: status.percentage >= 80 ? '#10b981' : status.percentage >= 40 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ACTIVE SYSTEM DEEP-DIVE CARD */}
          <Card className="rounded-3xl border-emerald-700/50 bg-[#091f11]/90 p-5 shadow-xl text-emerald-50">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-2 rounded-2xl bg-emerald-900/40 border border-emerald-700/40">
                  {selectedMeta.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-emerald-50">{selectedMeta.name}</h3>
                  <p className="text-xs text-emerald-300 font-mono">{selectedMeta.sanskritSrotas}</p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">{selectedMeta.governingDhatu}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-emerald-300">
                  {selectedNourishment.percentage}%
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-emerald-500/70 font-mono">
                  Today's Vitality
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed border-t border-emerald-900/50 pt-3">
              {selectedMeta.description}
            </p>

            <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-emerald-900/40 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-semibold shrink-0">📜 Classical Source:</span>
                <span className="text-emerald-300/90 italic">{selectedMeta.classicalShlokaReference}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-semibold shrink-0">⚡ Physiological Role:</span>
                <span className="text-emerald-200/80">{selectedMeta.ayurvedicFunction}</span>
              </div>
            </div>

            {/* CONTRIBUTING ACTIONS TODAY */}
            <div className="mt-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
                Confirmed Actions Powering This System Today
              </p>
              {selectedNourishment.contributingActions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNourishment.contributingActions.map((act, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-emerald-900/40 border border-emerald-700/40 text-[11px] text-emerald-200 font-mono"
                    >
                      ✓ {act}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-200/70 italic">
                  No direct actions logged yet today. Starts at 0% baseline until morning water, meal or breathwork is confirmed.
                </p>
              )}
            </div>

            {/* WHAT IS REQUIRED TO REACH 100%? */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/40">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-amber-400 font-bold text-xs">🎯 Required to Reach 100% Nourishment:</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-100/90">
                {selectedNourishment.missingFor100.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2.5 pt-2 border-t border-amber-900/40 flex items-center justify-between text-xs">
                <span className="text-amber-300/80">Recommended Intake:</span>
                <span className="font-semibold text-amber-100">{selectedNourishment.recommendedRemedyOrFood}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── DYNAMIC DEFICIT-BALANCING MEAL DESIGNER ─── */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#1c1407] via-[#140e04] to-[#0a0702] p-5 sm:p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">🍽️</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">
                ANATOMICAL DEFICIT COMPENSATOR
              </Badge>
              <span className="text-[11px] font-mono text-emerald-400">Automated Ayurvedic Meal Design</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-amber-100">
              {deficitMeal.recommendedMealTitle}
            </h3>
            <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
              {deficitMeal.rationale}
            </p>

            <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-amber-900/40">
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block mb-1.5">
                Targeted Ingredients To Bring Deficit Organs to 100%:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {deficitMeal.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-700/40 text-[11px] text-amber-200"
                  >
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-amber-400/70 italic mt-3">
              {deficitMeal.charakaCitation}
            </p>

            {onOpenMatraCalculator && (
              <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-amber-300/80">
                  ⚖️ Need exact 1/3 stomach solid grams & native grain matching?
                </span>
                <Button
                  size="sm"
                  onClick={onOpenMatraCalculator}
                  className="bg-amber-600 hover:bg-amber-500 text-amber-50 text-xs font-semibold rounded-xl shadow-md"
                >
                  🌾 Open Charaka Ahara Matra Calculator ➔
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
