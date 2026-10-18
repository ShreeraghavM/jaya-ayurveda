import type { DailyLog, Dosha, UserProfile } from './data'
import { doshaProfiles, mealPlans } from './data'
import {
  getDailyJoke,
  getProfession,
  getRegionFoods,
  getSeasonalProduce,
  getTodayHoliday,
  isWeekend,
  toMinutes,
} from './professions'
import { getBmiResult } from './bmi'

export type PopupKind =
  | 'wake'
  | 'ritual'
  | 'meal'
  | 'water'
  | 'break'
  | 'exercise'
  | 'family'
  | 'plan'
  | 'winddown'
  | 'sleep'
  | 'humour'
  | 'bmi'

export interface PopupAction {
  id: string
  label: string
  style: 'primary' | 'secondary'
}

export interface Popup {
  id: string
  time: string
  kind: PopupKind
  icon: string
  title: string
  body: string
  actions: PopupAction[]
  tab?: string
}

/** Days-since-epoch — used to rotate content deterministically, once per day. */
export function dayIndex(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 86_400_000)
}

function pick<T>(list: T[], date: Date, salt = 0): T {
  return list[(dayIndex(date) + salt) % list.length]
}

// ─── ROTATING CONTENT ────────────────────────────────────────────────────

const tips: Record<Dosha, string[]> = {
  Vata: [
    'Warm water first, before anything else. It settles the nervous system.',
    'Keep your meal times fixed today — routine is your medicine.',
    'A few drops of sesame oil in each nostril before you start work.',
    'Eat seated, slowly, and without a screen. Digestion begins with attention.',
    'Ten minutes of slow walking grounds scattered energy better than coffee.',
    'Warm, moist, oily food today. Skip the cold salad.',
    'Oil your feet before bed — it pulls the mind down out of the head.',
    'One thing at a time today. Multitasking is Vata\'s trap.',
  ],
  Pitta: [
    'Cool water, not cold. And not with meals.',
    'Step outside the heat before you answer the email that annoyed you.',
    'Fennel or coriander tea this afternoon instead of a third coffee.',
    'Eat lunch as your biggest meal, calmly, away from your desk.',
    'Ten slow breaths before your next meeting changes how you listen.',
    'Something sweet and cooling today: melon, coconut, grapes.',
    'Your intensity is a gift — aim it at one thing, not five.',
    'Finish work at a fixed hour. The work will still be there.',
  ],
  Kapha: [
    'Warm water with lemon and ginger before food. Cut the heaviness.',
    'Move before you eat breakfast — that is the whole difference.',
    'Stand up every 45 minutes. Stillness compounds for you.',
    'Light, warm, spicy food today. Skip the dairy and the sweets.',
    'Take the stairs deliberately. Your metabolism rewards the effort.',
    'Sunlight on your face for ten minutes this morning.',
    'One new thing today — novelty is Kapha\'s antidote.',
    'Dinner light and early. You will wake up lighter.',
  ],
}

const quotes: string[] = [
  'Health is not a destination — it is the way you spend an ordinary Tuesday.',
  'The body keeps an honest ledger. Small deposits count.',
  'You do not need more discipline. You need a smaller first step.',
  'Rest is not a reward for finishing. It is part of the work.',
  'The best time to begin was sunrise. The second best is now.',
  'A calm mind digests life better than a busy one.',
  'You are allowed to move slowly and still be moving.',
  'What you repeat in the morning, you become by evening.',
]

const encouragements: string[] = [
  'You showed up today. That is the whole game.',
  'Consistency is quiet. So is progress.',
  'Your body noticed. Even the parts you cannot feel yet.',
  'One good day is data. Two is a trend. Keep going.',
  'You are building a life you do not need a holiday from.',
]

export function getDailyTip(dosha: Dosha, date: Date = new Date()): string {
  return pick(tips[dosha], date)
}

export function getDailyQuote(date: Date = new Date()): string {
  return pick(quotes, date, 3)
}

export function getEncouragement(date: Date = new Date()): string {
  return pick(encouragements, date, 7)
}

// ─── DAY PLAN ────────────────────────────────────────────────────────────

function mealName(dosha: Dosha, slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks', date: Date): string {
  const list = mealPlans[dosha][slot]
  if (!list || list.length === 0) return 'a warm, simple meal'
  return pick(list, date, slot.length).name
}

export function buildDayPopups(profile: UserProfile, date: Date = new Date()): Popup[] {
  const dosha = profile.doshaType ?? 'Vata'
  const profession = getProfession(profile.profession)
  const wake = profession?.wakeTime ?? profile.wakeTime ?? '06:00'
  const sleep = profession?.sleepTime ?? profile.sleepTime ?? '22:00'
  const meals = profession?.meals ?? { breakfast: '08:00', lunch: '13:00', snack: '16:30', dinner: '19:30' }
  const name = profile.name || 'friend'
  const region = getRegionFoods(profile.region)
  const produce = getSeasonalProduce(date.getMonth())
  const holiday = getTodayHoliday(date)
  const joke = getDailyJoke(profession?.humorStyle ?? 'wholesome', date)

  const popups: Popup[] = []
  const add = (p: Omit<Popup, 'id'>) => popups.push({ ...p, id: `${p.time}-${p.kind}` })

  add({
    time: wake,
    kind: 'wake',
    icon: '🌅',
    title: `Good morning, ${name}`,
    body: `It is ${wake}. Brahma Muhurta is the clearest window of the day. Drink warm water and sit up slowly.`,
    actions: [
      { id: 'awake', label: 'I am awake', style: 'primary' },
      { id: 'snooze', label: 'Snooze 10 min', style: 'secondary' },
    ],
  })

  add({
    time: wake,
    kind: 'ritual',
    icon: '🧘',
    title: 'Pranayama and meditation',
    body: `${getDailyTip(dosha, date)} Ten minutes now sets the tone for everything after.`,
    actions: [
      { id: 'done', label: 'Completed', style: 'primary' },
      { id: 'skip', label: 'Skipped', style: 'secondary' },
    ],
    tab: 'yoga',
  })

  add({
    time: meals.breakfast,
    kind: 'meal',
    icon: '🥣',
    title: `Breakfast: ${mealName(dosha, 'breakfast', date)}`,
    body: `Seasonal in ${region.label} right now: ${produce.slice(0, 3).join(', ')}. Eat seated, warm, unhurried.`,
    actions: [
      { id: 'ate', label: 'I ate this', style: 'primary' },
      { id: 'different', label: 'I ate something else', style: 'secondary' },
      { id: 'skip', label: 'Skipped', style: 'secondary' },
    ],
    tab: 'diet',
  })

  add({
    time: addMinutesTo(meals.breakfast, 120),
    kind: 'water',
    icon: '💧',
    title: 'Water check',
    body: 'Two glasses since waking? Water before hunger, always.',
    actions: [
      { id: 'done', label: 'Yes, done', style: 'primary' },
      { id: 'later', label: 'Remind me later', style: 'secondary' },
    ],
  })

  add({
    time: meals.lunch,
    kind: 'meal',
    icon: '🍽️',
    title: `Lunch: ${mealName(dosha, 'lunch', date)}`,
    body: 'Your Agni peaks now. This should be your largest meal — away from your desk if you can.',
    actions: [
      { id: 'ate', label: 'I ate this', style: 'primary' },
      { id: 'different', label: 'I ate something else', style: 'secondary' },
      { id: 'skip', label: 'Skipped', style: 'secondary' },
    ],
    tab: 'diet',
  })

  add({
    time: addMinutesTo(meals.lunch, 30),
    kind: 'break',
    icon: '🚶',
    title: 'Ten-minute walk',
    body: 'A short walk after lunch flattens the afternoon crash. No phone needed.',
    actions: [
      { id: 'done', label: 'Walked', style: 'primary' },
      { id: 'skip', label: 'Not today', style: 'secondary' },
    ],
  })

  add({
    time: meals.snack,
    kind: 'meal',
    icon: '🍎',
    title: 'Afternoon snack',
    body: `Only if genuinely hungry. ${dosha === 'Kapha' ? 'Kapha does well to skip this one.' : 'Something warm and small beats biscuits.'}`,
    actions: [
      { id: 'ate', label: 'Had a snack', style: 'primary' },
      { id: 'skip', label: 'Not hungry', style: 'secondary' },
    ],
    tab: 'diet',
  })

  add({
    time: '15:00',
    kind: 'humour',
    icon: '😄',
    title: 'A small pause, on purpose',
    body: `${joke.setup} ${joke.punchline}`,
    actions: [
      { id: 'done', label: 'That helped', style: 'primary' },
      { id: 'skip', label: 'Dismiss', style: 'secondary' },
    ],
  })

  add({
    time: meals.dinner,
    kind: 'meal',
    icon: '🍲',
    title: `Dinner: ${mealName(dosha, 'dinner', date)}`,
    body: 'Lighter than lunch, and finished three hours before sleep.',
    actions: [
      { id: 'ate', label: 'I ate this', style: 'primary' },
      { id: 'different', label: 'I ate something else', style: 'secondary' },
      { id: 'skip', label: 'Skipped', style: 'secondary' },
    ],
    tab: 'diet',
  })

  add({
    time: addMinutesTo(meals.dinner, 30),
    kind: 'family',
    icon: '👨‍👩‍👧',
    title: 'Family time, phones away',
    body: `${profession?.familyWindow ?? 'Tonight'} is yours. Put the phone in another room for thirty minutes.`,
    actions: [
      { id: 'done', label: 'We did', style: 'primary' },
      { id: 'skip', label: 'Not tonight', style: 'secondary' },
    ],
  })

  add({
    time: '20:00',
    kind: 'plan',
    icon: '🗒️',
    title: 'Shall we plan tomorrow?',
    body: `Tell me what tomorrow looks like and I will plan meals and shopping tonight, so nothing is a scramble in the morning.${holiday ? ` Tomorrow is ${holiday.name} — ${holiday.tip}` : isWeekend(date) ? ' It is the weekend — we can be a little more relaxed.' : ''}`,
    actions: [
      { id: 'plan', label: 'Let us plan', style: 'primary' },
      { id: 'later', label: 'Later tonight', style: 'secondary' },
    ],
    tab: 'plan',
  })

  add({
    time: addMinutesTo(sleep, -60),
    kind: 'winddown',
    icon: '🌙',
    title: 'Wind down',
    body: 'Screens off. Oil the soles of your feet. Dim the lights. Let the day finish.',
    actions: [
      { id: 'done', label: 'Doing it', style: 'primary' },
      { id: 'skip', label: 'Not yet', style: 'secondary' },
    ],
    tab: 'routine',
  })

  add({
    time: sleep,
    kind: 'sleep',
    icon: '😴',
    title: 'Shall I close the day?',
    body: 'I will write your progress card: what you achieved, what to improve, and what tomorrow holds.',
    actions: [
      { id: 'close', label: 'Close my day', style: 'primary' },
      { id: 'later', label: 'In a little while', style: 'secondary' },
    ],
    tab: 'progress',
  })

  if (profile.weight && profile.height) {
    const bmi = getBmiResult(profile.weight, profile.height)
    if (bmi?.needsGoal) {
      add({
        time: '11:00',
        kind: 'bmi',
        icon: '⚖️',
        title: 'Your BMI goal',
        body: `${profile.name}, your BMI is ${bmi.bmi} (${bmi.category.label}). ${bmi.deltaToHealthyKg > 0 ? `About ${bmi.deltaToHealthyKg} kg towards the healthy band.` : `About ${Math.abs(bmi.deltaToHealthyKg)} kg to gain.`} Small daily steps work.`,
        actions: [
          { id: 'open', label: 'Show me how', style: 'primary' },
          { id: 'skip', label: 'Not now', style: 'secondary' },
        ],
        tab: 'goals',
      })
    }
  }

  return popups.sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
}

function addMinutesTo(time: string, delta: number): string {
  const total = (toMinutes(time) + delta + 1440) % 1440
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
}

/** The single popup that deserves attention right now, if any. */
export function getActivePopup(
  profile: UserProfile,
  handled: Record<string, 'done' | 'skipped' | 'snoozed'>,
  now: Date = new Date(),
): Popup | null {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const popups = buildDayPopups(profile, now)
  const due = popups
    .filter(p => toMinutes(p.time) <= nowMin && nowMin - toMinutes(p.time) <= 150)
    .filter(p => !handled[p.id])
  return due.length ? due[due.length - 1] : null
}

// ─── TOMORROW ────────────────────────────────────────────────────────────

export interface TomorrowPlan {
  date: string
  meals: { slot: string; time: string; name: string; ingredients: string[] }[]
  groceries: string[]
  focus: string
  note: string
  holiday: string | null
}

export function buildTomorrowPlan(profile: UserProfile, log: DailyLog | null, date: Date = new Date()): TomorrowPlan {
  const dosha = profile.doshaType ?? 'Vata'
  const tomorrow = new Date(date.getTime() + 86_400_000)
  const profession = getProfession(profile.profession)
  const meals = profession?.meals ?? { breakfast: '08:00', lunch: '13:00', snack: '16:30', dinner: '19:30' }
  const region = getRegionFoods(profile.region)

  const slots: { slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks'; label: string; time: string }[] = [
    { slot: 'breakfast', label: 'Breakfast', time: meals.breakfast },
    { slot: 'lunch', label: 'Lunch', time: meals.lunch },
    { slot: 'dinner', label: 'Dinner', time: meals.dinner },
  ]

  const mealsOut = slots.map(s => {
    const options = mealPlans[dosha][s.slot]
    const chosen = pick(options, tomorrow, s.label.length)
    return { slot: s.label, time: s.time, name: chosen.name, ingredients: chosen.ingredients }
  })

  const groceries = Array.from(
    new Set([
      ...mealsOut.flatMap(m => m.ingredients.slice(0, 5)),
      ...getSeasonalProduce(tomorrow.getMonth()).slice(0, 3),
      ...region.specials.slice(0, 2),
    ]),
  )

  const skippedToday = log ? log.meals.length < 2 : false
  const focus = skippedToday
    ? 'Yesterday you missed meals. Tomorrow the first goal is simply to sit and eat all three.'
    : dosha === 'Kapha'
      ? 'Tomorrow: move before breakfast, and take the post-lunch walk.'
      : dosha === 'Pitta'
        ? 'Tomorrow: keep lunch your biggest meal and step away from the desk to eat it.'
        : 'Tomorrow: fixed meal times and a warm breakfast, no exceptions.'

  const holiday = getTodayHoliday(tomorrow)

  return {
    date: tomorrow.toISOString().split('T')[0],
    meals: mealsOut,
    groceries,
    focus,
    note: holiday ? `${holiday.name}: ${holiday.tip}` : isWeekend(tomorrow) ? 'A slower weekend day — still keep meal times steady.' : '',
    holiday: holiday?.name ?? null,
  }
}

// ─── DAY REVIEW ──────────────────────────────────────────────────────────

export interface DayReview {
  score: number
  achievements: string[]
  improvements: string[]
  headline: string
  encouragement: string
  water: number
  mealsLogged: number
  practices: number
}

export function reviewDay(
  profile: UserProfile,
  log: DailyLog | null,
  handled: Record<string, 'done' | 'skipped' | 'snoozed'>,
  date: Date = new Date(),
): DayReview {
  const dosha = profile.doshaType ?? 'Vata'
  const done = Object.values(handled).filter(v => v === 'done').length
  const skipped = Object.values(handled).filter(v => v === 'skipped').length
  const water = log?.waterIntake ?? 0
  const mealsLogged = log?.meals.length ?? 0
  const practices =
    (log?.yogaMinutes ?? 0) + (log?.pranayamaMinutes ?? 0) + (log?.meditationMinutes ?? 0)

  const achievements: string[] = []
  const improvements: string[] = []

  if (done > 0) achievements.push(`You confirmed ${done} guidance moment${done === 1 ? '' : 's'} today.`)
  if (mealsLogged >= 2) achievements.push(`You logged ${mealsLogged} meals — that is real data to plan from.`)
  else if (mealsLogged === 1) achievements.push('One meal logged. It is a start, not a verdict.')
  if (water >= 6) achievements.push(`${water} glasses of water — hydration was strong today.`)
  if (practices >= 15) achievements.push(`${practices} minutes of yoga, breath or meditation.`)
  if (profile.healthGoals.length) achievements.push(`You kept "${profile.healthGoals[0]}" in view.`)

  if (skipped > 0) improvements.push(`${skipped} moment${skipped === 1 ? '' : 's'} were skipped. Which one will you protect tomorrow?`)
  if (water < 6) improvements.push(`Water was ${water} glasses. Aim for 8 tomorrow, starting with warm water at waking.`)
  if (mealsLogged < 2) improvements.push('Meals went unlogged. Tomorrow, tell me what you actually ate — it makes the plan sharper.')
  if (practices === 0) improvements.push('No breath or movement recorded. Ten minutes tomorrow is enough.')
  if (improvements.length === 0) improvements.push('Nothing needs fixing. Repeat today almost exactly.')

  const raw = done * 8 + mealsLogged * 10 + Math.min(water, 8) * 4 + Math.min(practices, 30)
  const score = Math.max(12, Math.min(100, Math.round(raw)))

  const headline =
    score >= 80 ? 'A strong day, honestly earned.' : score >= 55 ? 'A steady day with clear edges to sharpen.' : 'A human day. Tomorrow is a fresh ledger.'

  const doshaLine: Record<Dosha, string> = {
    Vata: 'For you the win is rhythm, not intensity. Same times tomorrow.',
    Pitta: 'For you the win is coolness and one thing at a time.',
    Kapha: 'For you the win is movement before food, every single morning.',
  }

  return {
    score,
    achievements: achievements.length ? achievements : ['You opened the app and checked in. That counts.'],
    improvements,
    headline,
    encouragement: `${getEncouragement(date)} ${doshaLine[dosha]}`,
    water,
    mealsLogged,
    practices,
  }
}

export function getDoshaComposition(profile: UserProfile): { dosha: Dosha; pct: number }[] {
  const scores = profile.doshaScores
  const total = scores.Vata + scores.Pitta + scores.Kapha || 1
  return (['Vata', 'Pitta', 'Kapha'] as Dosha[]).map(d => ({
    dosha: d,
    pct: Math.round((scores[d] / total) * 100),
  }))
}

export function describeDosha(dosha: Dosha): string {
  return doshaProfiles[dosha].description
}
