import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  onStart: () => void
  onDemo: () => void
  onGuide: () => void
  onOpenGrantDeck?: () => void
  onOpenHealthIntake?: () => void
  onOpenChapters?: () => void
}

const features = [
  { icon: '🌅', title: 'Sunrise to sunset', text: 'A day shaped around your constitution, from Brahma Muhurta to deep sleep.' },
  { icon: '🧠', title: 'Constitution-aware', text: 'Every meal, pose and remedy is filtered through your Vata, Pitta or Kapha balance.' },
  { icon: '⏰', title: 'It comes to you', text: 'Proactive guidance at the right hour. You only tap to confirm — no dashboards to remember.' },
  { icon: '🍽️', title: 'Food that fits your day', text: 'Meals built around your profession, region and season, with the shopping list ready the night before.' },
  { icon: '🎯', title: 'Goals with reasons', text: 'Every goal explains why it works for your body, not just what to do.' },
  { icon: '📊', title: 'An honest progress card', text: 'At bedtime: what you achieved, what to improve, and what tomorrow holds.' },
]

const steps = [
  { n: '01', title: 'Tell me about you', text: 'Name, body details and your profession. Two minutes, one conversation.' },
  { n: '02', title: 'Discover your dosha', text: 'A short Ayurvedic assessment reveals your constitution and its tendencies.' },
  { n: '03', title: 'See your BMI honestly', text: 'The WHO calculation, your healthy weight band, and a gentle goal if you are outside it.' },
  { n: '04', title: 'Live the day', text: 'Jaya prompts you from waking to bedtime. You confirm, it adapts.' },
]

const testimonials = [
  { quote: 'I stopped guessing what to eat. It just tells me, at the right time, and I tap yes.', name: 'Priya R.', role: 'Vata · Teacher' },
  { quote: 'The evening card is the only health summary I have ever actually read.', name: 'Arjun M.', role: 'Pitta · Engineer' },
  { quote: 'It woke me up and would not let me sit back down until I walked. I needed that.', name: 'Meera S.', role: 'Kapha · Doctor' },
]

export default function LandingPage({ onStart, onDemo, onGuide, onOpenGrantDeck, onOpenHealthIntake, onOpenChapters }: Props) {
  return (
    <div className="min-h-screen bg-[#08140c] text-emerald-50">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-700/20 blur-3xl" />
      </div>

      <div className="relative">
        {/* NAV */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-tight">Jaya</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">Ayurveda</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 sm:gap-3">
            {onOpenChapters && (
              <button
                onClick={onOpenChapters}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 text-xs font-mono font-medium text-amber-200 hover:bg-amber-500/35 transition shadow-lg shadow-amber-500/20"
                title="Charaka Samhita 120 Chapters Explorer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-100 font-bold">📜 120 Chapters</span>
              </button>
            )}
            {onOpenHealthIntake && (
              <button
                onClick={onOpenHealthIntake}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-400 bg-emerald-500/25 text-xs font-mono font-medium text-emerald-100 hover:bg-emerald-500/40 transition shadow-lg shadow-emerald-500/30"
                title="Clinical Health Assessment & Vector Healing Plan"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-50 font-bold">🩺 Health Intake</span>
              </button>
            )}
            {onOpenGrantDeck && (
              <button
                onClick={onOpenGrantDeck}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-mono text-amber-300 hover:bg-amber-500/20 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>$100k Grant Deck</span>
              </button>
            )}
            <button onClick={onGuide} className="rounded-lg px-3 py-2 text-xs text-emerald-300/80 transition hover:text-emerald-100 sm:text-sm">
              Guide
            </button>
            <a href="#why" className="hidden rounded-lg px-3 py-2 text-sm text-emerald-300/80 transition hover:text-emerald-100 sm:block">
              Why Jaya
            </a>
            <Button
              onClick={onStart}
              size="sm"
              className="rounded-full bg-emerald-600 px-4 text-emerald-50 hover:bg-emerald-500"
            >
              Begin
            </Button>
          </nav>
        </header>

        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="rounded-full border border-emerald-700/40 bg-emerald-900/40 px-3 py-1 text-[11px] font-medium text-emerald-300">
                  A companion, not another tracker
                </Badge>
                <Badge className="rounded-full border border-amber-500/40 bg-amber-950/40 px-3 py-1 text-[11px] font-mono text-amber-300">
                  Garry Tan gstack & Charaka Samhita
                </Badge>
              </div>

              {/* Glowing Health Intake Callout Pill */}
              {onOpenHealthIntake && (
                <div
                  onClick={onOpenHealthIntake}
                  className="inline-flex cursor-pointer items-center gap-2 mb-2 px-4 py-2 rounded-2xl border border-emerald-500/60 bg-gradient-to-r from-emerald-950/90 via-[#0a2717] to-black/80 hover:border-emerald-400 text-xs text-emerald-100 transition shadow-xl group"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="font-medium text-emerald-200">
                    Have existing health conditions? <span className="text-amber-300 font-semibold">(Blood Sugar, BP, PCOD, Raktapradar...)</span>
                  </span>
                  <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">➔ Clinical Assessment</span>
                </div>
              )}

              {/* Charaka Samhita 120 Chapters Callout Pill */}
              {onOpenChapters && (
                <div
                  onClick={onOpenChapters}
                  className="inline-flex cursor-pointer items-center gap-2 mb-4 px-4 py-2 rounded-2xl border border-amber-500/60 bg-gradient-to-r from-amber-950/80 via-[#1e1909] to-black/80 hover:border-amber-400 text-xs text-amber-100 transition shadow-xl group"
                >
                  <span className="text-sm">📜</span>
                  <span className="font-medium text-amber-200">
                    Complete Charaka Samhita Explorer <span className="text-emerald-300 font-semibold">(120 Chapters across VIII Sthanas)</span>
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">➔ Explore 120 Adhyayas</span>
                </div>
              )}

              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Your whole day,
                <span className="block bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent">
                  guided the Ayurvedic way.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-emerald-200/70 sm:text-base">
                Jaya walks with you from the moment you wake to the moment you sleep — meals, breath,
                movement, work breaks and rest, all tuned to your constitution and your profession.
                You only confirm what you did.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={onStart}
                  className="h-12 rounded-2xl bg-emerald-600 px-7 text-base text-emerald-50 shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500"
                >
                  Begin your journey
                </Button>
                <Button
                  onClick={onDemo}
                  variant="outline"
                  className="h-12 rounded-2xl border-emerald-700/50 bg-emerald-950/40 px-6 text-base text-emerald-200 hover:bg-emerald-900/50 hover:text-emerald-100"
                >
                  Try demo profile
                </Button>
                {onOpenChapters && (
                  <Button
                    onClick={onOpenChapters}
                    variant="outline"
                    className="h-12 rounded-2xl border-amber-500/50 bg-amber-950/30 px-5 text-sm text-amber-200 hover:bg-amber-900/50 hover:text-amber-100 font-mono shadow-sm"
                  >
                    📜 120 Chapters
                  </Button>
                )}
                {onOpenGrantDeck && (
                  <Button
                    onClick={onOpenGrantDeck}
                    variant="outline"
                    className="h-12 rounded-2xl border-amber-500/50 bg-amber-950/20 px-5 text-sm text-amber-300 hover:bg-amber-900/40 hover:text-amber-100 font-mono shadow-sm"
                  >
                    🌱 Grant Pitch Deck
                  </Button>
                )}
              </div>
              <p className="mt-3 text-[11px] text-emerald-500/60">
                No card, no email verification. Everything stays on your device.
              </p>

              <div className="mt-9 grid grid-cols-3 gap-3 border-t border-emerald-900/40 pt-6">
                {[
                  { k: '3', v: 'Dosha profiles' },
                  { k: '15', v: 'Profession days' },
                  { k: '20+', v: 'Daily prompts' },
                ].map(s => (
                  <div key={s.v}>
                    <p className="text-xl font-semibold text-emerald-200">{s.k}</p>
                    <p className="text-[11px] text-emerald-400/50">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 -rotate-2 rounded-[2rem] bg-gradient-to-br from-emerald-700/30 to-amber-600/10 blur-xl" />
              <Card className="relative overflow-hidden rounded-[2rem] border-emerald-800/40 bg-emerald-950/60 p-6 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">Today</p>
                    <p className="text-lg font-medium text-emerald-100">Arjun · Pitta · Engineer</p>
                  </div>
                  <span className="text-2xl">🌤️</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { t: '06:30', icon: '🌅', label: 'Wake up', state: 'done' },
                    { t: '06:45', icon: '🧘', label: 'Pranayama · 10 min', state: 'done' },
                    { t: '08:00', icon: '🥣', label: 'Breakfast · cooling porridge', state: 'now' },
                    { t: '13:00', icon: '🍽️', label: 'Lunch · kitchari with coconut', state: 'next' },
                    { t: '22:30', icon: '😴', label: 'Close the day', state: 'next' },
                  ].map(row => (
                    <div
                      key={row.t}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                        row.state === 'now'
                          ? 'border-emerald-500/50 bg-emerald-800/40'
                          : 'border-emerald-900/50 bg-emerald-950/40'
                      }`}
                    >
                      <span className="text-base">{row.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-emerald-100/90">{row.label}</p>
                        <p className="text-[10px] text-emerald-500/60">{row.t}</p>
                      </div>
                      <span
                        className={`text-[10px] ${
                          row.state === 'done'
                            ? 'text-emerald-400'
                            : row.state === 'now'
                              ? 'text-amber-300'
                              : 'text-emerald-600/60'
                        }`}
                      >
                        {row.state === 'done' ? '✓' : row.state === 'now' ? 'now' : '·'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-emerald-700/30 bg-emerald-900/30 p-3">
                  <p className="text-[11px] leading-relaxed text-emerald-200/80">
                    <span className="font-medium text-emerald-100">Jaya:</span> Breakfast is ready to confirm.
                    Your Agni is gentle this morning — warm and moist, not cold.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* SHLOKA */}
        <section className="border-y border-emerald-900/40 bg-emerald-950/30 py-8">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-base leading-relaxed text-amber-200/90 sm:text-lg" lang="sa">
              स्वस्थस्य स्वास्थ्य रक्षणम् । आतुरस्य विकार प्रशमनम् ॥
            </p>
            <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-emerald-300/60 sm:text-sm">
              To preserve the health of the healthy, and to relieve the disorder of the unwell.
              The two promises Ayurveda has made for three thousand years — and the two Jaya is built on.
            </p>
            {onOpenChapters && (
              <div className="mt-4">
                <button
                  onClick={onOpenChapters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-mono text-amber-300 hover:bg-amber-500/25 transition shadow-md"
                >
                  <span>📜 Browse all 120 Chapters of Charaka Samhita (Sutra to Siddhi Sthana) ➔</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Why Jaya</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Wellness apps wait for you. Jaya does not.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-200/60">
              Tracking is a graveyard of good intentions. Jaya flips the model: it brings one calm,
              specific instruction at the right moment, asks a single question, and adapts.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <Card key={f.title} className="rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5 transition hover:border-emerald-700/60 hover:bg-emerald-900/30">
                <span className="text-xl">{f.icon}</span>
                <h3 className="mt-3 text-sm font-medium text-emerald-100">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-emerald-300/60">{f.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="rounded-3xl border border-emerald-900/50 bg-gradient-to-br from-emerald-950/70 to-emerald-900/20 p-6 sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Ninety seconds to begin</h2>
            <p className="mt-2 max-w-xl text-sm text-emerald-300/60">
              One conversation. No forms to fill twice, no verification email, no trial countdown.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(s => (
                <div key={s.n}>
                  <p className="text-[11px] font-medium text-amber-300/70">{s.n}</p>
                  <p className="mt-1 text-sm font-medium text-emerald-100">{s.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-300/60">{s.text}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={onStart}
              className="mt-8 h-11 rounded-xl bg-emerald-600 px-6 text-emerald-50 hover:bg-emerald-500"
            >
              Start now
            </Button>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map(t => (
              <Card key={t.name} className="rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
                <p className="text-sm leading-relaxed text-emerald-100/80">“{t.quote}”</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800/60 text-xs text-emerald-200">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-200">{t.name}</p>
                    <p className="text-[10px] text-emerald-500/60">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* SWASTHYA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-amber-700/20 bg-amber-950/10 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-600/30 bg-amber-900/20 text-2xl">
              🇮🇳
            </div>
            <div>
              <p className="text-sm font-medium text-amber-100/90">Aligned with Swasthya Bharat Abhiyan</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-200/50">
                Preventive, everyday, preventive-first healthcare — the same principle behind India's
                national wellness mission, brought into a personal daily practice.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-emerald-900/40 px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-emerald-500/50">© {new Date().getFullYear()} Jaya Ayurveda</p>
            <p className="max-w-lg text-[10px] leading-relaxed text-emerald-600/40">
              Jaya offers wellness guidance inspired by Ayurvedic tradition. It is not a medical device and
              does not replace advice from a qualified physician.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
