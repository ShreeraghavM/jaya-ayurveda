import { useMemo, useState } from 'react'
import {
  calculateDoshaType,
  doshaProfiles,
  doshaQuestions,
  type Dosha,
  type RegionId,
  type UserProfile,
} from '../lib/data'
import { createDefaultProfile, saveUserProfile, saveSession } from '../lib/store'
import { getBmiGuidance, getBmiResult } from '../lib/bmi'
import { professions, regionFoods } from '../lib/professions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

interface Props {
  onComplete: (profile: UserProfile) => void
  onDemo: () => void
}

type Step = 'welcome' | 'quiz' | 'result' | 'body' | 'profession'

const shell = 'min-h-screen px-4 py-8'
const bg = { background: 'linear-gradient(160deg, #08140c 0%, #0b1f12 55%, #061009 100%)' }

export default function Onboarding({ onComplete, onDemo }: Props) {
  const [step, setStep] = useState<Step>('welcome')
  const [quizIndex, setQuizIndex] = useState(0)
  const [scores, setScores] = useState<Record<Dosha, number>>({ Vata: 0, Pitta: 0, Kapha: 0 })
  const [profile, setProfile] = useState<UserProfile>(createDefaultProfile)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [fade, setFade] = useState(false)

  const quizProgress = ((quizIndex + 1) / doshaQuestions.length) * 100
  const bmi = useMemo(
    () => (profile.weight > 0 && profile.height > 0 ? getBmiResult(profile.weight, profile.height) : null),
    [profile.weight, profile.height],
  )

  const triggerFade = (fn: () => void) => {
    setFade(true)
    setTimeout(() => {
      fn()
      setFade(false)
    }, 260)
  }

  const handleQuizAnswer = (optionScores: Record<Dosha, number>) => {
    const next: Record<Dosha, number> = {
      Vata: scores.Vata + optionScores.Vata,
      Pitta: scores.Pitta + optionScores.Pitta,
      Kapha: scores.Kapha + optionScores.Kapha,
    }
    setScores(next)

    if (quizIndex < doshaQuestions.length - 1) {
      triggerFade(() => {
        setQuizIndex(quizIndex + 1)
        setSelectedOption(null)
      })
    } else {
      const doshaType = calculateDoshaType(next)
      setProfile(p => ({ ...p, doshaScores: next, doshaType }))
      triggerFade(() => setStep('result'))
    }
  }

  const finish = (professionId: string) => {
    const final: UserProfile = { ...profile, profession: professionId, completedOnboarding: true }
    saveUserProfile(final)
    saveSession({
      name: final.name || 'Friend',
      email: final.email || '',
      mode: 'account',
      signedInAt: new Date().toISOString(),
    })
    onComplete(final)
  }

  // ─── 1. WELCOME / DETAILS ─────────────────────────────────────────────
  if (step === 'welcome') {
    const canContinue = profile.name.trim().length > 1
    return (
      <div className={shell} style={bg}>
        <div className="mx-auto max-w-lg animate-in fade-in duration-500">
          <div className="mb-7 flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-emerald-100">Jaya</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-500/60">Ayurveda</p>
            </div>
          </div>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-emerald-50">
            Namaste. I am Jaya.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-emerald-300/70">
            I will stay with you from the moment you wake to the moment you sleep — meals, breath,
            movement and rest, shaped around your body and your working day.
          </p>

          <Card className="mt-6 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
              First, what shall I call you?
            </p>
            <div className="space-y-3">
              <Input
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="rounded-xl border-emerald-800/50 bg-emerald-950/60 py-5 text-emerald-100 placeholder:text-emerald-700"
              />
              <Input
                type="email"
                value={profile.email ?? ''}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                placeholder="Email (optional — only to name your profile)"
                className="rounded-xl border-emerald-800/50 bg-emerald-950/60 py-5 text-emerald-100 placeholder:text-emerald-700"
              />
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-emerald-600/60">
              No password, no verification email. Your details stay in this browser and are never uploaded.
            </p>
          </Card>

          <Button
            onClick={() => setStep('quiz')}
            disabled={!canContinue}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-6 text-base text-emerald-50 hover:bg-emerald-500 disabled:opacity-40"
          >
            Continue
          </Button>

          <button
            onClick={onDemo}
            className="mt-3 w-full rounded-xl border border-emerald-800/50 bg-emerald-950/30 py-3 text-xs text-emerald-300/80 transition hover:bg-emerald-900/40"
          >
            Or explore with a demo profile (Arjun, 28, engineer)
          </button>

          <div className="mt-7 space-y-2.5 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
              Why I ask
            </p>
            {[
              ['Your name', 'so every prompt speaks to you, not at you'],
              ['Body details', 'so I can calculate your WHO body-mass index and healthy weight band'],
              ['Your profession', 'so meals, breaks and sleep land at the right hours for your actual day'],
              ['Nine questions', 'so every suggestion is filtered through your constitution'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 text-[11px] leading-relaxed">
                <span className="text-emerald-400/70">·</span>
                <p className="text-emerald-300/60">
                  <span className="text-emerald-200/80">{k}</span> — {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── 2. DOSHA QUIZ ────────────────────────────────────────────────────
  if (step === 'quiz') {
    const q = doshaQuestions[quizIndex]
    return (
      <div className={shell} style={bg}>
        <div className="mx-auto max-w-lg">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
                {q.category}
              </span>
              <span className="text-[10px] text-emerald-500/60">
                {quizIndex + 1} / {doshaQuestions.length}
              </span>
            </div>
            <Progress value={quizProgress} className="h-1.5 bg-emerald-900/50" />
          </div>

          <div className={`transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="mb-6 text-xl font-medium leading-relaxed text-emerald-50">{q.question}</h2>
            <div className="space-y-2.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedOption(opt.value)
                    setTimeout(() => handleQuizAnswer(opt.scores), 180)
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedOption === opt.value
                      ? 'scale-[1.01] border-emerald-500 bg-emerald-800/70 text-emerald-50'
                      : 'border-emerald-900/60 bg-emerald-950/40 text-emerald-200/80 hover:border-emerald-700/60 hover:bg-emerald-900/40'
                  }`}
                >
                  <span className="text-sm leading-relaxed">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('welcome')}
            className="mt-6 text-[11px] text-emerald-600/60 transition hover:text-emerald-400"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // ─── 3. DOSHA RESULT ──────────────────────────────────────────────────
  if (step === 'result' && profile.doshaType) {
    const dosha = profile.doshaType
    const info = doshaProfiles[dosha]
    const total = scores.Vata + scores.Pitta + scores.Kapha || 1
    const rows = [
      { label: 'Vata', pct: Math.round((scores.Vata / total) * 100), color: '#7dd3fc' },
      { label: 'Pitta', pct: Math.round((scores.Pitta / total) * 100), color: '#fbbf24' },
      { label: 'Kapha', pct: Math.round((scores.Kapha / total) * 100), color: '#86efac' },
    ]

    return (
      <div className={shell} style={bg}>
        <div className={`mx-auto max-w-lg transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center">
            <div className="text-5xl">{dosha === 'Vata' ? '🌬️' : dosha === 'Pitta' ? '🔥' : '🌍'}</div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Your constitution</p>
            <h1
              className="mt-1 text-4xl font-semibold tracking-tight"
              style={{ color: dosha === 'Vata' ? '#7dd3fc' : dosha === 'Pitta' ? '#fbbf24' : '#86efac' }}
            >
              {dosha}
            </h1>
            <p className="mt-1 text-xs italic text-emerald-400/60">{info.element}</p>
          </div>

          <Card className="mt-6 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="text-xs leading-relaxed text-emerald-200/75">{info.description}</p>
          </Card>

          <Card className="mt-3 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
              Composition
            </p>
            <div className="space-y-3">
              {rows.map(r => (
                <div key={r.label}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-emerald-300">{r.label}</span>
                    <span className="text-emerald-500/60">{r.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-emerald-900/60">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-3 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
              Your natural strengths
            </p>
            <div className="flex flex-wrap gap-1.5">
              {info.strengths.map(s => (
                <span
                  key={s}
                  className="rounded-full border border-emerald-800/50 bg-emerald-900/40 px-2.5 py-1 text-[10px] text-emerald-200/80"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>

          <Button
            onClick={() => setStep('body')}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-6 text-base text-emerald-50 hover:bg-emerald-500"
          >
            Now, my body details →
          </Button>
        </div>
      </div>
    )
  }

  // ─── 4. BODY DETAILS + BMI ────────────────────────────────────────────
  if (step === 'body') {
    return (
      <div className={shell} style={bg}>
        <div className="mx-auto max-w-lg">
          <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Step 3 of 4</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-emerald-50">
            A little about your body
          </h1>
          <p className="mt-1.5 text-xs text-emerald-400/60">
            I use the WHO formula — weight in kilograms divided by height in metres squared.
          </p>

          <Card className="mt-5 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Labelled label="Age">
                <Input
                  type="number"
                  value={profile.age || ''}
                  onChange={e => setProfile(p => ({ ...p, age: parseInt(e.target.value) || 0 }))}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Labelled>
              <Labelled label="Gender">
                <select
                  value={profile.gender}
                  onChange={e => setProfile(p => ({ ...p, gender: e.target.value as UserProfile['gender'] }))}
                  className="w-full rounded-xl border border-emerald-800/50 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Labelled>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Labelled label="Weight (kg)">
                <Input
                  type="number"
                  step="0.5"
                  value={profile.weight || ''}
                  onChange={e => setProfile(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Labelled>
              <Labelled label="Height (cm)">
                <Input
                  type="number"
                  value={profile.height || ''}
                  onChange={e => setProfile(p => ({ ...p, height: parseFloat(e.target.value) || 0 }))}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Labelled>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Labelled label="Wake time">
                <Input
                  type="time"
                  value={profile.wakeTime}
                  onChange={e => setProfile(p => ({ ...p, wakeTime: e.target.value }))}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Labelled>
              <Labelled label="Sleep time">
                <Input
                  type="time"
                  value={profile.sleepTime}
                  onChange={e => setProfile(p => ({ ...p, sleepTime: e.target.value }))}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Labelled>
            </div>

            <div className="mt-3">
              <Labelled label="Region — for local, seasonal food">
                <select
                  value={profile.region ?? 'south'}
                  onChange={e => setProfile(p => ({ ...p, region: e.target.value as RegionId }))}
                  className="w-full rounded-xl border border-emerald-800/50 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-100"
                >
                  {regionFoods.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Labelled>
            </div>
          </Card>

          {/* Live BMI */}
          {bmi && (
            <Card className="mt-3 rounded-2xl border-emerald-800/50 bg-emerald-900/30 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/70">Your BMI</p>
                  <p className="mt-0.5 text-3xl font-semibold text-emerald-50">{bmi.bmi}</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                  style={{ backgroundColor: `${bmi.category.color}22`, color: bmi.category.color }}
                >
                  {bmi.category.label}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-emerald-200/70">{bmi.category.summary}</p>
              <p className="mt-1.5 text-[11px] text-emerald-400/70">
                Healthy weight for your height: <span className="text-emerald-200">{bmi.healthyMinKg}–{bmi.healthyMaxKg} kg</span>
              </p>
              {bmi.needsGoal && (
                <div className="mt-3 rounded-xl border border-amber-700/30 bg-amber-950/20 p-3">
                  <p className="text-[11px] font-medium text-amber-200/90">
                    I will set this as a goal: {bmi.deltaToHealthyKg > 0 ? 'lose' : 'gain'}{' '}
                    {Math.abs(bmi.deltaToHealthyKg)} kg to reach the healthy band.
                  </p>
                  <ul className="mt-2 space-y-1">
                    {getBmiGuidance(profile.doshaType ?? 'Vata', bmi).slice(0, 2).map(line => (
                      <li key={line} className="flex gap-1.5 text-[10px] leading-relaxed text-amber-100/70">
                        <span>·</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setStep('result')}
              variant="outline"
              className="rounded-xl border-emerald-800/50 bg-emerald-950/40 px-4 text-emerald-300"
            >
              ←
            </Button>
            <Button
              onClick={() => setStep('profession')}
              disabled={!bmi}
              className="flex-1 rounded-xl bg-emerald-600 py-6 text-base text-emerald-50 hover:bg-emerald-500 disabled:opacity-40"
            >
              Almost done →
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ─── 5. PROFESSION ────────────────────────────────────────────────────
  return (
    <div className={shell} style={bg}>
      <div className="mx-auto max-w-lg">
        <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Step 4 of 4</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-emerald-50">
          What does your day look like?
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed text-emerald-400/60">
          Your profession decides when you eat, when you break, and when you sleep. Pick the closest one —
          you can change it later.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {professions.map(p => (
            <button
              key={p.id}
              onClick={() => finish(p.id)}
              className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3 text-left transition hover:border-emerald-600/60 hover:bg-emerald-900/40"
            >
              <span className="text-lg">{p.icon}</span>
              <p className="mt-1 text-[11px] font-medium leading-tight text-emerald-100">{p.label}</p>
              <p className="mt-0.5 text-[9px] text-emerald-500/60">
                {p.wakeTime} – {p.sleepTime}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => finish(profile.profession ?? 'software_engineer')}
          className="mt-4 w-full rounded-xl border border-emerald-800/50 bg-emerald-950/30 py-3 text-xs text-emerald-300/80 transition hover:bg-emerald-900/40"
        >
          Skip — use a flexible day for now
        </button>
      </div>
    </div>
  )
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
        {label}
      </label>
      {children}
    </div>
  )
}
