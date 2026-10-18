import { useEffect, useState } from 'react'
import type { UserProfile } from './lib/data'
import {
  DEMO_PROFILE,
  clearUserProfile,
  getSession,
  getUserProfile,
  saveSession,
  saveUserProfile,
  signOutSession,
  type AuthSession,
} from './lib/store'
import LandingPage from './components/LandingPage'
import UserGuide from './components/UserGuide'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import ChatCoach from './components/ChatCoach'
import DailyRoutine from './components/DailyRoutine'
import DietPlan from './components/DietPlan'
import YogaSession from './components/YogaSession'
import Remedies from './components/Remedies'
import Progress from './components/Progress'
import Goals from './components/Goals'
import TomorrowPlanning from './components/TomorrowPlanning'
import Profile from './components/UserProfile'
import SmartPopups from './components/SmartPopups'
import GoodNightRitual from './components/GoodNightRitual'

type View = 'landing' | 'onboarding' | 'guide' | 'profile' | 'plan' | 'app'
type Tab = 'home' | 'chat' | 'routine' | 'goals' | 'yoga' | 'diet' | 'remedies' | 'progress'

const tabs: { key: Tab; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'Home' },
  { key: 'chat', icon: '💬', label: 'Coach' },
  { key: 'routine', icon: '🕐', label: 'Routine' },
  { key: 'diet', icon: '🍽️', label: 'Diet' },
  { key: 'yoga', icon: '🧘', label: 'Yoga' },
  { key: 'goals', icon: '🎯', label: 'Goals' },
  { key: 'remedies', icon: '🌿', label: 'Remedies' },
  { key: 'progress', icon: '📊', label: 'Progress' },
]

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [guideFrom, setGuideFrom] = useState<View>('landing')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [tab, setTab] = useState<Tab>('home')
  const [loading, setLoading] = useState(true)
  const [showGoodNight, setShowGoodNight] = useState(false)
  const [popupTick, setPopupTick] = useState(0)

  useEffect(() => {
    const saved = getUserProfile()
    const savedSession = getSession()
    if (saved?.completedOnboarding) {
      setProfile(saved)
      setSession(savedSession)
      setView('app')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    setPopupTick(t => t + 1)
  }, [tab, view])

  const handleComplete = (next: UserProfile) => {
    setProfile(next)
    setSession(getSession())
    setView('app')
    setTab('home')
  }

  const handleDemo = () => {
    saveUserProfile(DEMO_PROFILE)
    const demoSession: AuthSession = {
      name: DEMO_PROFILE.name,
      email: DEMO_PROFILE.email ?? '',
      mode: 'demo',
      signedInAt: new Date().toISOString(),
    }
    saveSession(demoSession)
    setProfile(DEMO_PROFILE)
    setSession(demoSession)
    setView('app')
    setTab('home')
  }

  const handleSignOut = () => {
    signOutSession()
    clearUserProfile()
    setSession(null)
    setProfile(null)
    setTab('home')
    setView('landing')
  }

  const handleSaveProfile = (next: UserProfile) => {
    saveUserProfile(next)
    setProfile(next)
  }

  const openGuide = (from: View) => {
    setGuideFrom(from)
    setView('guide')
  }

  const navigate = (next: string) => {
    if (next === 'plan') {
      setView('plan')
      return
    }
    if (next === 'profile') {
      setView('profile')
      return
    }
    if (tabs.some(t => t.key === next)) {
      setTab(next as Tab)
      setView('app')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08140c]">
        <div className="text-center">
          <div className="mb-3 animate-pulse text-4xl">🌿</div>
          <p className="text-xs text-emerald-500/50">Waking up...</p>
        </div>
      </div>
    )
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onStart={() => setView('onboarding')}
        onDemo={handleDemo}
        onGuide={() => openGuide('landing')}
      />
    )
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleComplete} onDemo={handleDemo} />
  }

  if (view === 'guide') {
    return <UserGuide onBack={() => setView(guideFrom)} />
  }

  if (!profile) {
    return (
      <LandingPage
        onStart={() => setView('onboarding')}
        onDemo={handleDemo}
        onGuide={() => openGuide('landing')}
      />
    )
  }

  if (view === 'profile') {
    return (
      <Profile
        profile={profile}
        session={session}
        onSave={handleSaveProfile}
        onSignOut={handleSignOut}
        onOpenGuide={() => openGuide('profile')}
        onBack={() => setView('app')}
      />
    )
  }

  if (view === 'plan') {
    return <TomorrowPlanning profile={profile} onBack={() => setView('app')} />
  }

  const renderTab = () => {
    switch (tab) {
      case 'home':
        return <Dashboard profile={profile} onNavigate={navigate} />
      case 'chat':
        return <ChatCoach profile={profile} />
      case 'routine':
        return <DailyRoutine profile={profile} />
      case 'diet':
        return <DietPlan profile={profile} />
      case 'yoga':
        return <YogaSession profile={profile} />
      case 'goals':
        return <Goals profile={profile} />
      case 'remedies':
        return <Remedies profile={profile} />
      case 'progress':
        return <Progress profile={profile} />
    }
  }

  return (
    <div className="min-h-screen bg-[#08140c]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-emerald-900/40 bg-[#08140c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2.5">
          <button onClick={() => setTab('home')} className="flex items-center gap-1.5">
            <span className="text-base">🌿</span>
            <span className="text-xs font-medium tracking-tight text-emerald-100">Jaya</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => openGuide('app')}
              aria-label="User guide"
              className="rounded-lg px-2 py-1.5 text-xs text-emerald-400/70 transition hover:bg-emerald-900/40 hover:text-emerald-200"
            >
              ?
            </button>
            <button
              onClick={() => setShowGoodNight(v => !v)}
              aria-label="Close the day"
              className="rounded-lg px-2 py-1.5 text-sm transition hover:bg-emerald-900/40"
            >
              🌙
            </button>
            <button
              onClick={() => setView('profile')}
              aria-label="Profile"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-700/50 bg-emerald-900/60 text-[11px] font-medium text-emerald-200 transition hover:bg-emerald-800/60"
            >
              {(profile.name || 'J').charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg">{renderTab()}</div>

      {/* Living companion prompts */}
      <SmartPopups
        profile={profile}
        onNavigate={navigate}
        onCloseDay={() => setShowGoodNight(true)}
        refreshKey={popupTick}
      />

      {showGoodNight && <GoodNightRitual profile={profile} onClose={() => setShowGoodNight(false)} />}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-lg">
          <div className="mx-2 mb-2 rounded-2xl border border-emerald-800/30 bg-[#0a1a0a]/95 backdrop-blur-xl">
            <div className="flex items-center gap-0.5 overflow-x-auto px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex min-w-[46px] flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition ${
                    tab === t.key
                      ? 'bg-emerald-800/50 text-emerald-100'
                      : 'text-emerald-500/50 hover:text-emerald-300/80'
                  }`}
                >
                  <span className="text-base leading-none">{t.icon}</span>
                  <span className="text-[8px] font-medium leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
