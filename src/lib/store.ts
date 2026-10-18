import type { UserProfile, DailyLog, Dosha } from './data'

const USER_KEY = 'jaya_user_profile'
const LOGS_KEY = 'jaya_daily_logs'
const AUTH_KEY = 'jaya_auth_session'
const GOALS_KEY = 'jaya_goals'
const POPUP_KEY = 'jaya_popup_state'
const ROUTINE_KEY = 'jaya_routine_progress'
const MEAL_KEY = 'jaya_meal_confirmations'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked — the app keeps working from memory */
  }
}

export function todayKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

// ─── PROFILE ─────────────────────────────────────────────────────────────

export function getUserProfile(): UserProfile | null {
  return read<UserProfile | null>(USER_KEY, null)
}

export function saveUserProfile(profile: UserProfile): void {
  write(USER_KEY, profile)
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

export function createDefaultProfile(): UserProfile {
  return {
    name: '',
    email: '',
    age: 30,
    gender: 'other',
    weight: 65,
    height: 170,
    doshaType: null,
    doshaScores: { Vata: 0, Pitta: 0, Kapha: 0 },
    wakeTime: '06:00',
    sleepTime: '22:00',
    location: '',
    region: 'south',
    profession: 'software_engineer',
    healthGoals: [],
    allergies: [],
    activityLevel: 'moderate',
    completedOnboarding: false,
    createdAt: new Date().toISOString(),
  }
}

export const DEMO_PROFILE: UserProfile = {
  name: 'Arjun',
  email: 'arjun@demo.jaya',
  age: 28,
  gender: 'male',
  weight: 75,
  height: 175,
  doshaType: 'Pitta',
  doshaScores: { Vata: 18, Pitta: 44, Kapha: 13 },
  wakeTime: '06:30',
  sleepTime: '22:30',
  location: 'Bengaluru, India',
  region: 'south',
  profession: 'software_engineer',
  healthGoals: ['Better Sleep', 'Reduce Stress', 'Increase Energy'],
  allergies: [],
  activityLevel: 'light',
  completedOnboarding: true,
  createdAt: new Date().toISOString(),
}

// ─── AUTH ────────────────────────────────────────────────────────────────

export interface AuthSession {
  name: string
  email: string
  mode: 'account' | 'guest' | 'demo'
  signedInAt: string
}

export function getSession(): AuthSession | null {
  return read<AuthSession | null>(AUTH_KEY, null)
}

export function saveSession(session: AuthSession): void {
  write(AUTH_KEY, session)
}

export function signOutSession(): void {
  try {
    localStorage.removeItem(AUTH_KEY)
  } catch {
    /* ignore */
  }
}

// ─── GOALS ───────────────────────────────────────────────────────────────

export interface Goal {
  id: string
  title: string
  icon: string
  target: number
  unit: string
  progress: number
  streak: number
  benefit: string
  createdAt: string
}

export function getGoals(): Goal[] {
  return read<Goal[]>(GOALS_KEY, [])
}

export function saveGoals(goals: Goal[]): void {
  write(GOALS_KEY, goals)
}

// ─── POPUPS ──────────────────────────────────────────────────────────────

export type HandledState = 'done' | 'skipped' | 'snoozed'

export function getPopupHandled(date: string = todayKey()): Record<string, HandledState> {
  const all = read<Record<string, Record<string, HandledState>>>(POPUP_KEY, {})
  return all[date] ?? {}
}

export function markPopupHandled(id: string, state: HandledState, date: string = todayKey()): void {
  const all = read<Record<string, Record<string, HandledState>>>(POPUP_KEY, {})
  all[date] = { ...(all[date] ?? {}), [id]: state }
  write(POPUP_KEY, all)
}

export function resetPopup(id: string, date: string = todayKey()): void {
  const all = read<Record<string, Record<string, HandledState>>>(POPUP_KEY, {})
  if (all[date]) {
    delete all[date][id]
    write(POPUP_KEY, all)
  }
}

// ─── ROUTINE ─────────────────────────────────────────────────────────────

export type RoutineState = 'done' | 'skipped'

export function getRoutineProgress(date: string = todayKey()): Record<string, RoutineState> {
  const all = read<Record<string, Record<string, RoutineState>>>(ROUTINE_KEY, {})
  return all[date] ?? {}
}

export function saveRoutineProgress(
  entries: Record<string, RoutineState>,
  date: string = todayKey(),
): void {
  const all = read<Record<string, Record<string, RoutineState>>>(ROUTINE_KEY, {})
  all[date] = entries
  write(ROUTINE_KEY, all)
}

// ─── MEALS ───────────────────────────────────────────────────────────────

export type MealState = 'done' | 'different' | 'skipped'

export interface MealConfirmation {
  slots: Record<string, MealState>
  actual: Record<string, string>
}

export function getMealConfirmation(date: string = todayKey()): MealConfirmation {
  const all = read<Record<string, MealConfirmation>>(MEAL_KEY, {})
  return all[date] ?? { slots: {}, actual: {} }
}

export function saveMealConfirmation(
  confirmation: MealConfirmation,
  date: string = todayKey(),
): void {
  const all = read<Record<string, MealConfirmation>>(MEAL_KEY, {})
  all[date] = confirmation
  write(MEAL_KEY, all)
}

// ─── DAILY LOG ───────────────────────────────────────────────────────────

export function getDailyLogs(): DailyLog[] {
  return read<DailyLog[]>(LOGS_KEY, [])
}

export function getTodayLog(date: Date = new Date()): DailyLog {
  const today = todayKey(date)
  const logs = getDailyLogs()
  const existing = logs.find(l => l.date === today)
  if (existing) return existing

  return {
    date: today,
    meals: [],
    waterIntake: 0,
    sleepQuality: 5,
    sleepHours: 7,
    energyLevels: { morning: 5, afternoon: 5, evening: 5 },
    mood: 'balanced',
    activities: [],
    yogaMinutes: 0,
    pranayamaMinutes: 0,
    meditationMinutes: 0,
    exerciseMinutes: 0,
    notes: '',
    doshaBalance: { Vata: 33, Pitta: 33, Kapha: 34 },
  }
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs()
  const idx = logs.findIndex(l => l.date === log.date)
  if (idx >= 0) logs[idx] = log
  else logs.push(log)
  write(LOGS_KEY, logs)
}

export function getLast7DaysLogs(): DailyLog[] {
  const logs = getDailyLogs()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return logs
    .filter(l => new Date(l.date) >= weekAgo)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function doshaPercentages(profile: UserProfile): Record<Dosha, number> {
  const { Vata, Pitta, Kapha } = profile.doshaScores
  const total = Vata + Pitta + Kapha || 1
  return {
    Vata: Math.round((Vata / total) * 100),
    Pitta: Math.round((Pitta / total) * 100),
    Kapha: Math.round((Kapha / total) * 100),
  }
}
