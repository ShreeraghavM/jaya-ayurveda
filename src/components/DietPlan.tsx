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
import CharakaMatraCalculator from './CharakaMatraCalculator'
import MetabolicArdhaShaktiCalculator from './MetabolicArdhaShaktiCalculator'
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
  const [deshaProfile, setDeshaProfile] = useState(() => getDeshaSatmyaProfile(profile))

  // Charaka Ahara Matra portioning and Desha-Satmya adaptation
  const matraCalc = useMemo(() => calculateCharakaPortioning(profile, deshaProfile), [profile, deshaProfile])

  // Charaka Agni-BMR, TDEE, Ardha-Shakti & Vasanta Ritu (Spring) Bio-Shield
  const metabolism = useMemo(() => calculateAyurvedicMetabolism(profile, undefined, true), [profile])

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

            {expandedRecipe === i && (
              <div className="border-t border-emerald-900/40 px-4 pb-4">
                {meal.recipe && (
                  <div className="mt-3">
                    <p className="text-[9px] uppercase tracking-wider text-emerald-500/70">Method</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-emerald-200/70">{meal.recipe}</p>
                  </div>
                )}
                <div className="mt-3">
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
            )}
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
