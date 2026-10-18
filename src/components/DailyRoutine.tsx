import { useMemo, useState } from 'react'
import { dailyRoutine, doshaProfiles, type UserProfile } from '../lib/data'
import { getProfession, toMinutes } from '../lib/professions'
import { getRoutineProgress, saveRoutineProgress, todayKey, type RoutineState } from '../lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  profile: UserProfile
}

export default function DailyRoutine({ profile }: Props) {
  const dosha = profile.doshaType || 'Vata'
  const doshaInfo = doshaProfiles[dosha]
  const profession = getProfession(profile.profession)

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const [entries, setEntries] = useState<Record<string, RoutineState>>(() => getRoutineProgress())
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    for (let i = dailyRoutine.length - 1; i >= 0; i--) {
      if (currentMinutes >= toMinutes(dailyRoutine[i].time.split(' ')[0])) return i
    }
    return 0
  })
  const [asking, setAsking] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const stepKey = (index: number) => `${dailyRoutine[index].time}-${dailyRoutine[index].title}`
  const confirmedCount = Object.keys(entries).length
  const doneCount = Object.values(entries).filter(v => v === 'done').length
  const skippedCount = Object.values(entries).filter(v => v === 'skipped').length
  const active = dailyRoutine[activeIndex]
  const activeKey = stepKey(activeIndex)

  const nextUnconfirmed = useMemo(() => {
    const found = dailyRoutine.findIndex((_, i) => !entries[stepKey(i)])
    return found === -1 ? null : found
  }, [entries])

  const record = (state: RoutineState, note?: string) => {
    const next = { ...entries, [activeKey]: state }
    setEntries(next)
    saveRoutineProgress(next, todayKey())
    if (note) setNotes(n => ({ ...n, [activeKey]: note }))
    setAsking(false)
    setNoteDraft('')
    const after = dailyRoutine.findIndex((_, i) => i > activeIndex && !next[stepKey(i)])
    if (after !== -1) setActiveIndex(after)
  }

  const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
    body: { bg: 'bg-amber-900/20', border: 'border-amber-800/30', text: 'text-amber-200/80' },
    mind: { bg: 'bg-violet-900/20', border: 'border-violet-800/30', text: 'text-violet-200/80' },
    nutrition: { bg: 'bg-emerald-900/20', border: 'border-emerald-800/30', text: 'text-emerald-200/80' },
    spirit: { bg: 'bg-sky-900/20', border: 'border-sky-800/30', text: 'text-sky-200/80' },
    rest: { bg: 'bg-purple-900/20', border: 'border-purple-800/30', text: 'text-purple-200/80' },
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">
          {profession ? `${profession.icon} ${profession.label}` : 'Your day'}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-emerald-50">Dinacharya</h1>
        <p className="mt-1 text-xs text-emerald-400/60">
          One step at a time. Tell me honestly — the plan adapts either way.
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-emerald-300/70">
            {confirmedCount} of {dailyRoutine.length} steps answered
          </span>
          <span className="text-emerald-500/60">
            <span className="text-emerald-300">{doneCount} done</span>
            {skippedCount > 0 && <span className="text-amber-400/70"> · {skippedCount} skipped</span>}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-900/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
            style={{ width: `${(confirmedCount / dailyRoutine.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Current step confirmation */}
      {nextUnconfirmed !== null ? (
        <Card className="mb-4 overflow-hidden rounded-2xl border-emerald-600/40 bg-gradient-to-br from-emerald-900/50 to-emerald-950/60 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{active.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] text-emerald-400/70">{active.time} · {active.duration}</p>
              <p className="mt-0.5 text-base font-medium text-emerald-50">{active.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-200/70">{active.description}</p>
            </div>
          </div>

          {!asking ? (
            <div className="mt-4">
              <p className="mb-2 text-[11px] text-emerald-300/70">Did you follow this step?</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => record('done')}
                  size="sm"
                  className="h-8 rounded-lg bg-emerald-600 px-4 text-xs text-emerald-50 hover:bg-emerald-500"
                >
                  Yes, I did
                </Button>
                <Button
                  onClick={() => setAsking(true)}
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg border-emerald-800/60 bg-emerald-950/50 px-4 text-xs text-emerald-300 hover:bg-emerald-900/50"
                >
                  No / different
                </Button>
                <Button
                  onClick={() => record('skipped')}
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-lg px-3 text-xs text-emerald-500/60 hover:bg-emerald-900/40 hover:text-emerald-300"
                >
                  Skip
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-2 text-[11px] text-emerald-300/70">
                What did you do instead? (optional — it helps me adjust)
              </p>
              <Textarea
                value={noteDraft}
                onChange={e => setNoteDraft(e.target.value)}
                placeholder="e.g. I woke late and skipped oil pulling"
                className="min-h-[64px] rounded-xl border-emerald-800/50 bg-emerald-950/60 text-xs text-emerald-100 placeholder:text-emerald-700"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => record('skipped', noteDraft)}
                  size="sm"
                  className="h-8 rounded-lg bg-amber-700 px-4 text-xs text-amber-50 hover:bg-amber-600"
                >
                  Save & continue
                </Button>
                <Button
                  onClick={() => { setAsking(false); setNoteDraft('') }}
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-lg px-3 text-xs text-emerald-500/60 hover:text-emerald-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="mb-4 rounded-2xl border-emerald-700/40 bg-emerald-900/30 p-5 text-center">
          <p className="text-2xl">🙏</p>
          <p className="mt-1.5 text-sm font-medium text-emerald-100">Every step answered</p>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-300/60">
            {doneCount} followed, {skippedCount} skipped. Tomorrow I will build the day around this.
          </p>
        </Card>
      )}

      {/* Dosha note */}
      <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/30 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
          {dosha} rhythm
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-emerald-300/60">{doshaInfo.sleepAdvice}</p>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute bottom-0 left-[9px] top-0 w-px bg-emerald-900/50" />
        <div className="space-y-1.5">
          {dailyRoutine.map((step, i) => {
            const key = stepKey(i)
            const state = entries[key]
            const isCurrent = i === activeIndex && nextUnconfirmed !== null
            const isExpanded = expandedStep === i
            const colors = categoryColors[step.category]

            return (
              <div key={key} className="relative pl-7">
                <div
                  className={`absolute left-0 top-3.5 h-2.5 w-2.5 rounded-full border-2 ${
                    state === 'done'
                      ? 'border-emerald-400 bg-emerald-400'
                      : state === 'skipped'
                        ? 'border-amber-500/70 bg-amber-600/50'
                        : isCurrent
                          ? 'border-emerald-400 bg-emerald-950'
                          : 'border-emerald-800/60 bg-emerald-950'
                  }`}
                />
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : i)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isCurrent
                      ? 'border-emerald-600/50 bg-emerald-900/30'
                      : 'border-emerald-900/40 bg-emerald-950/30 hover:bg-emerald-900/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base">{step.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-emerald-500/60">{step.time}</span>
                        {state === 'done' && <span className="text-[9px] text-emerald-400">✓ done</span>}
                        {state === 'skipped' && <span className="text-[9px] text-amber-400/70">skipped</span>}
                        {isCurrent && !state && (
                          <span className="rounded bg-emerald-700/40 px-1 py-0.5 text-[8px] uppercase tracking-wider text-emerald-300">
                            now
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-medium ${state ? 'text-emerald-300/60' : 'text-emerald-100'}`}>
                        {step.title}
                      </p>
                      {isExpanded && (
                        <p className={`mt-1.5 text-[11px] leading-relaxed ${colors.text}`}>{step.description}</p>
                      )}
                      {notes[key] && (
                        <p className="mt-1 text-[10px] italic leading-relaxed text-amber-200/50">
                          “{notes[key]}”
                        </p>
                      )}
                    </div>
                    <span className="text-[9px] text-emerald-600/50">{step.duration}</span>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
