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
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

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
