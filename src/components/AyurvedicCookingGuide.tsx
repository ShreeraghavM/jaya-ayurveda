// src/components/AyurvedicCookingGuide.tsx
// Comprehensive Ayurvedic Culinary Guide, 3-Course Plate Order (Bhojana Krama),
// Macronutrient Distribution (Carbs, Protein, Fats, Fiber), and Daily Mandatory Essentials (Nitya Sevaniya)
// Grounded in Charaka Vimana 1.21-24, Charaka Sutra 5.12, Sutra 27, and Sushruta Sutra 46.

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
  DailyMacronutrientGoals,
  CookingInstruction,
} from '@/lib/culinaryEngine'

interface Props {
  profile: UserProfile
  mealName?: string
  mealSlot?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  onClose?: () => void
}

export default function AyurvedicCookingGuide({
  profile,
  mealName = 'Aged Harvest Rice & Dal Sambar',
  mealSlot = 'lunch',
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<'3course' | 'macros' | 'cooking' | 'daily10'>('3course')
  const [checkedEssentials, setCheckedEssentials] = useState<Record<string, boolean>>({
    shashtika_shali: true,
    mudga: true,
    saindhava: true,
    sarpi_ghrita: true,
    antariksha_jala: true,
    trikatu_spices: true,
  })

  const courses = getBhojanaKramaCourses(profile)
  const macroGoals: DailyMacronutrientGoals = calculateMealMacronutrients(profile)
  const currentMealMacros = macroGoals.mealBreakdown[mealSlot] || macroGoals.mealBreakdown.lunch
  const cookingSteps: CookingInstruction = getAyurvedicCookingInstructions(mealName, profile.doshaType || 'Pitta')

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
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-amber-100">Ayurvedic Culinary Science & Meal Course</h2>
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/40 text-[10px] font-mono">
                Charaka Vimana 1 & Sutra 5.12
              </Badge>
            </div>
            <p className="text-xs text-amber-300/70">
              Samskāra Cooking Methods · Bhojana Krama 3-Course Plate · Carbs, Protein, Fats & Fiber
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
                  VEDIC BHOJANA KRAMA (ORDER OF SERVING)
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  The Classical 3-Course Rice Bowl Sequence
                </h3>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  In classical Ayurveda (Sushruta Sutra 46 & Charaka Vimana 1.24), meals are never eaten in a haphazard rush. A bowl of rice is divided into 3 distinct portions, each activating a specific stage of digestive neuro-chemistry.
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
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-black">
                      {course.courseNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-100">{course.englishName}</h4>
                      <p className="text-[11px] font-mono text-amber-400/80">{course.sanskritName}</p>
                    </div>
                  </div>
                  <Badge className="bg-black/50 border-amber-700/50 text-[10px] text-amber-300 font-mono">
                    {course.platePortion.split('(')[0].trim()}
                  </Badge>
                </div>

                {/* Traditional Ingredients */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-900/40">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono mb-1">
                    Authentic Preparation & Ingredients:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-amber-100/90 list-disc list-inside">
                    {course.traditionalIngredients.map((ing, idx) => (
                      <li key={idx} className="leading-snug">
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gastrointestinal Reason */}
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/30 flex items-start gap-2 text-xs text-amber-200/90 leading-relaxed">
                  <span className="text-base shrink-0">🩺</span>
                  <div>
                    <span className="font-bold text-amber-100">Why This Sequence?</span>{' '}
                    <span>{course.gastrointestinalPurpose}</span>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-amber-400/60 italic text-right">
                  {course.classicalCitation}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: MACRONUTRIENT BREAKDOWN (Carbs, Protein, Fats, Fiber) ── */}
      {activeTab === 'macros' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-emerald-800/40 bg-gradient-to-br from-[#061b11] to-[#041108] p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                  MACRONUTRIENT & DHATU CALIBRATION
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white capitalize">
                  {mealSlot} Nutritional Profile ({currentMealMacros.caloriesKcal} kcal)
                </h3>
                <p className="mt-0.5 text-xs text-emerald-300/70">
                  Daily TDEE Target: {macroGoals.dailyTdeeKcal} kcal · Dominant Taste: {currentMealMacros.dominantRasa}
                </p>
              </div>
              <span className="text-3xl">📊</span>
            </div>

            {/* 4 Core Macronutrients Grid */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {/* Carbohydrates */}
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-600/40">
                <p className="text-[10px] uppercase font-mono text-amber-400/80">Carbohydrates</p>
                <p className="text-xl font-extrabold text-amber-100 mt-0.5">
                  {currentMealMacros.carbohydratesGrams}g
                </p>
                <p className="text-[10px] text-amber-300/70 font-sans mt-0.5">
                  ~50% kcal · Clean Fuel (Madhura)
                </p>
              </div>

              {/* Protein */}
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-600/40">
                <p className="text-[10px] uppercase font-mono text-emerald-400/80">Protein</p>
                <p className="text-xl font-extrabold text-emerald-100 mt-0.5">
                  {currentMealMacros.proteinGrams}g
                </p>
                <p className="text-[10px] text-emerald-300/70 font-sans mt-0.5">
                  ~18% kcal · Muscle (Mamsa)
                </p>
              </div>

              {/* Healthy Fats */}
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-600/40">
                <p className="text-[10px] uppercase font-mono text-rose-400/80">Healthy Fats</p>
                <p className="text-xl font-extrabold text-rose-100 mt-0.5">
                  {currentMealMacros.healthyFatsGrams}g
                </p>
                <p className="text-[10px] text-rose-300/70 font-sans mt-0.5">
                  ~22% kcal · Ghee / Sneha
                </p>
              </div>

              {/* Dietary Fiber */}
              <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-600/40">
                <p className="text-[10px] uppercase font-mono text-sky-400/80">Dietary Fiber</p>
                <p className="text-xl font-extrabold text-sky-100 mt-0.5">
                  {currentMealMacros.dietaryFiberGrams}g
                </p>
                <p className="text-[10px] text-sky-300/70 font-sans mt-0.5">
                  Gut & Stool Bulk (Purisha)
                </p>
              </div>
            </div>

            {/* Daily Total Summary Bar */}
            <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-emerald-900/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-emerald-300">
                <span>Daily Total Target Carbs: <strong>{macroGoals.targetCarbsGrams}g</strong></span>
                <span>Daily Protein: <strong>{macroGoals.targetProteinGrams}g</strong></span>
                <span>Daily Fiber: <strong>{macroGoals.targetFiberGrams}g</strong></span>
              </div>
              <p className="text-[11px] text-emerald-400/60 leading-relaxed">
                Charaka emphasizes: Energy requirements are dictated strictly by Agni capacity and activity level. Midday lunch receives 45% of daily macros when solar radiation maximizes digestive efficiency.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 3: STEP-BY-STEP COOKING SCIENCE (Samskara) ─────────────── */}
      {activeTab === 'cooking' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-rose-500/40 bg-gradient-to-br from-[#1a080c] to-[#0a0305] p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-mono">
                  KARAN / SAMSKARA (FOOD TRANSFORMATION)
                </Badge>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  Ayurvedic Culinary Instructions for {mealName}
                </h3>
                <p className="mt-0.5 text-xs text-rose-200/80">
                  How cooking transforms heavy substances into light, easily assimilated medicine
                </p>
              </div>
              <span className="text-3xl">🔥</span>
            </div>

            {/* 4 Sequential Cooking Stages */}
            <div className="mt-5 space-y-3">
              {/* Stage 1: Washing & Soaking */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-rose-900/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-700/50">
                    STAGE 1: TOYA SANSIKARSHA (SOAKING)
                  </span>
                </div>
                <p className="text-xs text-rose-100 font-medium mt-1">
                  {cookingSteps.prepPhase.washingAndSoaking}
                </p>
                <p className="text-[11px] text-rose-200/70 italic mt-0.5">
                  Scientific Reason: {cookingSteps.prepPhase.scientificAyurvedicReason}
                </p>
              </div>

              {/* Stage 2: Agni Heat Processing */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-900/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/50">
                    STAGE 2: AGNI SANSIKARSHA (HEATING)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/30">
                    <p className="text-[10px] text-amber-400/70">Method</p>
                    <p className="font-bold text-amber-100">{cookingSteps.agniProcessing.cookingMethod.split('(')[0]}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/30">
                    <p className="text-[10px] text-amber-400/70">Water Ratio</p>
                    <p className="font-bold text-amber-100">{cookingSteps.agniProcessing.waterRatio.split('(')[0]}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/30">
                    <p className="text-[10px] text-amber-400/70">Duration</p>
                    <p className="font-bold text-amber-100">{cookingSteps.agniProcessing.durationMinutes} mins</p>
                  </div>
                </div>
              </div>

              {/* Stage 3: Cow Ghee Tadka / Tempering */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-900/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                    STAGE 3: GHRITA SAMSKARA (TEMPERING / TADKA)
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-200">
                  Carrier Fat: {cookingSteps.ghritaSamskaraTadka.fatUsed}
                </p>
                <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/30 space-y-1 text-xs text-emerald-100">
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
