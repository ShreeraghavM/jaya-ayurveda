import { useMemo, useState } from 'react'
import type { UserProfile } from '../lib/data'
import { doshaProfiles } from '../lib/data'
import { buildTomorrowPlan, reviewDay } from '../lib/smartEngine'
import { getPopupHandled, getTodayLog } from '../lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import BedtimePainCheckin from './BedtimePainCheckin'

interface Props {
  profile: UserProfile
  onClose: () => void
}

export default function GoodNightRitual({ profile, onClose }: Props) {
  const [showPainCheckin, setShowPainCheckin] = useState(false)
  const dosha = profile.doshaType ?? 'Vata'
  const log = useMemo(() => getTodayLog(), [])
  const handled = useMemo(() => getPopupHandled(), [])
  const review = useMemo(() => reviewDay(profile, log, handled), [profile, log, handled])
  const tomorrow = useMemo(() => buildTomorrowPlan(profile, log), [profile, log])

  const ring = 2 * Math.PI * 42
  const offset = ring - (review.score / 100) * ring

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050f09]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-center">
            <p className="text-3xl">🌙</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-emerald-500/70">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-50">
              Good night, {profile.name || 'friend'}
            </h1>
            <p className="mt-1 text-xs text-emerald-300/60">{review.headline}</p>
          </div>

          {/* Score */}
          <div className="mt-7 flex justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(6,78,59,0.5)" strokeWidth="7" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={ring}
                  strokeDashoffset={offset}
                />
                <defs>
                  <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-semibold text-emerald-50">{review.score}</p>
                <p className="text-[9px] uppercase tracking-wider text-emerald-500/70">day score</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { label: 'Water', value: `${review.water}`, unit: 'glasses' },
              { label: 'Meals', value: `${review.mealsLogged}`, unit: 'logged' },
              { label: 'Practice', value: `${review.practices}`, unit: 'minutes' },
            ].map(s => (
              <Card key={s.label} className="rounded-xl border-emerald-900/50 bg-emerald-950/40 p-3 text-center">
                <p className="text-lg font-semibold text-emerald-100">{s.value}</p>
                <p className="text-[9px] uppercase tracking-wider text-emerald-500/60">{s.unit}</p>
                <p className="mt-0.5 text-[10px] text-emerald-400/50">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Achievements */}
          <Card className="mt-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              What you achieved today
            </p>
            <ul className="space-y-2">
              {review.achievements.map(a => (
                <li key={a} className="flex gap-2 text-xs leading-relaxed text-emerald-100/80">
                  <span className="text-emerald-400">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Improvements */}
          <Card className="mt-3 rounded-2xl border-amber-800/30 bg-amber-950/15 p-5">
            <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-amber-300/80">
              Where tomorrow can be better
            </p>
            <ul className="space-y-2">
              {review.improvements.map(i => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-amber-100/70">
                  <span className="text-amber-400/80">→</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Encouragement */}
          <Card className="mt-3 rounded-2xl border-emerald-700/30 bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 p-5">
            <p className="text-xs leading-relaxed text-emerald-100/90">{review.encouragement}</p>
          </Card>

          {/* Tomorrow */}
          <Card className="mt-3 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Tomorrow, gently
            </p>
            <div className="space-y-2">
              {tomorrow.meals.map(m => (
                <div key={m.slot} className="flex items-baseline justify-between gap-2">
                  <p className="text-[11px] text-emerald-400/60">{m.slot}</p>
                  <p className="flex-1 text-right text-xs text-emerald-100/80">{m.name}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-emerald-900/50 pt-3 text-[11px] leading-relaxed text-emerald-300/60">
              {tomorrow.focus}
            </p>
          </Card>

          {/* Bedtime Symptom & Pain Review Prompt */}
          <div className="mt-3 p-4 rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 to-black/60 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌙</span>
                <div>
                  <p className="text-xs font-bold text-indigo-100">Bedtime Symptom & Pain Check-in</p>
                  <p className="text-[10px] text-indigo-300/70">
                    Did today's food & remedies reduce bodily discomfort as projected?
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowPainCheckin(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono rounded-xl shrink-0"
              >
                Check In ➔
              </Button>
            </div>
          </div>

          {showPainCheckin && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
              <div className="max-w-lg mx-auto">
                <BedtimePainCheckin
                  onCompleted={() => setShowPainCheckin(false)}
                  onClose={() => setShowPainCheckin(false)}
                />
              </div>
            </div>
          )}

          {/* Sleep ritual */}
          <Card className="mt-3 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Tonight's wind-down for {dosha}
            </p>
            <p className="text-[11px] leading-relaxed text-emerald-300/70">
              {doshaProfiles[dosha].sleepAdvice}
            </p>
          </Card>

          <Button
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-emerald-600 py-5 text-emerald-50 hover:bg-emerald-500"
          >
            Sleep well 🌙
          </Button>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-emerald-600/50">
            Your progress card is saved. See you at sunrise.
          </p>
        </div>
      </div>
    </div>
  )
}
