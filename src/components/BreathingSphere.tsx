import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Technique {
  id: string
  name: string
  sanskrit: string
  benefit: string
  dosha: 'Vata' | 'Pitta' | 'Kapha' | 'All'
  inhale: number
  hold: number
  exhale: number
  pause: number
}

const TECHNIQUES: Technique[] = [
  {
    id: 'sheetali',
    name: 'Sheetali (Cooling Breath)',
    sanskrit: 'शीतली प्राणायाम',
    benefit: 'Pacifies Pitta heat, lowers body temperature, reduces anger & heartburn',
    dosha: 'Pitta',
    inhale: 4,
    hold: 4,
    exhale: 6,
    pause: 2,
  },
  {
    id: 'nadi_shodhana',
    name: 'Nadi Shodhana (Alternate Nostril)',
    sanskrit: 'नाडी शोधन',
    benefit: 'Calms Vata anxiety, balances Ida & Pingala subtle energetic channels',
    dosha: 'Vata',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 2,
  },
  {
    id: 'kapalabhati',
    name: 'Kapalabhati (Frontal Brain Cleansing)',
    sanskrit: 'कपालभाति',
    benefit: 'Stimulates sluggish Kapha, ignites Agni, clears sinuses and mucus',
    dosha: 'Kapha',
    inhale: 2,
    hold: 1,
    exhale: 3,
    pause: 1,
  },
  {
    id: 'bhramari',
    name: 'Bhramari (Humming Bee Breath)',
    sanskrit: 'भ्रामरी प्राणायाम',
    benefit: 'Stimulates nitric oxide, soothes pineal gland, induces deep calm for sleep',
    dosha: 'All',
    inhale: 4,
    hold: 2,
    exhale: 8,
    pause: 2,
  },
]

export default function BreathingSphere({ userDosha = 'Pitta' }: { userDosha?: string }) {
  const defaultTech = TECHNIQUES.find(t => t.dosha === userDosha) || TECHNIQUES[0]
  const [technique, setTechnique] = useState<Technique>(defaultTech)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [secondsLeft, setSecondsLeft] = useState(technique.inhale)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    setSecondsLeft(technique.inhale)
    setPhase('inhale')
    setCycles(0)
    setIsRunning(false)
  }, [technique])

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) return prev - 1

        // Switch to next phase
        if (phase === 'inhale') {
          if (technique.hold > 0) {
            setPhase('hold')
            return technique.hold
          } else {
            setPhase('exhale')
            return technique.exhale
          }
        } else if (phase === 'hold') {
          setPhase('exhale')
          return technique.exhale
        } else if (phase === 'exhale') {
          if (technique.pause > 0) {
            setPhase('pause')
            return technique.pause
          } else {
            setCycles(c => c + 1)
            setPhase('inhale')
            return technique.inhale
          }
        } else {
          setCycles(c => c + 1)
          setPhase('inhale')
          return technique.inhale
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, phase, technique])

  const phaseInstruction = {
    inhale: 'Breathe In Deeply...',
    hold: 'Hold & Center (Kumbhaka)',
    exhale: 'Slow Gentle Exhale...',
    pause: 'Relax & Stillness',
  }[phase]

  const sphereScale = {
    inhale: 'scale-125 transition-transform duration-1000 ease-out',
    hold: 'scale-125 transition-transform duration-500 ease-in-out',
    exhale: 'scale-90 transition-transform duration-1000 ease-in',
    pause: 'scale-90 transition-transform duration-500',
  }[phase]

  return (
    <Card className="p-5 bg-gradient-to-br from-emerald-950/40 to-[#0a1a0d] border border-emerald-800/40 rounded-3xl overflow-hidden relative shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-mono">
            Guided Pranayama Studio
          </Badge>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <span>🧘</span> {technique.name}
          </h3>
          <p className="text-[11px] text-emerald-400/70 font-serif italic">{technique.sanskrit}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-emerald-400 font-semibold">{cycles}</span>
          <span className="text-[10px] text-emerald-300/60 block uppercase">Completed</span>
        </div>
      </div>

      {/* Technique Selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 [scrollbar-width:none]">
        {TECHNIQUES.map(t => (
          <button
            key={t.id}
            onClick={() => setTechnique(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
              technique.id === t.id
                ? 'bg-emerald-700/60 text-white border-emerald-500/60 shadow-sm'
                : 'bg-black/30 text-emerald-300/70 border-emerald-900/40 hover:text-white'
            }`}
          >
            {t.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Animated Breathing Sphere */}
      <div className="py-8 flex flex-col items-center justify-center relative">
        <div
          className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl relative select-none ${sphereScale} ${
            phase === 'inhale'
              ? 'bg-gradient-to-br from-emerald-500/30 to-teal-600/40 border-emerald-400 shadow-emerald-500/30'
              : phase === 'hold'
              ? 'bg-gradient-to-br from-amber-500/30 to-emerald-600/40 border-amber-400 shadow-amber-500/30'
              : phase === 'exhale'
              ? 'bg-gradient-to-br from-sky-500/20 to-emerald-800/30 border-teal-500 shadow-teal-500/20'
              : 'bg-emerald-950/40 border-emerald-700/40 shadow-none'
          }`}
        >
          <span className="text-4xl font-light font-mono text-white tabular-nums">
            {isRunning ? secondsLeft : technique.inhale}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-200/80 mt-1">
            {isRunning ? phase : 'Ready'}
          </span>
        </div>

        <p className="text-sm font-medium text-emerald-200 mt-5 h-5 transition-all text-center">
          {isRunning ? phaseInstruction : 'Press Start to begin guided rhythm'}
        </p>
        <p className="text-[11px] text-emerald-400/60 mt-1 max-w-xs text-center">
          {technique.benefit}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`rounded-2xl px-8 text-xs font-semibold shadow-lg transition ${
            isRunning
              ? 'bg-amber-600/80 hover:bg-amber-500 text-white border border-amber-400/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
          }`}
        >
          {isRunning ? 'Pause Breath' : 'Start Session'}
        </Button>
        {cycles > 0 && (
          <Button
            onClick={() => {
              setIsRunning(false)
              setCycles(0)
              setSecondsLeft(technique.inhale)
              setPhase('inhale')
            }}
            variant="outline"
            className="rounded-2xl border-emerald-700/40 text-emerald-300 text-xs hover:bg-emerald-900/40"
          >
            Reset
          </Button>
        )}
      </div>
    </Card>
  )
}
