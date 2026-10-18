import { useState } from 'react'
import type { UserProfile } from '../lib/data'
import { Badge } from '@/components/ui/badge'

interface Props {
  currentProfile: UserProfile
  onSelectPersona: (profile: UserProfile) => void
  onNewAssessment: () => void
}

export const PRESET_PERSONAS: {
  id: string
  name: string
  label: string
  role: string
  dosha: 'Vata' | 'Pitta' | 'Kapha'
  profile: UserProfile
}[] = [
  {
    id: 'arjun',
    name: 'Arjun Mehta',
    label: 'Arjun · Pitta (Tech Engineer)',
    role: 'Software Engineer · Bengaluru',
    dosha: 'Pitta',
    profile: {
      name: 'Arjun',
      email: 'arjun@demo.jaya',
      age: 28,
      gender: 'male',
      weight: 74,
      height: 175,
      doshaType: 'Pitta',
      doshaScores: { Vata: 15, Pitta: 48, Kapha: 12 },
      wakeTime: '06:30',
      sleepTime: '22:30',
      location: 'Bengaluru, India',
      region: 'south',
      profession: 'software_engineer',
      healthGoals: ['Reduce Stress', 'Cooling Digestion', 'Better Sleep'],
      allergies: [],
      activityLevel: 'light',
      completedOnboarding: true,
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    label: 'Priya · Vata (Educator)',
    role: 'University Teacher · New Delhi',
    dosha: 'Vata',
    profile: {
      name: 'Priya',
      email: 'priya@demo.jaya',
      age: 25,
      gender: 'female',
      weight: 52,
      height: 162,
      doshaType: 'Vata',
      doshaScores: { Vata: 52, Pitta: 14, Kapha: 9 },
      wakeTime: '06:00',
      sleepTime: '21:45',
      location: 'New Delhi, India',
      region: 'north',
      profession: 'teacher',
      healthGoals: ['Grounding Energy', 'Calm Nervous System', 'Regular Digestion'],
      allergies: [],
      activityLevel: 'moderate',
      completedOnboarding: true,
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'rajesh',
    name: 'Rajesh Kumar',
    label: 'Rajesh · Kapha (Executive)',
    role: 'Managing Director · Mumbai',
    dosha: 'Kapha',
    profile: {
      name: 'Rajesh',
      email: 'rajesh@demo.jaya',
      age: 44,
      gender: 'male',
      weight: 88,
      height: 172,
      doshaType: 'Kapha',
      doshaScores: { Vata: 10, Pitta: 18, Kapha: 47 },
      wakeTime: '05:45',
      sleepTime: '22:00',
      location: 'Mumbai, India',
      region: 'west',
      profession: 'doctor',
      healthGoals: ['Metabolic Fire (Agni)', 'Weight Balance', 'Morning Vitality'],
      allergies: [],
      activityLevel: 'sedentary',
      completedOnboarding: true,
      createdAt: new Date().toISOString(),
    },
  },
]

export default function PersonaSwitcher({ currentProfile, onSelectPersona, onNewAssessment }: Props) {
  const [open, setOpen] = useState(false)

  const activePersona = PRESET_PERSONAS.find(p => p.name.toLowerCase() === currentProfile.name.toLowerCase())

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-700/50 bg-emerald-950/60 text-xs text-emerald-200 hover:bg-emerald-900/60 transition shadow-sm"
        title="Switch Demo Persona"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium truncate max-w-[110px] sm:max-w-none">
          {activePersona ? activePersona.name : currentProfile.name || 'Arjun'}
        </span>
        <Badge variant="outline" className="text-[9px] px-1 py-0 border-emerald-600/40 text-emerald-300 uppercase font-mono">
          {currentProfile.doshaType || 'Pitta'}
        </Badge>
        <span className="text-[10px] opacity-60">▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-emerald-700/50 bg-[#0a1a0d]/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1.5 border-b border-emerald-900/60 mb-1.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/70 font-semibold">
                Clinical Demo Personas
              </p>
              <p className="text-[11px] text-emerald-300/60">
                Switch profiles to test different Doshas, professions & Dinacharya routines.
              </p>
            </div>

            <div className="space-y-1">
              {PRESET_PERSONAS.map(p => {
                const isSelected = p.name.toLowerCase() === currentProfile.name.toLowerCase()
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPersona(p.profile)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-emerald-800/40 border border-emerald-600/40 text-white'
                        : 'hover:bg-emerald-900/30 text-emerald-200/80 hover:text-emerald-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{p.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                            p.dosha === 'Pitta'
                              ? 'bg-amber-500/20 text-amber-300'
                              : p.dosha === 'Vata'
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {p.dosha}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-400/60">{p.role}</p>
                    </div>
                    {isSelected && <span className="text-emerald-400 text-xs">✓</span>}
                  </button>
                )
              })}

              <div className="pt-1 mt-1 border-t border-emerald-900/60">
                <button
                  onClick={() => {
                    setOpen(false)
                    onNewAssessment()
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-amber-300/90 hover:bg-amber-950/40 hover:text-amber-200 transition"
                >
                  <span>✨</span>
                  <span>Take Full 15-Question Assessment</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
