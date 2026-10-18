import { useState, useMemo } from 'react'
import { type UserProfile, doshaProfiles, type DailyLog, type Mood } from '../lib/data'
import { getLast7DaysLogs, getTodayLog, saveDailyLog } from '../lib/store'
import { Card } from '@/components/ui/card'

interface Props {
  profile: UserProfile
}

export default function Progress({ profile }: Props) {
  const dosha = profile.doshaType || 'Vata'
  const doshaInfo = doshaProfiles[dosha]
  const [todayLog, setTodayLog] = useState(getTodayLog())
  const weekLogs = useMemo(() => getLast7DaysLogs(), [])

  const avgEnergy = useMemo(() => {
    if (weekLogs.length === 0) return { morning: 5, afternoon: 5, evening: 5 }
    const sum = weekLogs.reduce(
      (acc, log) => ({
        morning: acc.morning + log.energyLevels.morning,
        afternoon: acc.afternoon + log.energyLevels.afternoon,
        evening: acc.evening + log.energyLevels.evening,
      }),
      { morning: 0, afternoon: 0, evening: 0 }
    )
    const n = weekLogs.length
    return {
      morning: Math.round(sum.morning / n * 10) / 10,
      afternoon: Math.round(sum.afternoon / n * 10) / 10,
      evening: Math.round(sum.evening / n * 10) / 10,
    }
  }, [weekLogs])

  const totalYoga = weekLogs.reduce((s, l) => s + l.yogaMinutes, 0)
  const totalPranayama = weekLogs.reduce((s, l) => s + l.pranayamaMinutes, 0)
  const totalMeditation = weekLogs.reduce((s, l) => s + l.meditationMinutes, 0)
  const totalExercise = weekLogs.reduce((s, l) => s + l.exerciseMinutes, 0)
  const totalWater = weekLogs.reduce((s, l) => s + l.waterIntake, 0)
  const avgSleep = weekLogs.length ? Math.round(weekLogs.reduce((s, l) => s + l.sleepHours, 0) / weekLogs.length * 10) / 10 : 7

  const moodDistribution = useMemo(() => {
    const dist: Record<Mood, number> = {
      energetic: 0, calm: 0, anxious: 0, sluggish: 0, happy: 0, stressed: 0, balanced: 0,
    }
    weekLogs.forEach(l => { dist[l.mood]++ })
    return dist
  }, [weekLogs])

  const topMood = useMemo(() => {
    const entries = Object.entries(moodDistribution) as [Mood, number][]
    entries.sort((a, b) => b[1] - a[1])
    return entries[0]
  }, [moodDistribution])

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #0a1a0a 0%, #0d1f0d 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-emerald-100 mb-1">Your Progress</h1>
        <p className="text-emerald-300/60 text-sm">
          Wellness journey — last {weekLogs.length || '7'} days
        </p>
      </div>

      {/* Dosha Profile Card */}
      <div className="px-5 mb-6">
        <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 border-emerald-700/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">
              {dosha === 'Vata' ? '🌬️' : dosha === 'Pitta' ? '🔥' : '🌍'}
            </div>
            <div>
              <h3 className="text-emerald-100 font-semibold text-lg">{dosha} Constitution</h3>
              <p className="text-emerald-300/50 text-xs">{doshaInfo.element}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Vata', value: 33, color: '#7dd3fc' },
              { label: 'Pitta', value: 34, color: '#fbbf24' },
              { label: 'Kapha', value: 33, color: '#86efac' },
            ].map(d => (
              <div key={d.label} className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-1">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#0d3320" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="16" fill="none"
                      stroke={d.color}
                      strokeWidth="3"
                      strokeDasharray={`${d.value} 100`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-emerald-100 text-xs font-bold">
                    {d.value}%
                  </span>
                </div>
                <p className="text-emerald-300 text-[10px]">{d.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '😴', label: 'Avg Sleep', value: `${avgSleep}h`, color: 'from-purple-900/20 to-purple-950/20 border-purple-800/20' },
            { icon: '💧', label: 'Total Water', value: `${totalWater} glasses`, color: 'from-sky-900/20 to-sky-950/20 border-sky-800/20' },
            { icon: '🧘', label: 'Yoga', value: `${totalYoga} min`, color: 'from-violet-900/20 to-violet-950/20 border-violet-800/20' },
            { icon: '🫁', label: 'Pranayama', value: `${totalPranayama} min`, color: 'from-emerald-900/20 to-emerald-950/20 border-emerald-800/20' },
            { icon: '🧠', label: 'Meditation', value: `${totalMeditation} min`, color: 'from-indigo-900/20 to-indigo-950/20 border-indigo-800/20' },
            { icon: '🏃', label: 'Exercise', value: `${totalExercise} min`, color: 'from-rose-900/20 to-rose-950/20 border-rose-800/20' },
          ].map(stat => (
            <Card key={stat.label} className={`bg-gradient-to-br ${stat.color} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-emerald-400/50 text-[10px] uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-emerald-100 font-bold text-lg">{stat.value}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Energy Trend */}
      <div className="px-5 mb-6">
        <Card className="bg-emerald-950/40 border-emerald-800/30 p-5">
          <h3 className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4">
            Average Energy Levels
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Morning', value: avgEnergy.morning, icon: '🌅', color: '#f59e0b' },
              { label: 'Afternoon', value: avgEnergy.afternoon, icon: '☀️', color: '#f97316' },
              { label: 'Evening', value: avgEnergy.evening, icon: '🌙', color: '#8b5cf6' },
            ].map(e => (
              <div key={e.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-200/70 text-xs flex items-center gap-1.5">
                    <span>{e.icon}</span> {e.label}
                  </span>
                  <span className="text-emerald-300/50 text-xs">{e.value.toFixed(1)} / 5</span>
                </div>
                <div className="h-3 bg-emerald-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(e.value / 5) * 100}%`, backgroundColor: e.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mood Distribution */}
      <div className="px-5 mb-6">
        <Card className="bg-emerald-950/40 border-emerald-800/30 p-5">
          <h3 className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4">
            Mood Distribution
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodDistribution).map(([mood, count]) => {
              const emojis: Record<string, string> = {
                energetic: '⚡', calm: '😌', anxious: '😰', sluggish: '😴',
                happy: '😊', stressed: '😤', balanced: '⚖️',
              }
              const total = weekLogs.length || 1
              const pct = Math.round((count / total) * 100)
              if (count === 0) return null
              return (
                <div key={mood} className="flex items-center gap-2 bg-emerald-900/20 rounded-lg px-3 py-2">
                  <span>{emojis[mood]}</span>
                  <span className="text-emerald-200/70 text-xs capitalize">{mood}</span>
                  <span className="text-emerald-400/50 text-xs">{pct}%</span>
                </div>
              )
            })}
          </div>
          {topMood && topMood[1] > 0 && (
            <p className="text-emerald-400/40 text-xs mt-3">
              Your most common mood this week: <span className="text-emerald-300/60 capitalize">{topMood[0]}</span>
            </p>
          )}
        </Card>
      </div>

      {/* Daily Log Quick Entry */}
      <div className="px-5 mb-6">
        <Card className="bg-emerald-950/40 border-emerald-800/30 p-5">
          <h3 className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4">
            Log Today's Activity
          </h3>
          <div className="space-y-3">
            {[
              { key: 'yogaMinutes', label: 'Yoga', icon: '🧘', unit: 'min' },
              { key: 'pranayamaMinutes', label: 'Pranayama', icon: '🫁', unit: 'min' },
              { key: 'meditationMinutes', label: 'Meditation', icon: '🧠', unit: 'min' },
              { key: 'exerciseMinutes', label: 'Exercise', icon: '🏃', unit: 'min' },
            ].map(item => (
              <div key={item.key} className="flex items-center gap-3">
                <span className="text-sm w-6">{item.icon}</span>
                <span className="text-emerald-200/70 text-xs flex-1">{item.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const current = todayLog[item.key as keyof DailyLog] as number
                      setTodayLog(l => ({ ...l, [item.key]: Math.max(0, current - 5) }))
                    }}
                    className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30 text-emerald-300/60 text-xs flex items-center justify-center hover:bg-emerald-800/30"
                  >
                    -
                  </button>
                  <span className="text-emerald-100 text-sm font-mono w-8 text-center">
                    {todayLog[item.key as keyof DailyLog] as number}
                  </span>
                  <button
                    onClick={() => {
                      const current = todayLog[item.key as keyof DailyLog] as number
                      setTodayLog(l => ({ ...l, [item.key]: current + 5 }))
                    }}
                    className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30 text-emerald-300/60 text-xs flex items-center justify-center hover:bg-emerald-800/30"
                  >
                    +
                  </button>
                  <span className="text-emerald-500/30 text-[10px] w-6">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-800/20">
            <div className="flex items-center gap-3">
              <span className="text-sm">😴</span>
              <span className="text-emerald-200/70 text-xs flex-1">Sleep Quality</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setTodayLog(l => ({ ...l, sleepQuality: i + 1 }))}
                    className={`w-6 h-6 rounded-full transition-all ${
                      i < todayLog.sleepQuality
                        ? 'bg-amber-400 shadow-sm shadow-amber-400/20'
                        : 'bg-emerald-900/30 border border-emerald-800/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-3">
              <span className="text-sm">💤</span>
              <span className="text-emerald-200/70 text-xs flex-1">Sleep Hours</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTodayLog(l => ({ ...l, sleepHours: Math.max(0, l.sleepHours - 0.5) }))}
                  className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30 text-emerald-300/60 text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-emerald-100 text-sm font-mono w-8 text-center">{todayLog.sleepHours}</span>
                <button
                  onClick={() => setTodayLog(l => ({ ...l, sleepHours: Math.min(12, l.sleepHours + 0.5) }))}
                  className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30 text-emerald-300/60 text-xs flex items-center justify-center"
                >
                  +
                </button>
                <span className="text-emerald-500/30 text-[10px]">hrs</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Wisdom */}
      <div className="px-5 mb-6">
        <Card className="bg-gradient-to-br from-amber-900/15 to-emerald-900/15 border-amber-800/15 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📖</span>
            <h3 className="text-amber-200/70 text-xs font-semibold tracking-wider uppercase">Balance Tip for {dosha}</h3>
          </div>
          <p className="text-emerald-100/70 text-xs leading-relaxed">
            {doshaInfo.balanceTips[Math.floor(Math.random() * doshaInfo.balanceTips.length)]}
          </p>
        </Card>
      </div>
    </div>
  )
}
