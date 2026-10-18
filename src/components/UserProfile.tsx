import { useState } from 'react'
import type { RegionId, UserProfile } from '../lib/data'
import { doshaProfiles } from '../lib/data'
import { bmiPercent, getBmiGuidance, getBmiResult } from '../lib/bmi'
import { professions, regionFoods } from '../lib/professions'
import { doshaPercentages, type AuthSession } from '../lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Props {
  profile: UserProfile
  session: AuthSession | null
  onSave: (profile: UserProfile) => void
  onSignOut: () => void
  onOpenGuide: () => void
  onBack: () => void
}

export default function UserProfile({ profile, session, onSave, onSignOut, onOpenGuide, onBack }: Props) {
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [saved, setSaved] = useState(false)

  const dosha = draft.doshaType ?? 'Vata'
  const percentages = doshaPercentages(draft)
  const bmi = getBmiResult(draft.weight, draft.height)
  const profession = professions.find(p => p.id === draft.profession)

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setDraft(d => ({ ...d, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    onSave(draft)
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-[#08140c] pb-24 text-emerald-50">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Your account</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Profile</h1>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-xl border-emerald-800/50 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/40"
          >
            Back
          </Button>
        </div>

        {/* ACCOUNT */}
        <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800/50 text-lg text-emerald-100">
              {(profile.name || 'J').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium text-emerald-100">{profile.name || 'Unnamed'}</p>
              <p className="truncate text-xs text-emerald-400/60">{profile.email || session?.email || 'No email on file'}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-emerald-500/50">
                {session?.mode === 'demo' ? 'Demo profile' : session?.mode === 'guest' ? 'Guest session' : 'Signed in'} ·{' '}
                {session?.signedInAt ? new Date(session.signedInAt).toLocaleDateString() : 'this device'}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              onClick={onOpenGuide}
              variant="outline"
              className="rounded-xl border-emerald-800/50 bg-emerald-950/50 text-xs text-emerald-200 hover:bg-emerald-900/40"
            >
              Open user guide
            </Button>
            <Button
              onClick={onSignOut}
              variant="outline"
              className="rounded-xl border-rose-900/40 bg-rose-950/20 text-xs text-rose-200 hover:bg-rose-900/30"
            >
              Sign out
            </Button>
          </div>
        </Card>

        {/* BMI */}
        {bmi && (
          <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-emerald-100">Body mass index</h2>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ backgroundColor: `${bmi.category.color}22`, color: bmi.category.color }}
              >
                {bmi.category.label}
              </span>
            </div>

            <div className="mb-1 flex items-end gap-2">
              <p className="text-3xl font-semibold text-emerald-100">{bmi.bmi}</p>
              <p className="pb-1 text-xs text-emerald-400/60">kg/m² · WHO adult scale</p>
            </div>

            <div className="relative mt-5 h-2.5 rounded-full bg-emerald-900/60">
              <div
                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-rose-500 via-emerald-500 to-rose-500 opacity-60"
                style={{ left: 0, right: 0 }}
              />
              <div
                className="absolute -top-1 h-4.5 w-1 rounded-full bg-emerald-50 shadow"
                style={{ left: `${bmiPercent(bmi.bmi)}%`, height: '18px', transform: 'translateY(-4px)' }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-emerald-500/60">
              <span>14</span>
              <span>18.5</span>
              <span>24.9</span>
              <span>30</span>
              <span>42</span>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-800/40 bg-emerald-900/20 p-3">
              <p className="text-xs leading-relaxed text-emerald-200/80">{bmi.category.summary}</p>
              <p className="mt-2 text-[11px] text-emerald-400/70">
                Healthy weight for your height: <span className="text-emerald-200">{bmi.healthyMinKg}–{bmi.healthyMaxKg} kg</span>
              </p>
              {bmi.needsGoal && (
                <p className="mt-1 text-[11px] text-amber-200/80">
                  Goal set automatically: {bmi.deltaToHealthyKg > 0 ? 'lose' : 'gain'}{' '}
                  {Math.abs(bmi.deltaToHealthyKg)} kg to reach the healthy band.
                </p>
              )}
            </div>

            {bmi.needsGoal && (
              <ul className="mt-3 space-y-2">
                {getBmiGuidance(dosha, bmi).map(line => (
                  <li key={line} className="flex gap-2 text-[11px] leading-relaxed text-emerald-300/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/70" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {/* DETAILS */}
        <Card className="mb-4 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
          <h2 className="mb-4 text-sm font-medium text-emerald-100">Personal details</h2>

          <div className="space-y-4">
            <Field label="Name">
              <Input
                value={draft.name}
                onChange={e => update('name', e.target.value)}
                className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={draft.email ?? ''}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100 placeholder:text-emerald-700"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Age">
                <Input
                  type="number"
                  value={draft.age}
                  onChange={e => update('age', parseInt(e.target.value) || 0)}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Field>
              <Field label="Gender">
                <select
                  value={draft.gender}
                  onChange={e => update('gender', e.target.value as UserProfile['gender'])}
                  className="w-full rounded-xl border border-emerald-800/50 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Weight (kg)">
                <Input
                  type="number"
                  step="0.5"
                  value={draft.weight}
                  onChange={e => update('weight', parseFloat(e.target.value) || 0)}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Field>
              <Field label="Height (cm)">
                <Input
                  type="number"
                  value={draft.height}
                  onChange={e => update('height', parseFloat(e.target.value) || 0)}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Wake time">
                <Input
                  type="time"
                  value={draft.wakeTime}
                  onChange={e => update('wakeTime', e.target.value)}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Field>
              <Field label="Sleep time">
                <Input
                  type="time"
                  value={draft.sleepTime}
                  onChange={e => update('sleepTime', e.target.value)}
                  className="rounded-xl border-emerald-800/50 bg-emerald-950/60 text-emerald-100"
                />
              </Field>
            </div>

            <Field label="Profession">
              <select
                value={draft.profession ?? ''}
                onChange={e => update('profession', e.target.value)}
                className="w-full rounded-xl border border-emerald-800/50 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-100"
              >
                <option value="">Not set</option>
                {professions.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
              {profession && (
                <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-500/60">{profession.workNote}</p>
              )}
            </Field>

            <Field label="Region (for local, seasonal food)">
              <select
                value={draft.region ?? 'south'}
                onChange={e => update('region', e.target.value as RegionId)}
                className="w-full rounded-xl border border-emerald-800/50 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-100"
              >
                {regionFoods.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Button
            onClick={handleSave}
            className="mt-5 w-full rounded-xl bg-emerald-600 py-5 text-emerald-50 hover:bg-emerald-500"
          >
            {saved ? 'Saved ✓' : 'Save changes'}
          </Button>
        </Card>

        {/* DOSHA */}
        <Card className="rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
          <h2 className="mb-1 text-sm font-medium text-emerald-100">Your constitution</h2>
          <p className="mb-4 text-[11px] text-emerald-500/60">{doshaProfiles[dosha].element}</p>
          <div className="space-y-3">
            {(['Vata', 'Pitta', 'Kapha'] as const).map(d => (
              <div key={d}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className={d === dosha ? 'text-emerald-100' : 'text-emerald-400/60'}>{d}</span>
                  <span className="text-emerald-500/60">{percentages[d]}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-emerald-900/60">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentages[d]}%`,
                      backgroundColor: d === 'Vata' ? '#7dd3fc' : d === 'Pitta' ? '#fbbf24' : '#86efac',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-emerald-300/60">
            {doshaProfiles[dosha].description}
          </p>
        </Card>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-emerald-600/50">
          Your data is stored in this browser only. Signing out clears the session; clearing site data
          removes your profile permanently.
        </p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">
        {label}
      </label>
      {children}
    </div>
  )
}
