// src/components/BedtimePainCheckin.tsx
// Daily Bedtime Symptom & Pain Reduction Efficacy Check-in
// Compares projected healing reduction against actual user nocturnal feedback

import { useState } from 'react'
import {
  getBedtimePainLogs,
  saveBedtimePainLog,
  getDiseaseBeacons,
  type BedtimePainCheckinRecord,
  type DiseaseBeacon,
} from '@/lib/anatomyEngine'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { todayKey } from '@/lib/store'

interface Props {
  onCompleted?: () => void
  onClose?: () => void
}

export default function BedtimePainCheckin({ onCompleted, onClose }: Props) {
  const [beacons] = useState<DiseaseBeacon[]>(getDiseaseBeacons())
  const [logs, setLogs] = useState<BedtimePainCheckinRecord[]>(getBedtimePainLogs())

  // Select active beacon
  const activeBeacon = beacons.find(b => !b.isCleared) || beacons[0]

  // Form states
  const [selectedRelief, setSelectedRelief] = useState<BedtimePainCheckinRecord['reliefCategory']>('noticeable')
  const [painScore, setPainScore] = useState<number>(3)
  const [dietComplied, setDietComplied] = useState<boolean>(true)
  const [userNotes, setUserNotes] = useState<string>('')
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false)

  // Map relief category to numerical percentage
  const getActualPct = (cat: BedtimePainCheckinRecord['reliefCategory']): number => {
    switch (cat) {
      case 'significant':
        return 80
      case 'noticeable':
        return 50
      case 'mild':
        return 25
      case 'unchanged':
        return 0
      case 'worse':
        return -15
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLog: BedtimePainCheckinRecord = {
      id: `pain-log-${Date.now()}`,
      date: todayKey(),
      conditionId: activeBeacon ? activeBeacon.id : 'general-vitality',
      conditionName: activeBeacon ? activeBeacon.conditionName : 'Overall Body Wellness',
      projectedReductionPct: activeBeacon ? activeBeacon.expectedDailyPainReductionPct : 15,
      actualReductionPct: getActualPct(selectedRelief),
      reliefCategory: selectedRelief,
      painScore,
      userNotes: userNotes.trim() || 'Logged during nocturnal closing ritual.',
      verifiedDietCompliance: dietComplied,
    }

    saveBedtimePainLog(newLog)
    setLogs(getBedtimePainLogs())
    setSavedSuccess(true)

    setTimeout(() => {
      if (onCompleted) onCompleted()
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0e1124] via-[#090b17] to-[#04050a] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌙</span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[11px] font-mono">
                NOCTURNAL EFFICACY TRACKER
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-mono">
                BEDTIME PROTOCOL
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-50">
              Bedtime Symptom & Pain Review
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/70 mt-1 max-w-xl">
              We check in every night to measure how effectively the prescribed meals, herbs, and movement reduced bodily pain or discomfort compared to our clinical projections.
            </p>
          </div>

          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-indigo-800 text-indigo-300 rounded-xl text-xs font-mono"
            >
              Back
            </Button>
          )}
        </div>
      </div>

      {/* ─── ACTIVE CHECK-IN FORM ─── */}
      <Card className="rounded-3xl border-indigo-700/40 bg-[#090b17]/90 p-6 shadow-2xl text-indigo-50">
        {savedSuccess ? (
          <div className="text-center py-8">
            <span className="text-4xl">✨</span>
            <h3 className="text-lg font-bold text-emerald-300 mt-2">Nocturnal Feedback Recorded!</h3>
            <p className="text-xs text-indigo-200/70 mt-1">
              Your body's response has been logged. Jaya adapts tomorrow morning's Agni dipana herbs accordingly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Projected vs Reality Callout */}
            {activeBeacon && (
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-600/40">
                <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-mono block mb-1">
                  Active Clinical Target · {activeBeacon.conditionName}
                </span>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Today's protocol with <span className="text-amber-300 font-semibold">{activeBeacon.prescribedRemedy}</span> was projected to reduce tissue inflammation by{' '}
                  <span className="text-emerald-300 font-bold font-mono">~{activeBeacon.expectedDailyPainReductionPct}%</span>.
                </p>
              </div>
            )}

            {/* RELIEF CATEGORY SELECTOR */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-indigo-300 block mb-2">
                How did your body actually respond tonight?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'significant', label: 'Significant Relief', sub: '75–100% better', icon: '🌟' },
                  { id: 'noticeable', label: 'Noticeable Relief', sub: '50% better', icon: '✨' },
                  { id: 'mild', label: 'Mild Relief', sub: '25% better', icon: '🌱' },
                  { id: 'unchanged', label: 'Unchanged', sub: 'Same as morning', icon: '⚖️' },
                  { id: 'worse', label: 'Discomfort / Worse', sub: 'Increased irritation', icon: '⚠️' },
                ].map(opt => {
                  const isSel = selectedRelief === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedRelief(opt.id as BedtimePainCheckinRecord['reliefCategory'])}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSel
                          ? 'border-indigo-400 bg-indigo-900/80 shadow-md ring-1 ring-indigo-400/50'
                          : 'border-indigo-900/50 bg-black/40 hover:border-indigo-700/60'
                      }`}
                    >
                      <span className="text-xl block mb-1">{opt.icon}</span>
                      <p className="text-xs font-bold text-indigo-100">{opt.label}</p>
                      <p className="text-[10px] text-indigo-300/60 font-mono mt-0.5">{opt.sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PAIN / DISCOMFORT SEVERITY SCALE (0-10) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-indigo-300">
                  Current Pain / Discomfort Score (0 to 10)
                </label>
                <span className="text-base font-bold font-mono text-indigo-200">
                  {painScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={painScore}
                onChange={e => setPainScore(parseInt(e.target.value))}
                className="w-full accent-indigo-400 h-2 bg-indigo-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-indigo-400/60 font-mono mt-1">
                <span>0 (Completely Pain-Free)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe Pain)</span>
              </div>
            </div>

            {/* DIET COMPLIANCE CHECK */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/40">
              <div>
                <p className="text-xs font-semibold text-indigo-100">Did you consume the prescribed healing diet & remedies?</p>
                <p className="text-[10px] text-indigo-400/60">Helps us isolate whether response is metabolic or dietary</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setDietComplied(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                    dietComplied ? 'bg-emerald-600 text-white font-bold' : 'bg-black/40 text-emerald-400/70'
                  }`}
                >
                  Yes ✓
                </button>
                <button
                  type="button"
                  onClick={() => setDietComplied(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                    !dietComplied ? 'bg-rose-700 text-white font-bold' : 'bg-black/40 text-rose-400/70'
                  }`}
                >
                  Partially / No
                </button>
              </div>
            </div>

            {/* QUALITATIVE USER NOTES */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-indigo-300 block mb-1">
                Body Sensation & Remarks Before Sleep
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Swelling in knees was significantly lower after evening ginger compress; feeling peaceful..."
                value={userNotes}
                onChange={e => setUserNotes(e.target.value)}
                className="w-full rounded-2xl border border-indigo-900/60 bg-black/40 p-3 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-lg"
            >
              Submit Bedtime Check-in ✓
            </Button>
          </form>
        )}
      </Card>

      {/* ─── HISTORICAL CHECK-IN LOGS ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono text-indigo-300 uppercase tracking-wider">
          Bedtime Feedback History ({logs.length} entries)
        </h3>

        {logs.map(log => (
          <div
            key={log.id}
            className="p-4 rounded-2xl bg-[#090b17] border border-indigo-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-indigo-100">{log.conditionName}</span>
                <span className="text-[10px] text-indigo-400/60 font-mono">({log.date})</span>
                <Badge className="bg-indigo-950 text-indigo-300 border-indigo-800 text-[9px] font-mono uppercase">
                  {log.reliefCategory}
                </Badge>
              </div>
              <p className="text-[11px] text-indigo-200/80 italic">"{log.userNotes}"</p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-right">
              <div>
                <span className="text-[10px] text-indigo-400/60 font-mono block">Pain Score</span>
                <span className="font-mono font-bold text-indigo-200">{log.painScore} / 10</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-400/60 font-mono block">Relief Met</span>
                <span className="font-mono font-bold text-emerald-400">
                  {log.actualReductionPct > 0 ? `+${log.actualReductionPct}%` : `${log.actualReductionPct}%`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
