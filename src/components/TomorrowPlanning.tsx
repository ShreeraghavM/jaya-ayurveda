import { useMemo, useState } from 'react'
import type { UserProfile } from '../lib/data'
import { buildTomorrowPlan } from '../lib/smartEngine'
import { getTodayLog } from '../lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Props {
  profile: UserProfile
  onBack: () => void
}

export default function TomorrowPlanning({ profile, onBack }: Props) {
  const log = useMemo(() => getTodayLog(), [])
  const [plan] = useState(() => buildTomorrowPlan(profile, log))
  const [checked, setChecked] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState(false)

  const toggle = (item: string) => {
    setChecked(c => (c.includes(item) ? c.filter(i => i !== item) : [...c, item]))
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Before the shops close</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-emerald-50">Tomorrow</h1>
          <p className="mt-1 text-xs text-emerald-400/60">
            {new Date(plan.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-xl border-emerald-800/50 bg-emerald-950/40 text-emerald-200"
        >
          Back
        </Button>
      </div>

      {plan.holiday && (
        <Card className="mb-4 rounded-2xl border-amber-700/30 bg-amber-950/20 p-4">
          <p className="text-xs font-medium text-amber-100">{plan.holiday}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-200/70">{plan.note}</p>
        </Card>
      )}

      <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
        <p className="text-[10px] uppercase tracking-wider text-emerald-500/70">Focus for the day</p>
        <p className="mt-1.5 text-sm leading-relaxed text-emerald-100/90">{plan.focus}</p>
      </Card>

      <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
        <p className="mb-3 text-sm font-medium text-emerald-100">Meals</p>
        <div className="space-y-3">
          {plan.meals.map(m => (
            <div key={m.slot} className="rounded-xl border border-emerald-900/50 bg-emerald-900/20 p-3">
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-medium text-emerald-200">{m.slot}</p>
                <p className="text-[10px] text-emerald-500/60">{m.time}</p>
              </div>
              <p className="mt-1 text-sm text-emerald-100">{m.name}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-emerald-400/60">
                {m.ingredients.slice(0, 4).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
        <p className="text-sm font-medium text-emerald-100">Shopping list</p>
        <p className="mb-3 mt-1 text-[11px] text-emerald-500/60">Tap items you already have at home.</p>
        <div className="space-y-1.5">
          {plan.groceries.map(item => {
            const have = checked.includes(item)
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition ${
                  have ? 'bg-emerald-900/40' : 'hover:bg-emerald-900/30'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border text-[9px] ${
                    have ? 'border-emerald-500 bg-emerald-600 text-emerald-50' : 'border-emerald-700'
                  }`}
                >
                  {have ? '✓' : ''}
                </span>
                <span className={`text-xs ${have ? 'text-emerald-500/50 line-through' : 'text-emerald-200/80'}`}>
                  {item}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      <Button
        onClick={() => setConfirmed(true)}
        className="w-full rounded-xl bg-emerald-600 py-5 text-emerald-50 hover:bg-emerald-500"
      >
        {confirmed ? 'Plan confirmed ✓' : 'Confirm tomorrow’s plan'}
      </Button>
      {confirmed && (
        <p className="mt-3 text-center text-[11px] leading-relaxed text-emerald-400/60">
          Saved. I will remind you at each meal tomorrow — and ask what actually happened.
        </p>
      )}
    </div>
  )
}
