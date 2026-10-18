import { useEffect, useState } from 'react'
import type { UserProfile } from '../lib/data'
import { getActivePopup, type Popup } from '../lib/smartEngine'
import { getPopupHandled, markPopupHandled, resetPopup, type HandledState } from '../lib/store'
import { Button } from '@/components/ui/button'

interface Props {
  profile: UserProfile
  onNavigate: (tab: string) => void
  onCloseDay: () => void
  /** Changing this forces a re-check — useful after a tab switch. */
  refreshKey?: number
}

const snoozeUntil: { id: string; until: number }[] = []

export default function SmartPopups({ profile, onNavigate, onCloseDay, refreshKey = 0 }: Props) {
  const [popup, setPopup] = useState<Popup | null>(null)
  const [handled, setHandled] = useState<Record<string, HandledState>>({})
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    setHandled(getPopupHandled())
  }, [refreshKey])

  useEffect(() => {
    const check = () => {
      const active = getActivePopup(profile, getPopupHandled())
      if (!active) {
        setPopup(null)
        return
      }
      if (dismissed.includes(active.id)) return
      const snoozed = snoozeUntil.find(s => s.id === active.id)
      if (snoozed && Date.now() < snoozed.until) return
      setPopup(active)
    }
    check()
    const timer = setInterval(check, 45_000)
    return () => clearInterval(timer)
  }, [profile, dismissed, refreshKey])

  if (!popup) return null

  const act = (actionId: string) => {
    const isSkip = actionId === 'skip' || actionId === 'later' || actionId === 'not_now'
    const isSnooze = actionId === 'snooze'

    if (isSnooze) {
      snoozeUntil.push({ id: popup.id, until: Date.now() + 10 * 60 * 1000 })
      setPopup(null)
      return
    }

    if (popup.kind === 'sleep' && actionId === 'close') {
      markPopupHandled(popup.id, 'done')
      setPopup(null)
      onCloseDay()
      return
    }

    if (popup.kind === 'plan' && actionId === 'plan') {
      markPopupHandled(popup.id, 'done')
      setPopup(null)
      onNavigate('plan')
      return
    }

    markPopupHandled(popup.id, isSkip ? 'skipped' : 'done')
    setHandled(getPopupHandled())

    if (popup.tab && !isSkip) {
      setPopup(null)
      onNavigate(popup.tab)
      return
    }

    setDismissed(d => [...d, popup.id])
    setPopup(null)
  }

  const later = () => {
    if (popup.kind === 'sleep' || popup.kind === 'plan') {
      markPopupHandled(popup.id, 'snoozed')
    }
    resetPopup(popup.id)
    setDismissed(d => [...d, popup.id])
    setPopup(null)
  }

  const confirmedCount = Object.values(handled).filter(v => v === 'done').length

  return (
    <div className="fixed inset-x-0 bottom-[86px] z-40 px-3">
      <div className="mx-auto max-w-lg">
        <div
          className="animate-in slide-in-from-bottom-4 fade-in overflow-hidden rounded-2xl border border-emerald-600/40 shadow-2xl shadow-black/50 backdrop-blur-xl duration-300"
          style={{ background: 'linear-gradient(145deg, rgba(6,38,24,0.97), rgba(8,26,16,0.97))' }}
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800/60 text-lg">
                {popup.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/70">{popup.time}</p>
                  {confirmedCount > 0 && (
                    <span className="rounded-full bg-emerald-900/60 px-1.5 py-0.5 text-[9px] text-emerald-400/80">
                      {confirmedCount} done today
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm font-medium leading-snug text-emerald-50">{popup.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-200/70">{popup.body}</p>
              </div>
              <button
                onClick={later}
                aria-label="Dismiss"
                className="shrink-0 rounded-lg p-1 text-emerald-500/50 transition hover:bg-emerald-900/40 hover:text-emerald-300"
              >
                ✕
              </button>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2">
              {popup.actions.map(a => (
                <Button
                  key={a.id}
                  onClick={() => act(a.id)}
                  size="sm"
                  className={
                    a.style === 'primary'
                      ? 'h-8 rounded-lg bg-emerald-600 px-3 text-xs text-emerald-50 hover:bg-emerald-500'
                      : 'h-8 rounded-lg border border-emerald-800/60 bg-emerald-950/50 px-3 text-xs text-emerald-300 hover:bg-emerald-900/50'
                  }
                  variant={a.style === 'primary' ? 'default' : 'outline'}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
