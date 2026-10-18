import type { Dosha, RegionId } from './data'

export type HumorStyle = 'technical' | 'motivational' | 'wholesome' | 'philosophical'

export type ScheduleKind =
  | 'wake'
  | 'ritual'
  | 'meal'
  | 'work'
  | 'break'
  | 'exercise'
  | 'family'
  | 'rest'
  | 'sleep'

export interface ScheduleItem {
  time: string
  title: string
  icon: string
  kind: ScheduleKind
}

export interface Profession {
  id: string
  label: string
  icon: string
  category: 'technical' | 'non-technical'
  wakeTime: string
  sleepTime: string
  meals: { breakfast: string; lunch: string; snack: string; dinner: string }
  breakTimes: string[]
  screenTimeLimitHours: number
  humorStyle: HumorStyle
  exercise: string
  familyWindow: string
  workNote: string
  schedule: ScheduleItem[]
}

interface ProfessionSeed {
  id: string
  label: string
  icon: string
  category: 'technical' | 'non-technical'
  wake: string
  sleep: string
  meals: { breakfast: string; lunch: string; snack: string; dinner: string }
  breaks: string[]
  screen: number
  humor: HumorStyle
  exercise: string
  family: string
  workNote: string
  extra?: ScheduleItem[]
}

const i = (time: string, title: string, icon: string, kind: ScheduleKind): ScheduleItem => ({
  time,
  title,
  icon,
  kind,
})

const seeds: ProfessionSeed[] = [
  {
    id: 'student_school',
    label: 'School Student',
    icon: '🎒',
    category: 'non-technical',
    wake: '06:00',
    sleep: '21:30',
    meals: { breakfast: '07:00', lunch: '12:30', snack: '16:30', dinner: '19:30' },
    breaks: ['10:30', '15:30'],
    screen: 2,
    humor: 'wholesome',
    exercise: 'Surya Namaskar and skipping before school',
    family: '19:30 – 20:30',
    workNote: 'Homework sits best in the late afternoon, after a snack and before dinner.',
    extra: [
      i('08:00', 'School begins — sit tall, breathe before class', '🏫', 'work'),
      i('12:30', 'School lunch — eat seated, no phone', '🍱', 'meal'),
      i('15:45', 'Home — wash up and eat a warm snack', '🏠', 'meal'),
      i('16:30', 'Homework block 1 (45 min)', '📚', 'work'),
      i('17:30', 'Play outdoors — movement builds focus', '⚽', 'exercise'),
    ],
  },
  {
    id: 'student_college',
    label: 'College Student',
    icon: '🎓',
    category: 'non-technical',
    wake: '06:30',
    sleep: '22:30',
    meals: { breakfast: '07:30', lunch: '13:00', snack: '17:00', dinner: '20:00' },
    breaks: ['11:00', '16:00'],
    screen: 4,
    humor: 'wholesome',
    exercise: '20 minutes of yoga plus a campus walk',
    family: '20:30 – 21:15',
    workNote: 'Deep study earlier, revision later. Late-night cramming drains Agni and memory.',
    extra: [
      i('09:00', 'Lectures — hydrate between sessions', '🏫', 'work'),
      i('13:00', 'Lunch with friends — chew slowly', '🍛', 'meal'),
      i('16:00', 'Study block: 2 focused hours', '📖', 'work'),
      i('19:00', 'Campus walk or sport', '🚶', 'exercise'),
    ],
  },
  {
    id: 'software_engineer',
    label: 'Software Engineer',
    icon: '💻',
    category: 'technical',
    wake: '06:30',
    sleep: '22:30',
    meals: { breakfast: '08:00', lunch: '13:00', snack: '16:30', dinner: '19:30' },
    breaks: ['11:00', '15:00', '17:30'],
    screen: 8,
    humor: 'technical',
    exercise: 'Neck and shoulder release plus a 15-minute walk',
    family: '19:30 – 20:30',
    workNote: 'Deep work before 11 AM, code review after lunch, no screens for 45 minutes before bed.',
    extra: [
      i('09:30', 'Deep work block — phone in another room', '⌨️', 'work'),
      i('11:00', 'Stand, stretch, 20-20-20 eye rule', '👀', 'break'),
      i('15:00', 'Walk 10 minutes — reset posture', '🚶', 'break'),
      i('18:30', 'Log off — close the laptop fully', '🔌', 'rest'),
    ],
  },
  {
    id: 'doctor',
    label: 'Doctor',
    icon: '🩺',
    category: 'non-technical',
    wake: '05:45',
    sleep: '22:00',
    meals: { breakfast: '06:45', lunch: '13:30', snack: '17:00', dinner: '20:00' },
    breaks: ['10:30', '16:00'],
    screen: 5,
    humor: 'philosophical',
    exercise: '10 minutes of pranayama between rounds',
    family: '20:00 – 21:00',
    workNote: 'Shift work disrupts Agni. Anchor meals to clock times, not hunger, and hydrate continuously.',
    extra: [
      i('08:00', 'Rounds begin — breathe before each patient', '🏥', 'work'),
      i('13:30', 'Lunch — even five seated minutes counts', '🥗', 'meal'),
      i('18:00', 'Handover — release the day deliberately', '📋', 'rest'),
    ],
  },
  {
    id: 'teacher',
    label: 'Teacher',
    icon: '📐',
    category: 'non-technical',
    wake: '05:30',
    sleep: '21:45',
    meals: { breakfast: '07:00', lunch: '13:00', snack: '16:30', dinner: '19:30' },
    breaks: ['10:15', '15:30'],
    screen: 3,
    humor: 'wholesome',
    exercise: 'Morning stretches and an evening walk',
    family: '19:30 – 20:30',
    workNote: 'Your voice is your instrument — warm water with honey, and silence between classes.',
    extra: [
      i('08:15', 'Classes begin — stand tall, speak from the belly', '🏫', 'work'),
      i('16:00', 'Marking block (45 min max)', '📝', 'work'),
      i('17:00', 'Step outside — daylight resets energy', '🌤️', 'break'),
    ],
  },
  {
    id: 'business_owner',
    label: 'Business Owner',
    icon: '📊',
    category: 'non-technical',
    wake: '06:00',
    sleep: '22:30',
    meals: { breakfast: '07:30', lunch: '13:00', snack: '16:30', dinner: '20:00' },
    breaks: ['10:30', '15:30'],
    screen: 7,
    humor: 'motivational',
    exercise: 'Strength training three mornings a week',
    family: '20:00 – 21:00',
    workNote: 'Guard one no-meeting block in the morning for the work only you can do.',
    extra: [
      i('09:00', 'Deep work — the decisions that matter', '🎯', 'work'),
      i('18:30', 'Close the business day with a written handover', '🗂️', 'rest'),
    ],
  },
  {
    id: 'homemaker',
    label: 'Homemaker',
    icon: '🏡',
    category: 'non-technical',
    wake: '05:45',
    sleep: '22:00',
    meals: { breakfast: '07:30', lunch: '12:30', snack: '16:30', dinner: '19:30' },
    breaks: ['11:00', '16:00'],
    screen: 3,
    humor: 'wholesome',
    exercise: 'Yoga at home plus a 20-minute walk',
    family: '19:30 – 20:30',
    workNote: 'You care for everyone — put your own meal on the table first, seated.',
    extra: [
      i('10:00', 'Household rhythm — pause for tea, seated', '🍵', 'break'),
      i('12:30', 'Lunch — eat before serving seconds', '🍲', 'meal'),
      i('17:00', 'Twenty-minute walk, alone if possible', '🚶', 'exercise'),
    ],
  },
  {
    id: 'freelancer',
    label: 'Freelancer',
    icon: '🖊️',
    category: 'technical',
    wake: '07:00',
    sleep: '22:45',
    meals: { breakfast: '08:00', lunch: '13:00', snack: '16:30', dinner: '20:00' },
    breaks: ['10:30', '15:30'],
    screen: 8,
    humor: 'technical',
    exercise: 'A 20-minute walk at the start and end of work',
    family: '20:00 – 21:00',
    workNote: 'Start work with a walk, not a screen. Fixed hours protect you from drift.',
    extra: [
      i('09:30', 'First focus block — one task only', '🎧', 'work'),
      i('18:00', 'Hard stop — shut the laptop', '🛑', 'rest'),
    ],
  },
  {
    id: 'govt_employee',
    label: 'Government Employee',
    icon: '🏛️',
    category: 'non-technical',
    wake: '06:00',
    sleep: '22:00',
    meals: { breakfast: '07:30', lunch: '13:00', snack: '16:30', dinner: '19:30' },
    breaks: ['11:00', '15:30'],
    screen: 5,
    humor: 'philosophical',
    exercise: 'Morning walk and evening stretching',
    family: '19:30 – 20:30',
    workNote: 'Desk days stiffen the spine — stand every 45 minutes without fail.',
    extra: [
      i('09:30', 'Office begins — set a 45-minute standing reminder', '🗄️', 'work'),
      i('17:30', 'Leave on time — the work will still be there', '🚪', 'rest'),
    ],
  },
  {
    id: 'lawyer',
    label: 'Lawyer',
    icon: '⚖️',
    category: 'non-technical',
    wake: '05:45',
    sleep: '22:15',
    meals: { breakfast: '07:00', lunch: '13:00', snack: '16:30', dinner: '19:45' },
    breaks: ['10:30', '15:30'],
    screen: 6,
    humor: 'philosophical',
    exercise: 'Pranayama before court and a brisk evening walk',
    family: '19:45 – 20:45',
    workNote: 'High-stakes days raise Pitta. Cooling breath before every hearing is not optional.',
    extra: [
      i('09:00', 'Preparation — single-tab focus', '📚', 'work'),
      i('18:00', 'Close case notes, then close the day', '🗃️', 'rest'),
    ],
  },
  {
    id: 'creative',
    label: 'Creative Professional',
    icon: '🎨',
    category: 'technical',
    wake: '07:00',
    sleep: '22:45',
    meals: { breakfast: '08:30', lunch: '13:30', snack: '17:00', dinner: '20:00' },
    breaks: ['11:00', '16:00'],
    screen: 7,
    humor: 'motivational',
    exercise: 'Dance or free movement for 20 minutes',
    family: '20:00 – 21:00',
    workNote: 'Your best work arrives in waves — protect two long blocks and let the rest go.',
    extra: [
      i('09:30', 'Creative block — no notifications', '🖌️', 'work'),
      i('17:30', 'Step away from the screen, look far away', '👁️', 'break'),
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare Worker',
    icon: '🧑‍⚕️',
    category: 'non-technical',
    wake: '05:30',
    sleep: '22:00',
    meals: { breakfast: '06:30', lunch: '13:00', snack: '16:30', dinner: '19:30' },
    breaks: ['10:00', '15:30'],
    screen: 4,
    humor: 'philosophical',
    exercise: 'Shoulder and low-back release plus a short walk',
    family: '19:30 – 20:30',
    workNote: 'You give all day. Three conscious breaths before every shift change protect you.',
    extra: [
      i('07:00', 'Shift start — hydrate before the first patient', '🏨', 'work'),
      i('19:00', 'Shift end — wash hands, then shoulders down', '🚿', 'rest'),
    ],
  },
  {
    id: 'factory_worker',
    label: 'Factory / Site Worker',
    icon: '🦺',
    category: 'non-technical',
    wake: '05:00',
    sleep: '21:30',
    meals: { breakfast: '06:00', lunch: '12:00', snack: '16:00', dinner: '19:00' },
    breaks: ['09:30', '14:30'],
    screen: 1,
    humor: 'motivational',
    exercise: 'Stretch the back and shoulders before and after shift',
    family: '19:00 – 20:00',
    workNote: 'Physical work still needs recovery — legs up the wall for five minutes after shift.',
    extra: [
      i('07:00', 'Shift begins — lift with the legs, not the back', '🏗️', 'work'),
      i('17:00', 'Shift ends — water, then rest', '🚰', 'rest'),
    ],
  },
  {
    id: 'farmer',
    label: 'Farmer',
    icon: '🌾',
    category: 'non-technical',
    wake: '04:45',
    sleep: '21:00',
    meals: { breakfast: '06:30', lunch: '12:00', snack: '16:00', dinner: '18:45' },
    breaks: ['09:30', '15:00'],
    screen: 1,
    humor: 'wholesome',
    exercise: 'Field work counts — add gentle evening stretching',
    family: '18:45 – 19:45',
    workNote: 'Early starts and heat demand steady water and shade, not just willpower.',
    extra: [
      i('06:00', 'Field work begins before the heat', '🌱', 'work'),
      i('11:30', 'Rest in shade, drink water', '🌳', 'break'),
      i('17:30', 'Finish before dusk, wash up', '💧', 'rest'),
    ],
  },
  {
    id: 'retired',
    label: 'Retired',
    icon: '🌻',
    category: 'non-technical',
    wake: '05:30',
    sleep: '21:45',
    meals: { breakfast: '07:30', lunch: '12:30', snack: '16:30', dinner: '19:00' },
    breaks: ['10:30', '16:00'],
    screen: 2,
    humor: 'philosophical',
    exercise: 'Gentle morning walk and joint-friendly yoga',
    family: '18:30 – 19:30',
    workNote: 'Purpose keeps Vata grounded — keep one meaningful commitment every day.',
    extra: [
      i('09:00', 'Morning walk in daylight', '🌞', 'exercise'),
      i('17:00', 'Tea with someone you love', '🫖', 'family'),
    ],
  },
]

function buildSchedule(seed: ProfessionSeed): ScheduleItem[] {
  const items: ScheduleItem[] = [
    i(seed.wake, 'Wake up — Brahma Muhurta window', '🌅', 'wake'),
    i(seed.wake, 'Tongue scraping, warm water, oil pulling', '✨', 'ritual'),
    i(addMinutes(seed.wake, 30), 'Pranayama & meditation', '🧘', 'ritual'),
    i(addMinutes(seed.wake, 60), 'Yoga asana practice', '🧘‍♀️', 'exercise'),
    i(seed.meals.breakfast, 'Breakfast — warm and seated', '🥣', 'meal'),
    i(seed.meals.lunch, 'Lunch — the largest meal of the day', '🍽️', 'meal'),
    i(seed.meals.snack, 'Afternoon snack if genuinely hungry', '🍎', 'meal'),
    i(seed.meals.dinner, 'Dinner — light, three hours before sleep', '🍲', 'meal'),
    i(seed.family, 'Family time — phones in another room', '👨‍👩‍👧', 'family'),
    i(addMinutes(seed.sleep, -60), 'Wind down — screens off, oil your feet', '🌙', 'rest'),
    i(seed.sleep, 'Sleep — the day is complete', '😴', 'sleep'),
  ]
  for (const br of seed.breaks) items.push(i(br, 'Movement break — stand and breathe', '🚶', 'break'))
  if (seed.extra) items.push(...seed.extra)
  return items.sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function addMinutes(time: string, delta: number): string {
  const total = (toMinutes(time) + delta + 24 * 60) % (24 * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export const professions: Profession[] = seeds.map(seed => ({
  ...seed,
  wakeTime: seed.wake,
  sleepTime: seed.sleep,
  breakTimes: seed.breaks,
  screenTimeLimitHours: seed.screen,
  humorStyle: seed.humor,
  familyWindow: seed.family,
  schedule: buildSchedule(seed),
}))

export function getProfession(id: string | undefined): Profession | null {
  if (!id) return null
  return professions.find(p => p.id === id) ?? null
}

// ─── HUMOUR ──────────────────────────────────────────────────────────────

export interface Joke {
  style: HumorStyle
  setup: string
  punchline: string
}

export const jokes: Joke[] = [
  { style: 'technical', setup: 'Why did the developer go broke?', punchline: 'Because he used up all his cache.' },
  { style: 'technical', setup: 'How many programmers does it take to change a light bulb?', punchline: 'None — that is a hardware problem.' },
  { style: 'technical', setup: 'A QA engineer walks into a bar.', punchline: 'Orders 1 beer, 0 beers, -1 beers, 99999 beers, a lizard.' },
  { style: 'technical', setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.' },
  { style: 'technical', setup: 'I told my computer I needed a break.', punchline: 'Now it will not stop sending me KitKat ads.' },
  { style: 'technical', setup: 'What is a programmer\'s favourite hangout spot?', punchline: 'The Foo Bar.' },
  { style: 'technical', setup: 'Why did the function stop calling the other function?', punchline: 'It had too many arguments.' },
  { style: 'motivational', setup: 'You do not have to be extreme,', punchline: 'just consistent. Ten minutes today beats two hours next month.' },
  { style: 'motivational', setup: 'The mountain does not care', punchline: 'that you are tired. But your body does — so rest, then climb.' },
  { style: 'motivational', setup: 'Small steps feel slow', punchline: 'until you look back and cannot see the start.' },
  { style: 'wholesome', setup: 'My grandmother used to say', punchline: 'a home-cooked meal is a hug you can eat.' },
  { style: 'wholesome', setup: 'The best therapy', punchline: 'is a warm meal and someone who listens without advice.' },
  { style: 'wholesome', setup: 'You remembered to drink water today?', punchline: 'Look at you, thriving.' },
  { style: 'philosophical', setup: 'Ayurveda says the body is a river,', punchline: 'not a statue. Flow beats perfection.' },
  { style: 'philosophical', setup: 'You cannot pour from an empty cup —', punchline: 'and you cannot digest while you are running.' },
  { style: 'philosophical', setup: 'The mind that is always busy', punchline: 'is like a lamp in the wind: bright, but never steady.' },
]

export function getDailyJoke(style: HumorStyle, date: Date = new Date()): Joke {
  const pool = jokes.filter(j => j.style === style)
  const list = pool.length ? pool : jokes
  const dayIndex = Math.floor(date.getTime() / 86_400_000)
  return list[dayIndex % list.length]
}

// ─── REGIONAL FOOD ───────────────────────────────────────────────────────

export interface RegionFoods {
  id: RegionId
  label: string
  grains: string[]
  vegetables: string[]
  fruits: string[]
  specials: string[]
}

export const regionFoods: RegionFoods[] = [
  {
    id: 'north',
    label: 'North India',
    grains: ['Wheat', 'Basmati rice', 'Bajra', 'Jowar'],
    vegetables: ['Spinach', 'Cauliflower', 'Bottle gourd', 'Carrot', 'Turnip'],
    fruits: ['Apple', 'Guava', 'Pomegranate', 'Mango (summer)'],
    specials: ['Ghee', 'Paneer', 'Curd', 'Methi'],
  },
  {
    id: 'south',
    label: 'South India',
    grains: ['Rice', 'Ragi', 'Millet', 'Urad dal'],
    vegetables: ['Drumstick', 'Snake gourd', 'Brinjal', 'Banana stem', 'Curry leaves'],
    fruits: ['Banana', 'Coconut', 'Jackfruit', 'Guava'],
    specials: ['Coconut oil', 'Curd rice', 'Sambar', 'Tamarind'],
  },
  {
    id: 'east',
    label: 'East India',
    grains: ['Rice', 'Poha', 'Dal', 'Barley'],
    vegetables: ['Bitter gourd', 'Pumpkin', 'Fern shoot', 'Radish', 'Mustard greens'],
    fruits: ['Guava', 'Papaya', 'Banana', 'Litchi (summer)'],
    specials: ['Mustard oil', 'Panch phoron', 'Fish curry', 'Rice flakes'],
  },
  {
    id: 'west',
    label: 'West India',
    grains: ['Jowar', 'Bajra', 'Wheat', 'Rice'],
    vegetables: ['Okra', 'Cluster beans', 'Bottle gourd', 'Tomato', 'Onion'],
    fruits: ['Mango', 'Chikoo', 'Guava', 'Watermelon'],
    specials: ['Groundnut oil', 'Buttermilk', 'Fenugreek', 'Kokum'],
  },
  {
    id: 'northeast',
    label: 'North East India',
    grains: ['Rice', 'Millet', 'Maize', 'Sticky rice'],
    vegetables: ['Bamboo shoot', 'Mustard greens', 'Colocasia', 'Pumpkin', 'Chilli'],
    fruits: ['Passion fruit', 'Orange', 'Pineapple', 'Banana'],
    specials: ['Fermented soy', 'Ginger', 'Turmeric', 'Herbal greens'],
  },
  {
    id: 'central',
    label: 'Central India',
    grains: ['Wheat', 'Rice', 'Jowar', 'Gram flour'],
    vegetables: ['Bottle gourd', 'Lauki', 'Brinjal', 'Spinach', 'Tomato'],
    fruits: ['Guava', 'Papaya', 'Mango', 'Custard apple'],
    specials: ['Ghee', 'Poha', 'Sattu', 'Curd'],
  },
]

export function getRegionFoods(region: RegionId | undefined): RegionFoods {
  return regionFoods.find(r => r.id === region) ?? regionFoods[0]
}

export function getSeasonalProduce(month: number): string[] {
  if (month >= 2 && month <= 4) return ['Mango', 'Jamun', 'Guava', 'Cucumber', 'Bottle gourd', 'Mint']
  if (month >= 5 && month <= 7) return ['Watermelon', 'Muskmelon', 'Cucumber', 'Coconut', 'Zucchini', 'Gourds']
  if (month >= 8 && month <= 9) return ['Pomegranate', 'Fig', 'Apple', 'Pumpkin', 'Sweet potato', 'Spinach']
  return ['Orange', 'Guava', 'Carrot', 'Mustard greens', 'Methi', 'Sesame']
}

// ─── HOLIDAYS ────────────────────────────────────────────────────────────

export interface Holiday {
  month: number
  day: number
  name: string
  tip: string
}

export const holidays: Holiday[] = [
  { month: 1, day: 1, name: 'New Year', tip: 'Set one gentle intention, not ten resolutions.' },
  { month: 1, day: 14, name: 'Makar Sankranti / Pongal', tip: 'Celebrate with sesame and jaggery — warming and grounding.' },
  { month: 1, day: 26, name: 'Republic Day', tip: 'A long morning walk in the winter sun is a gift to yourself.' },
  { month: 3, day: 8, name: 'International Women\'s Day', tip: 'Honour the women who feed and heal your family.' },
  { month: 3, day: 14, name: 'Holi', tip: 'Cooling coconut water afterwards, and oil your skin before colours.' },
  { month: 4, day: 14, name: 'Baisakhi / Tamil New Year', tip: 'Harvest foods, shared meals, early night.' },
  { month: 5, day: 1, name: 'Labour Day', tip: 'Rest is part of the work. Take it without guilt.' },
  { month: 8, day: 15, name: 'Independence Day', tip: 'Morning flag, morning walk, family lunch.' },
  { month: 10, day: 2, name: 'Gandhi Jayanti', tip: 'A day of simplicity: light food, long walk, no screens.' },
  { month: 10, day: 20, name: 'Diwali window', tip: 'Sweets in small portions, and a walk between celebrations.' },
  { month: 12, day: 25, name: 'Christmas', tip: 'Warm meals and company are the best medicine.' },
  { month: 12, day: 31, name: 'New Year\'s Eve', tip: 'Sleep by 10:30 — you will thank yourself at sunrise.' },
]

export function getTodayHoliday(date: Date = new Date()): Holiday | null {
  return holidays.find(h => h.month === date.getMonth() + 1 && h.day === date.getDate()) ?? null
}

export function isWeekend(date: Date = new Date()): boolean {
  const d = date.getDay()
  return d === 0 || d === 6
}

// ─── GOAL LIBRARY ────────────────────────────────────────────────────────

export interface GoalTemplate {
  id: string
  title: string
  icon: string
  category: 'body' | 'mind' | 'nutrition' | 'sleep' | 'lifestyle'
  target: number
  unit: string
  benefit: string
  whyItWorks: string
  doshaFit: Dosha[]
}

export const goalTemplates: GoalTemplate[] = [
  {
    id: 'morning_walk',
    title: 'Morning walk',
    icon: '🚶',
    category: 'body',
    target: 20,
    unit: 'min',
    benefit: 'Steadier energy through the day and better digestion at lunch.',
    whyItWorks: 'Daylight in the first hour anchors your body clock, which improves sleep that same night.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'pranayama',
    title: 'Pranayama',
    icon: '🫁',
    category: 'mind',
    target: 10,
    unit: 'min',
    benefit: 'Lower resting heart rate and a calmer response to stress.',
    whyItWorks: 'Slow nasal breathing raises vagal tone — the body\'s own brake pedal.',
    doshaFit: ['Vata', 'Pitta'],
  },
  {
    id: 'meditation',
    title: 'Meditation',
    icon: '🧘',
    category: 'mind',
    target: 10,
    unit: 'min',
    benefit: 'Sharper focus and less mental noise.',
    whyItWorks: 'Ten daily minutes is enough for the mind to start returning to the breath on its own.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'water',
    title: 'Water intake',
    icon: '💧',
    category: 'nutrition',
    target: 8,
    unit: 'glasses',
    benefit: 'Cleaner digestion, fewer headaches, better skin.',
    whyItWorks: 'Dehydration is routinely mistaken for hunger and fatigue.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'sleep_early',
    title: 'Sleep before 10:30 PM',
    icon: '🌙',
    category: 'sleep',
    target: 7,
    unit: 'nights/wk',
    benefit: 'Deeper rest and a calmer morning.',
    whyItWorks: 'The hours before midnight carry the most restorative sleep for Pitta balance.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'no_screens_bed',
    title: 'No screens before bed',
    icon: '📵',
    category: 'sleep',
    target: 45,
    unit: 'min buffer',
    benefit: 'Falling asleep faster and waking less at night.',
    whyItWorks: 'Blue light delays melatonin; a dark buffer lets it rise naturally.',
    doshaFit: ['Vata', 'Pitta'],
  },
  {
    id: 'yoga',
    title: 'Yoga practice',
    icon: '🧘‍♀️',
    category: 'body',
    target: 20,
    unit: 'min',
    benefit: 'Flexibility, posture and fewer aches from desk work.',
    whyItWorks: 'Daily short practice beats a long weekly one for joint and fascia health.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'family_time',
    title: 'Screen-free family time',
    icon: '👨‍👩‍👧',
    category: 'lifestyle',
    target: 30,
    unit: 'min',
    benefit: 'Better mood and a felt sense of connection.',
    whyItWorks: 'Undivided attention is what the nervous system reads as safety.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'home_cooked',
    title: 'Home-cooked meals',
    icon: '🍲',
    category: 'nutrition',
    target: 2,
    unit: 'meals/day',
    benefit: 'Less hidden oil, salt and sugar; steadier energy.',
    whyItWorks: 'You cannot control what you cannot see being cooked.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 'post_meal_walk',
    title: 'Post-meal walk',
    icon: '🚶‍♂️',
    category: 'nutrition',
    target: 10,
    unit: 'min',
    benefit: 'Flatter blood sugar curves after eating.',
    whyItWorks: 'Even ten minutes of walking after a meal improves glucose uptake.',
    doshaFit: ['Kapha', 'Pitta'],
  },
  {
    id: 'oil_massage',
    title: 'Abhyanga (self-massage)',
    icon: '🧴',
    category: 'body',
    target: 10,
    unit: 'min',
    benefit: 'Calmer nervous system and better sleep.',
    whyItWorks: 'Warm oil on the skin settles Vata and supports the lymph.',
    doshaFit: ['Vata'],
  },
  {
    id: 'bmi_healthy',
    title: 'Reach healthy BMI',
    icon: '⚖️',
    category: 'body',
    target: 1,
    unit: 'goal',
    benefit: 'Lower risk of lifestyle disease and easier daily movement.',
    whyItWorks: 'Moving a few kilos towards the healthy band improves blood pressure and sleep apnoea risk.',
    doshaFit: ['Vata', 'Pitta', 'Kapha'],
  },
]

export function getGoalTemplates(dosha: Dosha): GoalTemplate[] {
  return goalTemplates.filter(g => g.doshaFit.includes(dosha))
}
