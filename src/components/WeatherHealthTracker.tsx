// src/components/WeatherHealthTracker.tsx
// Comprehensive Real-Time Weather & Health Activity Tracker (Walking, Running & Environmental Bio-Adaptation)
// Grounded in Charaka Samhita: Sutra Sthana 6 (Kāla Parinama) & Sutra Sthana 7 (Vyayama & Ardha-Shakti)

import { useState, useEffect, useRef } from 'react'
import type { UserProfile } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  WeatherCondition,
  DoshaClimateImpact,
  PRESET_WEATHER_LOCATIONS,
  calculateDoshaClimateImpact,
  fetchLiveWeather,
} from '@/lib/weatherEngine'
import {
  ActivityType,
  ActivityWorkoutSession,
  DailyActivitySummary,
  getSavedDailyActivity,
  logWorkoutSession,
  calculateWorkoutCalories,
} from '@/lib/activityEngine'

interface Props {
  profile?: UserProfile | null
  onClose?: () => void
  onOpenDietPlan?: () => void
}

export default function WeatherHealthTracker({ profile, onClose, onOpenDietPlan }: Props) {
  // ─── Weather State ────────────────────────────────────────────────────────
  const [selectedCityKey, setSelectedCityKey] = useState<string>('delhi')
  const [weather, setWeather] = useState<WeatherCondition>(PRESET_WEATHER_LOCATIONS.delhi.defaultCondition)
  const [climateImpact, setClimateImpact] = useState<DoshaClimateImpact>(() =>
    calculateDoshaClimateImpact(PRESET_WEATHER_LOCATIONS.delhi.defaultCondition, profile)
  )
  const [isLocating, setIsLocating] = useState(false)

  // ─── Activity State ───────────────────────────────────────────────────────
  const [activitySummary, setActivitySummary] = useState<DailyActivitySummary>(() =>
    getSavedDailyActivity(profile)
  )
  const [activeTab, setActiveTab] = useState<'overview' | 'weather' | 'tracker' | 'history'>('overview')

  // ─── Active Workout Session Timer State ────────────────────────────────────
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutType, setWorkoutType] = useState<ActivityType>('walking')
  const [workoutSeconds, setWorkoutSeconds] = useState(0)
  const [workoutSteps, setWorkoutSteps] = useState(0)
  const [workoutDistanceKm, setWorkoutDistanceKm] = useState(0)
  const [liveHeartRate, setLiveHeartRate] = useState<number>(() => activitySummary.ardhaShaktiSafeHrZone.targetHr)
  const [stopSignObserved, setStopSignObserved] = useState<'None' | 'Vaktram Prapadyate (Mouth Breathing)' | 'Lalate Sveda (Forehead Sweat)'>('None')
  const [isSuccessLogged, setIsSuccessLogged] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Synchronize climate impact when weather changes
  useEffect(() => {
    setClimateImpact(calculateDoshaClimateImpact(weather, profile))
  }, [weather, profile])

  // Workout Session Timer Effect
  useEffect(() => {
    if (isWorkoutActive) {
      timerRef.current = setInterval(() => {
        setWorkoutSeconds(prev => {
          const nextSec = prev + 1
          // Every 2 seconds, simulate realistic steps based on walking vs running
          if (nextSec % 2 === 0) {
            const addedSteps = workoutType === 'running' ? 5 : 3
            setWorkoutSteps(s => s + addedSteps)
            setWorkoutDistanceKm(d => Number((d + (workoutType === 'running' ? 0.004 : 0.002)).toFixed(3)))
          }
          return nextSec
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isWorkoutActive, workoutType])

  // Handle Location Switcher
  const handleSelectCity = (key: string) => {
    setSelectedCityKey(key)
    const preset = PRESET_WEATHER_LOCATIONS[key]
    if (preset) {
      setWeather(preset.defaultCondition)
    }
  }

  // Handle Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        const live = await fetchLiveWeather(latitude, longitude, 'My Location (GPS)')
        setWeather(live)
        setSelectedCityKey('custom')
        setIsLocating(false)
      },
      err => {
        console.warn('Geolocation error:', err)
        setIsLocating(false)
        alert('Could not access current location. Using regional preset.')
      },
      { timeout: 8000 }
    )
  }

  // Finish and Log Workout
  const handleFinishWorkout = () => {
    if (workoutSeconds < 10 && workoutSteps === 0) {
      setIsWorkoutActive(false)
      setWorkoutSeconds(0)
      return
    }

    const durationMinutes = Math.max(1, Math.round(workoutSeconds / 60))
    const userWeight = profile?.weight || 70
    const calories = calculateWorkoutCalories(workoutType, durationMinutes, userWeight)
    const pace = workoutDistanceKm > 0 ? Number((durationMinutes / workoutDistanceKm).toFixed(1)) : 10.0
    const cadence = workoutSeconds > 0 ? Math.round((workoutSteps / workoutSeconds) * 60) : 110
    const isOverLimit = liveHeartRate > activitySummary.ardhaShaktiSafeHrZone.maxSafeHr

    const sessionData = {
      type: workoutType,
      durationSeconds: workoutSeconds,
      distanceKm: Number(workoutDistanceKm.toFixed(2)),
      steps: workoutSteps,
      avgPaceMinKm: pace,
      avgCadenceStepsPerMin: cadence,
      estimatedCaloriesBurned: calories,
      avgHeartRateBpm: liveHeartRate,
      ardhaShaktiExceeded: isOverLimit,
      cessationSignObserved: stopSignObserved,
      notes: `${workoutType === 'running' ? 'Active outdoor jogging' : 'Mindful Prātah-Bhramana walk'} at ${weather.temperatureC}°C (${weather.weatherDescription})`,
    }

    const updated = logWorkoutSession(sessionData, profile)
    setActivitySummary(updated)
    setIsWorkoutActive(false)
    setWorkoutSeconds(0)
    setWorkoutSteps(0)
    setWorkoutDistanceKm(0)
    setIsSuccessLogged(true)
    setTimeout(() => setIsSuccessLogged(false), 4000)
  }

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ─── Header & Mode Selector ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-500/40 bg-sky-950/40 text-xl shadow-md">
            🌦️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-emerald-100">Weather & Health Activity Tracker</h2>
              <Badge className="bg-sky-500/20 text-sky-200 border-sky-500/40 text-[10px] font-mono">
                Charaka Sutra 6 & 7
              </Badge>
            </div>
            <p className="text-xs text-emerald-300/60">
              Kāla-Parināma Climate Shield & Ardha-Shakti Walking / Running Safety
            </p>
          </div>
        </div>

        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-full text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-100"
          >
            ✕ Close
          </Button>
        )}
      </div>

      {/* ─── Sub-Tab Navigation Bar ─────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-black/40 p-1 border border-emerald-900/40 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-emerald-700/80 text-white font-bold shadow-md'
              : 'text-emerald-300/70 hover:text-emerald-100'
          }`}
        >
          📊 Summary
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'weather'
              ? 'bg-sky-700/80 text-white font-bold shadow-md'
              : 'text-sky-300/70 hover:text-sky-100'
          }`}
        >
          🌤️ Weather & Dosha
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'tracker'
              ? 'bg-emerald-600/80 text-white font-bold shadow-md'
              : 'text-emerald-300/70 hover:text-emerald-100'
          }`}
        >
          🏃 Live Walk / Run
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 rounded-xl transition ${
            activeTab === 'history'
              ? 'bg-amber-700/80 text-white font-bold shadow-md'
              : 'text-amber-300/70 hover:text-amber-100'
          }`}
        >
          📜 Workout Log
        </button>
      </div>

      {/* ─── TAB 1: OVERVIEW & COMBINED DASHBOARD ───────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Weather Quick Snapshot Banner */}
          <Card className="rounded-2xl border-sky-500/40 bg-gradient-to-r from-sky-950/60 via-[#061821] to-emerald-950/50 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{weather.weatherIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{weather.temperatureC}°C</span>
                    <span className="text-xs text-sky-200/80 font-medium">{weather.weatherDescription}</span>
                  </div>
                  <p className="text-[11px] text-sky-400/80">{weather.city}</p>
                </div>
              </div>

              {/* Climate Alert Pill */}
              <div className="flex items-center gap-2">
                <Badge
                  className={`px-2.5 py-1 text-[11px] font-semibold border ${
                    climateImpact.dominantAggravation === 'Pitta'
                      ? 'bg-rose-950/60 text-rose-200 border-rose-500/60'
                      : climateImpact.dominantAggravation === 'Kapha'
                      ? 'bg-sky-950/60 text-sky-200 border-sky-500/60'
                      : climateImpact.dominantAggravation === 'Vata'
                      ? 'bg-amber-950/60 text-amber-200 border-amber-500/60'
                      : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/60'
                  }`}
                >
                  {climateImpact.dominantAggravation} Climate Active
                </Badge>
                <button
                  onClick={() => setActiveTab('weather')}
                  className="text-xs font-semibold text-sky-300 hover:text-sky-100 underline"
                >
                  View Shield →
                </button>
              </div>
            </div>

            {/* Quick Weather Metrics Grid */}
            <div className="mt-3 grid grid-cols-4 gap-2 border-t border-sky-900/40 pt-2.5 text-center text-xs">
              <div>
                <p className="text-[10px] text-sky-400/60 uppercase">Humidity</p>
                <p className="font-semibold text-sky-200">{weather.humidityPct}%</p>
              </div>
              <div>
                <p className="text-[10px] text-sky-400/60 uppercase">Wind</p>
                <p className="font-semibold text-sky-200">{weather.windSpeedKmh} km/h</p>
              </div>
              <div>
                <p className="text-[10px] text-sky-400/60 uppercase">UV Index</p>
                <p className="font-semibold text-sky-200">{weather.uvIndex} (Safe)</p>
              </div>
              <div>
                <p className="text-[10px] text-sky-400/60 uppercase">Air Quality</p>
                <p className={`font-semibold ${weather.aqi > 100 ? 'text-amber-300' : 'text-emerald-300'}`}>
                  AQI {weather.aqi}
                </p>
              </div>
            </div>
          </Card>

          {/* Daily Pedometer & Activity Ring Card */}
          <Card className="rounded-2xl border-emerald-800/40 bg-gradient-to-br from-emerald-950/70 to-emerald-900/30 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-mono">
                  Today's Ayurvedic Movement Target
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-emerald-100">
                    {activitySummary.currentSteps.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-300/70">
                    / {activitySummary.dailyStepGoal.toLocaleString()} steps ({activitySummary.stepGoalCompletionPct}%)
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setActiveTab('tracker')}
                size="sm"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                ▶ Start Walk / Run
              </Button>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="mt-3 w-full bg-emerald-950/80 rounded-full h-3 border border-emerald-700/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, activitySummary.stepGoalCompletionPct)}%` }}
              />
            </div>

            {/* 3 Activity Metrics Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-emerald-900/40 pt-3 text-center">
              <div className="p-2 rounded-xl bg-emerald-900/20 border border-emerald-800/30">
                <p className="text-[10px] text-emerald-400/70">Active Time</p>
                <p className="text-base font-bold text-emerald-100">{activitySummary.totalActiveMinutes} mins</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-900/20 border border-emerald-800/30">
                <p className="text-[10px] text-emerald-400/70">Distance</p>
                <p className="text-base font-bold text-emerald-100">{activitySummary.totalDistanceKm} km</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-900/20 border border-emerald-800/30">
                <p className="text-[10px] text-emerald-400/70">Active Burn</p>
                <p className="text-base font-bold text-amber-200">{activitySummary.totalCaloriesBurned} kcal</p>
              </div>
            </div>

            {/* Dosha Pacing Advice Callout */}
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/30 flex items-center gap-2.5 text-xs text-emerald-200/90">
              <span className="text-base shrink-0">🌿</span>
              <p className="leading-relaxed">{activitySummary.doshaPacingAdvice}</p>
            </div>
          </Card>

          {/* Quick Ardha-Shakti Safe Heart Rate Gauge */}
          <Card className="rounded-2xl border-amber-500/30 bg-[#120e06]/60 p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-bold text-amber-200">
                  Ardha-Shakti Safe Heart Rate Zone (Charaka Sutra 7.31)
                </span>
              </div>
              <span className="text-xs font-mono text-amber-300 font-bold">
                {activitySummary.ardhaShaktiSafeHrZone.minHr} – {activitySummary.ardhaShaktiSafeHrZone.maxSafeHr} bpm
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/70">
              Exert up to half capacity (50%–70% max HR). Cease walking or running the instant mouth breathing or brow sweat begins.
            </p>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: LIVE WEATHER & DOSHA ENVIRONMENTAL SHIELD ──────────── */}
      {activeTab === 'weather' && (
        <div className="space-y-4">
          {/* City / Location Selector */}
          <Card className="p-3 rounded-2xl border-sky-900/40 bg-sky-950/30 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-sky-300/80 font-medium">Select City:</span>
              {Object.keys(PRESET_WEATHER_LOCATIONS).map(key => (
                <button
                  key={key}
                  onClick={() => handleSelectCity(key)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                    selectedCityKey === key
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-sky-950/60 text-sky-300 hover:bg-sky-900/60'
                  }`}
                >
                  {PRESET_WEATHER_LOCATIONS[key].defaultCondition.city.split(',')[0]}
                </button>
              ))}
            </div>

            <Button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              size="sm"
              variant="outline"
              className="rounded-xl border-sky-500/50 bg-sky-950/40 text-xs text-sky-200 hover:bg-sky-900/50"
            >
              {isLocating ? '📡 Locating...' : '📍 Use GPS'}
            </Button>
          </Card>

          {/* Primary Climate Diagnostic Card */}
          <Card className="rounded-2xl border-sky-600/40 bg-gradient-to-br from-[#051a24] to-[#0a2717] p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge className="bg-sky-500/20 text-sky-200 border-sky-400/40 text-xs">
                  {weather.city} · {weather.temperatureC}°C
                </Badge>
                <h3 className="mt-2 text-base font-bold text-white">{climateImpact.climateAlertTitle}</h3>
                <p className="mt-1 text-xs text-sky-200/80 leading-relaxed">{climateImpact.climateAlertExplanation}</p>
              </div>
              <span className="text-4xl shrink-0">{weather.weatherIcon}</span>
            </div>

            {/* Classical Sanskrit Inscription */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-black/40 border border-sky-500/20 text-[11px] font-mono text-amber-200/90 text-center">
              "{climateImpact.classicalSanskritQuote}"
            </div>

            {/* 3 Real-Time Dosha Aggravation Bars */}
            <div className="mt-4 space-y-2 border-t border-sky-900/40 pt-3">
              <p className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                Ambient Environmental Aggravation Indices
              </p>

              {/* Vata Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-300 font-medium">Vata (Wind & Cold Index)</span>
                  <span className="text-amber-200 font-bold">{climateImpact.vataIndex} / 100</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300 rounded-full"
                    style={{ width: `${climateImpact.vataIndex}%` }}
                  />
                </div>
              </div>

              {/* Pitta Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-300 font-medium">Pitta (Solar Heat & UV Index)</span>
                  <span className="text-rose-200 font-bold">{climateImpact.pittaIndex} / 100</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300 rounded-full"
                    style={{ width: `${climateImpact.pittaIndex}%` }}
                  />
                </div>
              </div>

              {/* Kapha Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-sky-300 font-medium">Kapha (Humidity & Dampness Index)</span>
                  <span className="text-sky-200 font-bold">{climateImpact.kaphaIndex} / 100</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300 rounded-full"
                    style={{ width: `${climateImpact.kaphaIndex}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Actionable Recommendations Based on Weather */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Exercise Time & Precautions */}
            <Card className="rounded-2xl border-emerald-800/40 bg-emerald-950/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏃</span>
                <h4 className="text-xs font-bold text-emerald-100">Recommended Exercise Window</h4>
              </div>
              <p className="text-sm font-extrabold text-emerald-300">
                {climateImpact.recommendedExerciseWindow.idealTimeWindow}
              </p>
              <p className="text-xs font-medium text-emerald-200/80 mt-0.5">
                Activity: {climateImpact.recommendedExerciseWindow.exerciseType}
              </p>
              <ul className="mt-2.5 space-y-1 text-[11px] text-emerald-300/70 list-disc list-inside">
                {climateImpact.recommendedExerciseWindow.precautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </Card>

            {/* Hydration & Superfood Shield */}
            <Card className="rounded-2xl border-amber-800/40 bg-amber-950/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🍵</span>
                <h4 className="text-xs font-bold text-amber-100">Weather Hydration & Food Shield</h4>
              </div>
              <p className="text-xs text-amber-200/80">
                <span className="font-semibold text-amber-100">Water Temperature:</span>{' '}
                {climateImpact.hydrationAndDietShield.waterTemperature}
              </p>
              <p className="text-xs text-amber-200/80 mt-1">
                <span className="font-semibold text-amber-100">Climate Superfood:</span>{' '}
                {climateImpact.hydrationAndDietShield.superfoodAntidote}
              </p>
              <p className="text-xs text-rose-300/80 mt-1">
                <span className="font-semibold text-rose-200">Avoid Under This Weather:</span>{' '}
                {climateImpact.hydrationAndDietShield.foodsToAvoidNow}
              </p>

              {onOpenDietPlan && (
                <Button
                  onClick={onOpenDietPlan}
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full rounded-xl border-amber-600/40 text-xs text-amber-200 hover:bg-amber-900/40"
                >
                  Apply to Today's Diet Plan →
                </Button>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ─── TAB 3: LIVE WALKING & RUNNING WORKOUT RECORDER ─────────────── */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-emerald-500/50 bg-gradient-to-br from-[#061e12] via-[#091a13] to-black/80 p-5 shadow-xl">
            {/* Mode Toggle: Walking vs Running */}
            <div className="flex items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
              <span className="text-xs font-bold text-emerald-200">Select Movement Mode:</span>
              <div className="flex gap-1 bg-black/60 p-1 rounded-xl border border-emerald-800/40 text-xs">
                <button
                  disabled={isWorkoutActive}
                  onClick={() => setWorkoutType('walking')}
                  className={`px-3 py-1 rounded-lg transition ${
                    workoutType === 'walking'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-emerald-300/70 hover:text-emerald-100'
                  }`}
                >
                  🚶 Walking (Pratah-Bhramana)
                </button>
                <button
                  disabled={isWorkoutActive}
                  onClick={() => setWorkoutType('running')}
                  className={`px-3 py-1 rounded-lg transition ${
                    workoutType === 'running'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'text-rose-300/70 hover:text-rose-100'
                  }`}
                >
                  🏃 Running / Jogging
                </button>
              </div>
            </div>

            {/* Stopwatch Display */}
            <div className="mt-4 text-center">
              <p className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-mono">
                {isWorkoutActive ? 'SESSION IN PROGRESS' : 'READY TO RECORD'}
              </p>
              <h1 className="text-5xl font-mono font-extrabold text-white tracking-wider my-2">
                {formatTimer(workoutSeconds)}
              </h1>

              {/* Live Session Counter Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                  <p className="text-[10px] text-emerald-400/60">Steps</p>
                  <p className="text-xl font-bold text-emerald-200">{workoutSteps.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                  <p className="text-[10px] text-emerald-400/60">Distance</p>
                  <p className="text-xl font-bold text-emerald-200">{workoutDistanceKm.toFixed(2)} km</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                  <p className="text-[10px] text-emerald-400/60">Active Burn</p>
                  <p className="text-xl font-bold text-amber-300">
                    {calculateWorkoutCalories(workoutType, Math.max(1, Math.round(workoutSeconds / 60)), profile?.weight || 70)}{' '}
                    kcal
                  </p>
                </div>
              </div>
            </div>

            {/* Live Ardha-Shakti Heart Rate Safety Dial */}
            <div className="mt-5 p-3 rounded-2xl bg-black/50 border border-amber-600/40">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="animate-pulse">❤️</span>
                  <span className="font-bold text-amber-200">Live Pulse Indicator</span>
                </div>
                <span className="font-mono text-sm font-bold text-amber-100">{liveHeartRate} bpm</span>
              </div>

              {/* Heart rate zone bar */}
              <div className="mt-2 h-2.5 w-full bg-emerald-950 rounded-full overflow-hidden flex">
                <div className="w-[50%] bg-emerald-600" title="Warm-up Zone" />
                <div className="w-[20%] bg-amber-400" title="Ardha-Shakti Safe Zone (50%-70%)" />
                <div className="w-[30%] bg-rose-600" title="Over-exertion (Avoid)" />
              </div>
              <div className="flex justify-between text-[10px] text-emerald-300/60 mt-1 font-mono">
                <span>Rest</span>
                <span>Ardha-Shakti Safe ({activitySummary.ardhaShaktiSafeHrZone.targetHr} bpm)</span>
                <span className="text-rose-400">Stop ({activitySummary.ardhaShaktiSafeHrZone.maxSafeHr}+)</span>
              </div>

              {/* Interactive Heart Rate Adjuster for Demo / Wearable Input */}
              <div className="mt-3 flex items-center justify-between text-xs text-amber-200/80">
                <span>Simulate / Wearable HR:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setLiveHeartRate(h => Math.max(70, h - 5))}
                    className="px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-xs"
                  >
                    -5
                  </button>
                  <span className="font-mono font-bold">{liveHeartRate}</span>
                  <button
                    onClick={() => setLiveHeartRate(h => Math.min(180, h + 5))}
                    className="px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-xs"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* Stop Sign Checkboxes */}
              <div className="mt-3 border-t border-amber-900/40 pt-2 text-xs">
                <p className="text-[11px] text-amber-200/80 font-semibold mb-1">
                  Classical Cessation Sign Check (Charaka Sutra 7):
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    onClick={() =>
                      setStopSignObserved(prev =>
                        prev === 'Vaktram Prapadyate (Mouth Breathing)' ? 'None' : 'Vaktram Prapadyate (Mouth Breathing)'
                      )
                    }
                    className={`p-1.5 rounded-lg border text-left transition ${
                      stopSignObserved === 'Vaktram Prapadyate (Mouth Breathing)'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-300/70'
                    }`}
                  >
                    🫁 Mouth Breathing (Vaktram)
                  </button>
                  <button
                    onClick={() =>
                      setStopSignObserved(prev =>
                        prev === 'Lalate Sveda (Forehead Sweat)' ? 'None' : 'Lalate Sveda (Forehead Sweat)'
                      )
                    }
                    className={`p-1.5 rounded-lg border text-left transition ${
                      stopSignObserved === 'Lalate Sveda (Forehead Sweat)'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-300/70'
                    }`}
                  >
                    💧 Brow Sweat (Lalate Sveda)
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-5 flex items-center gap-2">
              {!isWorkoutActive ? (
                <Button
                  onClick={() => setIsWorkoutActive(true)}
                  className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition"
                >
                  ▶ Start Recording
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsWorkoutActive(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-amber-500/50 bg-amber-950/40 text-amber-200 hover:bg-amber-900/50 font-bold"
                  >
                    ⏸ Pause
                  </Button>
                  <Button
                    onClick={handleFinishWorkout}
                    className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg"
                  >
                    ⏹ Finish & Log
                  </Button>
                </>
              )}
            </div>

            {isSuccessLogged && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-center text-xs text-emerald-200 font-bold animate-in fade-in">
                ✓ Workout successfully logged! Daily steps & calories updated.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ─── TAB 4: WORKOUT LOG & HISTORY ───────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-300/70">
            <span>Recorded Movement Sessions for Today:</span>
            <span>{activitySummary.recentWorkouts.length} sessions</span>
          </div>

          {activitySummary.recentWorkouts.length === 0 ? (
            <Card className="p-8 text-center rounded-2xl border-emerald-900/40 bg-emerald-950/20 text-xs text-emerald-400/60">
              No workouts recorded yet today. Tap "Live Walk / Run" to start your session!
            </Card>
          ) : (
            activitySummary.recentWorkouts.map(session => (
              <Card
                key={session.id}
                className="p-4 rounded-2xl border-emerald-900/40 bg-gradient-to-r from-emerald-950/60 to-[#071911] shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{session.type === 'running' ? '🏃' : '🚶'}</span>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-100 capitalize">
                        {session.type} ({Math.round(session.durationSeconds / 60)} mins)
                      </h4>
                      <p className="text-[10px] text-emerald-400/60">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] ${
                      session.ardhaShaktiExceeded
                        ? 'bg-rose-950/80 text-rose-200 border-rose-500'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-500'
                    }`}
                  >
                    {session.ardhaShaktiExceeded ? 'Exceeded Half-Capacity' : 'Safe Ardha-Shakti'}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-1 border-t border-emerald-900/40 pt-2 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-emerald-400/60">Distance</p>
                    <p className="font-semibold text-emerald-200">{session.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400/60">Steps</p>
                    <p className="font-semibold text-emerald-200">{session.steps.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400/60">Burn</p>
                    <p className="font-semibold text-amber-300">{session.estimatedCaloriesBurned} kcal</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400/60">Avg Pulse</p>
                    <p className="font-semibold text-emerald-200">{session.avgHeartRateBpm} bpm</p>
                  </div>
                </div>

                {session.notes && (
                  <p className="text-[11px] text-emerald-300/80 italic bg-black/30 p-2 rounded-xl">
                    "{session.notes}"
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
