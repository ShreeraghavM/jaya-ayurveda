import { useMemo, useState } from 'react'
import { doshaProfiles, getSeason, mealPlans, type UserProfile } from '../lib/data'
import { getProfession } from '../lib/professions'
import { buildTomorrowPlan } from '../lib/smartEngine'
import {
  getMealConfirmation,
  getTodayLog,
  saveMealConfirmation,
  type MealConfirmation,
  type MealState,
} from '../lib/store'
import {
  calculateCharakaPortioning,
  getDeshaSatmyaProfile,
} from '../lib/deshaSatmyaEngine'
import { calculateAyurvedicMetabolism } from '../lib/metabolicEngine'
import {
  calculateMealMacronutrients,
  getAyurvedicCookingInstructions,
  getBhojanaKramaCourses,
  DISEASE_CULINARY_MODULATIONS,
} from '../lib/culinaryEngine'
import { getActiveHealingProtocol } from '../lib/vectorSearch'
import CharakaMatraCalculator from './CharakaMatraCalculator'
import MetabolicArdhaShaktiCalculator from './MetabolicArdhaShaktiCalculator'
import AyurvedicCookingGuide from './AyurvedicCookingGuide'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface Props {
  profile: UserProfile
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

const labels: Record<MealType, { icon: string; label: string }> = {
  breakfast: { icon: '🌅', label: 'Breakfast' },
  lunch: { icon: '☀️', label: 'Lunch' },
  dinner: { icon: '🌙', label: 'Dinner' },
  snacks: { icon: '🍎', label: 'Snacks' },
}

export default function DietPlan({ profile }: Props) {
  const dosha = profile.doshaType || 'Vata'
  const season = getSeason()
  const doshaInfo = doshaProfiles[dosha]
  const profession = getProfession(profile.profession)
  const times = profession?.meals ?? { breakfast: '08:00', lunch: '13:00', snack: '16:30', dinner: '19:30' }

  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null)
  const [confirmation, setConfirmation] = useState<MealConfirmation>(() => getMealConfirmation())
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [showMatraCalculator, setShowMatraCalculator] = useState(false)
  const [showMetabolicCalc, setShowMetabolicCalc] = useState(false)
  const [showCookingGuide, setShowCookingGuide] = useState(false)
  const [activeConditionId, setActiveConditionId] = useState<string | null>(
    () => getActiveHealingProtocol()?.remedy.id ?? null
  )
  const [deshaProfile, setDeshaProfile] = useState(() => getDeshaSatmyaProfile(profile))

  // Active Clinical Disease Modulation
  const activeModulation = activeConditionId ? DISEASE_CULINARY_MODULATIONS[activeConditionId] : null

  // Charaka Ahara Matra portioning and Desha-Satmya adaptation
  const matraCalc = useMemo(() => calculateCharakaPortioning(profile, deshaProfile), [profile, deshaProfile])

  // Charaka Agni-BMR, TDEE, Ardha-Shakti & Vasanta Ritu (Spring) Bio-Shield
  const metabolism = useMemo(() => calculateAyurvedicMetabolism(profile, undefined, true), [profile])

  // Charaka Culinary Science, Macronutrient Targets (Carbs, Protein, Fats, Fiber) & Bhojana Krama
  const macroGoals = useMemo(
    () => calculateMealMacronutrients(profile, activeConditionId),
    [profile, activeConditionId]
  )

  const courses = useMemo(
    () => getBhojanaKramaCourses(profile, activeConditionId),
    [profile, activeConditionId]
  )

  const meals = mealPlans[dosha]
  const currentMeals = meals[activeMeal] || []
  const planned = currentMeals[0]
  const tomorrow = useMemo(() => buildTomorrowPlan(profile, getTodayLog()), [profile])

  const mealTabs: { key: MealType; time: string }[] = [
    { key: 'breakfast', time: times.breakfast },
    { key: 'lunch', time: times.lunch },
    { key: 'dinner', time: times.dinner },
    { key: 'snacks', time: times.snack },
  ]

  const setState = (slot: MealType, state: MealState, actual?: string) => {
    const next: MealConfirmation = {
      slots: { ...confirmation.slots, [slot]: state },
      actual: { ...confirmation.actual, ...(actual ? { [slot]: actual } : {}) },
    }
    setConfirmation(next)
    saveMealConfirmation(next)
    setEditing(false)
    setDraft('')
  }

  const status = confirmation.slots[activeMeal]

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Season · {season}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-emerald-50">Diet & recipes</h1>
        <p className="mt-1 text-xs text-emerald-400/60">
          Built for {dosha}
          {profession ? ` and a ${profession.label.toLowerCase()}'s day` : ''}.
        </p>
      </div>

      {/* ─── CLINICAL PATHOLOGY & DISEASE SYNCHRONIZER ─── */}
      <Card className="mb-4 overflow-hidden rounded-2xl border-emerald-500/40 bg-gradient-to-br from-[#07190f] via-[#04110a] to-[#020805] p-4 text-emerald-50 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-lg">🩺</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-mono">
              CLINICAL PATHOLOGY SYNCHRONIZER
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] font-mono">
              {activeModulation ? activeModulation.charakaCitation : 'CHARAKA CHIKITSA'}
            </Badge>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">
            {activeModulation ? 'Clinical Mode Active' : 'Wellness Satmya'}
          </span>
        </div>

        {/* Quick Disease Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 pt-0.5">
          <button
            onClick={() => setActiveConditionId(null)}
            className={`px-2 py-1 rounded-xl text-[10px] whitespace-nowrap transition ${
              !activeConditionId
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'bg-emerald-950/40 text-emerald-300/70 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            🌿 General Wellness
          </button>
          <button
            onClick={() => setActiveConditionId('prameha-metabolic')}
            className={`px-2 py-1 rounded-xl text-[10px] whitespace-nowrap transition ${
              activeConditionId === 'prameha-metabolic'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-amber-950/40 text-amber-300/70 hover:bg-amber-900/40 border border-amber-800/40'
            }`}
          >
            🩸 Diabetes (Prameha)
          </button>
          <button
            onClick={() => setActiveConditionId('amlapitta')}
            className={`px-2 py-1 rounded-xl text-[10px] whitespace-nowrap transition ${
              activeConditionId === 'amlapitta'
                ? 'bg-rose-600 text-white font-bold shadow-md'
                : 'bg-rose-950/40 text-rose-300/70 hover:bg-rose-900/40 border border-rose-800/40'
            }`}
          >
            🍵 Acid Reflux (Amlapitta)
          </button>
          <button
            onClick={() => setActiveConditionId('grahani-ibs')}
            className={`px-2 py-1 rounded-xl text-[10px] whitespace-nowrap transition ${
              activeConditionId === 'grahani-ibs'
                ? 'bg-cyan-600 text-white font-bold shadow-md'
                : 'bg-cyan-950/40 text-cyan-300/70 hover:bg-cyan-900/40 border border-cyan-800/40'
            }`}
          >
            🔄 IBS (Grahani)
          </button>
          <button
            onClick={() => setActiveConditionId('raktachapa-hypertension')}
            className={`px-2 py-1 rounded-xl text-[10px] whitespace-nowrap transition ${
              activeConditionId === 'raktachapa-hypertension'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'bg-indigo-950/40 text-indigo-300/70 hover:bg-indigo-900/40 border border-indigo-800/40'
            }`}
          >
            🩺 High BP (Raktachapa)
          </button>
        </div>

        {/* Active Disease Clinical Banner */}
        {activeModulation ? (
          <div className="mt-2.5 pt-2.5 border-t border-emerald-900/40 text-xs space-y-2">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="font-bold text-emerald-100 text-[11px]">{activeModulation.conditionName}</span>
              <span className="text-[10px] text-amber-300 font-mono">{activeModulation.sanskritName}</span>
            </div>

            <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[10px] text-amber-200">
              <strong className="text-amber-100">🌾 Staple Grain Substitution: </strong>
              {activeModulation.stapleGrainSubstitute}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-700/40">
                <span className="block font-bold text-emerald-300 mb-1">✓ Charaka Pathya (Favor)</span>
                <ul className="space-y-0.5 text-emerald-100/90">
                  {activeModulation.pathyaFoods.slice(0, 3).map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2 rounded-xl bg-red-950/40 border border-red-700/40">
                <span className="block font-bold text-red-300 mb-1">🚫 Charaka Apathya (Avoid)</span>
                <ul className="space-y-0.5 text-red-100/90">
                  {activeModulation.apathyaFoods.slice(0, 3).map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-emerald-300/70 leading-relaxed">
            Personalized to your {dosha} Prakriti and {matraCalc.nativeSatmyaMeal.regionalHeritage.split('(')[0].trim()} native soil. Select any clinical condition above to simulate strict Charaka Chikitsa dietary modifications.
          </p>
        )}
      </Card>

      {/* ─── CHARAKA AHARA MATRA & DESHA-SATMYA 1/3 STOMACH SECTION ─── */}
      <Card className="mb-4 overflow-hidden rounded-2xl border-amber-500/40 bg-gradient-to-br from-[#1a1205] via-[#100b02] to-[#070501] p-4 text-amber-50 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-lg">🌾</span>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] font-mono">
              CHARAKA 1/3 DIVISION
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-mono">
              {matraCalc.nativeSatmyaMeal.regionalHeritage.split('(')[0].trim()} SATMYA
            </Badge>
          </div>
          <button
            onClick={() => setShowMatraCalculator(!showMatraCalculator)}
            className="text-[11px] text-amber-400 font-medium underline underline-offset-2 hover:text-amber-200"
          >
            {showMatraCalculator ? 'Minimize ✕' : 'Configure Soil & Matra ➔'}
          </button>
        </div>

        {showMatraCalculator ? (
          <div className="mt-4 pt-3 border-t border-amber-900/40">
            <CharakaMatraCalculator
              profile={profile}
              onClose={() => {
                setShowMatraCalculator(false)
                setDeshaProfile(getDeshaSatmyaProfile(profile))
              }}
            />
          </div>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-amber-800/40 bg-amber-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-amber-400/80 font-mono">1/3 Solids</span>
                <span className="mt-0.5 block text-sm font-bold text-amber-100 font-mono">~{matraCalc.solidFoodGrams}g</span>
                <span className="block text-[8px] text-amber-300/60 font-sans">Grains & Veg</span>
              </div>
              <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-cyan-400/80 font-mono">1/3 Liquids</span>
                <span className="mt-0.5 block text-sm font-bold text-cyan-100 font-mono">~{matraCalc.liquidFoodMl}ml</span>
                <span className="block text-[8px] text-cyan-300/60 font-sans">Takra / Rasam</span>
              </div>
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-400/80 font-mono">1/3 Space</span>
                <span className="mt-0.5 block text-sm font-bold text-emerald-100 font-mono">~{matraCalc.emptyChurnSpaceMl}ml</span>
                <span className="block text-[8px] text-emerald-300/60 font-sans">Agni Churning</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[10px] text-amber-200/80 flex-wrap gap-1">
              <span>🌾 Native Staple: <strong className="text-amber-100">{matraCalc.nativeSatmyaMeal.stapleGrainName}</strong></span>
              <span>⚖️ Quality: <strong className="text-amber-100">{matraCalc.heavyFoodRatioPct}% Heavy : {matraCalc.lightFoodRatioPct}% Light</strong></span>
            </div>
          </>
        )}
      </Card>

      {/* ─── AGNI-BMR, TDEE & SPRING (VASANTA RITU) BIO-SHIELD SECTION ─── */}
      <Card className="mb-4 overflow-hidden rounded-2xl border-rose-500/40 bg-gradient-to-br from-[#1a070c] via-[#100306] to-[#080204] p-4 text-rose-50 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-lg">🌸</span>
            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[9px] font-mono">
              VASANTA RITU (SPRING SHIELD)
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] font-mono">
              BMR {metabolism.ayurvedicBmrKcal} kcal · TDEE {metabolism.dailyTdeeKcal} kcal
            </Badge>
          </div>
          <button
            onClick={() => setShowMetabolicCalc(!showMetabolicCalc)}
            className="text-[11px] text-rose-300 font-medium underline underline-offset-2 hover:text-rose-100"
          >
            {showMetabolicCalc ? 'Minimize ✕' : 'View BMR & Spring Shield ➔'}
          </button>
        </div>

        {showMetabolicCalc ? (
          <div className="mt-4 pt-3 border-t border-rose-900/40">
            <MetabolicArdhaShaktiCalculator
              profile={profile}
              onClose={() => setShowMetabolicCalc(false)}
            />
          </div>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-rose-900/40 bg-rose-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-rose-400/80 font-mono">Daily TDEE</span>
                <span className="mt-0.5 block text-sm font-bold text-rose-100 font-mono">~{metabolism.dailyTdeeKcal} kcal</span>
                <span className="block text-[8px] text-rose-300/60 font-sans">PAL ×{metabolism.physicalActivityMultiplier}</span>
              </div>
              <div className="rounded-xl border border-amber-900/40 bg-amber-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-amber-300/80 font-mono">Lunch Agni Peak</span>
                <span className="mt-0.5 block text-sm font-bold text-amber-100 font-mono">~{metabolism.mealPortionsKcal.lunchKcal} kcal</span>
                <span className="block text-[8px] text-amber-200/60 font-sans">45% Midday Sun</span>
              </div>
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-400/80 font-mono">Ardha-Shakti HR</span>
                <span className="mt-0.5 block text-sm font-bold text-emerald-100 font-mono">~{metabolism.exerciseCapacity.ardhaShaktiTargetZoneBpm.targetBpm} bpm</span>
                <span className="block text-[8px] text-emerald-300/60 font-sans">50% Exertion Zone</span>
              </div>
            </div>

            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/30 border border-rose-900/40 text-[10px] text-rose-200/80 leading-relaxed flex items-start gap-1.5">
              <span>🌸</span>
              <div>
                <strong className="text-rose-100">Spring Kapha Defense:</strong> Sun rays liquefy winter mucus. 15% fat reduction applied. Barley, roasted moong & honey activated.
                <span className="block text-red-300 font-semibold mt-0.5">🚫 Diva-swapna strictly prohibited (No daytime naps in spring).</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* ─── CHARAKA COOKING SCIENCE (SAMSKARA) & 3-COURSE PLATE (BHOJANA KRAMA) ─── */}
      <Card className="mb-4 overflow-hidden rounded-2xl border-amber-600/40 bg-gradient-to-br from-[#1b1206] via-[#110b03] to-[#070401] p-4 text-amber-50 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-lg">🍛</span>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] font-mono">
              BHOJANA KRAMA (3-COURSE ORDER)
            </Badge>
            {activeModulation ? (
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/30 text-[9px] font-mono">
                {activeModulation.conditionName.split(',')[0]} Mode
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-mono">
                NATIVE SATMYA
              </Badge>
            )}
          </div>
          <button
            onClick={() => setShowCookingGuide(!showCookingGuide)}
            className="text-[11px] text-amber-400 font-medium underline underline-offset-2 hover:text-amber-200"
          >
            {showCookingGuide ? 'Minimize ✕' : 'View Cooking Science & 3 Courses ➔'}
          </button>
        </div>

        {showCookingGuide ? (
          <div className="mt-4 pt-3 border-t border-amber-900/40">
            <AyurvedicCookingGuide
              profile={profile}
              mealSlot={activeMeal === 'snacks' ? 'snack' : activeMeal}
              initialConditionId={activeConditionId}
              onSelectCondition={setActiveConditionId}
              onClose={() => setShowCookingGuide(false)}
            />
          </div>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-amber-800/40 bg-amber-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-amber-400/80 font-mono">Course 1 (Agra)</span>
                <span className="mt-0.5 block text-xs font-bold text-amber-100 line-clamp-1">{courses[0]?.englishName.split(':')[1]?.trim() || 'Agra Course'}</span>
                <span className="block text-[8px] text-amber-300/60 font-sans">{courses[0]?.diseaseModulationNote ? 'Clinical Shield' : 'Mucosal Buffer'}</span>
              </div>
              <div className="rounded-xl border border-rose-800/40 bg-rose-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-rose-400/80 font-mono">Course 2 (Madhya)</span>
                <span className="mt-0.5 block text-xs font-bold text-rose-100 line-clamp-1">{courses[1]?.englishName.split(':')[1]?.trim() || 'Madhya Course'}</span>
                <span className="block text-[8px] text-rose-300/60 font-sans">{courses[1]?.diseaseModulationNote ? 'Pathya Main' : 'Enzymatic Peak'}</span>
              </div>
              <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/40 p-2">
                <span className="block text-[9px] uppercase tracking-wider text-cyan-400/80 font-mono">Course 3 (Anta)</span>
                <span className="mt-0.5 block text-xs font-bold text-cyan-100 line-clamp-1">{courses[2]?.englishName.split(':')[1]?.trim() || 'Anta Course'}</span>
                <span className="block text-[8px] text-cyan-300/60 font-sans">{courses[2]?.diseaseModulationNote ? 'Pyloric Seal' : 'Digestive Closure'}</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[10px] text-amber-200/80 flex-wrap gap-1">
              <span>📊 Target: <strong className="text-amber-100">~{macroGoals.mealBreakdown.lunch.carbohydratesGrams}g Carbs ({macroGoals.mealBreakdown.lunch.carbsPercentage}%) · ~{macroGoals.mealBreakdown.lunch.proteinGrams}g Protein · ~{macroGoals.mealBreakdown.lunch.healthyFatsGrams}g Fats · ~{macroGoals.mealBreakdown.lunch.dietaryFiberGrams}g Fiber</strong></span>
              <span>🔥 Rule: <strong className="text-amber-100">Fresh Warm (Ushnam) & 0 Reheating</strong></span>
            </div>
          </>
        )}
      </Card>

      {/* Check-in */}
      <Card className="mb-4 overflow-hidden rounded-2xl border-emerald-600/40 bg-gradient-to-br from-emerald-900/50 to-emerald-950/60 p-5">
        {!status && !editing && (
          <>
            <p className="text-[10px] uppercase tracking-wider text-emerald-400/70">
              {labels[activeMeal].label} · planned {mealTabs.find(t => t.key === activeMeal)?.time}
            </p>
            <p className="mt-1 text-base font-medium text-emerald-50">{planned?.name ?? 'No plan yet'}</p>
            <p className="mt-2 text-[11px] text-emerald-300/70">Did you eat this today?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                onClick={() => setState(activeMeal, 'done')}
                size="sm"
                className="h-8 rounded-lg bg-emerald-600 px-4 text-xs text-emerald-50 hover:bg-emerald-500"
              >
                Yes, I did
              </Button>
              <Button
                onClick={() => setEditing(true)}
                size="sm"
                variant="outline"
                className="h-8 rounded-lg border-emerald-800/60 bg-emerald-950/50 px-4 text-xs text-emerald-300 hover:bg-emerald-900/50"
              >
                I ate something else
              </Button>
              <Button
                onClick={() => setState(activeMeal, 'skipped')}
                size="sm"
                variant="ghost"
                className="h-8 rounded-lg px-3 text-xs text-emerald-500/60 hover:text-emerald-300"
              >
                Skipped
              </Button>
            </div>
          </>
        )}

        {editing && (
          <>
            <p className="text-[11px] text-emerald-300/70">
              Tell me what you actually ate — it shapes tomorrow's plan and your shopping list.
            </p>
            <Textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="e.g. two idlis with sambar and a coffee"
              className="mt-2 min-h-[66px] rounded-xl border-emerald-800/50 bg-emerald-950/60 text-xs text-emerald-100 placeholder:text-emerald-700"
            />
            <div className="mt-2 flex gap-2">
              <Button
                onClick={() => setState(activeMeal, 'different', draft || 'Something else')}
                size="sm"
                className="h-8 rounded-lg bg-emerald-600 px-4 text-xs text-emerald-50 hover:bg-emerald-500"
              >
                Save
              </Button>
              <Button
                onClick={() => { setEditing(false); setDraft('') }}
                size="sm"
                variant="ghost"
                className="h-8 rounded-lg px-3 text-xs text-emerald-500/60"
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {status && !editing && (
          <>
            <div className="flex items-start gap-2">
              <span className="text-lg">{status === 'done' ? '✅' : status === 'skipped' ? '⏭️' : '📝'}</span>
              <div>
                <p className="text-xs font-medium text-emerald-100">
                  {status === 'done' ? 'Confirmed — thank you.' : status === 'skipped' ? 'Skipped, noted without judgement.' : 'Recorded what you actually ate.'}
                </p>
                {confirmation.actual[activeMeal] && (
                  <p className="mt-1 text-[11px] italic text-emerald-300/60">“{confirmation.actual[activeMeal]}”</p>
                )}
                <p className="mt-1 text-[10px] leading-relaxed text-emerald-400/60">
                  {status === 'skipped'
                    ? `Tomorrow's breakfast will be lighter on quantity but higher in nourishment.`
                    : 'Tomorrow I will keep what worked and adjust what did not.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setState(activeMeal, 'different', '') ; setEditing(true) }}
              className="mt-3 text-[10px] text-emerald-500/60 underline-offset-2 hover:text-emerald-300 hover:underline"
            >
              Change my answer
            </button>
          </>
        )}
      </Card>

      {/* Meal tabs */}
      <div className="mb-4 flex gap-1.5">
        {mealTabs.map(tab => {
          const st = confirmation.slots[tab.key]
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveMeal(tab.key); setExpandedRecipe(null); setEditing(false) }}
              className={`flex-1 rounded-xl border py-2.5 text-center transition ${
                activeMeal === tab.key
                  ? 'border-emerald-600/40 bg-emerald-800/50 text-emerald-100'
                  : 'border-emerald-900/50 bg-emerald-950/30 text-emerald-500/60 hover:bg-emerald-900/30'
              }`}
            >
              <span className="block text-base">{labels[tab.key].icon}</span>
              <span className="mt-0.5 block text-[9px]">{labels[tab.key].label}</span>
              <span className="mt-0.5 block text-[8px] text-emerald-600/60">
                {st === 'done' ? '✓' : st === 'skipped' ? '—' : st === 'different' ? '•' : tab.time}
              </span>
            </button>
          )
        })}
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {currentMeals.map((meal, i) => (
          <Card key={meal.name} className="overflow-hidden rounded-2xl border-emerald-900/50 bg-emerald-950/40">
            <button onClick={() => setExpandedRecipe(expandedRecipe === i ? null : i)} className="w-full p-4 text-left">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-100">{meal.name}</p>
                  <p className="mt-0.5 text-[10px] text-emerald-500/60">
                    {meal.time} · {meal.prepTime} · {meal.calories} cal
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="rounded-md border border-amber-500/30 bg-amber-950/40 px-1.5 py-0.5 text-[9px] font-mono text-amber-300">
                      ⚖️ 1/3 Solid: ~{matraCalc.solidFoodGrams}g
                    </span>
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300">
                      💧 1/3 Liquid: ~{matraCalc.liquidFoodMl}ml
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600/60">{expandedRecipe === i ? '▲' : '▼'}</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-emerald-300/60">{meal.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {meal.foods.slice(0, 6).map(f => (
                  <span key={f} className="rounded-full bg-emerald-900/40 px-2 py-0.5 text-[9px] text-emerald-300/60">
                    {f}
                  </span>
                ))}
              </div>
            </button>

            {expandedRecipe === i && (() => {
              const cooking = getAyurvedicCookingInstructions(meal.name, dosha, activeConditionId)
              const slotKey = activeMeal === 'snacks' ? 'snack' : activeMeal
              const macros = macroGoals.mealBreakdown[slotKey]

              return (
                <div className="border-t border-emerald-900/40 px-4 pb-4 space-y-3 pt-3">
                  {/* Clinical Disease Directive if active */}
                  {cooking.clinicalDiseaseNote && (
                    <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-2.5 text-[10px] text-amber-200 flex items-start gap-2">
                      <span className="text-base shrink-0">🩺</span>
                      <div>
                        <strong className="text-amber-100 font-bold">Clinical Pathology Directive: </strong>
                        <span>{cooking.clinicalDiseaseNote}</span>
                      </div>
                    </div>
                  )}

                  {/* Macronutrient Pill Badges */}
                  <div className="rounded-xl border border-amber-900/40 bg-amber-950/30 p-2.5">
                    <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold mb-1.5">
                      <span>📊 Ayurvedic Macronutrients ({activeMeal.toUpperCase()})</span>
                      <span className="font-mono text-amber-200">~{macros.caloriesKcal} kcal</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                      <div className="rounded-lg bg-black/40 border border-amber-500/20 p-1">
                        <span className="block text-[8px] uppercase tracking-wider text-amber-400 font-mono">Carbs</span>
                        <span className="font-bold text-amber-100 font-mono">{macros.carbohydratesGrams}g</span>
                        <span className="block text-[8px] text-amber-300/60 font-sans">Energy/Bulk</span>
                      </div>
                      <div className="rounded-lg bg-black/40 border border-emerald-500/20 p-1">
                        <span className="block text-[8px] uppercase tracking-wider text-emerald-400 font-mono">Protein</span>
                        <span className="font-bold text-emerald-100 font-mono">{macros.proteinGrams}g</span>
                        <span className="block text-[8px] text-emerald-300/60 font-sans">Mamsa Dhatu</span>
                      </div>
                      <div className="rounded-lg bg-black/40 border border-yellow-500/20 p-1">
                        <span className="block text-[8px] uppercase tracking-wider text-yellow-400 font-mono">Fats (Ghee)</span>
                        <span className="font-bold text-yellow-100 font-mono">{macros.healthyFatsGrams}g</span>
                        <span className="block text-[8px] text-yellow-300/60 font-sans">Sneha/Ojas</span>
                      </div>
                      <div className="rounded-lg bg-black/40 border border-teal-500/20 p-1">
                        <span className="block text-[8px] uppercase tracking-wider text-teal-400 font-mono">Fiber</span>
                        <span className="font-bold text-teal-100 font-mono">{macros.dietaryFiberGrams}g</span>
                        <span className="block text-[8px] text-teal-300/60 font-sans">Purisha Bulk</span>
                      </div>
                    </div>
                  </div>

                  {/* Classical Samskara Cooking Method */}
                  <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/30 p-2.5 text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-200 uppercase tracking-wider text-[10px]">
                        🍳 Classical Samskāra Cooking Method (Charaka Vimana 1)
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono">Agni: {cooking.agniProcessing.fireIntensity}</span>
                    </div>

                    <div className="space-y-1.5 text-emerald-100/80 leading-relaxed text-[11px]">
                      <div>
                        <strong className="text-amber-200">1. Soaking & Washing:</strong> {cooking.prepPhase.washingAndSoaking}
                        <span className="block text-[10px] text-amber-300/60 italic">{cooking.prepPhase.scientificAyurvedicReason}</span>
                      </div>
                      <div>
                        <strong className="text-amber-200">2. Water & Heat:</strong> {cooking.agniProcessing.waterRatio} · {cooking.agniProcessing.cookingMethod} for ~{cooking.agniProcessing.durationMinutes} mins.
                      </div>
                      <div>
                        <strong className="text-amber-200">3. Cow Ghee Tadka (Ghrita Samskara):</strong>
                        <ul className="mt-1 space-y-0.5 pl-2 text-[10px] text-amber-100/90 font-mono">
                          {cooking.ghritaSamskaraTadka.spiceOrder.slice(0, 3).map((step, idx) => (
                            <li key={idx}>• {step}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-[10px] text-emerald-300/90 font-semibold pt-1 border-t border-emerald-900/40">
                        ⚡ Rule: {cooking.servingRule}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCookingGuide(true)}
                      className="mt-1.5 w-full py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 text-center text-[10px] font-bold text-amber-200 hover:bg-amber-900/50 hover:text-white transition"
                    >
                      🍛 View Full Bhojana Krama (3-Course Plate Order) & Daily 10 Essentials ➔
                    </button>
                  </div>

                  {meal.recipe && (
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-emerald-500/70">Traditional Method</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-emerald-200/70">{meal.recipe}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-emerald-500/70">Ingredients</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {meal.ingredients.map(ing => (
                        <span key={ing} className="rounded-full border border-amber-800/20 bg-amber-900/20 px-2 py-0.5 text-[9px] text-amber-200/60">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}
          </Card>
        ))}
      </div>

      {/* Principles */}
      <Card className="mt-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-4">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
          {dosha} food principles
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1 text-[9px] uppercase tracking-wider text-emerald-400/60">Favour</p>
            <div className="flex flex-wrap gap-1">
              {doshaInfo.favorableFoods.slice(0, 5).map(f => (
                <span key={f} className="rounded-full border border-emerald-700/20 bg-emerald-800/30 px-2 py-0.5 text-[9px] text-emerald-200/70">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-[9px] uppercase tracking-wider text-red-400/60">Avoid</p>
            <div className="flex flex-wrap gap-1">
              {doshaInfo.unfavorableFoods.slice(0, 5).map(f => (
                <span key={f} className="rounded-full border border-red-800/20 bg-red-900/20 px-2 py-0.5 text-[9px] text-red-200/50">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tomorrow influence */}
      <Card className="mt-3 rounded-2xl border-amber-800/30 bg-amber-950/15 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-amber-300/80">Tomorrow, adjusted</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/70">{tomorrow.focus}</p>
        <p className="mt-2 text-[10px] leading-relaxed text-amber-200/50">
          First meal tomorrow: {tomorrow.meals[0]?.name} at {tomorrow.meals[0]?.time}.
        </p>
      </Card>
    </div>
  )
}
