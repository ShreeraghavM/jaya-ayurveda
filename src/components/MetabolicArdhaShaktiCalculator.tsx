// src/components/MetabolicArdhaShaktiCalculator.tsx
// Interactive Charaka Agni-BMR, TDEE, Ardha-Shakti Exercise Guard & Vasanta Ritu (Spring) Bio-Shield Component

import { useState, useMemo } from 'react'
import type { UserProfile } from '@/lib/data'
import {
  calculateAyurvedicMetabolism,
  type ActivityLevel,
} from '@/lib/metabolicEngine'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  profile: UserProfile
  onClose?: () => void
}

export default function MetabolicArdhaShaktiCalculator({ profile, onClose }: Props) {
  const [activityOverride, setActivityOverride] = useState<ActivityLevel | undefined>(undefined)
  const [springMode, setSpringMode] = useState<boolean>(true) // default to spring mode for demonstration
  const [activeSubTab, setActiveSubTab] = useState<'metabolism' | 'exercise' | 'spring'>('metabolism')

  const metabolism = useMemo(
    () => calculateAyurvedicMetabolism(profile, activityOverride, springMode),
    [profile, activityOverride, springMode]
  )

  const {
    baselineBmrKcal,
    ayurvedicAgniType,
    agniMultiplier,
    ayurvedicBmrKcal,
    activityLevel,
    dailyTdeeKcal,
    mealPortionsKcal,
    exerciseCapacity,
    springBioShield,
  } = metabolism

  return (
    <div className="space-y-6">
      {/* ─── HEADER BANNER ─── */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#1c1205] via-[#120a02] to-[#080501] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl">🔥</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">
                CHARAKA VIMANA 8 (AHARA & VYAYAMA SHAKTI)
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                SUTRA 6 (VASANTA RITU) & SUTRA 7 (ARDHA-SHAKTI)
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-50">
              Ayurvedic Metabolic Engine & Spring Bio-Shield
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-xl">
              Scientific BMR & TDEE calibrated by your Weight, Height, Age, and Agni-Bala, combined with the 50% Ardha-Shakti exercise law and Spring seasonal allergy defense.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpringMode(!springMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition ${
                springMode
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                  : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
              }`}
            >
              {springMode ? '🌸 Spring Shield: ACTIVE' : '🍂 Auto Season Mode'}
            </button>
            {onClose && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-amber-800/40 bg-black/40 text-xs text-amber-200 hover:bg-amber-950/40"
              >
                Close
              </Button>
            )}
          </div>
        </div>

        {/* SUB-TABS */}
        <div className="mt-5 flex gap-2 border-t border-amber-900/40 pt-4 overflow-x-auto [scrollbar-width:none]">
          <button
            onClick={() => setActiveSubTab('metabolism')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'metabolism'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-amber-200/70 hover:bg-amber-950/40'
            }`}
          >
            🔥 BMR, TDEE & Agni ({dailyTdeeKcal} kcal)
          </button>
          <button
            onClick={() => setActiveSubTab('exercise')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'exercise'
                ? 'bg-emerald-500 text-stone-950 font-bold shadow'
                : 'text-emerald-300/70 hover:bg-emerald-950/40'
            }`}
          >
            🏃 Ardha-Shakti (Half-Capacity Exercise)
          </button>
          <button
            onClick={() => setActiveSubTab('spring')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'spring'
                ? 'bg-rose-500 text-white font-bold shadow'
                : 'text-rose-300/70 hover:bg-rose-950/40'
            }`}
          >
            🌸 Spring Season (Vasanta Ritu) Bio-Shield
          </button>
        </div>
      </div>

      {/* ─── TAB 1: METABOLISM, BMR & TDEE ─── */}
      {activeSubTab === 'metabolism' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: BMR & Agni */}
          <Card className="rounded-3xl border-amber-500/30 bg-[#120a02]/90 p-5 shadow-xl text-amber-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Basal Metabolic Rate (BMR)
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono text-[10px]">
                CHARAKA VIMANA 8.120
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-mono text-amber-100">{ayurvedicBmrKcal}</span>
              <span className="text-xs text-amber-300 font-mono">kcal/day at cellular rest</span>
            </div>

            <p className="text-xs text-amber-200/70 leading-relaxed mb-4">
              Energy burned by your organs (Heart, Brain, Liver, Kidneys) strictly at complete physical and digestive rest, calibrated by height, weight, and your Ayurvedic metabolic fire.
            </p>

            <div className="space-y-2.5 p-3 rounded-2xl bg-black/40 border border-amber-900/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-300/80">Standard WHO/Mifflin BMR:</span>
                <span className="font-mono text-amber-100 font-semibold">{baselineBmrKcal} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-300/80">Ayurvedic Agni Classification:</span>
                <span className="font-mono text-amber-200 font-bold">{ayurvedicAgniType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-300/80">Cellular Agni Multiplier:</span>
                <span className="font-mono text-emerald-400 font-bold">×{agniMultiplier.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-amber-900/40 text-[11px] text-amber-200/70 italic">
                *Pitta dominance (Tikshnagni) increases basal oxidation by 10%, whereas Kapha dominance (Mandagni) conserves energy with slower tissue turnover.
              </div>
            </div>
          </Card>

          {/* Card B: TDEE & Caloric Allocation */}
          <Card className="rounded-3xl border-emerald-500/30 bg-[#07160c]/90 p-5 shadow-xl text-emerald-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Total Daily Energy Expenditure (TDEE)
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-mono text-[10px]">
                JARANA SHAKTI CAPACITY
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-mono text-emerald-100">{dailyTdeeKcal}</span>
              <span className="text-xs text-emerald-300 font-mono">kcal total burn/day</span>
            </div>

            <p className="text-xs text-emerald-200/70 leading-relaxed mb-3">
              Total caloric needs incorporating your profession physical activity level (PAL ×{metabolism.physicalActivityMultiplier}).
            </p>

            {/* Meal Allocation aligned with Jatharagni */}
            <div className="grid grid-cols-4 gap-1.5 text-center mt-3">
              <div className="rounded-xl bg-emerald-950/60 border border-emerald-800/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-400 font-mono">Morning</span>
                <span className="block text-xs font-bold text-emerald-100 font-mono mt-0.5">{mealPortionsKcal.breakfastKcal}</span>
                <span className="block text-[8px] text-emerald-300/60 font-sans">25% Agni</span>
              </div>
              <div className="rounded-xl bg-amber-950/60 border border-amber-500/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-amber-300 font-mono">Midday</span>
                <span className="block text-xs font-bold text-amber-100 font-mono mt-0.5">{mealPortionsKcal.lunchKcal}</span>
                <span className="block text-[8px] text-amber-200/70 font-sans">45% Peak</span>
              </div>
              <div className="rounded-xl bg-indigo-950/60 border border-indigo-800/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-indigo-300 font-mono">Sunset</span>
                <span className="block text-xs font-bold text-indigo-100 font-mono mt-0.5">{mealPortionsKcal.dinnerKcal}</span>
                <span className="block text-[8px] text-indigo-200/60 font-sans">25% Light</span>
              </div>
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-900/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-400 font-mono">Teatime</span>
                <span className="block text-xs font-bold text-emerald-200 font-mono mt-0.5">{mealPortionsKcal.snackKcal}</span>
                <span className="block text-[8px] text-emerald-300/60 font-sans">5% Snack</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-emerald-300/80 pt-2 border-t border-emerald-900/40">
              <span>Activity Profile:</span>
              <span className="font-semibold text-emerald-100 uppercase font-mono">{activityLevel.replace('_', ' ')}</span>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: ARDHA-SHAKTI (EXERCISE CAPACITY) ─── */}
      {activeSubTab === 'exercise' && (
        <Card className="rounded-3xl border-emerald-500/40 bg-gradient-to-br from-[#06180c] via-[#092212] to-[#040f07] p-5 sm:p-6 shadow-2xl text-emerald-50">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏃</span>
                <h3 className="text-lg font-bold text-emerald-100">
                  The Ardha-Shakti (Half-Capacity) Exercise Law
                </h3>
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">
                Charaka Sutra Sthana 7.31–35: Exact formula to ignite metabolism without causing muscle depletion or immune fatigue.
              </p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono text-xs">
              SAFE HR ZONE: {exerciseCapacity.ardhaShaktiTargetZoneBpm.minBpm} – {exerciseCapacity.ardhaShaktiTargetZoneBpm.maxSafeBpm} BPM
            </Badge>
          </div>

          {/* 3 STAT METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-800/40">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Target Safe Heart Rate</span>
              <span className="text-2xl font-bold font-mono text-emerald-100 block mt-1">
                ~{exerciseCapacity.ardhaShaktiTargetZoneBpm.targetBpm} <span className="text-xs text-emerald-400">BPM</span>
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">50% to 70% of HR Max (192 BPM)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-800/40">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Max Safe Active Burn</span>
              <span className="text-2xl font-bold font-mono text-amber-200 block mt-1">
                ~{exerciseCapacity.maxSafeWorkoutCaloriesKcal} <span className="text-xs text-amber-400">kcal</span>
              </span>
              <span className="text-[10px] text-amber-200/70 block mt-0.5">18% of TDEE (Prevents Dhatu breakdown)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-800/40">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Optimal Daily Duration</span>
              <span className="text-2xl font-bold font-mono text-emerald-100 block mt-1">
                {exerciseCapacity.recommendedDailyWorkoutMinutes} <span className="text-xs text-emerald-400">mins</span>
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">Customized for {profile.doshaType || 'Pitta'} stamina</span>
            </div>
          </div>

          {/* 3 CLASSICAL CLINICAL STOP SIGNS */}
          <div className="rounded-2xl border border-emerald-800/50 bg-[#092212]/70 p-4 mb-4">
            <span className="text-xs font-mono uppercase text-emerald-300 font-bold tracking-wider block mb-3">
              📜 3 Physical Signs You Have Reached Half-Capacity (Stop Exertion Immediately):
            </span>
            <div className="space-y-3">
              {exerciseCapacity.classicalArdhaShaktiSigns.map((sign, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/30 border border-emerald-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-100 font-mono">{sign.signSanskrit}</span>
                    <span className="text-[11px] text-emerald-400 font-medium">({sign.signEnglish})</span>
                  </div>
                  <p className="text-xs text-emerald-200/80 pl-7 leading-relaxed">{sign.actionRequired}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/40 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <span className="text-xs font-bold text-amber-200 block">Charaka's Clinical Warning Against Overtraining:</span>
              <p className="text-xs text-amber-100/80 mt-0.5 leading-relaxed">
                {exerciseCapacity.overtrainingWarning}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ─── TAB 3: SPRING SEASON (VASANTA RITU) BIO-SHIELD ─── */}
      {activeSubTab === 'spring' && (
        <Card className="rounded-3xl border-rose-500/40 bg-gradient-to-br from-[#1a070c] via-[#240b12] to-[#0c0306] p-5 sm:p-6 shadow-2xl text-rose-50">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="text-lg font-bold text-rose-100">
                  Vasanta Ritu (Spring Season) Pathophysiology & Bio-Shield
                </h3>
              </div>
              <p className="text-xs text-rose-300/80 mt-1">
                Charaka Sutra Sthana 6.22–26: The classical science of seasonal Kapha liquefaction and doused Agni.
              </p>
            </div>
            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 font-mono text-xs">
              CHAITRA & VAISHAKHA (SPRING SHIELD)
            </Badge>
          </div>

          {/* PATHOLOGY EXPLANATION */}
          <div className="p-4 rounded-2xl bg-black/40 border border-rose-900/50 mb-5 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">📜 Classical Sutra:</span>
              <span className="text-rose-200/90 italic font-serif leading-relaxed">
                "वसन्ते भ्रमण्डीभूतः श्लेष्मा देहेषु संचितः। हेमन्ते शीतसङ्घातात्सूर्यपादेः प्रतापितः॥ हन्ति कायाग्निम्..." (चरक सूत्र ६.२२)
              </span>
            </div>
            <p className="text-rose-200/80 leading-relaxed pt-1 border-t border-rose-950/60">
              {springBioShield.pathologyAlert}
            </p>
            <p className="text-amber-200/80 leading-relaxed font-medium">
              💡 {springBioShield.dousedAgniExplanation}
            </p>
          </div>

          {/* DIETARY PROTOCOLS & SUPERFOODS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-600/40 text-xs">
              <span className="text-emerald-300 font-bold uppercase tracking-wider block mb-2 font-mono">
                ✓ Mandatory Spring Superfoods (Kapha Scrapers):
              </span>
              <ul className="space-y-1.5 text-emerald-100/90">
                {springBioShield.dietaryAdjustments.keySpringSuperfoods.map((food, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">🌾</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-700/40 text-xs">
              <span className="text-red-300 font-bold uppercase tracking-wider block mb-2 font-mono">
                ✗ Strictly Prohibited in Spring (Causes Instant Ama):
              </span>
              <ul className="space-y-1.5 text-red-100/90">
                {springBioShield.dietaryAdjustments.strictlyAvoidFoods.map((food, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">🚫</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STRICT PROHIBITION: NO DAY SLEEP */}
          <div className="p-4 rounded-2xl bg-red-900/30 border border-red-500/60 mb-5 text-xs">
            {springBioShield.strictProhibitions.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-sm font-bold text-red-100">{p.rule}</span>
                <p className="text-red-200/90 leading-relaxed">{p.classicalReason}</p>
              </div>
            ))}
          </div>

          {/* SPRING DAILY REGIMEN (DINACHARYA) */}
          <div className="p-4 rounded-2xl bg-black/40 border border-rose-900/50">
            <span className="text-xs font-mono uppercase text-rose-300 font-bold tracking-wider block mb-3">
              🌸 3 Spring Dinacharya Protocols for Zero Allergies:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {springBioShield.springDinacharyaProtocols.map((proto, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs">
                  <span className="font-bold text-rose-100 block mb-0.5">{proto.protocolName}</span>
                  <span className="text-[10px] text-rose-400 font-mono block mb-1.5">{proto.sanskritTerm}</span>
                  <p className="text-[11px] text-rose-200/80 mb-2 leading-relaxed">{proto.instructions}</p>
                  <span className="text-[10px] text-emerald-300 font-semibold block pt-1 border-t border-rose-900/40">
                    ⚡ {proto.benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
