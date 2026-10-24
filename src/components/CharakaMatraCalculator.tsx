// src/components/CharakaMatraCalculator.tsx
// Interactive Charaka Ahara Matra (Quantity & 1/3 Stomach Division) and Desha-Satmya (Native Geography) Calculator

import { useState, useMemo } from 'react'
import type { UserProfile } from '@/lib/data'
import {
  calculateCharakaPortioning,
  getDeshaSatmyaProfile,
  saveDeshaSatmyaProfile,
  DESHA_DEFINITIONS,
  STAPLE_GRAIN_NAMES,
  type ClassicalDeshaType,
  type StapleGrainType,
  type DeshaSatmyaProfile,
} from '@/lib/deshaSatmyaEngine'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  profile: UserProfile
  onClose?: () => void
}

export default function CharakaMatraCalculator({ profile, onClose }: Props) {
  const [deshaProfile, setDeshaProfile] = useState<DeshaSatmyaProfile>(() => getDeshaSatmyaProfile(profile))
  const [isEditingHeritage, setIsEditingHeritage] = useState(false)

  // Compute live portioning metrics
  const calculation = useMemo(
    () => calculateCharakaPortioning(profile, deshaProfile),
    [profile, deshaProfile]
  )

  const handleUpdateHeritage = (updates: Partial<DeshaSatmyaProfile>) => {
    const next = { ...deshaProfile, ...updates }
    setDeshaProfile(next)
    saveDeshaSatmyaProfile(next)
  }

  const currentDeshaMeta = DESHA_DEFINITIONS[deshaProfile.deshaType]

  return (
    <div className="space-y-6">
      {/* ─── HEADER BANNER ─── */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#1c1407] via-[#120c04] to-[#080501] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl">🌾</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">
                CHARAKA SUTRA 5 & VIMANA 2
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                DESHA-SATMYA NATIVE SOIL DOCTRINE
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-50">
              Charaka Ahara Matra & Desha-Satmya Calculator
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-xl">
              Quantitative meal portioning according to the 1/3 Stomach Division Rule, calibrated by your Age, Gender, Native Geography, and Childhood Heritage Grains.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsEditingHeritage(!isEditingHeritage)}
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-mono shadow-md"
            >
              {isEditingHeritage ? '✓ Done Editing' : '✏️ Edit Birth Soil & Grain'}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-amber-800 text-amber-300 rounded-xl text-xs font-mono"
              >
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Shloka Citation Card */}
        <div className="mt-4 pt-3 border-t border-amber-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-amber-300/90 italic font-serif">
            "मात्राशी स्यात् । आहारमात्रा पुनरग्निबलापेक्षिणी ॥" — चरक सूत्र ५.३
          </p>
          <span className="text-[11px] text-amber-400/60 font-mono">
            Every food measure is dictated by Agni and native habitat
          </span>
        </div>
      </div>

      {/* ─── HERITAGE & NATIVE SOIL EDITOR (DESHA SATMYA & OKA SATMYA) ─── */}
      {isEditingHeritage && (
        <Card className="rounded-3xl border-amber-500/40 bg-[#0d0903] p-5 shadow-2xl text-amber-50 animate-in fade-in">
          <h3 className="text-sm font-bold text-amber-100 mb-3 flex items-center gap-2">
            <span>🌍</span> Configure Your Native Heritage & Childhood Staple
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Birth Geography */}
            <div>
              <label className="text-xs font-mono text-amber-300 block mb-1.5">
                Where were you born and raised? (Janma Desha)
              </label>
              <select
                value={deshaProfile.deshaType}
                onChange={e => {
                  const val = e.target.value as ClassicalDeshaType
                  const birthDesc =
                    val === 'anupa'
                      ? 'South India (Coastal/Deccan)'
                      : val === 'jangala'
                      ? 'Western India (Gujarat/Rajasthan/Arid)'
                      : 'North India (Fertile Plains)'
                  handleUpdateHeritage({ deshaType: val, birthRegion: birthDesc })
                }}
                className="w-full rounded-xl border border-amber-800/60 bg-black/60 p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              >
                <option value="anupa">Anupa Desha (Wet/Coastal/River Delta — e.g. South/Kerala/Bengal/Coast)</option>
                <option value="jangala">Jangala Desha (Dry/Arid/Desert Plateau — e.g. Rajasthan/Gujarat/Deccan)</option>
                <option value="sadharana">Sadharana Desha (Moderate/Fertile River Basin — e.g. North/Plains/Central)</option>
              </select>
              <p className="text-[10px] text-amber-400/60 mt-1 italic">
                {currentDeshaMeta.nativeDietRules}
              </p>
            </div>

            {/* Childhood Staple Grain */}
            <div>
              <label className="text-xs font-mono text-amber-300 block mb-1.5">
                Staple grain from mother's kitchen? (Oka-Satmya)
              </label>
              <select
                value={deshaProfile.stapleGrain}
                onChange={e => handleUpdateHeritage({ stapleGrain: e.target.value as StapleGrainType })}
                className="w-full rounded-xl border border-amber-800/60 bg-black/60 p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              >
                {(Object.keys(STAPLE_GRAIN_NAMES) as StapleGrainType[]).map(g => (
                  <option key={g} value={g}>
                    {STAPLE_GRAIN_NAMES[g].label} ({STAPLE_GRAIN_NAMES[g].sanskrit})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-amber-400/60 mt-1">
                Thermal Action: <span className="text-amber-200 capitalize">{STAPLE_GRAIN_NAMES[deshaProfile.stapleGrain].thermalAction}</span> · Digestibility: <span className="text-amber-200 capitalize">{STAPLE_GRAIN_NAMES[deshaProfile.stapleGrain].digestibility}</span>
              </p>
            </div>

            {/* Current Living City */}
            <div>
              <label className="text-xs font-mono text-amber-300 block mb-1.5">
                Current City of Residence (Vartamana Desha)
              </label>
              <input
                type="text"
                value={deshaProfile.currentLivingCity}
                onChange={e => handleUpdateHeritage({ currentLivingCity: e.target.value })}
                className="w-full rounded-xl border border-amber-800/60 bg-black/60 p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                placeholder="e.g. Bengaluru, India or London, UK"
              />
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="text-xs font-mono text-amber-300 block mb-1.5">
                Dietary Preference & Heritage
              </label>
              <select
                value={deshaProfile.dietaryPreference}
                onChange={e => handleUpdateHeritage({ dietaryPreference: e.target.value as DeshaSatmyaProfile['dietaryPreference'] })}
                className="w-full rounded-xl border border-amber-800/60 bg-black/60 p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              >
                <option value="vegetarian">Pure Vegetarian (Lacto-vegetarian)</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_vegetarian">Non-Vegetarian (Fish / River Fowl)</option>
                <option value="vegan">Plant-Based (Vegan)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* ─── THE 1/3 STOMACH DIVISION RULE GRAPHIC (TRIVIDHA KUKSHI) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3-TIER VOLUMETRIC STOMACH DIAGRAM (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-amber-600/40 bg-gradient-to-b from-[#140f06] to-[#070502] p-5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              Trividha Kukshi · 3-Tier Stomach
            </span>
            <span className="text-[10px] text-amber-500/70 font-mono">
              Total: ~{calculation.totalGastricCapacityMl}ml
            </span>
          </div>

          {/* Volumetric Visual Container */}
          <div className="w-full max-w-[280px] mx-auto space-y-2 py-2">
            {/* Tier 1: Empty Churn Space (1/3) */}
            <div className="p-3.5 rounded-2xl border border-dashed border-sky-500/40 bg-sky-950/20 text-center relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300">🌬️ 1/3 Empty Space</span>
                <span className="text-xs font-mono font-bold text-sky-200">
                  ~{calculation.emptyChurnSpaceMl} ml
                </span>
              </div>
              <p className="text-[10px] text-sky-200/70 mt-1 text-left leading-relaxed">
                Mandatory free volume for Vata (churning), Pitta (enzymes), and Kapha (mucus) to break down food unhindered.
              </p>
            </div>

            {/* Tier 2: Liquid Intake (1/3) */}
            <div className="p-3.5 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 text-center relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">🥣 1/3 Liquid Intake</span>
                <span className="text-xs font-mono font-bold text-cyan-200">
                  ~{calculation.liquidFoodMl} ml
                </span>
              </div>
              <p className="text-[10px] text-cyan-200/70 mt-1 text-left leading-relaxed">
                Thin digestive dal soup, spiced rasam, warm ginger water, or seasoned buttermilk (Takra).
              </p>
            </div>

            {/* Tier 3: Solid Food Portion (1/3) */}
            <div className="p-3.5 rounded-2xl border border-amber-500/50 bg-amber-950/40 text-center relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">🌾 1/3 Solid Food</span>
                <span className="text-xs font-mono font-bold text-amber-200">
                  ~{calculation.solidFoodGrams} grams
                </span>
              </div>
              <p className="text-[10px] text-amber-200/70 mt-1 text-left leading-relaxed">
                Cooked native grains, lentils, and steamed vegetables. Never exceeds one-third of the gastric volume.
              </p>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-amber-900/40 text-[11px] text-amber-200/80 leading-relaxed text-center font-mono">
            Calibrated for: <span className="text-white font-bold">{profile.weight}kg · Age {profile.age} · {profile.gender}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: AGE & GENDER BIO-METRICS + NATIVE MEAL (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AGE & GENDER ADAPTATION METERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Age Guru-Laghu Ratio */}
            <Card className="p-4 rounded-2xl border-amber-800/40 bg-[#0d0903] text-amber-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Life Stage ({calculation.lifeStageCategory})
                </span>
                <span className="text-xs font-bold font-mono text-amber-200">Age {profile.age}</span>
              </div>
              <p className="text-[11px] text-amber-300/70 mb-2">
                Heavy (*Guru*) vs. Light (*Laghu*) Balance
              </p>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-amber-300">Laghu (Light): {calculation.lightFoodRatioPct}%</span>
                <span className="text-amber-500">Guru (Dense): {calculation.heavyFoodRatioPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-amber-950 overflow-hidden flex">
                <div style={{ width: `${calculation.lightFoodRatioPct}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${calculation.heavyFoodRatioPct}%` }} className="bg-amber-500 h-full" />
              </div>
            </Card>

            {/* Gender Tissue Focus */}
            <Card className="p-4 rounded-2xl border-amber-800/40 bg-[#0d0903] text-amber-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Biological Tissue Focus
                </span>
                <span className="text-xs font-bold font-mono text-amber-200 capitalize">{profile.gender}</span>
              </div>
              <div className="space-y-1 mt-2">
                {calculation.genderTissueFocus.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* TARGETED REGIONAL SOUL MEAL CARD */}
          <Card className="p-5 rounded-3xl border-emerald-600/50 bg-[#091f11] text-emerald-50 shadow-xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <Badge className="bg-emerald-900 text-emerald-200 border-emerald-600/50 text-[10px] font-mono mb-1">
                  NATIVE DESHA-SATMYA FORMULA
                </Badge>
                <h3 className="text-base sm:text-lg font-bold text-emerald-100">
                  {calculation.nativeSatmyaMeal.mealTitle}
                </h3>
                <p className="text-xs text-emerald-300/70 font-mono mt-0.5">
                  {calculation.nativeSatmyaMeal.regionalHeritage}
                </p>
              </div>

              <span className="text-2xl p-2 rounded-2xl bg-emerald-950 border border-emerald-700/40 shrink-0">
                🍛
              </span>
            </div>

            {/* Clinical Adaptation Badge if active */}
            {calculation.nativeSatmyaMeal.clinicalAdaptation && (
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/50 mb-3 text-xs text-amber-200">
                <span className="font-bold text-amber-300 font-mono">🩺 Clinical Adaptation: </span>
                {calculation.nativeSatmyaMeal.clinicalAdaptation}
              </div>
            )}

            {/* Portions breakdown */}
            <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-emerald-900/50 text-xs">
              <div>
                <span className="text-emerald-400 font-bold font-mono block">Solid Measure (1/3):</span>
                <span className="text-emerald-100/90">{calculation.nativeSatmyaMeal.solidPortionDescription}</span>
              </div>
              <div className="pt-2 border-t border-emerald-900/40">
                <span className="text-emerald-400 font-bold font-mono block">Liquid Measure (1/3):</span>
                <span className="text-emerald-100/90">{calculation.nativeSatmyaMeal.liquidPortionDescription}</span>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block mb-1">
                Agni-Dipana Spices:
              </span>
              <div className="flex flex-wrap gap-1">
                {calculation.nativeSatmyaMeal.ayurvedicSpices.map((sp, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-200 font-mono"
                  >
                    🌿 {sp}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-emerald-300/80 italic mt-3 pt-2 border-t border-emerald-900/40">
              {calculation.nativeSatmyaMeal.charakaCitation}
            </p>
          </Card>

          {/* 6 CLINICAL SIGNS OF RIGHT MEASURE */}
          <Card className="p-4 rounded-2xl border-amber-900/50 bg-[#0d0903] text-amber-50">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <span>✓</span> 6 Clinical Signs You Ate the Right Quantity (Charaka Sutra 5.8)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-amber-200/80">
              {calculation.clinicalSignsOfRightMeasure.map((sign, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{sign}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
