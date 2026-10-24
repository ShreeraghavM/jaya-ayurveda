// src/lib/weatherEngine.ts
// Real-Time Outdoor Weather & Environmental Dosha Bio-Adaptation Engine
// Grounded in Charaka Samhita: Sutra Sthana 6 (Tasyashiteeya - Kāla & Ritu Parinama)

import type { Dosha, UserProfile } from './data'

export interface WeatherCondition {
  city: string
  temperatureC: number
  humidityPct: number
  windSpeedKmh: number
  uvIndex: number
  aqi: number // Air Quality Index (US AQI standard)
  weatherCode: number // WMO Weather Interpretation code
  weatherDescription: string
  weatherIcon: string
  isDay: boolean
}

export interface DoshaClimateImpact {
  dominantAggravation: 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic Balance'
  vataIndex: number // 0 - 100
  pittaIndex: number // 0 - 100
  kaphaIndex: number // 0 - 100
  respiratoryAqiRisk: 'Good' | 'Moderate' | 'Unhealthy (Pranavaha Srotas Alert)' | 'Hazardous'
  climateAlertTitle: string
  climateAlertExplanation: string
  classicalSanskritQuote: string
  recommendedExerciseWindow: {
    idealTimeWindow: string
    exerciseType: 'Outdoor Walking / Running' | 'Indoor Surya Namaskar & Pranayama' | 'Cool Twilight Walk'
    precautions: string[]
  }
  hydrationAndDietShield: {
    waterTemperature: 'Warm Boiled' | 'Room Temp Coriander' | 'Ginger Infused' | 'Clay Pot Cool'
    superfoodAntidote: string
    foodsToAvoidNow: string
  }
}

// Preset cities for offline or instant user selection
export const PRESET_WEATHER_LOCATIONS: Record<string, { lat: number; lon: number; defaultCondition: WeatherCondition }> = {
  delhi: {
    lat: 28.6139,
    lon: 77.2090,
    defaultCondition: {
      city: 'New Delhi, India',
      temperatureC: 28,
      humidityPct: 62,
      windSpeedKmh: 11,
      uvIndex: 6,
      aqi: 145,
      weatherCode: 1,
      weatherDescription: 'Hazy Sun with Moderate Humidity',
      weatherIcon: '🌤️',
      isDay: true,
    },
  },
  bangalore: {
    lat: 12.9716,
    lon: 77.5946,
    defaultCondition: {
      city: 'Bengaluru, India',
      temperatureC: 24,
      humidityPct: 58,
      windSpeedKmh: 14,
      uvIndex: 7,
      aqi: 68,
      weatherCode: 2,
      weatherDescription: 'Pleasant & Breezy',
      weatherIcon: '⛅',
      isDay: true,
    },
  },
  mumbai: {
    lat: 19.0760,
    lon: 72.8777,
    defaultCondition: {
      city: 'Mumbai, India',
      temperatureC: 31,
      humidityPct: 78,
      windSpeedKmh: 16,
      uvIndex: 8,
      aqi: 112,
      weatherCode: 3,
      weatherDescription: 'Humid Coastal Heat',
      weatherIcon: '🌊',
      isDay: true,
    },
  },
  london: {
    lat: 51.5074,
    lon: -0.1278,
    defaultCondition: {
      city: 'London, UK',
      temperatureC: 13,
      humidityPct: 82,
      windSpeedKmh: 22,
      uvIndex: 2,
      aqi: 35,
      weatherCode: 61,
      weatherDescription: 'Cold Drizzle & Wind',
      weatherIcon: '🌧️',
      isDay: true,
    },
  },
  san_francisco: {
    lat: 37.7749,
    lon: -122.4194,
    defaultCondition: {
      city: 'San Francisco, USA',
      temperatureC: 16,
      humidityPct: 74,
      windSpeedKmh: 19,
      uvIndex: 4,
      aqi: 42,
      weatherCode: 45,
      weatherDescription: 'Cool Coastal Fog',
      weatherIcon: '🌫️',
      isDay: true,
    },
  },
}

/**
 * Maps WMO code to human-readable description and icon.
 */
export function interpretWmoCode(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Clear Skies', icon: '☀️' }
  if (code === 1 || code === 2) return { description: 'Partly Cloudy', icon: '⛅' }
  if (code === 3) return { description: 'Overcast', icon: '☁️' }
  if (code === 45 || code === 48) return { description: 'Foggy Mist', icon: '🌫️' }
  if (code >= 51 && code <= 55) return { description: 'Light Drizzle', icon: '🌦️' }
  if (code >= 61 && code <= 65) return { description: 'Rain', icon: '🌧️' }
  if (code >= 71 && code <= 77) return { description: 'Snow Flurries', icon: '❄️' }
  if (code >= 80 && code <= 82) return { description: 'Passing Showers', icon: '🌧️' }
  if (code >= 95) return { description: 'Thunderstorm', icon: '⛈️' }
  return { description: 'Fair Weather', icon: '🌤️' }
}

/**
 * Calculates real-time Ayurvedic Dosha climate aggravation and health advisories
 * based on ambient temperature, humidity, wind, UV, and AQI.
 */
export function calculateDoshaClimateImpact(
  weather: WeatherCondition,
  profile?: UserProfile | null
): DoshaClimateImpact {
  const userDosha: Dosha = profile?.doshaType || 'Pitta'
  const { temperatureC, humidityPct, windSpeedKmh, uvIndex, aqi } = weather

  // 1. Compute Dosha Aggravation Indices (0 - 100)
  // Vata increases with Cold (< 18°C), Wind (> 15 km/h), and Extreme Dryness (< 40%)
  let vataScore = 20
  if (temperatureC < 18) vataScore += (18 - temperatureC) * 2.5
  if (windSpeedKmh > 15) vataScore += (windSpeedKmh - 15) * 1.8
  if (humidityPct < 40) vataScore += (40 - humidityPct) * 1.2
  vataScore = Math.min(100, Math.max(10, Math.round(vataScore)))

  // Pitta increases with Heat (> 26°C) and High UV Index (> 5)
  let pittaScore = 20
  if (temperatureC > 26) pittaScore += (temperatureC - 26) * 4.0
  if (uvIndex > 5) pittaScore += (uvIndex - 5) * 6.0
  pittaScore = Math.min(100, Math.max(10, Math.round(pittaScore)))

  // Kapha increases with High Humidity (> 65%) and Cool-to-Warm dampness
  let kaphaScore = 20
  if (humidityPct > 60) kaphaScore += (humidityPct - 60) * 1.8
  if (temperatureC >= 15 && temperatureC <= 26) kaphaScore += 15
  kaphaScore = Math.min(100, Math.max(10, Math.round(kaphaScore)))

  // Boost individual score if it matches the user's innate Prakriti
  if (userDosha === 'Vata') vataScore = Math.min(100, vataScore + 10)
  if (userDosha === 'Pitta') pittaScore = Math.min(100, pittaScore + 10)
  if (userDosha === 'Kapha') kaphaScore = Math.min(100, kaphaScore + 10)

  // Determine dominant environmental climate dosha
  let dominant: DoshaClimateImpact['dominantAggravation'] = 'Tridoshic Balance'
  if (pittaScore > vataScore && pittaScore > kaphaScore && pittaScore >= 45) {
    dominant = 'Pitta'
  } else if (kaphaScore > vataScore && kaphaScore > pittaScore && kaphaScore >= 45) {
    dominant = 'Kapha'
  } else if (vataScore > pittaScore && vataScore > kaphaScore && vataScore >= 45) {
    dominant = 'Vata'
  }

  // Respiratory AQI Risk
  let respiratoryAqiRisk: DoshaClimateImpact['respiratoryAqiRisk'] = 'Good'
  if (aqi > 200) respiratoryAqiRisk = 'Hazardous'
  else if (aqi > 100) respiratoryAqiRisk = 'Unhealthy (Pranavaha Srotas Alert)'
  else if (aqi > 50) respiratoryAqiRisk = 'Moderate'

  // Diagnostic Explanations & Classical Grounding
  let alertTitle = 'Pleasant & Balanced Climate (Sama-Kāla)'
  let alertExplanation = 'The ambient atmosphere supports balanced tissue metabolism and smooth Prana circulation.'
  let classicalSanskritQuote = 'शीतोष्णवर्षलक्षणाः... समदोषः समाग्निश्च समधातुमलक्रियः (Charaka Sutra 6)'
  let idealTimeWindow = '06:00 AM – 08:00 AM'
  let exerciseType: DoshaClimateImpact['recommendedExerciseWindow']['exerciseType'] = 'Outdoor Walking / Running'
  let precautions = ['Maintain steady cadence', 'Breathe purely through nostrils']
  let waterTemp: DoshaClimateImpact['hydrationAndDietShield']['waterTemperature'] = 'Room Temp Coriander'
  let superfood = 'Fresh Amla juice or roasted cumin water'
  let avoidFood = 'Extremely refrigerated leftovers'

  if (respiratoryAqiRisk === 'Hazardous' || (aqi > 130 && weather.weatherCode >= 45)) {
    alertTitle = '⚠️ Pranavaha Srotas Air Quality Alert (High Particulates)'
    alertExplanation = `Air Quality Index is ${aqi}. Micro-particles irritate the bronchial mucous membranes. Outdoor running will inhale deep toxins into lung channels.`
    classicalSanskritQuote = 'प्राणवहानां स्रोतसां हृदयं मूलं महास्रोतश्च (Charaka Vimana 5.7)'
    idealTimeWindow = 'Stay Indoors — Late morning after dust settles'
    exerciseType = 'Indoor Surya Namaskar & Pranayama'
    precautions = [
      'Avoid brisk outdoor jogging until AQI drops below 100',
      'Apply 2 drops of Anu Taila or sesame oil into each nostril before stepping outside',
      'Practice 10 mins of gentle Nadi Shodhana (Alternate Nostril Breathing)',
    ]
    waterTemp = 'Warm Boiled'
    superfood = 'Tulsi-Ginger Kashayam with raw honey'
    avoidFood = 'Cold dairy, ice creams, and unctuous fried foods that solidify bronchial mucus'
  } else if (dominant === 'Pitta') {
    alertTitle = '🔥 Pitta Ushna Alert: Solar Radiation & Heat Intensity'
    alertExplanation = `Ambient temp is ${temperatureC}°C with UV Index ${uvIndex}. Midday heat accelerates catabolism, irritates bile, and causes dehydration.`
    classicalSanskritQuote = 'तत्र ग्रीष्मे तीक्ष्णोष्णरूक्षा भास्वतो रश्मयो... (Charaka Sutra 6.27)'
    idealTimeWindow = '05:30 AM – 07:00 AM or Post-Sunset (06:30 PM)'
    exerciseType = 'Cool Twilight Walk'
    precautions = [
      'Strictly avoid outdoor jogging between 11:00 AM and 04:00 PM',
      'Wear light breathable white or pale cotton',
      'Cease workout immediately if pulse bounds or temporal temples throb',
    ]
    waterTemp = 'Clay Pot Cool'
    superfood = 'Fennel seed infusion (Saunf water) or coconut water'
    avoidFood = 'Pungent red chilies, fermented sour foods, and salty chips'
  } else if (dominant === 'Kapha') {
    alertTitle = '💧 Kapha Snigdha Alert: High Humidity & Sluggish Micro-Channels'
    alertExplanation = `Humidity is ${humidityPct}%. Heavy damp air slows down gastric fire (Mandagni) and encourages mucus consolidation.`
    classicalSanskritQuote = 'वसन्तवर्षासु श्लेष्मा... स्निग्धशीतगुरुक्लिन्नाः (Charaka Sutra 6.22)'
    idealTimeWindow = '06:30 AM – 08:30 AM (Brisk Pace Essential)'
    exerciseType = 'Outdoor Walking / Running'
    precautions = [
      'Brisk vigorous pace required to break lymphatic stagnation',
      'Wipe off sweat promptly to prevent damp chills',
      'Do not sleep during daytime regardless of humidity fatigue',
    ]
    waterTemp = 'Ginger Infused'
    superfood = 'Dry-roasted barley sattu, black pepper, and honey'
    avoidFood = 'Heavy curd/yogurt, cheeses, and iced sugary beverages'
  } else if (dominant === 'Vata') {
    alertTitle = '💨 Vata Chala Alert: High Wind & Dry Cold Exposure'
    alertExplanation = `Wind speeds of ${windSpeedKmh} km/h and ${temperatureC}°C cold directly irritate the musculoskeletal and nervous systems.`
    classicalSanskritQuote = 'शीतानिलस्पर्शरूक्षाः... वातः प्रकुप्यति (Charaka Sutra 6.10)'
    idealTimeWindow = '10:00 AM – 11:30 AM or 04:30 PM (Sun-Warmed Windows)'
    exerciseType = 'Outdoor Walking / Running'
    precautions = [
      'Wear windcheater and cover ears/neck (protects Shira & Karna Pradesha)',
      'Keep walk steady and grounded — avoid erratic sprints against heavy wind',
      'Apply warm sesame oil to soles of feet before running',
    ]
    waterTemp = 'Warm Boiled'
    superfood = 'Warm ashwagandha golden milk with a pinch of nutmeg'
    avoidFood = 'Dry raw salads, popcorn, and carbonated cold soda'
  }

  return {
    dominantAggravation: dominant,
    vataIndex: vataScore,
    pittaIndex: pittaScore,
    kaphaIndex: kaphaScore,
    respiratoryAqiRisk,
    climateAlertTitle: alertTitle,
    climateAlertExplanation: alertExplanation,
    classicalSanskritQuote,
    recommendedExerciseWindow: {
      idealTimeWindow,
      exerciseType,
      precautions,
    },
    hydrationAndDietShield: {
      waterTemperature: waterTemp,
      superfoodAntidote: superfood,
      foodsToAvoidNow: avoidFood,
    },
  }
}

/**
 * Fetches live weather from Open-Meteo for a given latitude/longitude.
 * Gracefully falls back to preset or default conditions on offline/network errors.
 */
export async function fetchLiveWeather(lat: number, lon: number, cityName = 'Current Location'): Promise<WeatherCondition> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=uv_index&timezone=auto`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
    const data = await res.json()

    const current = data.current || {}
    const temp = Math.round(current.temperature_2m ?? 24)
    const humidity = Math.round(current.relative_humidity_2m ?? 60)
    const wind = Math.round(current.wind_speed_10m ?? 12)
    const weatherCode = current.weather_code ?? 0
    const isDay = current.is_day === 1

    const uvHourly = data.hourly?.uv_index || []
    const uv = uvHourly.length > 0 ? Math.round(uvHourly[12] ?? 5) : 5

    const { description, icon } = interpretWmoCode(weatherCode)

    return {
      city: cityName,
      temperatureC: temp,
      humidityPct: humidity,
      windSpeedKmh: wind,
      uvIndex: uv,
      aqi: 65, // Standard moderate fallback unless dedicated sensor attached
      weatherCode,
      weatherDescription: description,
      weatherIcon: icon,
      isDay,
    }
  } catch (err) {
    console.warn('Live weather network fetch failed; utilizing verified regional default:', err)
    return PRESET_WEATHER_LOCATIONS.delhi.defaultCondition
  }
}
