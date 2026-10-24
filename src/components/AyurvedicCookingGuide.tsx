// src/components/AyurvedicCookingGuide.tsx
// Comprehensive Ayurvedic Culinary Guide, Dynamic Bhojana Krama (3-Course Plate Order),
// Disease Modulation Engine (Prameha, Amlapitta, Grahani, Raktachapa), Macronutrients & 10 Daily Essentials
// Grounded in Charaka Vimana 1.21-24, Charaka Sutra 5.12, Charaka Chikitsa 6, 15, 28, and Sushruta Sutra 46.

import { useState } from 'react'
import type { UserProfile } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getBhojanaKramaCourses,
  calculateMealMacronutrients,
  getAyurvedicCookingInstructions,
  NITYA_SEVANIYA_ESSENTIALS,
  DISEASE_CULINARY_MODULATIONS,
  DailyMacronutrientGoals,
  CookingInstruction,
} from '@/lib/culinaryEngine'
import { getActiveHealingProtocol } from '@/lib/vectorSearch'

interface Props {
  profile: UserProfile
  mealName?: string
  mealSlot?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  initialConditionId?: string | null
  onSelectCondition?: (conditionId: string | null) => void
  onClose?: () => void
}

export default function AyurvedicCookingGuide({
  profile,
  mealName = 'Aged Harvest Rice & Dal Sambar',
  mealSlot = 'lunch',
  initialConditionId,
  onSelectCondition,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<'3course' | 'macros' | 'cooking' | 'daily10'>('3course')
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(
    () => initialConditionId ?? getActiveHealingProtocol()?.remedy.id ?? null
  )
  const [checkedEssentials, setCheckedEssentials] = useState<Record<string, boolean>>({
    shashtika_shali: true,
    mudga: true,
    saindhava: true,
    sarpi_ghrita: true,
    antariksha_jala: true,
    trikatu_spices: true,
  })

  const handleConditionChange = (id: string | null) => {
    setSelectedConditionId(id)
    if (onSelectCondition) onSelectCondition(id)
  }

  const activeModulation = selectedConditionId ? DISEASE_CULINARY_MODULATIONS[selectedConditionId] : null
  const courses = getBhojanaKramaCourses(profile, selectedConditionId)
  const macroGoals: DailyMacronutrientGoals = calculateMealMacronutrients(profile, selectedConditionId)
  const currentMealMacros = macroGoals.mealBreakdown[mealSlot] || macroGoals.mealBreakdown.lunch
  const cookingSteps: CookingInstruction = getAyurvedicCookingInstructions(
    mealName,
    profile.doshaType || 'Pitta',
    selectedConditionId
  )

  const toggleEssential = (id: string) => {
    setCheckedEssentials(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const completedEssentialsCount = Object.values(checkedEssentials).filter(Boolean).length

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ─── Top Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-950/40 text-xl shadow-md">
            🍳
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-amber-100">Ayurvedic Culinary Science & Bhojana Krama</h2>
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/40 text-[10px] font-mono">
                Charaka Vimana 1 & Chikitsa
              </Badge>
            </div>
            <p className="text-xs text-amber-300/70">
              Personalized Plate Order · Clinical Disease Sync · Carbs, Protein, Fats & Daily 10 Essentials
            </p>
          </div>
        </div>

        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-full text-amber-400 hover:bg-amber-900/40 hover:text-amber-100"
          >
            ✕ Close
          </Button>
        )}
      </div>

      {/* ─── CLINICAL DISEASE & PATHOLOGY SELECTOR BAR ─────────────────────── */}
      <div className="rounded-2xl border border-amber-800/40 bg-gradient-to-r from-[#170e04] via-[#201306] to-[#0e0802] p-2.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1">
            <span>🩺</span>
            <span>Clinical Pathology Filter:</span>
          </span>
          <span className="text-[9px] text-amber-200/60 font-sans">
            {activeModulation ? activeModulation.charakaCitation : 'Preventive Wellness Mode'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0.5">
          <button
            onClick={() => handleConditionChange(null)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
              !selectedConditionId
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'bg-black/40 text-emerald-300/70 hover:bg-emerald-950/40 border border-emerald-900/40'
            }`}
          >
            🌿 General Wellness (Native Satmya)
          </button>
          <button
            onClick={() => handleConditionChange('prameha-metabolic')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
              selectedConditionId === 'prameha-metabolic'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-black/40 text-amber-300/70 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            🩸 Diabetes / Sugar (Prameha)
          </button>
          <button
            onClick={() => handleConditionChange('amlapitta')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
              selectedConditionId === 'amlapitta'
                ? 'bg-rose-600 text-white font-bold shadow-md'
                : 'bg-black/40 text-rose-300/70 hover:bg-rose-950/40 border border-rose-900/40'
            }`}
          >
            🍵 Acid Reflux & GERD (Amlapitta)
          </button>
          <button
            onClick={() => handleConditionChange('grahani-ibs')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
              selectedConditionId === 'grahani-ibs'
                ? 'bg-cyan-600 text-white font-bold shadow-md'
                : 'bg-black/40 text-cyan-300/70 hover:bg-cyan-950/40 border border-cyan-900/40'
            }`}
          >
            🔄 IBS & Gut (Grahani)
          </button>
          <button
            onClick={() => handleConditionChange('raktachapa-hypertension')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
              selectedConditionId === 'raktachapa-hypertension'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'bg-black/40 text-indigo-300/70 hover:bg-indigo-950/40 border border-indigo-900/40'
            }`}
          >
            🩺 High BP (Raktachapa)
          </button>
        </div>

        {/* Active Disease Clinical Banner */}
        {activeModulation && (
          <div className="mt-2.5 pt-2 border-t border-amber-900/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="font-bold text-amber-100">{activeModulation.conditionName}</span>
              <span className="text-[10px] text-amber-300/80 font-mono">{activeModulation.sanskritName}</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed italic">
              “{activeModulation.bhojanaKramaModificationRationale}”
            </p>

            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-2">
                <span className="block text-[9px] uppercase font-bold text-emerald-300 mb-1">
                  ✓ Charaka Pathya (Foods to Favor)
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeModulation.pathyaFoods.slice(0, 4).map((f, i) => (
                    <span key={i} className="text-[9px] bg-emerald-900/40 text-emerald-200 px-1.5 py-0.5 rounded-md">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-red-950/30 border border-red-800/40 p-2">
                <span className="block text-[9px] uppercase font-bold text-red-300 mb-1">
                  🚫 Charaka Apathya (Strict Forbidden Foods)
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeModulation.apathyaFoods.slice(0, 4).map((f, i) => (
                    <span key={i} className="text-[9px] bg-red-900/40 text-red-200 px-1.5 py-0.5 rounded-md">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Sub-Tab Navigation Bar ─────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-black/40 p-1 border border-amber-900/40 text-xs font-medium">
        <button
          onClick={() => setActiveTab('3course')}
          className={`py-2 rounded-xl transition ${
            activeTab === '3course'
              ? 'bg-amber-700/80 text-white font-bold shadow-md'
              : 'text-amber-300/70 hover:text-amber-100'
          }`}
        >
          🍛 3-Course Plate
        </button>
        <button
          onClick={() => setActiveTab('macros')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'macros'
              ? 'bg-emerald-700/80 text-white font-bold shadow-md'
              : 'text-emerald-300/70 hover:text-emerald-100'
          }`}
        >
          📊 Macros & Nutrients
        </button>
        <button
          onClick={() => setActiveTab('cooking')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'cooking'
              ? 'bg-rose-700/80 text-white font-bold shadow-md'
              : 'text-rose-300/70 hover:text-rose-100'
          }`}
        >
          🔥 Cooking Method
        </button>
        <button
          onClick={() => setActiveTab('daily10')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'daily10'
              ? 'bg-sky-700/80 text-white font-bold shadow-md'
              : 'text-sky-300/70 hover:text-sky-100'
          }`}
        >
          🌿 Daily 10 Essentials
        </button>
      </div>

      {/* ─── TAB 1: 3-COURSE PLATE EXPERIENCE (Bhojana Krama) ────────────── */}
      {activeTab === '3course' && (
        <div className="space-y-4">
          {/* Classical Grounding Banner */}
          <Card className="rounded-2xl border-amber-500/40 bg-gradient-to-br from-[#1d1305] via-[#241806] to-[#0d0903] p-4 text-amber-50 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-mono">
                  VEDIC BHOJANA KRAMA (DYNAMIC SERVING ORDER)
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  {activeModulation ? `${activeModulation.conditionName} Modulated Sequence` : 'The Classical 3-Course Meal Sequence'}
                </h3>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  In classical Ayurveda (Sushruta Sutra 46 & Charaka Vimana 1.24), meals are never eaten in a haphazard rush. The plate is divided into 3 distinct portions, each activating a specific stage of digestive neuro-chemistry and calibrated to your health.
                </p>
              </div>
              <span className="text-3xl shrink-0">🍚</span>
            </div>
          </Card>

          {/* 3 Courses Cards */}
          <div className="space-y-3">
            {courses.map(course => (
              <Card
                key={course.courseNumber}
                className="rounded-2xl border-amber-900/50 bg-gradient-to-r from-amber-950/60 to-[#0e0904] p-4 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
                      #{course.courseNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-100">{course.englishName}</h4>
                      <p className="text-[10px] font-mono text-amber-400">{course.sanskritName}</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-900/40 border-amber-700/50 text-[9px] text-amber-200 font-mono">
                    {course.platePortion}
                  </Badge>
                </div>

                {course.diseaseModulationNote && (
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-600/40 text-[10px] text-amber-200 flex items-start gap-1.5">
                    <span>🩺</span>
                    <span><strong>Clinical Adaptation:</strong> {course.diseaseModulationNote}</span>
                  </div>
                )}

                {course.regionalVariant && !course.diseaseModulationNote && (
                  <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-[10px] text-emerald-300">
                    🌍 {course.regionalVariant}
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Prescribed Course Foods:</p>
                  <ul className="grid sm:grid-cols-2 gap-1 text-xs text-amber-200/90">
                    {course.traditionalIngredients.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-900/40 text-xs text-amber-100/90 leading-relaxed">
                  <strong className="text-amber-300">Physiological Action: </strong>
                  {course.gastrointestinalPurpose}
                </div>

                <p className="text-[10px] italic text-amber-400/70 font-mono border-t border-amber-950 pt-1.5">
                  {course.classicalCitation}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: MACRONUTRIENTS & CALORIES ────────────────────────────── */}
      {activeTab === 'macros' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-emerald-500/40 bg-gradient-to-br from-[#061e12] to-[#030f09] p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                  CHARAKA SUTRA 27 & DHATU POSHANA
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  Macronutrient Distribution: Carbs, Protein, Fats & Fiber
                </h3>
                <p className="mt-0.5 text-xs text-emerald-200/80">
                  {activeModulation
                    ? `Clinical ${activeModulation.conditionName} Target Ratios Active`
                    : 'Balanced Ayurvedic Dhatu Building Macro Targets'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400/80">Daily TDEE</span>
                <p className="text-lg font-mono font-bold text-emerald-100">{macroGoals.dailyTdeeKcal} kcal</p>
              </div>
            </div>

            {/* 4 Macro Gauges */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Carbs */}
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-center">
                <p className="text-[10px] font-mono uppercase text-amber-400 font-bold">Carbohydrates</p>
                <p className="text-xl font-bold font-mono text-amber-100 mt-1">{macroGoals.targetCarbsGrams}g</p>
                <Badge className="mt-1 bg-amber-500/20 text-amber-300 border-none text-[9px]">
                  {macroGoals.mealBreakdown.lunch.carbsPercentage}% of Calories
                </Badge>
                <p className="text-[9px] text-amber-300/60 mt-1">Madhura Rasa / Balya</p>
              </div>

              {/* Protein */}
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-center">
                <p className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Plant Protein</p>
                <p className="text-xl font-bold font-mono text-emerald-100 mt-1">{macroGoals.targetProteinGrams}g</p>
                <Badge className="mt-1 bg-emerald-500/20 text-emerald-300 border-none text-[9px]">
                  {macroGoals.mealBreakdown.lunch.proteinPercentage}% of Calories
                </Badge>
                <p className="text-[9px] text-emerald-300/60 mt-1">Mamsa Dhatu / Ojas</p>
              </div>

              {/* Fats */}
              <div className="p-3 rounded-2xl bg-yellow-950/40 border border-yellow-800/40 text-center">
                <p className="text-[10px] font-mono uppercase text-yellow-400 font-bold">Healthy Fats (Ghee)</p>
                <p className="text-xl font-bold font-mono text-yellow-100 mt-1">{macroGoals.targetFatsGrams}g</p>
                <Badge className="mt-1 bg-yellow-500/20 text-yellow-300 border-none text-[9px]">
                  {macroGoals.mealBreakdown.lunch.fatsPercentage}% of Calories
                </Badge>
                <p className="text-[9px] text-yellow-300/60 mt-1">Sneha / Yogavahi</p>
              </div>

              {/* Fiber */}
              <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-center">
                <p className="text-[10px] font-mono uppercase text-teal-400 font-bold">Dietary Fiber</p>
                <p className="text-xl font-bold font-mono text-teal-100 mt-1">{macroGoals.targetFiberGrams}g</p>
                <Badge className="mt-1 bg-teal-500/20 text-teal-300 border-none text-[9px]">
                  Soluble & Insoluble
                </Badge>
                <p className="text-[9px] text-teal-300/60 mt-1">Purisha / Srotoshodhana</p>
              </div>
            </div>

            {/* Diurnal Caloric Distribution */}
            <div className="mt-5 p-3 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Diurnal Agni Caloric Allocation:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-1.5 rounded-xl bg-emerald-950/40">
                  <p className="text-[9px] text-emerald-400 font-mono">Breakfast (25%)</p>
                  <p className="font-bold text-emerald-100 font-mono">{macroGoals.mealBreakdown.breakfast.caloriesKcal} cal</p>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-950/50 border border-amber-500/40">
                  <p className="text-[9px] text-amber-300 font-bold font-mono">Lunch Peak (45%)</p>
                  <p className="font-bold text-amber-100 font-mono">{macroGoals.mealBreakdown.lunch.caloriesKcal} cal</p>
                </div>
                <div className="p-1.5 rounded-xl bg-emerald-950/40">
                  <p className="text-[9px] text-emerald-400 font-mono">Dinner (25%)</p>
                  <p className="font-bold text-emerald-100 font-mono">{macroGoals.mealBreakdown.dinner.caloriesKcal} cal</p>
                </div>
                <div className="p-1.5 rounded-xl bg-emerald-950/40">
                  <p className="text-[9px] text-emerald-400 font-mono">Snack (5%)</p>
                  <p className="font-bold text-emerald-100 font-mono">{macroGoals.mealBreakdown.snack.caloriesKcal} cal</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 3: AYURVEDIC COOKING METHOD (Samskara) ──────────────────── */}
      {activeTab === 'cooking' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-rose-500/40 bg-gradient-to-br from-[#1d060a] to-[#0f0305] p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-mono">
                  CHARAKA VIMANA 1.21-22 (SAMSKARA / KARAN)
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  Classical Samskāra Cooking Process: {mealName}
                </h3>
                <p className="mt-0.5 text-xs text-rose-200/80">
                  How heat, water contact, and ghee tempering qualitatively transform food from heavy (Guru) to light (Laghu)
                </p>
              </div>
              <span className="text-3xl">🔥</span>
            </div>

            {cookingSteps.clinicalDiseaseNote && (
              <div className="mt-3 p-2 rounded-xl bg-amber-950/50 border border-amber-600/40 text-xs text-amber-200 flex items-center gap-2">
                <span>🩺</span>
                <span><strong>Clinical Directive:</strong> {cookingSteps.clinicalDiseaseNote}</span>
              </div>
            )}

            <div className="mt-5 space-y-4">
              {/* Stage 1: Prep Phase */}
              <div className="p-3 rounded-2xl bg-black/40 border border-rose-900/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">💧</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    STAGE 1: TOYA SANNIKARSHA (WASHING & SOAKING)
                  </span>
                </div>
                <p className="text-xs text-rose-100 leading-relaxed font-mono">
                  {cookingSteps.prepPhase.washingAndSoaking}
                </p>
                <p className="text-[11px] text-amber-300/80 italic">
                  Ayurvedic Science: {cookingSteps.prepPhase.scientificAyurvedicReason}
                </p>
              </div>

              {/* Stage 2: Agni Processing */}
              <div className="p-3 rounded-2xl bg-black/40 border border-rose-900/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">🥘</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    STAGE 2: AGNI SANNIKARSHA (COOKING & WATER RATIOS)
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-rose-950/30">
                    <span className="block text-[9px] uppercase text-rose-400">Method</span>
                    <span className="font-bold text-rose-100">{cookingSteps.agniProcessing.cookingMethod}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-950/30">
                    <span className="block text-[9px] uppercase text-rose-400">Water Ratio</span>
                    <span className="font-bold text-rose-100">{cookingSteps.agniProcessing.waterRatio}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-950/30">
                    <span className="block text-[9px] uppercase text-rose-400">Flame & Duration</span>
                    <span className="font-bold text-rose-100">
                      {cookingSteps.agniProcessing.fireIntensity} · {cookingSteps.agniProcessing.durationMinutes}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage 3: Ghrita Samskara (Tadka) */}
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🧈</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    STAGE 3: GHRITA SAMSKARA (TEMPERING / TADKA)
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-200">
                  Carrier Fat: {cookingSteps.ghritaSamskaraTadka.fatUsed}
                </p>
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/30 space-y-1 text-xs text-emerald-100">
                  {cookingSteps.ghritaSamskaraTadka.spiceOrder.map((step, idx) => (
                    <p key={idx}>{step}</p>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  Bio-Availability Purpose: {cookingSteps.ghritaSamskaraTadka.medicinalPurpose}
                </p>
              </div>

              {/* Stage 4: Serving Rule */}
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-700/40 text-xs text-rose-200 flex items-center gap-2">
                <span className="text-base">⏱️</span>
                <span>
                  <strong>Golden Serving Rule:</strong> {cookingSteps.servingRule}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 4: NITYA SEVANIYA AHARA (10 Classical Daily Essentials) ── */}
      {activeTab === 'daily10' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-sky-500/40 bg-gradient-to-br from-[#061924] to-[#041118] p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/40 text-[10px] font-mono">
                  CHARAKA SUTRA 5.12 (NITYA SEVANIYA)
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  The 10 Sacred Foods to Eat Daily for Life
                </h3>
                <p className="mt-0.5 text-xs text-sky-200/80">
                  Charaka mandates that these 10 foods must be consumed daily to prevent all disease and maintain youth
                </p>
              </div>
              <Badge className="bg-sky-600 text-white font-bold text-xs px-3 py-1">
                {completedEssentialsCount} / 10 Consumed
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-sky-900/50">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${(completedEssentialsCount / 10) * 100}%` }}
              />
            </div>

            {/* 10 Items Checklist */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {NITYA_SEVANIYA_ESSENTIALS.map(item => {
                const isChecked = !!checkedEssentials[item.id]
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleEssential(item.id)}
                    className={`cursor-pointer p-3 rounded-2xl border transition flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-sky-950/60 border-sky-500/60 text-white'
                        : 'bg-black/40 border-sky-900/40 text-sky-300/60 hover:bg-sky-950/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 h-4 w-4 rounded border-sky-500 text-sky-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-sky-100">{item.englishName}</p>
                        <span className="text-[9px] font-mono text-sky-400">{item.nutrientCategory}</span>
                      </div>
                      <p className="text-[10px] font-mono text-amber-300/80 mt-0.5">{item.sanskritName}</p>
                      <p className="text-[11px] text-sky-200/70 mt-1 leading-snug">{item.classicalBenefit}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
