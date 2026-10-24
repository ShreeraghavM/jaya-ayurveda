import { useState, useEffect, useMemo } from 'react'
import {
  type UserProfile, doshaProfiles, getGreeting, getSeason,
  getAgniStatus, getTimeOfDayAdvice, getCurrentTimePeriod, dailyRoutine
} from '../lib/data'
import { doshaPercentages, getTodayLog, saveDailyLog } from '../lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  profile: UserProfile
  onNavigate: (tab: string) => void
  onOpenHealthIntake?: () => void
  onOpenChapters?: () => void
}

export default function Dashboard({ profile, onNavigate, onOpenHealthIntake, onOpenChapters }: Props) {
  const [now, setNow] = useState(new Date())
  const [todayLog, setTodayLog] = useState(getTodayLog())
  const [waterAdded, setWaterAdded] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { saveDailyLog(todayLog) }, [todayLog])

  const dosha = profile.doshaType || 'Vata'
  const doshaInfo = doshaProfiles[dosha]
  const season = getSeason()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

  const currentRoutineStep = useMemo(() => {
    const currentMinutes = hour * 60 + minute
    for (let i = dailyRoutine.length - 1; i >= 0; i--) {
      const [rh, rm] = dailyRoutine[i].time.includes(':')
        ? dailyRoutine[i].time.split(':').map(Number)
        : [0, 0]
      if (currentMinutes >= rh * 60 + rm) return { step: dailyRoutine[i], index: i }
    }
    return { step: dailyRoutine[0], index: 0 }
  }, [hour, minute])

  const nextStep = currentRoutineStep.index < dailyRoutine.length - 1
    ? dailyRoutine[currentRoutineStep.index + 1]
    : null

  const sunPosition = ((hour - 5) / 14) * 100
  const clampedSun = Math.max(0, Math.min(100, sunPosition))

  const doshaPct = doshaPercentages(profile)

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #0a1a0a 0%, #0d1f0d 30%, #111f11 100%)' }}>
      {/* ─── HEADER ─── */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-400/50 text-xs tracking-wider uppercase font-medium">
              {getGreeting()}, {profile.name || 'Friend'}
            </p>
            <h1 className="text-2xl font-bold text-emerald-50 mt-1">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-emerald-200 text-3xl font-light tabular-nums">{timeString}</p>
            <p className="text-emerald-400/50 text-xs capitalize">{season} season</p>
          </div>
        </div>

        {/* Sun Arc */}
        <div className="relative h-24 mb-4 overflow-hidden">
          <svg viewBox="0 0 300 100" className="w-full h-full">
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M 20 90 Q 150 -20 280 90" fill="none" stroke="url(#arcGrad)" strokeWidth="2" strokeDasharray="4,4" />
            <circle
              cx={20 + (clampedSun / 100) * 260}
              cy={90 - Math.sin((clampedSun / 100) * Math.PI) * 80}
              r="8"
              fill="#f59e0b"
              className="drop-shadow-lg"
            />
            <text x="20" y="100" fill="#737373" fontSize="8">5 AM</text>
            <text x="140" y="100" fill="#737373" fontSize="8" textAnchor="middle">Noon</text>
            <text x="270" y="100" fill="#737373" fontSize="8" textAnchor="end">7 PM</text>
          </svg>
        </div>
      </div>

      {/* ─── CURRENT MOMENT ─── */}
      <div className="px-5 mb-6">
        <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 border-emerald-700/30 p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{currentRoutineStep.step.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-400/50 text-xs font-mono">{currentRoutineStep.step.time}</span>
                <span className="text-emerald-700 text-xs">•</span>
                <span className="text-emerald-400/50 text-xs">{currentRoutineStep.step.duration}</span>
              </div>
              <h3 className="text-emerald-100 font-semibold text-base">{currentRoutineStep.step.title}</h3>
            </div>
          </div>
          <p className="text-emerald-200/70 text-sm leading-relaxed">{currentRoutineStep.step.description}</p>
          
          {nextStep && (
            <div className="mt-4 pt-3 border-t border-emerald-800/30 flex items-center gap-2">
              <span className="text-xs text-emerald-500/50">Next:</span>
              <span className="text-xs text-emerald-400/70">{nextStep.icon} {nextStep.title} at {nextStep.time}</span>
            </div>
          )}
        </Card>
      </div>

      {/* ─── HUMAN ANATOMY & SROTAS VITALITY BANNER ─── */}
      <div className="px-5 mb-3">
        <div
          onClick={() => onNavigate('profile')}
          className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-[#0a2717] to-indigo-950/70 border border-emerald-500/50 hover:border-emerald-400/80 transition-all shadow-xl group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">🧬</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
                    Ayurvedic Digital Twin
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 font-semibold">13 Anatomical Systems</span>
                </div>
                <h3 className="text-emerald-50 font-semibold text-sm">
                  Human Anatomy & Organ Vitality Map
                </h3>
                <p className="text-emerald-200/70 text-xs mt-1 leading-relaxed">
                  Track 0% to 100% organ nourishment from today's meals, observe active pathology beacons, record diagnostic lab counts, and complete your bedtime pain review.
                </p>
              </div>
            </div>
            <span className="text-emerald-400 text-sm group-hover:translate-x-1 transition-transform shrink-0 mt-2">
              ➔
            </span>
          </div>
        </div>
      </div>

      {/* ─── CHARAKA AHARA MATRA & DESHA-SATMYA 1/3 BANNER ─── */}
      <div className="px-5 mb-3">
        <div
          onClick={() => onNavigate('diet')}
          className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-[#1c1205] via-[#291b08] to-emerald-950/70 border border-amber-500/50 hover:border-amber-400/80 transition-all shadow-xl group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">🌾</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-600/40">
                    Charaka Vimana 2.3 & Sutra 6
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-semibold">1/3 Stomach Division Rule</span>
                </div>
                <h3 className="text-amber-100 font-semibold text-sm">
                  Charaka Ahara Matra & Desha-Satmya Calculator
                </h3>
                <p className="text-amber-200/70 text-xs mt-1 leading-relaxed">
                  Exact solid portion grams, liquid portion ml, and native birthplace soil food matching calibrated by your age and gender.
                </p>
              </div>
            </div>
            <span className="text-amber-400 text-sm group-hover:translate-x-1 transition-transform shrink-0 mt-2">
              ➔
            </span>
          </div>
        </div>
      </div>

      {/* ─── VASANTA RITU (SPRING SEASON) BIO-SHIELD BANNER ─── */}
      <div className="px-5 mb-3">
        <div
          onClick={() => onNavigate('diet')}
          className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-[#1c080e] via-[#2a0e16] to-[#0d0306] border border-rose-500/50 hover:border-rose-400/80 transition-all shadow-xl group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">🌸</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 bg-rose-950/90 px-2 py-0.5 rounded-full border border-rose-600/40">
                    Charaka Sutra 6.22-26
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-semibold">Vasanta Ritu Bio-Shield</span>
                </div>
                <h3 className="text-rose-100 font-semibold text-sm">
                  Spring Kapha Liquefaction Defense & Zero Allergies
                </h3>
                <p className="text-rose-200/70 text-xs mt-1 leading-relaxed">
                  Sun rays melt winter mucus flooding Jatharagni. 15% fat reduction, aged barley & honey scraping, and strict daytime nap ban (Diva-swapna Nishiddha).
                </p>
              </div>
            </div>
            <span className="text-rose-400 text-sm group-hover:translate-x-1 transition-transform shrink-0 mt-2">
              ➔
            </span>
          </div>
        </div>
      </div>

      {/* ─── CLINICAL HEALTH INTAKE BANNER (Polite & Personalized) ─── */}
      <div className="px-5 mb-3">
        <div
          onClick={onOpenHealthIntake}
          className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0a2616] to-black/80 border border-emerald-600/40 hover:border-emerald-400/60 transition-all shadow-xl group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">🩺</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
                    Vedic Clinical Intake
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-semibold">Vector AI</span>
                </div>
                <h3 className="text-emerald-50 font-semibold text-sm">
                  Have Existing Health Issues? (Blood Sugar, BP, Joints...)
                </h3>
                <p className="text-emerald-200/70 text-xs mt-1 leading-relaxed">
                  Tell us politely in your own words. We vectorize your symptoms against the Charaka Samhita and clinical trials to give you exact intake grams, targeted yoga, and 14–90 day tracking with numbers.
                </p>
              </div>
            </div>
            <span className="text-emerald-400 text-sm group-hover:translate-x-1 transition-transform shrink-0 mt-2">
              ➔
            </span>
          </div>
        </div>
      </div>

      {/* ─── CHARAKA SAMHITA 120 CHAPTERS EXPLORER BANNER ─── */}
      <div className="px-5 mb-6">
        <div
          onClick={() => {
            if (onOpenChapters) onOpenChapters()
            else onNavigate('remedies')
          }}
          className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#1b1909] to-black/80 border border-amber-500/50 hover:border-amber-400/80 transition-all shadow-xl group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">📜</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-500/50">
                    Canonical Samhita
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-semibold">VIII Sthanas · 120 Chapters</span>
                </div>
                <h3 className="text-amber-100 font-semibold text-sm">
                  Charaka Samhita 120 Chapters Explorer
                </h3>
                <p className="text-emerald-200/70 text-xs mt-1 leading-relaxed">
                  Canonical encyclopedia from carakasamhitaonline.com indexed across Sutra, Nidana, Vimana, Sharira, Indriya, Chikitsa, Kalpa & Siddhi Sthanas.
                </p>
              </div>
            </div>
            <span className="text-amber-400 text-sm group-hover:translate-x-1 transition-transform shrink-0 mt-2">
              ➔
            </span>
          </div>
        </div>
      </div>

      {/* ─── QUICK PATHWAYS (gstack Fast Access) ─── */}
      <div className="px-5 mb-6">
        <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/70 mb-2">Direct Feature Access</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-indigo-950/40 to-emerald-900/30 border border-emerald-500/40 text-left hover:border-emerald-400 hover:bg-emerald-900/40 transition-all group shadow-sm"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🧬</span>
            <div>
              <p className="text-emerald-100 text-xs font-semibold">Anatomy Twin</p>
              <p className="text-emerald-400/60 text-[10px]">13 Body Systems</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('diet')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-amber-950/60 via-emerald-950/40 to-emerald-900/30 border border-amber-500/40 text-left hover:border-amber-400 hover:bg-emerald-900/40 transition-all group shadow-sm"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🌾</span>
            <div>
              <p className="text-amber-100 text-xs font-semibold">Ahara Matra</p>
              <p className="text-amber-300/60 text-[10px]">1/3 Stomach Rule</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('diet')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border border-emerald-800/40 text-left hover:border-emerald-500/50 hover:bg-emerald-900/40 transition-all group shadow-sm"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🍽️</span>
            <div>
              <p className="text-emerald-100 text-xs font-semibold">Diet Plan</p>
              <p className="text-emerald-400/60 text-[10px]">Dosha Recipes</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (onOpenChapters) onOpenChapters()
              else onNavigate('remedies')
            }}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 via-emerald-950/60 to-emerald-900/30 border border-amber-500/40 text-left hover:border-amber-400 hover:bg-emerald-900/40 transition-all group shadow-sm"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📜</span>
            <div>
              <p className="text-amber-200 text-xs font-semibold">120 Chapters</p>
              <p className="text-emerald-400/60 text-[10px]">Charaka Samhita</p>
            </div>
          </button>
        </div>
      </div>

      {/* ─── AGNI STATUS ─── */}
      <div className="px-5 mb-6">
        <div className="bg-amber-900/20 border border-amber-800/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-amber-200/80 text-xs font-semibold tracking-wider uppercase">Digestive Fire</p>
            <p className="text-amber-100/60 text-sm">{getAgniStatus(hour)}</p>
          </div>
        </div>
      </div>

      {/* ─── PERSONAL GUIDANCE ─── */}
      <div className="px-5 mb-6">
        <Card className="bg-emerald-950/40 border-emerald-800/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">
              {dosha === 'Vata' ? '🌬️' : dosha === 'Pitta' ? '🔥' : '🌍'}
            </span>
            <h3 className="text-emerald-200 text-xs font-semibold tracking-wider uppercase">
              Your {dosha} Guidance — Right Now
            </h3>
          </div>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            {getTimeOfDayAdvice(dosha, hour)}
          </p>
        </Card>
      </div>

      {/* ─── WATER TRACKER ─── */}
      <div className="px-5 mb-6">
        <Card className="bg-emerald-950/40 border-emerald-800/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-emerald-200 text-xs font-semibold tracking-wider uppercase">💧 Water Intake</h3>
            <span className="text-emerald-300 text-sm font-mono">{todayLog.waterIntake + waterAdded} / 8 glasses</span>
          </div>
          <div className="flex gap-1.5 mb-3">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded-lg transition-all duration-300 ${
                  i < todayLog.waterIntake + waterAdded
                    ? 'bg-sky-500/60 shadow-sm shadow-sky-500/20'
                    : 'bg-emerald-900/30 border border-emerald-800/20'
                }`}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              const newTotal = todayLog.waterIntake + waterAdded + 1
              setTodayLog(l => ({ ...l, waterIntake: newTotal }))
              setWaterAdded(w => w + 1)
            }}
            variant="outline"
            className="w-full border-emerald-700/30 text-emerald-300 hover:bg-emerald-800/30 text-xs"
          >
            + Add Glass
          </Button>
        </Card>
      </div>

      {/* ─── ENERGY & MOOD ─── */}
      <div className="px-5 mb-6">
        <h3 className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3 px-1">
          How Are You Feeling?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['morning', 'afternoon', 'evening'] as const).map(period => (
            <Card key={period} className="bg-emerald-950/40 border-emerald-800/30 p-3 text-center">
              <p className="text-emerald-400/50 text-[10px] uppercase tracking-wider mb-2">{period}</p>
              <div className="flex justify-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTodayLog(l => ({
                        ...l,
                        energyLevels: { ...l.energyLevels, [period]: i + 1 }
                      }))
                    }}
                    className={`w-5 h-5 rounded-full transition-all ${
                      i < todayLog.energyLevels[period]
                        ? 'bg-amber-400 shadow-sm shadow-amber-400/30'
                        : 'bg-emerald-900/30 border border-emerald-800/20'
                    }`}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── QUICK MOOD ─── */}
      <div className="px-5 mb-6">
        <h3 className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3 px-1">
          Current Mood
        </h3>
        <div className="flex gap-2 flex-wrap">
          {[
            { mood: 'energetic', emoji: '⚡', label: 'Energetic' },
            { mood: 'calm', emoji: '😌', label: 'Calm' },
            { mood: 'happy', emoji: '😊', label: 'Happy' },
            { mood: 'balanced', emoji: '⚖️', label: 'Balanced' },
            { mood: 'anxious', emoji: '😰', label: 'Anxious' },
            { mood: 'stressed', emoji: '😤', label: 'Stressed' },
            { mood: 'sluggish', emoji: '😴', label: 'Sluggish' },
          ].map(m => (
            <button
              key={m.mood}
              onClick={() => setTodayLog(l => ({ ...l, mood: m.mood as any }))}
              className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                todayLog.mood === m.mood
                  ? 'bg-emerald-700 border border-emerald-500 text-emerald-100'
                  : 'bg-emerald-950/50 border border-emerald-800/30 text-emerald-400/60 hover:bg-emerald-900/30'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── DOSHA BALANCE ─── */}
      <div className="px-5 mb-6">
        <Card className="bg-emerald-950/40 border-emerald-800/30 p-5">
          <h3 className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4">Your Dosha Balance</h3>
          <div className="relative h-32 flex items-center justify-center">
            <div className="flex items-end gap-6 h-full">
              {[
                { label: 'Vata', value: doshaPct.Vata, color: 'bg-sky-400', icon: '🌬️' },
                { label: 'Pitta', value: doshaPct.Pitta, color: 'bg-amber-400', icon: '🔥' },
                { label: 'Kapha', value: doshaPct.Kapha, color: 'bg-emerald-400', icon: '🌍' },
              ].map(d => (
                <div key={d.label} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-emerald-400/60">{d.value}%</span>
                  <div className={`w-12 ${d.color} rounded-t-lg transition-all duration-1000 opacity-70`}
                    style={{ height: `${d.value * 2.5}px` }}
                  />
                  <span className="text-xs text-emerald-300">{d.icon}</span>
                  <span className="text-[10px] text-emerald-500/60">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ─── TODAY'S TIP ─── */}
      <div className="px-5 mb-6">
        <Card className="bg-gradient-to-br from-amber-900/20 to-emerald-900/20 border-amber-800/20 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <h3 className="text-amber-200/80 text-xs font-semibold tracking-wider uppercase">Wisdom of the Day</h3>
          </div>
          <p className="text-emerald-100/80 text-sm italic leading-relaxed">
            "{season === 'summer' ? 'When the sun is fierce, be the shade. Cool your body, calm your mind, and let your spirit rest in the garden of simplicity.' 
              : season === 'winter' ? 'The cold invites inward. Use this season to nourish, build, and strengthen. Warmth is your greatest ally.'
              : season === 'spring' ? 'The earth renews itself. Let go of what no longer serves you. Spring is for cleansing and new beginnings.'
              : 'Balance is not stillness — it is the dynamic harmony of movement and rest. Find yours today.'}"
          </p>
          <p className="text-emerald-500/40 text-xs mt-2">— Ayurvedic Wisdom</p>
        </Card>
      </div>
    </div>
  )
}
