export type Dosha = 'Vata' | 'Pitta' | 'Kapha'
export type TimeOfDay = 'brahma_muhurta' | 'morning' | 'mid_morning' | 'afternoon' | 'evening' | 'night'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'early_winter' | 'late_winter'
export type Mood = 'energetic' | 'calm' | 'anxious' | 'sluggish' | 'happy' | 'stressed' | 'balanced'

export interface DoshaQuestion {
  id: string
  question: string
  category: string
  options: { label: string; value: string; scores: Record<Dosha, number> }[]
}

export interface UserProfile {
  name: string
  email?: string
  age: number
  gender: 'male' | 'female' | 'other'
  weight: number
  height: number
  doshaType: Dosha | null
  doshaScores: Record<Dosha, number>
  wakeTime: string
  sleepTime: string
  location: string
  region?: RegionId
  profession?: string
  healthGoals: string[]
  allergies: string[]
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  completedOnboarding: boolean
  createdAt: string
}

export type RegionId = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'central'

export interface DailyLog {
  date: string
  meals: { type: string; time: string; foods: string[]; notes: string }[]
  waterIntake: number
  sleepQuality: number
  sleepHours: number
  energyLevels: { morning: number; afternoon: number; evening: number }
  mood: Mood
  activities: string[]
  yogaMinutes: number
  pranayamaMinutes: number
  meditationMinutes: number
  exerciseMinutes: number
  notes: string
  doshaBalance: Record<Dosha, number>
}

export interface RoutineStep {
  time: string
  title: string
  description: string
  duration: string
  icon: string
  category: 'body' | 'mind' | 'nutrition' | 'spirit' | 'rest'
  doshaSpecific?: Dosha[]
}

export interface Meal {
  name: string
  time: string
  foods: string[]
  description: string
  recipe?: string
  doshaFriendly: Dosha[]
  season: Season[]
  calories: number
  prepTime: string
  ingredients: string[]
}

export interface YogaPose {
  name: string
  sanskrit: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  benefits: string[]
  doshaFriendly: Dosha[]
  category: 'standing' | 'seated' | 'supine' | 'prone' | 'inverted' | 'twist' | 'breathing' | 'meditation'
  contraindications?: string[]
}

export interface Remedy {
  condition: string
  remedy: string
  ingredients: string[]
  preparation: string
  dosage: string
  precautions: string
  doshaType: Dosha[]
  severity: 'mild' | 'moderate' | 'severe'
}

export interface SeasonalTip {
  season: string
  title: string
  description: string
  doshaAdvice: Record<Dosha, string>
  foods: string[]
  activities: string[]
  avoid: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'coach' | 'system'
  content: string
  timestamp: string
  type?: 'advice' | 'question' | 'reminder' | 'celebration' | 'check_in'
  context?: string
}

// ─── DOSHA QUIZ QUESTIONS ───────────────────────────────────────────────

export const doshaQuestions: DoshaQuestion[] = [
  {
    id: 'body_build',
    question: 'How would you describe your natural body build?',
    category: 'Physical',
    options: [
      { label: 'Thin, light frame, hard to gain weight', value: 'thin', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Medium, athletic, well-proportioned', value: 'medium', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Solid, broad, gains weight easily', value: 'solid', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'skin_type',
    question: 'What is your skin naturally like?',
    category: 'Physical',
    options: [
      { label: 'Dry, rough, cool to touch, tends to crack', value: 'dry', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Warm, oily, sensitive, prone to rashes or acne', value: 'warm_oily', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Thick, oily, cool, smooth, pale or fair', value: 'thick_oily', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'hair_type',
    question: 'Describe your hair naturally:',
    category: 'Physical',
    options: [
      { label: 'Dry, thin, frizzy, tends to tangle easily', value: 'dry', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Fine, oily, premature graying or thinning', value: 'fine_oily', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Thick, lustrous, heavy, grows slowly', value: 'thick', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'eyes',
    question: 'Your eyes are best described as:',
    category: 'Physical',
    options: [
      { label: 'Small, dry, darting, dark colored', value: 'small_dry', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Sharp, bright, light-colored, piercing gaze', value: 'sharp_bright', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Large, calm, steady, attractive, often light or blue', value: 'large_calm', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'appetite',
    question: 'How is your appetite typically?',
    category: 'Digestive',
    options: [
      { label: 'Irregular — sometimes ravenous, sometimes forget to eat', value: 'irregular', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Strong and sharp — get irritable when hungry (hangry!)', value: 'strong', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Steady and consistent — can skip meals without discomfort', value: 'steady', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'digestion',
    question: 'After eating a heavy meal, you typically:',
    category: 'Digestive',
    options: [
      { label: 'Feel bloated, gassy, or uncomfortable', value: 'bloating', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Feel fine — digest quickly and feel energized', value: 'fine', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Feel heavy and lethargic, want to rest', value: 'heavy', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'bowel',
    question: 'Your bowel movements are typically:',
    category: 'Digestive',
    options: [
      { label: 'Irregular — constipation is common, small hard stools', value: 'constipation', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Loose, soft, or frequent — tendency toward diarrhea', value: 'loose', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Regular and well-formed, but slow', value: 'regular', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'sleep',
    question: 'Your natural sleep pattern is:',
    category: 'Lifestyle',
    options: [
      { label: 'Light sleeper, often wake up, vivid dreams', value: 'light', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Moderate sleep, wake up easily with heat or noise', value: 'moderate', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Deep sleeper, hard to wake up, love sleeping in', value: 'deep', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'energy',
    question: 'Your energy levels through the day are:',
    category: 'Lifestyle',
    options: [
      { label: 'Comes in bursts — high energy then sudden crashes', value: 'bursts', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Steady and strong — can push through long days', value: 'steady_strong', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Slow to start, builds gradually, endurance is your strength', value: 'slow_build', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'temperature',
    question: 'In terms of temperature preference:',
    category: 'Physical',
    options: [
      { label: 'Always cold — hate wind, love warm places', value: 'cold', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Always warm — hate heat, prefer cool places', value: 'warm', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Adaptable — neither too hot nor too cold usually', value: 'adaptable', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'speaking',
    question: 'When you speak, people might describe it as:',
    category: 'Mental',
    options: [
      { label: 'Fast, enthusiastic, jumps between topics', value: 'fast', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Clear, assertive, convincing, sometimes loud', value: 'assertive', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Slow, thoughtful, measured, sometimes monotone', value: 'slow', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'memory',
    question: 'Your memory style is best described as:',
    category: 'Mental',
    options: [
      { label: 'Quick to learn, quick to forget — like writing on water', value: 'quick_quick', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Sharp and focused — great at details, sometimes overthink', value: 'sharp', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Slow to learn, but once learned, never forget', value: 'slow_steady', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'stress_response',
    question: 'When you are under stress, you tend to:',
    category: 'Mental',
    options: [
      { label: 'Feel anxious, worried, scattered, can\'t focus', value: 'anxious', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Get irritable, angry, critical, impatient', value: 'angry', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Withdraw, shut down, overeat, become lazy', value: 'withdraw', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'exercise',
    question: 'Your preferred type of exercise is:',
    category: 'Lifestyle',
    options: [
      { label: 'Walking, dancing, light cardio — variety is key', value: 'light_variety', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'Intense workouts, competitive sports, pushing limits', value: 'intense', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Swimming, hiking, weight training — steady and sustained', value: 'sustained', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
  {
    id: 'social',
    question: 'In social situations, you are:',
    category: 'Mental',
    options: [
      { label: 'Enthusiastic but tire quickly — prefer small groups', value: 'enthusiastic', scores: { Vata: 3, Pitta: 0, Kapha: 0 } },
      { label: 'The life of the party — love being the center of attention', value: 'center', scores: { Vata: 0, Pitta: 3, Kapha: 0 } },
      { label: 'Quiet but warm — prefer close friends, good listener', value: 'quiet_warm', scores: { Vata: 0, Pitta: 0, Kapha: 3 } },
    ],
  },
]

// ─── DOSHA PROFILES ─────────────────────────────────────────────────────

export const doshaProfiles: Record<Dosha, {
  description: string
  element: string
  qualities: string[]
  strengths: string[]
  weaknesses: string[]
  balanceTips: string[]
  favorableFoods: string[]
  unfavorableFoods: string[]
  favorableActivities: string[]
  sleepAdvice: string
  exerciseAdvice: string
  mentalAdvice: string
}> = {
  Vata: {
    description: 'Vata is the energy of movement — air and space. You are creative, quick-thinking, and enthusiastic. Like the wind, you are always in motion, bringing new ideas and excitement wherever you go.',
    element: 'Air & Space (Ether)',
    qualities: ['Light', 'Dry', 'Cold', 'Rough', 'Mobile', 'Subtle'],
    strengths: ['Creativity', 'Quick learning', 'Enthusiasm', 'Adaptability', 'Joyfulness', 'Imagination'],
    weaknesses: ['Anxiety', 'Indecisiveness', 'Insomnia', 'Digestive issues', 'Dry skin', 'Weight loss'],
    balanceTips: [
      'Maintain a regular daily routine — this is your #1 medicine',
      'Favor warm, cooked, moist foods over cold, dry, raw foods',
      'Practice grounding yoga and meditation daily',
      'Get to bed by 10 PM — Vata becomes most agitated after 10 PM',
      'Apply warm sesame oil to your body before bathing (Abhyanga)',
      'Practice slow, deep breathing — Nadi Shodhana is excellent for you',
    ],
    favorableFoods: [
      'Warm soups and stews', 'Cooked grains (rice, oats, wheat)', 'Root vegetables',
      'Sweet fruits (bananas, mangoes, avocados)', 'Nuts and seeds', 'Ghee and warm milk',
      'Ginger and cinnamon', 'Sweet and sour tastes', 'Warm, moist, grounding foods',
    ],
    unfavorableFoods: [
      'Raw vegetables and salads', 'Cold drinks and ice cream', 'Dried fruits',
      'Beans and lentils (in excess)', 'Caffeine', 'Crackers and chips',
      'Bitter and astringent tastes', 'Popcorn', 'Puffed rice',
    ],
    favorableActivities: [
      'Gentle yoga (Hatha, Restorative)', 'Walking in nature', 'Tai Chi',
      'Warm baths', 'Massage', 'Creative arts', 'Journaling',
      'Gardening', 'Gentle swimming', 'Dancing',
    ],
    sleepAdvice: 'Go to bed by 10 PM. Apply warm sesame oil to feet before bed. Drink warm milk with nutmeg. Keep the bedroom warm and dark. Avoid screens for 1 hour before sleep.',
    exerciseAdvice: 'Favor slow, grounding exercises. Walking, gentle yoga, Tai Chi, swimming in warm water. Avoid excessive cardio and cold-weather exercise. Practice yoga in the morning.',
    mentalAdvice: 'Establish daily meditation practice (10-20 min). Journal to calm the mind. Practice deep breathing when anxious. Reduce multitasking. Spend time in nature regularly.',
  },
  Pitta: {
    description: 'Pitta is the energy of transformation — fire and water. You are driven, intelligent, and passionate. Like a flame, you illuminate everything around you with your sharp intellect and radiant energy.',
    element: 'Fire & Water',
    qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Sour', 'Spreading'],
    strengths: ['Intelligence', 'Courage', 'Leadership', 'Discipline', 'Sharp memory', 'Passion'],
    weaknesses: ['Anger', 'Perfectionism', 'Jealousy', 'Inflammation', 'Skin issues', 'Burnout'],
    balanceTips: [
      'Cool down — physically and emotionally — this is your primary goal',
      'Favor cooling, sweet, and bitter tastes over spicy and sour',
      'Practice moderation in work and exercise — avoid overheating',
      'Spend time near water — oceans, lakes, cool gardens',
      'Apply coconut or sunflower oil for Abhyanga',
      'PracticeSheetali or Sheetkari pranayama to cool the body',
    ],
    favorableFoods: [
      'Cool fruits (watermelon, cucumber, grapes, coconut)', 'Leafy greens', 'Sweet grains (rice, oats)',
      'Dairy (milk, ghee, paneer)', 'Cooling spices (fennel, coriander, mint)',
      'Sweet and bitter tastes', 'Moonlight walks', 'Aloe vera juice',
    ],
    unfavorableFoods: [
      'Spicy foods (chili, hot peppers)', 'Fried foods', 'Red meat',
      'Sour foods (vinegar, tomatoes, citrus in excess)', 'Alcohol', 'Coffee',
      'Salty and fermented foods', 'Sour cream', 'Mustard',
    ],
    favorableActivities: [
      'Swimming', 'Moonlight walks', 'Hatha Yoga', 'Pranayama (cooling)',
      'Meditation', 'Reading', 'Gardening in evening', 'Team sports (moderate)',
      'Cycling (not in heat)', 'Cool music and dance',
    ],
    sleepAdvice: 'Sleep in a cool, well-ventilated room. Apply coconut oil to feet before bed. Avoid spicy food at night. Drink cool (room temp) milk with saffron. Sleep by 10 PM.',
    exerciseAdvice: 'Exercise in the cooler parts of the day (early morning, evening). Swimming is ideal. Avoid intense midday workouts. Favor moderate, sustained exercise over competitive sports.',
    mentalAdvice: 'Practice cooling meditation techniques. Take breaks from intense work. Avoid conflict and criticism. Practice compassion and patience. Spend time in nature, especially near water.',
  },
  Kapha: {
    description: 'Kapha is the energy of structure — earth and water. You are steady, loyal, and compassionate. Like a mountain, you provide stability, strength, and nourishment to everyone around you.',
    element: 'Earth & Water',
    qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Dense'],
    strengths: ['Stability', 'Loyalty', 'Compassion', 'Endurance', 'Patience', 'Memory'],
    weaknesses: ['Lethargy', 'Depression', 'Attachment', 'Weight gain', 'Congestion', 'Procrastination'],
    balanceTips: [
      'Get moving — regular vigorous exercise is your #1 medicine',
      'Favor light, warm, spicy foods to counter heaviness',
      'Wake up early (before 6 AM) — the morning Kapha time is your window',
      'Reduce sleep to 6-7 hours — too much sleep increases Kapha',
      'Dry brush your skin before bathing (Garshana)',
      'Practice Kapalabhati and Bhastrika pranayama to energize',
    ],
    favorableFoods: [
      'Light grains (millet, buckwheat, barley)', 'Pungent spices (ginger, black pepper, mustard)',
      'Honey (raw, not heated)', 'Light soups', 'Leafy greens', 'Legumes (mung, lentils)',
      'Bitter and astringent tastes', 'Warm water with lemon', 'Steamed vegetables',
    ],
    unfavorableFoods: [
      'Dairy (especially cheese and ice cream)', 'Sugar and sweets', 'Cold foods and drinks',
      'Fried foods', 'Heavy grains (wheat in excess)', 'Red meat',
      'Nuts and seeds (in excess)', 'Processed foods', 'Sweet and salty tastes in excess',
    ],
    favorableActivities: [
      'Vigorous exercise (running, HIIT, cycling)', 'Hot yoga', 'Dancing',
      'Brisk walking', 'Rowing', 'Wrestling/martial arts', 'Climbing',
      'Vinyasa/Power yoga', 'Kapalabhati breathing', 'Dry brushing',
    ],
    sleepAdvice: 'Wake before 6 AM. Avoid napping. Sleep in a cool, dry room. Dry brush skin before bed. Drink hot water with ginger before sleep. Keep bedroom minimal and stimulating.',
    exerciseAdvice: 'Exercise vigorously every morning. Running, cycling, HIIT, power yoga. Exercise outdoors when possible. Avoid oversleeping — wake up early. Use Kapalabhati to start your practice.',
    mentalAdvice: 'Seek novelty and stimulation. Set challenging goals. Avoid isolation. Practice dynamic meditation (Kundalini). Engage in stimulating conversations. Take on leadership roles.',
  },
}

// ─── DAILY ROUTINE (DINACHARYA) ────────────────────────────────────────

export const dailyRoutine: RoutineStep[] = [
  {
    time: '04:30',
    title: 'Brahma Muhurta',
    description: 'The divine hour before dawn. Wake gently, lie on your back, and take a moment to set an intention for the day. This time is sacred for clarity and spiritual practice.',
    duration: '10 min',
    icon: '🌅',
    category: 'spirit',
  },
  {
    time: '04:45',
    title: 'Morning Elimination',
    description: 'Drink a glass of warm water. Your body naturally seeks to eliminate toxins accumulated overnight. Sit comfortably and allow nature to take its course. Do not rush.',
    duration: '15 min',
    icon: '💧',
    category: 'body',
  },
  {
    time: '05:00',
    title: 'Oil Pulling (Gandusha)',
    description: 'Swish 1 tablespoon of sesame or coconut oil in your mouth for 10-15 minutes. This draws toxins from the oral cavity, strengthens teeth, and freshens breath. Spit into a trash can, not the sink.',
    duration: '15 min',
    icon: '🫒',
    category: 'body',
  },
  {
    time: '05:15',
    title: 'Tongue Scraping (Jihva Prakshalana)',
    description: 'Use a copper tongue scraper to gently scrape your tongue from back to front, 7-14 times. This removes the ama (toxin) coating that builds overnight and stimulates digestion.',
    duration: '3 min',
    icon: '✨',
    category: 'body',
  },
  {
    time: '05:20',
    title: 'Nasal Cleansing (Neti)',
    description: 'Use a neti pot with warm saline water to rinse each nostril. This clears the sinuses, prevents congestion, and improves breathing. Follow with 3 drops of nasya (sesame oil) in each nostril.',
    duration: '5 min',
    icon: '👃',
    category: 'body',
  },
  {
    time: '05:30',
    title: 'Abhyanga (Self-Massage)',
    description: 'Massage warm oil into your entire body — scalp, ears, joints, and feet. Use sesame oil for Vata, coconut for Pitta, or mustard for Kapha. This nourishes the skin, calms the nervous system, and promotes deep sleep at night.',
    duration: '15 min',
    icon: '🧴',
    category: 'body',
  },
  {
    time: '05:45',
    title: 'Warm Bath or Shower',
    description: 'Take a warm shower to let the oil absorb. For Kapha types, end with a brief cool rinse. For Vata, keep it warm. For Pitta, use lukewarm water.',
    duration: '10 min',
    icon: '🚿',
    category: 'body',
  },
  {
    time: '06:00',
    title: 'Pranayama (Breathing)',
    description: 'Practice conscious breathing for 10-15 minutes. Nadi Shodhana (alternate nostril) balances all doshas. Kapalabhati energizes. Sheetali cools. Choose what your body needs today.',
    duration: '15 min',
    icon: '🫁',
    category: 'spirit',
  },
  {
    time: '06:15',
    title: 'Meditation (Dhyana)',
    description: 'Sit in a comfortable position with a straight spine. Close your eyes and focus on your breath. Start with 10 minutes and gradually increase. This is non-negotiable for mental health.',
    duration: '15 min',
    icon: '🧘',
    category: 'mind',
  },
  {
    time: '06:30',
    title: 'Yoga Asana Practice',
    description: 'Practice yoga postures suited to your dosha and current state. Morning is the best time for asana practice. Start with Sun Salutations, then move to standing and seated poses.',
    duration: '30-60 min',
    icon: '🧘‍♀️',
    category: 'body',
  },
  {
    time: '07:30',
    title: 'Morning Hydration',
    description: 'Drink a glass of warm water, optionally with lemon and a pinch of ginger. This ignites Agni (digestive fire) and prepares your body for breakfast. Wait 20-30 minutes before eating.',
    duration: '5 min',
    icon: '☕',
    category: 'nutrition',
  },
  {
    time: '08:00',
    title: 'Breakfast (Snana Kala)',
    description: 'Eat a warm, nourishing breakfast. This is the second meal of the day — eat when genuinely hungry. Kapha should eat a light breakfast. Vata and Pitta can have a moderate one.',
    duration: '20 min',
    icon: '🥣',
    category: 'nutrition',
  },
  {
    time: '10:00',
    title: 'Mid-Morning Check-in',
    description: 'Pause for 2 minutes. How is your energy? Hydrate with room-temperature water. This is a good time for creative work if you are a Vata. Pitta thrives in focused work. Kapha should stay active.',
    duration: '5 min',
    icon: '🔍',
    category: 'mind',
  },
  {
    time: '12:30',
    title: 'Lunch (Madhyahna)',
    description: 'Your largest meal of the day. Eat in a calm environment, seated, without screens. Chew thoroughly. The sun is strongest now, and your Agni (digestive fire) is at its peak.',
    duration: '30 min',
    icon: '🍽️',
    category: 'nutrition',
  },
  {
    time: '13:00',
    title: 'Post-Lunch Rest',
    description: 'A brief 10-20 minute rest after lunch. Do not sleep deeply — lie on your left side for best digestion. This resets the afternoon and prevents the 3 PM energy crash.',
    duration: '15 min',
    icon: '😴',
    category: 'rest',
  },
  {
    time: '15:00',
    title: 'Afternoon Movement',
    description: 'Take a 10-minute walk or do gentle stretching. This prevents the afternoon slump, aids digestion, and keeps your energy flowing. Even a short walk around the office works.',
    duration: '10-15 min',
    icon: '🚶',
    category: 'body',
  },
  {
    time: '16:00',
    title: 'Afternoon Snack (optional)',
    description: 'Only if genuinely hungry. A piece of fruit, a handful of nuts, or a light snack. Kapha should skip this. Vata benefits from a small snack. Pitta enjoys something cooling.',
    duration: '10 min',
    icon: '🍎',
    category: 'nutrition',
  },
  {
    time: '18:00',
    title: 'Evening Transition',
    description: 'Shift from activity to rest. Dim the lights. Reduce screen time. This is a natural transition period — respect it. Light a candle or play soft music to signal the change.',
    duration: '15 min',
    icon: '🕯️',
    category: 'spirit',
  },
  {
    time: '18:30',
    title: 'Evening Walk (Surya Setu)',
    description: 'A gentle walk during sunset is one of the most healing practices. It grounds Vata, cools Pitta, and gently moves Kapha. Walk in nature if possible. Practice gratitude.',
    duration: '15-30 min',
    icon: '🌅',
    category: 'body',
  },
  {
    time: '19:00',
    title: 'Dinner (Sayam Kala)',
    description: 'Eat a light, warm dinner at least 2-3 hours before sleep. Soups, khichdi, or steamed vegetables are ideal. Dinner should be the smallest meal. Skip if not hungry.',
    duration: '20 min',
    icon: '🍲',
    category: 'nutrition',
  },
  {
    time: '19:30',
    title: 'Evening Hygiene',
    description: 'Wash feet before bed — this is a simple but powerful Ayurvedic practice. The feet have many nerve endings and washing them promotes cool, deep sleep. Brush teeth with herbal toothpaste.',
    duration: '10 min',
    icon: '🦶',
    category: 'body',
  },
  {
    time: '20:00',
    title: 'Padabhyanga (Foot Massage)',
    description: 'Apply warm sesame or coconut oil to the soles of your feet. Massage gently for 5 minutes. Put on cotton socks. This promotes deep sleep, nourishes the nervous system, and grounds Vata.',
    duration: '10 min',
    icon: '🦶',
    category: 'body',
  },
  {
    time: '20:15',
    title: 'Evening Reflection',
    description: 'Write down 3 things you are grateful for from today. Reflect briefly on what went well and what could be better. This simple practice transforms mental health over time.',
    duration: '10 min',
    icon: '📝',
    category: 'mind',
  },
  {
    time: '20:30',
    title: 'Sleep Preparation',
    description: 'Turn off all screens. Dim lights. Apply a drop of Brahmi oil or lavender to the crown of your head. Read something inspiring or listen to calming music. Let the mind settle.',
    duration: '15 min',
    icon: '🌙',
    category: 'rest',
  },
  {
    time: '21:00 - 22:00',
    title: 'Deep Sleep (Sushupti Kala)',
    description: 'Ideally asleep by 10 PM. The hours before midnight are the most restorative for Pitta. Vata benefits from early sleep. Kapha should wake early and sleep early. Quality over quantity.',
    duration: '7-8 hrs',
    icon: '😴',
    category: 'rest',
  },
]

// ─── MEALS & RECIPES ────────────────────────────────────────────────────

export const mealPlans: Record<Dosha, { breakfast: Meal[]; lunch: Meal[]; dinner: Meal[]; snacks: Meal[] }> = {
  Vata: {
    breakfast: [
      {
        name: 'Warm Spiced Oatmeal',
        time: '08:00',
        foods: ['Oats', 'Ghee', 'Cinnamon', 'Dates', 'Almonds', 'Warm Milk'],
        description: 'Cook oats in milk with a spoon of ghee, cinnamon, chopped dates, and slivered almonds. This warm, moist, sweet bowl grounds Vata energy and provides sustained morning energy.',
        recipe: 'Cook 1/2 cup oats in 1 cup warm milk. Add 1 tsp ghee, 1/2 tsp cinnamon, 2 chopped dates, and 1 tbsp slivered almonds. Cook until creamy.',
        doshaFriendly: ['Vata'],
        season: ['winter', 'early_winter', 'autumn'],
        calories: 350,
        prepTime: '10 min',
        ingredients: ['1/2 cup rolled oats', '1 cup whole milk', '1 tsp ghee', '1/2 tsp cinnamon', '2 Medjool dates', '1 tbsp slivered almonds'],
      },
      {
        name: 'Banana Honey Toast',
        time: '08:00',
        foods: ['Whole Wheat Toast', 'Ghee', 'Banana', 'Honey', 'Cinnamon'],
        description: 'Warm whole wheat toast spread with ghee, topped with sliced banana, a drizzle of raw honey, and a pinch of cinnamon. Sweet, warm, and grounding.',
        doshaFriendly: ['Vata'],
        season: ['autumn', 'winter', 'early_winter'],
        calories: 320,
        prepTime: '5 min',
        ingredients: ['2 slices whole wheat bread', '1 tsp ghee', '1 ripe banana', '1 tsp raw honey', 'Pinch of cinnamon'],
      },
      {
        name: 'Stewed Apples with Spices',
        time: '08:00',
        foods: ['Apple', 'Ghee', 'Cinnamon', 'Cardamom', 'Raisins', 'Walnuts'],
        description: 'Stew diced apples in ghee with warming spices until soft. Top with raisins and walnuts. An Ayurvedic classic for morning Agni stimulation.',
        doshaFriendly: ['Vata', 'Kapha'],
        season: ['autumn', 'winter'],
        calories: 280,
        prepTime: '10 min',
        ingredients: ['1 apple, diced', '1 tsp ghee', '1/2 tsp cinnamon', '1/4 tsp cardamom', '1 tbsp raisins', '1 tbsp chopped walnuts'],
      },
    ],
    lunch: [
      {
        name: 'Kitchari (Comfort Bowl)',
        time: '12:30',
        foods: ['Basmati Rice', 'Yellow Mung Dal', 'Ghee', 'Turmeric', 'Cumin', 'Ginger', 'Vegetables'],
        description: 'The most healing food in Ayurveda. A warm, easy-to-digest blend of rice and mung dal, seasoned with turmeric, cumin, and ginger in ghee. This is complete nourishment.',
        recipe: 'Cook 1/2 cup basmati rice with 1/2 cup split mung dal, 4 cups water, 1 tsp turmeric, 1 tsp cumin seeds, 1 inch ginger, 2 tbsp ghee, and seasonal vegetables. Cook until soft and soupy.',
        doshaFriendly: ['Vata', 'Pitta', 'Kapha'],
        season: ['winter', 'spring', 'summer', 'autumn', 'early_winter'],
        calories: 400,
        prepTime: '30 min',
        ingredients: ['1/2 cup basmati rice', '1/2 cup split yellow mung dal', '4 cups water', '1 tsp turmeric', '1 tsp cumin seeds', '1 inch fresh ginger', '2 tbsp ghee', 'Seasonal vegetables'],
      },
      {
        name: 'Warm Vegetable Soup',
        time: '12:30',
        foods: ['Root Vegetables', 'Broth', 'Ghee', 'Cumin', 'Coriander', 'Fenugreek'],
        description: 'A hearty soup with sweet potato, carrot, and zucchini in a warming broth. Root vegetables are grounding and nourishing for Vata.',
        doshaFriendly: ['Vata'],
        season: ['winter', 'early_winter', 'autumn'],
        calories: 350,
        prepTime: '25 min',
        ingredients: ['1 sweet potato', '2 carrots', '1 zucchini', '4 cups vegetable broth', '1 tsp ghee', '1 tsp cumin', '1 tsp coriander'],
      },
    ],
    dinner: [
      {
        name: 'Mung Dal Soup',
        time: '19:00',
        foods: ['Split Mung Dal', 'Ghee', 'Turmeric', 'Ginger', 'Cumin', 'Lemon'],
        description: 'A light yet nourishing soup of mung dal with warming spices. Easy to digest, protein-rich, and perfect for evening when Vata is most vulnerable.',
        doshaFriendly: ['Vata', 'Pitta'],
        season: ['winter', 'autumn', 'spring'],
        calories: 280,
        prepTime: '25 min',
        ingredients: ['1 cup split mung dal', '4 cups water', '1 tsp turmeric', '1 inch ginger', '1 tsp cumin seeds', '1 tbsp ghee', 'Squeeze of lemon'],
      },
      {
        name: 'Khichdi with Vegetables',
        time: '19:00',
        foods: ['Rice', 'Mung Dal', 'Ghee', 'Vegetables', 'Ginger', 'Turmeric'],
        description: 'The lightest version of kitchari — soft rice and mung dal with gentle vegetables. Comfort food that heals.',
        doshaFriendly: ['Vata'],
        season: ['winter', 'autumn'],
        calories: 320,
        prepTime: '30 min',
        ingredients: ['1/3 cup basmati rice', '1/3 cup mung dal', '3 cups water', 'Mixed vegetables', '1 tsp ghee', 'Spices'],
      },
    ],
    snacks: [
      {
        name: 'Warm Almond Milk',
        time: '16:00',
        foods: ['Almond Milk', 'Cardamom', 'Saffron', 'Dates'],
        description: 'Warm almond milk with cardamom and saffron. A soothing, grounding drink that calms Vata.',
        doshaFriendly: ['Vata'],
        season: ['winter', 'autumn'],
        calories: 150,
        prepTime: '5 min',
        ingredients: ['1 cup almond milk', '1/4 tsp cardamom', 'Pinch of saffron', '1 date, blended'],
      },
    ],
  },
  Pitta: {
    breakfast: [
      {
        name: 'Cooling Coconut Rice Pudding',
        time: '08:00',
        foods: ['Basmati Rice', 'Coconut Milk', 'Cardamom', 'Saffron', 'Pistachios', 'Rose Water'],
        description: 'A cooling, sweet rice pudding with coconut milk, saffron, and rose water. This pacifies Pitta\'s internal heat while providing gentle morning nourishment.',
        recipe: 'Cook 1/2 cup rice in 1 cup coconut milk with cardamom and saffron. Cool slightly, add rose water and chopped pistachios.',
        doshaFriendly: ['Pitta'],
        season: ['summer', 'spring'],
        calories: 340,
        prepTime: '15 min',
        ingredients: ['1/2 cup basmati rice', '1 cup coconut milk', '1/4 tsp cardamom', 'Pinch of saffron', '1 tbsp chopped pistachios', '1 tsp rose water'],
      },
      {
        name: 'Sweet Berry Smoothie Bowl',
        time: '08:00',
        foods: ['Sweet Berries', 'Coconut Yogurt', 'Honey', 'Mint', 'Coconut Flakes'],
        description: 'A cooling smoothie bowl with sweet berries, coconut yogurt, and fresh mint. Light, refreshing, and perfect for hot Pitta mornings.',
        doshaFriendly: ['Pitta'],
        season: ['summer'],
        calories: 290,
        prepTime: '5 min',
        ingredients: ['1 cup sweet berries', '1/2 cup coconut yogurt', '1 tsp honey', 'Fresh mint', '1 tbsp coconut flakes'],
      },
    ],
    lunch: [
      {
        name: 'Cooling Cucumber Raita Bowl',
        time: '12:30',
        foods: ['Basmati Rice', 'Cucumber', 'Yogurt', 'Cilantro', 'Mint', 'Cumin', 'Ghee'],
        description: 'A cooling lunch of rice with cucumber raita — yogurt, grated cucumber, cumin, and fresh herbs. This is Pitta\'s ideal midday meal.',
        doshaFriendly: ['Pitta'],
        season: ['summer', 'spring'],
        calories: 380,
        prepTime: '20 min',
        ingredients: ['1 cup cooked basmati rice', '1/2 cup yogurt', '1/2 cucumber', 'Fresh cilantro', 'Fresh mint', '1 tsp cumin', '1 tsp ghee'],
      },
      {
        name: 'Kitchari with Coconut',
        time: '12:30',
        foods: ['Basmati Rice', 'Mung Dal', 'Coconut Milk', 'Cilantro', 'Fennel', 'Ghee'],
        description: 'A Pitta-pacifying kitchari with coconut milk and cooling fennel seeds. Gentle, nourishing, and heat-reducing.',
        doshaFriendly: ['Pitta', 'Vata'],
        season: ['summer', 'spring', 'winter'],
        calories: 400,
        prepTime: '30 min',
        ingredients: ['1/2 cup rice', '1/2 cup mung dal', '1 cup coconut milk', '1 tsp fennel', 'Fresh cilantro', '2 tbsp ghee'],
      },
    ],
    dinner: [
      {
        name: 'Sweet Coconut Soup',
        time: '19:00',
        foods: ['Coconut Milk', 'Sweet Potato', 'Lemongrass', 'Ginger', 'Lime'],
        description: 'A light, cooling soup with coconut milk and sweet potato. Subtle lemongrass and ginger add flavor without heating.',
        doshaFriendly: ['Pitta'],
        season: ['summer'],
        calories: 280,
        prepTime: '20 min',
        ingredients: ['1 cup coconut milk', '1 sweet potato', '1 stalk lemongrass', '1 inch ginger', 'Lime juice'],
      },
    ],
    snacks: [
      {
        name: 'Cooling Cucumber-Mint Water',
        time: '16:00',
        foods: ['Cucumber', 'Mint', 'Lime', 'Water'],
        description: 'Infused water with sliced cucumber, fresh mint, and a squeeze of lime. The simplest way to cool Pitta.',
        doshaFriendly: ['Pitta'],
        season: ['summer', 'spring'],
        calories: 10,
        prepTime: '2 min',
        ingredients: ['1/2 cucumber, sliced', '5-6 mint leaves', '1/2 lime', '1 glass cold water'],
      },
    ],
  },
  Kapha: {
    breakfast: [
      {
        name: 'Spiced Honey Water',
        time: '07:00',
        foods: ['Warm Water', 'Honey', 'Ginger', 'Black Pepper', 'Lemon'],
        description: 'Start with warm water with raw honey (never heated), fresh ginger, and a pinch of black pepper. This light, spicy drink ignites Agni and cuts through Kapha\'s morning heaviness.',
        recipe: 'Warm 1 cup water (not boiling). Add 1 tsp raw honey, 1 inch grated ginger, pinch of black pepper, squeeze of lemon. Stir well.',
        doshaFriendly: ['Kapha'],
        season: ['winter', 'spring', 'summer', 'autumn', 'early_winter'],
        calories: 60,
        prepTime: '3 min',
        ingredients: ['1 cup warm water', '1 tsp raw honey', '1 inch fresh ginger', 'Pinch black pepper', '1/2 lemon'],
      },
      {
        name: 'Light Millet Porridge',
        time: '08:00',
        foods: ['Millet', 'Honey', 'Ginger', 'Cardamom', 'Apple'],
        description: 'A light porridge of millet with warming spices and diced apple. Millet is one of the lightest grains and perfect for Kapha.',
        doshaFriendly: ['Kapha'],
        season: ['winter', 'spring'],
        calories: 250,
        prepTime: '15 min',
        ingredients: ['1/2 cup millet', '1.5 cups water', '1 tsp honey (after cooling)', '1/4 tsp ginger', '1/4 tsp cardamom', '1/2 apple, diced'],
      },
    ],
    lunch: [
      {
        name: 'Light Vegetable Stir-Fry',
        time: '12:30',
        foods: ['Broccoli', 'Bell Peppers', 'Ginger', 'Garlic', 'Black Pepper', 'Millet'],
        description: 'A light stir-fry of vegetables with pungent spices. This is warming, light, and moves Kapha\'s stagnation without adding heaviness.',
        doshaFriendly: ['Kapha'],
        season: ['winter', 'spring'],
        calories: 320,
        prepTime: '15 min',
        ingredients: ['1 cup broccoli', '1 bell pepper', '1 inch ginger', '2 cloves garlic', 'Black pepper', '1/2 cup millet'],
      },
      {
        name: 'Mung Bean Soup',
        time: '12:30',
        foods: ['Mung Beans', 'Turmeric', 'Black Pepper', 'Ginger', 'Garlic', 'Lemon'],
        description: 'A light, protein-rich soup of mung beans with warming spices. Mung is the lightest legume and excellent for Kapha.',
        doshaFriendly: ['Kapha', 'Pitta'],
        season: ['winter', 'spring', 'summer'],
        calories: 300,
        prepTime: '30 min',
        ingredients: ['1 cup mung beans', '4 cups water', '1 tsp turmeric', 'Black pepper', '1 inch ginger', '2 cloves garlic', 'Lemon juice'],
      },
    ],
    dinner: [
      {
        name: 'Light Vegetable Broth',
        time: '18:30',
        foods: ['Broth', 'Leafy Greens', 'Ginger', 'Turmeric', 'Black Pepper'],
        description: 'A simple, light broth with leafy greens and warming spices. Dinner should be minimal for Kapha — this provides nourishment without heaviness.',
        doshaFriendly: ['Kapha'],
        season: ['winter', 'spring'],
        calories: 150,
        prepTime: '15 min',
        ingredients: ['4 cups vegetable broth', '2 cups leafy greens', '1 inch ginger', '1/2 tsp turmeric', 'Black pepper'],
      },
    ],
    snacks: [
      {
        name: 'Warm Ginger Tea',
        time: '16:00',
        foods: ['Ginger', 'Honey', 'Black Pepper', 'Cinnamon'],
        description: 'A warming ginger tea with honey and spices. This stimulates metabolism and cuts through Kapha lethargy without adding calories.',
        doshaFriendly: ['Kapha'],
        season: ['winter', 'spring'],
        calories: 20,
        prepTime: '5 min',
        ingredients: ['1 inch fresh ginger', '1 cup boiling water', '1 tsp honey (after cooling)', 'Pinch black pepper', 'Pinch cinnamon'],
      },
    ],
  },
}

// ─── YOGA POSES ──────────────────────────────────────────────────────────

export const yogaPoses: YogaPose[] = [
  // Vata Balancing
  {
    name: 'Child\'s Pose',
    sanskrit: 'Balasana',
    description: 'Kneel, sit back on heels, fold forward with arms extended. Forehead rests on the ground. This deeply calming pose grounds Vata energy.',
    duration: '2-5 min',
    difficulty: 'beginner',
    benefits: ['Calms the nervous system', 'Relieves anxiety', 'Stretches the back', 'Promotes grounding'],
    doshaFriendly: ['Vata'],
    category: 'seated',
  },
  {
    name: 'Standing Forward Fold',
    sanskrit: 'Uttanasana',
    description: 'Stand with feet hip-width apart, fold forward from the hips. Let the head hang heavy. Bend knees slightly for Vata types.',
    duration: '1-3 min',
    difficulty: 'beginner',
    benefits: ['Calms the brain', 'Stretches hamstrings', 'Reduces stress', 'Grounding'],
    doshaFriendly: ['Vata', 'Pitta'],
    category: 'standing',
  },
  {
    name: 'Corpse Pose',
    sanskrit: 'Savasana',
    description: 'Lie flat on your back, arms at sides with palms up, legs slightly apart. Let the body be completely still. This is the deepest relaxation pose.',
    duration: '5-15 min',
    difficulty: 'beginner',
    benefits: ['Deep relaxation', 'Reduces anxiety', 'Integrates yoga practice', 'Calms the mind'],
    doshaFriendly: ['Vata', 'Pitta', 'Kapha'],
    category: 'supine',
  },
  {
    name: 'Tree Pose',
    sanskrit: 'Vrksasana',
    description: 'Stand on one leg, place the other foot on the inner thigh. Hands at heart center or overhead. This builds balance and focus.',
    duration: '1-2 min each side',
    difficulty: 'beginner',
    benefits: ['Improves balance', 'Strengthens legs', 'Builds focus', 'Grounding'],
    doshaFriendly: ['Vata', 'Kapha'],
    category: 'standing',
  },
  {
    name: 'Bridge Pose',
    sanskrit: 'Setu Bandhasana',
    description: 'Lie on your back, bend knees, feet flat. Lift hips toward ceiling. Hold and breathe. Opens the heart and grounds the lower body.',
    duration: '1-2 min',
    difficulty: 'beginner',
    benefits: ['Strengthens back', 'Opens chest', 'Calms anxiety', 'Improves circulation'],
    doshaFriendly: ['Vata', 'Kapha'],
    category: 'supine',
  },
  // Pitta Balancing
  {
    name: 'Moon Salutation',
    sanskrit: 'Chandra Namaskar',
    description: 'A cooling alternative to Sun Salutation. A flowing sequence of poses performed facing the moon or east. Moves through 14 postures in a calming rhythm.',
    duration: '10-15 min',
    difficulty: 'intermediate',
    benefits: ['Cools the body', 'Calms the mind', 'Balances hormones', 'Promotes emotional release'],
    doshaFriendly: ['Pitta'],
    category: 'standing',
  },
  {
    name: 'Seated Forward Fold',
    sanskrit: 'Paschimottanasana',
    description: 'Sit with legs extended, fold forward from the hips. Reach for your shins, ankles, or feet. This calms Pitta\'s fiery energy.',
    duration: '2-5 min',
    difficulty: 'beginner',
    benefits: ['Cools the body', 'Calms the mind', 'Stretches the spine', 'Soothes emotions'],
    doshaFriendly: ['Pitta', 'Vata'],
    category: 'seated',
  },
  {
    name: 'Supine Twist',
    sanskrit: 'Supta Matsyendrasana',
    description: 'Lie on your back, draw one knee across the body. Look opposite to the knee. A gentle twist that releases tension and cools the body.',
    duration: '2-3 min each side',
    difficulty: 'beginner',
    benefits: ['Releases tension', 'Aids digestion', 'Calms the nervous system', 'Improves spinal mobility'],
    doshaFriendly: ['Pitta', 'Vata'],
    category: 'supine',
  },
  // Kapha Energizing
  {
    name: 'Sun Salutation',
    sanskrit: 'Surya Namaskar',
    description: 'A dynamic 12-pose sequence that builds heat and energy. Each round should be performed with breath awareness. Start with 3 rounds and build to 12.',
    duration: '10-20 min',
    difficulty: 'intermediate',
    benefits: ['Energizes the body', 'Builds heat', 'Improves circulation', 'Strengthens all muscle groups'],
    doshaFriendly: ['Kapha'],
    category: 'standing',
  },
  {
    name: 'Warrior II',
    sanskrit: 'Virabhadrasana II',
    description: 'Stand with legs wide, one foot forward. Bend front knee, extend arms. Hold with strength and determination. This builds inner fire.',
    duration: '1-2 min each side',
    difficulty: 'beginner',
    benefits: ['Builds strength', 'Increases energy', 'Improves stamina', 'Builds confidence'],
    doshaFriendly: ['Kapha', 'Vata'],
    category: 'standing',
  },
  {
    name: 'Camel Pose',
    sanskrit: 'Ustrasana',
    description: 'Kneel, arch backward, reach for heels. Opens the entire front body. An energizing backbend that awakens Kapha energy.',
    duration: '30-60 sec',
    difficulty: 'intermediate',
    benefits: ['Opens the chest', 'Energizes', 'Improves posture', 'Stimulates endocrine system'],
    doshaFriendly: ['Kapha'],
    category: 'seated',
  },
  {
    name: 'Shoulder Stand',
    sanskrit: 'Sarvangasana',
    description: 'Lie on your back, lift legs and hips, supporting your back with your hands. Hold with legs vertical. This energizes and reverses blood flow.',
    duration: '1-3 min',
    difficulty: 'advanced',
    benefits: ['Stimulates thyroid', 'Energizes', 'Improves circulation', 'Calms the mind'],
    doshaFriendly: ['Kapha'],
    category: 'inverted',
  },
  // Universal
  {
    name: 'Cat-Cow Stretch',
    sanskrit: 'Marjaryasana-Bitilasana',
    description: 'On all fours, alternate between arching the back (cow) and rounding (cat). Synchronized with breath. Perfect warm-up for any dosha.',
    duration: '2-5 min',
    difficulty: 'beginner',
    benefits: ['Warms the spine', 'Improves flexibility', 'Calms the mind', 'Aids digestion'],
    doshaFriendly: ['Vata', 'Pitta', 'Kapha'],
    category: 'seated',
  },
  {
    name: 'Cobra Pose',
    sanskrit: 'Bhujangasana',
    description: 'Lie face down, place hands under shoulders, lift chest. Keep elbows slightly bent. Opens the heart and strengthens the spine.',
    duration: '30-60 sec',
    difficulty: 'beginner',
    benefits: ['Strengthens spine', 'Opens chest', 'Improves posture', 'Energizes'],
    doshaFriendly: ['Kapha', 'Vata'],
    category: 'prone',
  },
]

// ─── PRANAYAMA TECHNIQUES ───────────────────────────────────────────────

export const pranayamaTechniques: YogaPose[] = [
  {
    name: 'Alternate Nostril Breathing',
    sanskrit: 'Nadi Shodhana',
    description: 'Sit tall. Close right nostril with thumb, inhale through left. Close left nostril, exhale through right. Inhale right, close right, exhale left. This is the most balancing pranayama.',
    duration: '5-10 min',
    difficulty: 'beginner',
    benefits: ['Balances left and right brain', 'Calms the nervous system', 'Balances all doshas', 'Improves focus'],
    doshaFriendly: ['Vata', 'Pitta', 'Kapha'],
    category: 'breathing',
    contraindications: ['Severe congestion'],
  },
  {
    name: 'Skull Shining Breath',
    sanskrit: 'Kapalabhati',
    description: 'Sit tall with a straight spine. Take a deep breath in, then exhale sharply through the nose while pulling the belly in. Inhale passively. Start with 30 pumps, build to 100.',
    duration: '3-5 min',
    difficulty: 'intermediate',
    benefits: ['Energizes the mind', 'Clears sinuses', 'Stimulates digestion', 'Builds inner fire'],
    doshaFriendly: ['Kapha', 'Vata'],
    category: 'breathing',
    contraindications: ['Pregnancy', 'High blood pressure', 'Heart disease', 'Pitta imbalance (use cautiously)'],
  },
  {
    name: 'Cooling Breath',
    sanskrit: 'Sheetali',
    description: 'Curl your tongue into a tube (or purse lips if you cannot). Inhale through the rolled tongue, close mouth, exhale through nose. Repeat. This literally cools the body.',
    duration: '3-5 min',
    difficulty: 'beginner',
    benefits: ['Cools the body', 'Reduces Pitta', 'Calms anger', 'Hydrates the body'],
    doshaFriendly: ['Pitta'],
    category: 'breathing',
    contraindications: ['Low blood pressure (use cautiously)'],
  },
  {
    name: 'Ocean Breath',
    sanskrit: 'Ujjayi',
    description: 'Constrict the back of the throat slightly while breathing, creating a soft ocean sound. Inhale and exhale through the nose with this constriction. Used throughout yoga practice.',
    duration: '5-20 min',
    difficulty: 'beginner',
    benefits: ['Calms the mind', 'Builds internal heat', 'Improves focus', 'Regulates energy'],
    doshaFriendly: ['Vata', 'Pitta', 'Kapha'],
    category: 'breathing',
  },
  {
    name: 'Bellows Breath',
    sanskrit: 'Bhastrika',
    description: 'Like Kapalabhati but with active inhales too. Pump the belly rapidly — inhale and exhale both with force. Start with 10 rounds, build slowly. The most energizing pranayama.',
    duration: '3-5 min',
    difficulty: 'advanced',
    benefits: ['Maximum energy boost', 'Clears mental fog', 'Stimulates all systems', 'Builds intense heat'],
    doshaFriendly: ['Kapha'],
    category: 'breathing',
    contraindications: ['Pitta imbalance', 'Pregnancy', 'High blood pressure', 'Heart disease', 'Ulcers'],
  },
  {
    name: 'Humming Bee Breath',
    sanskrit: 'Bhramari',
    description: 'Close ears with thumbs, place fingers over eyes. Inhale deeply, then exhale with a long, steady humming sound like a bee. This deeply calms the mind.',
    duration: '5-10 min',
    difficulty: 'beginner',
    benefits: ['Deeply calming', 'Reduces anxiety', 'Improves sleep', 'Relieves tension'],
    doshaFriendly: ['Vata', 'Pitta'],
    category: 'breathing',
  },
]

// ─── SEASONAL TIPS ──────────────────────────────────────────────────────

export const seasonalTips: SeasonalTip[] = [
  {
    season: 'Spring (Basant)',
    title: 'Spring Renewal — Detox & Rebirth',
    description: 'Spring is Kapha season — the body naturally wants to cleanse. Mucus accumulates, allergies flare, and energy may feel sluggish. This is the perfect time for a gentle detox.',
    doshaAdvice: {
      Vata: 'Spring brings moisture that can increase Vata. Favor warm, light foods. Practice gentle detoxing with herbal teas. Avoid raw foods.',
      Pitta: 'Spring\'s warmth can start building Pitta. Stay cool with cucumber and mint. Enjoy outdoor activities in the morning.',
      Kapha: 'Spring is your most challenging season. Wake early, exercise vigorously, eat light and warm. This is your detox season.',
    },
    foods: ['Bitter greens (dandelion, arugula)', 'Honey (raw)', 'Light grains (millet, barley)', 'Pungent spices (ginger, pepper)', 'Sprouts', 'Lentils'],
    activities: ['Brisk morning walks', 'Dry brushing (Garshana)', 'Steam therapy', 'Nasal irrigation (Neti)', 'Light yoga', 'Hiking in nature'],
    avoid: ['Dairy (especially cold)', 'Heavy fried foods', 'Sugar and sweets', 'Wheat in excess', 'Cold drinks', 'Napping during the day'],
  },
  {
    season: 'Summer (Grishma)',
    title: 'Summer Cooling — Protect Your Inner Fire',
    description: 'Summer is Pitta season — heat builds in the body and mind. Stay cool, hydrated, and calm. This is the time to enjoy life\'s sweetness without burning out.',
    doshaAdvice: {
      Vata: 'Summer\'s heat can dry Vata further. Stay hydrated with coconut water. Enjoy evening walks. Favor moist, cooling foods.',
      Pitta: 'This is your most challenging season. Stay cool in every way — food, activity, emotions. Avoid midday sun and spicy food.',
      Kapha: 'Summer is your best season. The heat balances your cold nature. Stay active and enjoy the outdoors. Eat fresh seasonal fruits.',
    },
    foods: ['Coconut water', 'Watermelon', 'Cucumber', 'Sweet grapes', 'Fresh mint', 'Aloe vera juice', 'Cool dairy (in moderation)', 'Sweet berries'],
    activities: ['Swimming', 'Moonlight walks', 'Morning yoga before sunrise', 'Meditation in nature', 'Gentle hiking', 'Reading in shade'],
    avoid: ['Spicy food', 'Alcohol', 'Coffee', 'Midday sun', 'Intense exercise in heat', 'Sour and fermented foods', 'Arguments'],
  },
  {
    season: 'Autumn (Sharad)',
    title: 'Autumn Grounding — Balance the Wind',
    description: 'Autumn is Vata season — the air becomes cool, dry, and windy. Vata people may feel anxious, scattered, or ungrounded. This is the time to warm, moisten, and ground.',
    doshaAdvice: {
      Vata: 'This is your most challenging season. Double down on routine. Warm, moist foods. Oil massage daily. Early bedtime.',
      Pitta: 'Autumn\'s cooling nature soothes your summer fire. Enjoy the relief. Favor warm, grounding foods as the cold sets in.',
      Kapha: 'Autumn\'s dryness can aggravate Kapha. Stay active. Favor warm, light foods. Avoid heaviness.',
    },
    foods: ['Warm soups and stews', 'Root vegetables', 'Sweet fruits', 'Ghee', 'Warm spiced milk', 'Dates and figs', 'Cooked grains', 'Nuts'],
    activities: ['Warm oil massage (Abhyanga)', 'Grounding yoga (forward folds)', 'Nature walks', 'Fire pit gatherings', 'Journaling', 'Warm baths'],
    avoid: ['Raw foods', 'Cold drinks', 'Wind exposure', 'Irregular schedule', 'Late nights', 'Overstimulation', 'Travel (if Vata)'],
  },
  {
    season: 'Early Winter (Hemanta)',
    title: 'Early Winter Nourishment — Build Your reserves',
    description: 'Early winter is Kapha season with cold, damp energy. The body naturally wants to nourish and build. This is the time for warm, nourishing foods and building strength.',
    doshaAdvice: {
      Vata: 'Winter\'s cold can increase Vata. Layer up, eat warm foods, practice daily oil massage. Protect your warmth.',
      Pitta: 'Winter is comfortable for you. Enjoy hearty meals and moderate exercise. Stay warm but not overheated.',
      Kapha: 'Winter can increase congestion and heaviness. Exercise regularly, eat warm and light, avoid dairy and sweets.',
    },
    foods: ['Hearty soups and stews', 'Whole grains', 'Root vegetables', 'Ghee', 'Nuts and seeds', 'Warming spices (cinnamon, ginger, cardamom)', 'Bone broth', 'Sweet potatoes'],
    activities: ['Yoga in a warm room', 'Indoor exercise', 'Warm baths with essential oils', 'Cozy gatherings', 'Gentle massage', 'Meditation by fire'],
    avoid: ['Cold and raw foods', 'Ice water', 'Overeating', 'Late nights', 'Sedentary lifestyle', 'Skipping warm-up before exercise'],
  },
  {
    season: 'Late Winter (Shishira)',
    title: 'Late Winter Awakening — Prepare for Spring',
    description: 'Late winter is the transition from Kapha buildup to spring\'s renewal. The body has accumulated energy — now is the time to begin gentle cleansing to prepare for spring.',
    doshaAdvice: {
      Vata: 'The cold is ending — relief is coming. Begin to lighten your diet slightly. Add more warm water and herbal teas.',
      Pitta: 'You may feel a slight increase in internal heat as spring approaches. Start incorporating more cooling foods again.',
      Kapha: 'This is your cleansing time. Begin reducing heavy foods, increase exercise, and prepare for spring detox.',
    },
    foods: ['Light soups', 'Steamed vegetables', 'Herbal teas (ginger, tulsi)', 'Honey', 'Light grains (barley, millet)', 'Bitter greens beginning'],
    activities: ['Begin outdoor exercise', 'Morning walks', 'Dry brushing', 'Steam inhalation', 'Yoga intensification', 'Begin spring cleaning (physical and mental)'],
    avoid: ['Heavy, oily foods', 'Dairy (especially cold)', 'Sugar', 'Sedentary behavior', 'Excessive sleep', 'Processed foods'],
  },
]

// ─── REMEDIES DATABASE ──────────────────────────────────────────────────

export const remediesDatabase: Remedy[] = [
  {
    condition: 'Headache',
    remedy: 'Apply a paste of sandalwood powder and rose water to the forehead. Practice Sheetali pranayama. Drink warm water with fennel seeds.',
    ingredients: ['Sandalwood powder', 'Rose water', 'Fennel seeds', 'Warm water'],
    preparation: 'Mix sandalwood powder with rose water to form a paste. Apply to forehead and temples. Rest in a dark room.',
    dosage: 'Apply paste as needed. Drink 1 cup fennel tea.',
    precautions: 'If headache persists more than 3 days or is severe, consult a doctor.',
    doshaType: ['Pitta', 'Vata'],
    severity: 'mild',
  },
  {
    condition: 'Cold',
    remedy: 'Steam inhalation with eucalyptus oil. Drink hot ginger-tulsi tea. Apply sesame oil to the chest and soles of feet before bed.',
    ingredients: ['Eucalyptus oil', 'Fresh ginger', 'Tulsi leaves', 'Sesame oil', 'Water'],
    preparation: 'Boil water, add 3-4 drops eucalyptus oil. Inhale steam for 10 minutes. Boil ginger and tulsi for tea.',
    dosage: 'Steam 2-3 times daily. Drink 2-3 cups of ginger-tulsi tea.',
    precautions: 'Avoid cold foods and drinks. Rest well. If fever develops, see a doctor.',
    doshaType: ['Vata', 'Kapha'],
    severity: 'mild',
  },
  {
    condition: 'Fever',
    remedy: 'Drink tulsi-ginger-tea with honey. Apply sandalwood paste to forehead. Stay hydrated with warm water. Rest completely.',
    ingredients: ['Tulsi leaves', 'Fresh ginger', 'Honey', 'Sandalwood powder', 'Water'],
    preparation: 'Boil tulsi and ginger in water for 5 minutes. Strain, add honey when warm (not hot). Apply sandalwood paste to forehead.',
    dosage: 'Drink tea every 2-3 hours. Apply paste as needed.',
    precautions: 'If fever exceeds 103°F or lasts more than 2 days, seek medical attention immediately.',
    doshaType: ['Pitta'],
    severity: 'moderate',
  },
  {
    condition: 'Indigestion',
    remedy: 'Drink warm water with lemon and a pinch of ginger powder. Chew on fennel seeds after meals. Avoid cold foods and eating when stressed.',
    ingredients: ['Lemon', 'Fresh ginger or ginger powder', 'Fennel seeds', 'Warm water'],
    preparation: 'Squeeze half a lemon in warm water, add 1/4 tsp ginger powder. Drink before meals. Keep fennel seeds handy.',
    dosage: 'Drink 1 cup before meals. Chew 1 tsp fennel seeds after meals.',
    precautions: 'Eat slowly, chew thoroughly. Avoid eating when emotionally disturbed.',
    doshaType: ['Vata', 'Kapha'],
    severity: 'mild',
  },
  {
    condition: 'Anxiety',
    remedy: 'Practice Nadi Shodhana pranayama for 10 minutes. Drink warm milk with nutmeg and cardamom before bed. Apply Brahmi oil to the crown of the head.',
    ingredients: ['Warm milk', 'Nutmeg', 'Cardamom', 'Brahmi oil', 'Sesame oil'],
    preparation: 'Warm milk with 1/4 tsp nutmeg and a pinch of cardamom. Apply 2-3 drops of Brahmi oil to the crown of the head and massage gently.',
    dosage: 'Practice pranayama daily. Drink warm milk nightly. Apply Brahmi oil 3-4 times a week.',
    precautions: 'If anxiety is severe or persistent, seek professional help alongside these remedies.',
    doshaType: ['Vata'],
    severity: 'moderate',
  },
  {
    condition: 'Insomnia',
    remedy: 'Apply warm sesame oil to the soles of the feet before bed. Drink warm milk with nutmeg. Practice Sheetali pranayama. Keep a consistent sleep schedule.',
    ingredients: ['Sesame oil', 'Warm milk', 'Nutmeg', 'Lavender oil'],
    preparation: 'Massage warm sesame oil into soles for 5 minutes. Put on cotton socks. Warm milk with 1/4 tsp nutmeg.',
    dosage: 'Oil massage nightly. Drink milk 30 min before bed.',
    precautions: 'Avoid screens 1 hour before bed. Keep bedroom cool and dark.',
    doshaType: ['Vata', 'Pitta'],
    severity: 'moderate',
  },
  {
    condition: 'Joint Pain',
    remedy: 'Massage with warm sesame oil and camphor. Drink turmeric milk (golden milk). Apply warm compress to affected area. Practice gentle yoga.',
    ingredients: ['Sesame oil', 'Camphor', 'Turmeric', 'Milk', 'Ginger'],
    preparation: 'Warm sesame oil with a pinch of camphor. Massage into joints. Golden milk: warm milk with 1/2 tsp turmeric and pinch of ginger.',
    dosage: 'Oil massage daily. Drink golden milk before bed.',
    precautions: 'Avoid cold and damp conditions. Keep joints warm and moving.',
    doshaType: ['Vata'],
    severity: 'moderate',
  },
  {
    condition: 'Acidity',
    remedy: 'Drink cool (room temp) water with a tsp of raw coriander powder. Eat ripe banana. Avoid spicy, sour, and fried foods. Practice Sheetali pranayama.',
    ingredients: ['Coriander powder', 'Ripe banana', 'Water', 'Coconut water'],
    preparation: 'Soak 1 tbsp coriander seeds in water overnight, drink in the morning. Or mix 1 tsp coriander powder in room-temp water.',
    dosage: 'Drink coriander water daily until acidity resolves.',
    precautions: 'Avoid eating late at night. Reduce coffee, alcohol, and spicy food.',
    doshaType: ['Pitta'],
    severity: 'mild',
  },
  {
    condition: 'Fatigue',
    remedy: 'Start the day with Kapalabhati pranayama (3 rounds of 30). Drink warm water with lemon and honey. Eat iron-rich foods (dates, pomegranate). Take a short walk after lunch.',
    ingredients: ['Lemon', 'Honey', 'Dates', 'Pomegranate', 'Warm water'],
    preparation: 'Morning: Kapalabhati practice. Then warm water with lemon juice and 1 tsp honey. Include dates and pomegranate in your diet.',
    dosage: 'Practice Kapalabhati daily. Drink lemon water every morning.',
    precautions: 'If fatigue persists more than 2 weeks, get blood work done to rule out medical conditions.',
    doshaType: ['Kapha', 'Vata'],
    severity: 'mild',
  },
  {
    condition: 'Back Pain',
    remedy: 'Apply warm castor oil pack to the lower back. Practice Cat-Cow and Bhujangasana (Cobra). Drink ginger tea. Rest but stay gently mobile.',
    ingredients: ['Castor oil', 'Old towel', 'Hot water bottle', 'Ginger', 'Water'],
    preparation: 'Apply warm castor oil to lower back, cover with towel, place hot water bottle on top. Rest for 20 minutes.',
    dosage: 'Oil pack 3-4 times a week. Practice yoga daily.',
    precautions: 'Avoid heavy lifting. If pain radiates down the leg, see a doctor immediately.',
    doshaType: ['Vata'],
    severity: 'moderate',
  },
  {
    condition: 'Skin Problems',
    remedy: 'Apply turmeric and sandalwood paste to affected area. Drink aloe vera juice. Eat bitter greens. Use coconut oil for moisturizing. Avoid spicy and fried foods.',
    ingredients: ['Turmeric', 'Sandalwood powder', 'Aloe vera juice', 'Coconut oil', 'Bitter greens'],
    preparation: 'Mix turmeric and sandalwood with water or rose water to form paste. Apply to skin for 15-20 minutes.',
    dosage: 'Apply paste 2-3 times a week. Drink aloe vera juice daily.',
    precautions: 'If skin condition is severe, spreading, or painful, consult a dermatologist.',
    doshaType: ['Pitta'],
    severity: 'moderate',
  },
  {
    condition: 'Allergies',
    remedy: 'Practice Neti (nasal irrigation) daily. Drink warm water with honey and turmeric. Apply sesame oil inside nostrils. Include ginger and black pepper in diet.',
    ingredients: ['Neti pot', 'Non-iodized salt', 'Warm water', 'Honey', 'Turmeric', 'Sesame oil'],
    preparation: 'Neti: dissolve 1/4 tsp salt in 1 cup warm water. Rinse each nostril gently. Apply 2 drops sesame oil in each nostril after.',
    dosage: 'Neti daily during allergy season. Drink turmeric-honey water twice daily.',
    precautions: 'Use distilled or boiled (then cooled) water for Neti. Never use tap water directly.',
    doshaType: ['Kapha', 'Vata'],
    severity: 'mild',
  },
]

// ─── CHAT COACH RESPONSES ───────────────────────────────────────────────

export const coachResponses: Record<string, { greeting: string; followUp: string[] }> = {
  morning: {
    greeting: 'Good morning! 🌅 The sun has risen and so should you. How did you sleep last night?',
    followUp: [
      'Remember, your morning routine is the foundation of your entire day. Take it slowly.',
      'Start with warm water — your Agni needs to be awakened gently.',
      'The first hour of your day sets the tone. Make it sacred.',
    ],
  },
  afternoon: {
    greeting: 'Good afternoon! ☀️ You\'re at the peak of your day. How is your energy flowing?',
    followUp: [
      'Lunch should be your biggest meal now. Your Agni is strongest.',
      'A brief rest after lunch will prevent the afternoon crash.',
      'If you feel sluggish, a short walk can do wonders.',
    ],
  },
  evening: {
    greeting: 'Good evening! 🌆 The day is winding down. How are you feeling?',
    followUp: [
      'Time to shift from doing to being. Reduce stimulation.',
      'A light dinner will help you sleep deeply tonight.',
      'The evening walk is medicine for both body and mind.',
    ],
  },
  night: {
    greeting: 'Good night! 🌙 The stars are out. It\'s time to prepare for rest.',
    followUp: [
      'Your body heals during sleep. Honor this with a proper wind-down.',
      'Oil your feet and let the day go.',
      'Tomorrow starts tonight. A good night\'s sleep is the best gift you can give yourself.',
    ],
  },
}

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────

export function getCurrentTimePeriod(): TimeOfDay {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 6) return 'brahma_muhurta'
  if (hour >= 6 && hour < 10) return 'morning'
  if (hour >= 10 && hour < 12) return 'mid_morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good night'
}

export function getSeason(): Season {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 9) return 'autumn'
  if (month >= 10 && month <= 10) return 'early_winter'
  return 'late_winter'
}

export function calculateDoshaType(scores: Record<Dosha, number>): Dosha {
  const max = Math.max(...Object.values(scores))
  const dominant = Object.entries(scores).find(([, v]) => v === max)
  return dominant ? (dominant[0] as Dosha) : 'Vata'
}

export function getDoshaBalance(dosha: Dosha): number {
  const balances: Record<Dosha, number> = { Vata: 60, Pitta: 30, Kapha: 10 }
  return balances[dosha]
}

export function getAgniStatus(hour: number): string {
  if (hour >= 6 && hour < 10) return 'Kapha Agni — Gentle, building'
  if (hour >= 10 && hour < 14) return 'Pitta Agni — Peak digestive fire 🔥'
  if (hour >= 14 && hour < 18) return 'Vata Agni — Light, airy, declining'
  return 'Agni resting — eat lightly or not at all'
}

export function getTimeOfDayAdvice(dosha: Dosha, hour: number): string {
  if (hour >= 5 && hour < 7) {
    if (dosha === 'Vata') return 'Wake gently. Drink warm water. Your body is sensitive right now — move slowly.'
    if (dosha === 'Pitta') return 'Rise with the sun. Your energy builds early. Start with cooling breath.'
    return 'Wake before 6 AM. Your body wants to sleep in — resist gently. Move your body.'
  }
  if (hour >= 7 && hour < 9) {
    if (dosha === 'Vata') return 'Ground yourself with warm food and gentle movement. Avoid screens.'
    if (dosha === 'Pitta') return 'You\'re in your power hour. Channel it wisely — don\'t rush into stress.'
    return 'Light breakfast or just warm water with honey. Your Agni is still low.'
  }
  if (hour >= 10 && hour < 12) {
    return 'Your mind is sharpest now. Do your most important work. Stay hydrated.'
  }
  if (hour >= 12 && hour < 14) {
    return 'Lunch time! Eat your largest meal now. Sit quietly. No screens while eating.'
  }
  if (hour >= 15 && hour < 17) {
    if (dosha === 'Kapha') return 'The afternoon slump is real for you. Get up, move, breathe deeply.'
    return 'Check in with yourself. How is your energy? A brief walk refreshes everything.'
  }
  if (hour >= 18 && hour < 20) {
    return 'Begin your evening transition. Dim lights. Light dinner. Wind down.'
  }
  if (hour >= 20 && hour < 22) {
    return 'Screens off. Oil your feet. Journal. Let the day go. Sleep calls.'
  }
  return 'Rest now. Your body heals while you sleep. Trust the process.'
}
