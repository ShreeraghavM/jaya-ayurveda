// src/lib/activityEngine.ts
// Physical Activity, Walking/Running Sessions, and Ardha-Shakti Heart Rate Safety Engine
// Grounded in Charaka Samhita: Sutra Sthana 7.31-35 (Vyayama & Ardha-Shakti)

import type { Dosha, UserProfile } from './data'

export type ActivityType = 'walking' | 'running'

export interface ActivityWorkoutSession {
  id: string
  timestamp: string
  type: ActivityType
  durationSeconds: number
  distanceKm: number
  steps: number
  avgPaceMinKm: number
  avgCadenceStepsPerMin: number
  estimatedCaloriesBurned: number
  avgHeartRateBpm: number
  ardhaShaktiExceeded: boolean
  cessationSignObserved?: 'Vaktram Prapadyate (Mouth Breathing)' | 'Lalate Sveda (Forehead Sweat)' | 'None'
  notes?: string
}

export interface DailyActivitySummary {
  date: string
  currentSteps: number
  dailyStepGoal: number
  stepGoalCompletionPct: number
  totalActiveMinutes: number
  totalDistanceKm: number
  totalCaloriesBurned: number
  doshaPacingAdvice: string
  ardhaShaktiSafeHrZone: {
    minHr: number // 50% max HR
    targetHr: number // 65% max HR
    maxSafeHr: number // 70% max HR
  }
  recentWorkouts: ActivityWorkoutSession[]
}

const STORAGE_KEY_ACTIVITY = 'jaya_ayurveda_activity_summary'

/**
 * Returns classical Ayurvedic daily step targets calibrated to constitution.
 */
export function getDoshaStepGoal(dosha: Dosha): number {
  switch (dosha) {
    case 'Kapha':
      // Kapha requires vigorous movement to disperse cold lymphatic stagnation
      return 10000
    case 'Pitta':
      // Pitta needs moderate, cooling pacing without competitive exhaustion
      return 7500
    case 'Vata':
    default:
      // Vata needs gentle, grounding walk to preserve synovial fluid without burning Ojas
      return 6000
  }
}

/**
 * Calculates Ardha-Shakti safe heart rate zones based on age.
 */
export function calculateSafeHeartRateZone(age: number) {
  const maxHr = 220 - (age > 5 ? age : 28)
  return {
    maxHr,
    minHr: Math.round(maxHr * 0.50),
    targetHr: Math.round(maxHr * 0.65),
    maxSafeHr: Math.round(maxHr * 0.70),
  }
}

/**
 * Calculates calories burned during walking or running session.
 */
export function calculateWorkoutCalories(
  type: ActivityType,
  durationMinutes: number,
  weightKg: number
): number {
  const weight = weightKg > 30 ? weightKg : 70
  // MET values: Walking (3.5 METs), Running/Jogging (7.5 METs)
  const met = type === 'running' ? 7.5 : 3.5
  // Formula: Calories = MET * Weight (kg) * Duration (hours)
  const hours = durationMinutes / 60
  return Math.round(met * weight * hours)
}

/**
 * Returns saved activity summary from localStorage or generates initial state.
 */
export function getSavedDailyActivity(profile?: UserProfile | null): DailyActivitySummary {
  const todayStr = new Date().toISOString().split('T')[0]
  const dosha: Dosha = profile?.doshaType || 'Pitta'
  const age = profile?.age || 28
  const goal = getDoshaStepGoal(dosha)
  const hrZone = calculateSafeHeartRateZone(age)

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITY)
    if (raw) {
      const parsed: DailyActivitySummary = JSON.parse(raw)
      if (parsed.date === todayStr) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Could not read saved activity:', err)
  }

  // Initial fresh summary for today
  let pacingAdvice = 'Gentle regular pacing preserves Agni.'
  if (dosha === 'Kapha') {
    pacingAdvice = 'Charaka prescribes: Brisk vigorous walking to burn winter Kapha and stimulate liver circulation.'
  } else if (dosha === 'Pitta') {
    pacingAdvice = 'Charaka prescribes: Moderate endurance in early morning or twilight. Do not run in direct midday sun.'
  } else if (dosha === 'Vata') {
    pacingAdvice = 'Charaka prescribes: Grounded steady walk. Avoid exhausting sprints that deplete joint lubrication (Shleshaka Kapha).'
  }

  const initialSummary: DailyActivitySummary = {
    date: todayStr,
    currentSteps: 4250, // default baseline demo steps
    dailyStepGoal: goal,
    stepGoalCompletionPct: Math.round((4250 / goal) * 100),
    totalActiveMinutes: 35,
    totalDistanceKm: 3.1,
    totalCaloriesBurned: 185,
    doshaPacingAdvice: pacingAdvice,
    ardhaShaktiSafeHrZone: hrZone,
    recentWorkouts: [
      {
        id: 'demo-walk-1',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        type: 'walking',
        durationSeconds: 1500, // 25 mins
        distanceKm: 2.1,
        steps: 2800,
        avgPaceMinKm: 11.9,
        avgCadenceStepsPerMin: 112,
        estimatedCaloriesBurned: 115,
        avgHeartRateBpm: Math.round(hrZone.targetHr * 0.95),
        ardhaShaktiExceeded: false,
        cessationSignObserved: 'None',
        notes: 'Morning Prātah-Bhramana walking ritual',
      },
    ],
  }

  saveDailyActivity(initialSummary)
  return initialSummary
}

/**
 * Persists daily activity summary into localStorage.
 */
export function saveDailyActivity(summary: DailyActivitySummary): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(summary))
  } catch (err) {
    console.warn('Failed to save daily activity:', err)
  }
}

/**
 * Adds a completed workout session and recalculates daily totals.
 */
export function logWorkoutSession(
  session: Omit<ActivityWorkoutSession, 'id' | 'timestamp'>,
  profile?: UserProfile | null
): DailyActivitySummary {
  const current = getSavedDailyActivity(profile)
  const newWorkout: ActivityWorkoutSession = {
    ...session,
    id: `workout-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }

  const updatedWorkouts = [newWorkout, ...current.recentWorkouts]
  const addedMinutes = Math.round(session.durationSeconds / 60)
  const updatedSteps = current.currentSteps + session.steps
  const updatedDistance = Number((current.totalDistanceKm + session.distanceKm).toFixed(2))
  const updatedCalories = current.totalCaloriesBurned + session.estimatedCaloriesBurned
  const updatedCompletion = Math.min(100, Math.round((updatedSteps / current.dailyStepGoal) * 100))

  const nextSummary: DailyActivitySummary = {
    ...current,
    currentSteps: updatedSteps,
    stepGoalCompletionPct: updatedCompletion,
    totalActiveMinutes: current.totalActiveMinutes + addedMinutes,
    totalDistanceKm: updatedDistance,
    totalCaloriesBurned: updatedCalories,
    recentWorkouts: updatedWorkouts,
  }

  saveDailyActivity(nextSummary)
  return nextSummary
}
