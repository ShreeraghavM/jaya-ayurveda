import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Props {
  onBack: () => void
}

const sections: { id: string; icon: string; title: string; body: string[] }[] = [
  {
    id: 'start',
    icon: '🌱',
    title: 'Getting started',
    body: [
      'Tap "Begin your journey" and answer one short conversation: your name, body details, profession and nine Ayurvedic questions.',
      'Nothing is sent anywhere. Your profile, logs and goals are stored in this browser only.',
      'There is no password to remember and no verification email. Signing out from the profile screen clears the session on this device.',
    ],
  },
  {
    id: 'dosha',
    icon: '🔥',
    title: 'Your dosha and what it means',
    body: [
      'Vata (air and space) — creative and quick, but prone to anxiety, dryness and irregular digestion.',
      'Pitta (fire and water) — sharp and driven, but prone to heat, irritability and burnout.',
      'Kapha (earth and water) — steady and loyal, but prone to heaviness, congestion and inertia.',
      'Your result is a starting point, not a label. Every recommendation in the app is filtered through it, and you can retake the quiz any time by clearing your profile.',
    ],
  },
  {
    id: 'home',
    icon: '🏠',
    title: 'The home screen',
    body: [
      'The top card shows the guidance for this exact hour, based on your dosha and the Ayurvedic clock.',
      'The water counter logs glasses with a tap. The mood row records how the day actually feels.',
      'The sun arc shows where you are between sunrise and sunset, so you can see how much day remains.',
    ],
  },
  {
    id: 'popups',
    icon: '🔔',
    title: 'Proactive prompts (the heart of Jaya)',
    body: [
      'Roughly twenty prompts are scheduled across your day — waking, breath, meals, water, movement, family time, planning and sleep.',
      'Each one asks a single question and offers two or three taps: confirm, tell me what actually happened, or skip.',
      'If you skip, nothing is judged. Jaya adapts tomorrow\'s plan around what you tell it.',
      'Prompts only appear within a window after their time, so opening the app at noon will not replay your morning.',
    ],
  },
  {
    id: 'routine',
    icon: '🕐',
    title: 'Dinacharya — the daily routine',
    body: [
      'A full Ayurvedic day from Brahma Muhurta to sleep, with the reason behind each step.',
      'Work through it one step at a time. Each step asks whether you followed it, and lets you record what you did instead.',
      'Your progress is saved per day, so tomorrow starts clean.',
    ],
  },
  {
    id: 'diet',
    icon: '🍽️',
    title: 'Food, recipes and check-ins',
    body: [
      'Meals are chosen for your dosha, the season and your region.',
      'Each meal can be confirmed as eaten, replaced with what you actually ate, or skipped.',
      'What you tell Jaya feeds directly into tomorrow\'s plan and the shopping list.',
    ],
  },
  {
    id: 'bmi',
    icon: '⚖️',
    title: 'BMI and your healthy band',
    body: [
      'Jaya uses the WHO adult formula: weight in kilograms divided by height in metres squared.',
      'Healthy range is 18.5 to 24.9. Below or above it, Jaya sets a goal automatically and shows your healthy weight band.',
      'The guidance is Ayurvedic and behavioural — food, movement, sleep — never medication. For clinical concerns, speak to a doctor.',
    ],
  },
  {
    id: 'goals',
    icon: '🎯',
    title: 'Goals and why they work',
    body: [
      'Choose from goals suited to your dosha: walking, breath, sleep timing, water, home cooking and more.',
      'Each goal states the benefit and the mechanism — why it works for a body like yours.',
      'Mark a goal complete each day to build a streak. Streaks are the only scoreboard Jaya cares about.',
    ],
  },
  {
    id: 'progress',
    icon: '📊',
    title: 'The progress card',
    body: [
      'At the end of the day, tap the moon icon (or accept the bedtime prompt) to close the day.',
      'You get a score, your achievements, the areas worth improving, and a preview of tomorrow.',
      'The weekly view shows energy, mood, hydration and practice minutes together, so patterns become visible.',
    ],
  },
  {
    id: 'plan',
    icon: '🗒️',
    title: 'Planning tomorrow',
    body: [
      'Every evening around eight, Jaya asks to plan tomorrow. It proposes meals, a focus and a shopping list.',
      'Confirm it, and the list is waiting for you before the shops close.',
      'If you ate something different today, tomorrow\'s plan adjusts automatically.',
    ],
  },
  {
    id: 'yoga',
    icon: '🧘',
    title: 'Yoga and pranayama',
    body: [
      'Poses and breathing techniques are filtered by dosha and by experience level.',
      'Each entry explains the benefit, the duration and any contraindication.',
      'Ten honest minutes beats an hour you never start.',
    ],
  },
  {
    id: 'remedies',
    icon: '🌿',
    title: 'Remedies',
    body: [
      'Home remedies for common, mild complaints — headache, cold, indigestion, insomnia and similar.',
      'Each includes preparation, dosage and precautions.',
      'Anything persistent, severe or worsening belongs with a doctor, not an app.',
    ],
  },
  {
    id: 'profile',
    icon: '👤',
    title: 'Your profile',
    body: [
      'Open the profile from the top-right avatar on the home screen.',
      'Edit your body details, profession, region and goals at any time. BMI recalculates instantly.',
      'Sign out from the same screen. Your data remains on this device until you clear it.',
    ],
  },
  {
    id: 'tips',
    icon: '💡',
    title: 'Getting the most out of Jaya',
    body: [
      'Answer prompts honestly, including the misses. The plan is only as good as the signal.',
      'Keep your profession current — meal and break times are built from it.',
      'Log water as you drink it rather than at night; the afternoon prompt depends on it.',
      'Plan tomorrow before 8pm. It is the single highest-leverage habit in the app.',
      'Use the demo profile to explore every screen before committing your own data.',
    ],
  },
]

export default function UserGuide({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-[#08140c] text-emerald-50">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/70">Jaya Ayurveda</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">User guide</h1>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-xl border-emerald-800/50 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/40"
          >
            Back
          </Button>
        </div>

        <Card className="mb-6 rounded-2xl border-emerald-900/50 bg-emerald-950/40 p-5">
          <p className="text-sm leading-relaxed text-emerald-200/70">
            Jaya is a daily Ayurvedic companion. It brings you one calm instruction at the right moment,
            asks a single question, and adapts the next day around your answer. Everything below can be
            reached from the bottom navigation or the top-right profile avatar.
          </p>
        </Card>

        <Card className="rounded-2xl border-emerald-900/50 bg-emerald-950/40 px-4 py-1">
          <Accordion className="w-full">
            {sections.map(s => (
              <AccordionItem key={s.id} value={s.id} className="border-emerald-900/40">
                <AccordionTrigger className="py-4 text-left text-sm text-emerald-100 hover:no-underline">
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{s.icon}</span>
                    <span>{s.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2.5 pl-1">
                    {s.body.map((line, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-emerald-300/70">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-emerald-600/50">
          Jaya is a wellness companion, not a medical device. It does not diagnose, treat or replace a
          qualified physician. If a symptom is severe, sudden or worsening, seek medical care.
        </p>
      </div>
    </div>
  )
}
