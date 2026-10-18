import { useMemo, useState } from 'react'
import type { UserProfile } from '../lib/data'
import { getGoalTemplates, type GoalTemplate } from '../lib/professions'
import { getBmiResult } from '../lib/bmi'
import { getGoals, saveGoals, type Goal } from '../lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  profile: UserProfile
}

export default function Goals({ profile }: Props) {
  const dosha = profile.doshaType ?? 'Vata'
  const [goals, setGoals] = useState<Goal[]>(() => seedGoals(profile))
  const [picker, setPicker] = useState(false)

  const templates = useMemo(() => getGoalTemplates(dosha), [dosha])
  const available = templates.filter(t => !goals.some(g => g.id === t.id))

  const persist = (next: Goal[]) => {
    setGoals(next)
    saveGoals(next)
  }

  const addGoal = (t: GoalTemplate) => {
    const goal: Goal = {
      id: t.id,
      title: t.title,
      icon: t.icon,
      target: t.target,
      unit: t.unit,
      progress: 0,
      streak: 0,
      benefit: t.benefit,
      createdAt: new Date().toISOString(),
    }
    persist([...goals, goal])
    setPicker(false)
  }

  const completeToday = (id: string) => {
    persist(
      goals.map(g =>
        g.id === id
          ? { ...g, progress: Math.min(g.target, g.progress + Math.max(1, Math.round(g.target / 5))), streak: g.streak + 1 }
          : g,
      ),
    )
  }

  const removeGoal = (id: string) => persist(goals.filter(g => g.id !== id))

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Small, repeated</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-emerald-50">Your goals</h1>
        <p className="mt-1.5 text-xs leading-relaxed text-emerald-300/60">
          Chosen for a {dosha} constitution. Each one explains why it works for you — not just what to do.
        </p>
      </div>

      {goals.length === 0 && (
        <Card className="mb-4 rounded-2xl border-dashed border-emerald-800/50 bg-emerald-950/30 p-6 text-center">
          <p className="text-3xl">🎯</p>
          <p className="mt-2 text-sm text-emerald-200/80">No goals yet</p>
          <p className="mt-1 text-xs text-emerald-400/60">Begin with one. One is enough to change a week.</p>
        </Card>
      )}

      <div className="space-y-3">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.progress / g.target) * 100))
          return (
            <Card key={g.id} className="rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{g.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-emerald-100">{g.title}</p>
                    {g.streak > 0 && (
                      <Badge className="rounded-full bg-amber-900/40 px-2 py-0.5 text-[10px] text-amber-200">
                        🔥 {g.streak}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-emerald-500/60">
                    {g.progress} / {g.target} {g.unit}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-900/60">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-emerald-300/60">{g.benefit}</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={() => completeToday(g.id)}
                      size="sm"
                      className="h-7 rounded-lg bg-emerald-700 px-3 text-[11px] text-emerald-50 hover:bg-emerald-600"
                    >
                      Mark today
                    </Button>
                    <Button
                      onClick={() => removeGoal(g.id)}
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-lg border-emerald-800/50 bg-transparent px-3 text-[11px] text-emerald-400/70 hover:bg-emerald-900/40"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {picker ? (
        <Card className="mt-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-4">
          <p className="mb-3 text-sm font-medium text-emerald-100">Add a goal</p>
          <div className="space-y-2">
            {available.map(t => (
              <button
                key={t.id}
                onClick={() => addGoal(t)}
                className="flex w-full items-start gap-3 rounded-xl border border-emerald-900/50 bg-emerald-900/20 p-3 text-left transition hover:border-emerald-700/60 hover:bg-emerald-900/40"
              >
                <span className="text-lg">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-emerald-100">{t.title}</p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-emerald-400/60">{t.whyItWorks}</p>
                </div>
                <span className="text-emerald-500">+</span>
              </button>
            ))}
            {available.length === 0 && (
              <p className="text-xs text-emerald-400/60">You have added every goal suited to your constitution.</p>
            )}
          </div>
          <Button
            onClick={() => setPicker(false)}
            variant="outline"
            className="mt-3 w-full rounded-xl border-emerald-800/50 text-xs text-emerald-300"
          >
            Close
          </Button>
        </Card>
      ) : (
        <Button
          onClick={() => setPicker(true)}
          className="mt-4 w-full rounded-xl bg-emerald-600 py-5 text-emerald-50 hover:bg-emerald-500"
        >
          + Add a goal
        </Button>
      )}
    </div>
  )
}

function seedGoals(profile: UserProfile): Goal[] {
  const existing = getGoals()
  const bmi = profile.weight && profile.height ? getBmiResult(profile.weight, profile.height) : null
  const seeded: Goal[] = [...existing]

  if (bmi?.needsGoal && !seeded.some(g => g.id === 'bmi_healthy')) {
    seeded.unshift({
      id: 'bmi_healthy',
      title: 'Reach a healthy BMI',
      icon: '⚖️',
      target: 1,
      unit: 'goal',
      progress: 0,
      streak: 0,
      benefit: `Your BMI is ${bmi.bmi} (${bmi.category.label}). Moving into the ${bmi.healthyMinKg}–${bmi.healthyMaxKg} kg band for your height lowers everyday strain on your heart, joints and sleep.`,
      createdAt: new Date().toISOString(),
    })
  }

  if (seeded.length === 0) {
    const defaults = getGoalTemplates(profile.doshaType ?? 'Vata').slice(0, 2)
    for (const t of defaults) {
      seeded.push({
        id: t.id,
        title: t.title,
        icon: t.icon,
        target: t.target,
        unit: t.unit,
        progress: 0,
        streak: 0,
        benefit: t.benefit,
        createdAt: new Date().toISOString(),
      })
    }
  }

  if (seeded.length !== existing.length) saveGoals(seeded)
  return seeded
}
