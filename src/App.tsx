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
import GrantPitchModal from './components/GrantPitchModal'
import PersonaSwitcher from './components/PersonaSwitcher'
import CommandPalette from './components/CommandPalette'
import HealthIntakeConsultation from './components/HealthIntakeConsultation'

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
  const [showGrantPitch, setShowGrantPitch] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showHealthIntake, setShowHealthIntake] = useState(false)
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowCommandPalette(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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

  const handleSelectPersona = (p: UserProfile) => {
    saveUserProfile(p)
    const demoSession: AuthSession = {
      name: p.name,
      email: p.email ?? '',
      mode: 'demo',
      signedInAt: new Date().toISOString(),
    }
    saveSession(demoSession)
    setProfile(p)
    setSession(demoSession)
    setView('app')
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
      <>
        <LandingPage
          onStart={() => setView('onboarding')}
          onDemo={handleDemo}
          onGuide={() => openGuide('landing')}
          onOpenGrantDeck={() => setShowGrantPitch(true)}
        />
        <GrantPitchModal isOpen={showGrantPitch} onClose={() => setShowGrantPitch(false)} />
      </>
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
      <>
        <LandingPage
          onStart={() => setView('onboarding')}
          onDemo={handleDemo}
          onGuide={() => openGuide('landing')}
          onOpenGrantDeck={() => setShowGrantPitch(true)}
          onOpenHealthIntake={() => setShowHealthIntake(true)}
        />
        <GrantPitchModal isOpen={showGrantPitch} onClose={() => setShowGrantPitch(false)} />
        {showHealthIntake && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
            <div className="max-w-4xl mx-auto">
              <HealthIntakeConsultation
                profile={DEMO_PROFILE}
                onClose={() => setShowHealthIntake(false)}
                onNavigateTab={nextTab => {
                  setShowHealthIntake(false)
                  handleDemo()
                  setTab(nextTab as Tab)
                }}
              />
            </div>
          </div>
        )}
      </>
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
        return (
          <Dashboard
            profile={profile}
            onNavigate={navigate}
            onOpenHealthIntake={() => setShowHealthIntake(true)}
          />
        )
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
    <div className="min-h-screen bg-[#08140c] text-emerald-50 font-sans">
      {/* Top bar with 2026 AI Standard Glassmorphism Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/40 bg-[#08140c]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => setTab('home')} className="flex items-center gap-1.5 group">
              <span className="text-base group-hover:scale-110 transition-transform">🌿</span>
              <span className="text-xs font-bold tracking-tight text-emerald-100">Jaya</span>
            </button>

            {/* Clinical Health Assessment Trigger Badge */}
            <button
              onClick={() => setShowHealthIntake(true)}
              className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-400 bg-emerald-500/25 text-[11px] font-mono font-medium text-emerald-100 hover:bg-emerald-500/40 transition shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/50"
              title="Clinical Health Assessment & Vector Healing Plan"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-bold text-emerald-50">🩺 Health</span>
            </button>

            {/* Grant Deck Trigger Badge */}
            <button
              onClick={() => setShowGrantPitch(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-[10px] font-mono text-amber-300 hover:bg-amber-500/20 transition shadow-sm"
              title="View $100k Seed / AYUSH Grant Pitch Deck"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>🌱 Pitch</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Quick Demo Persona Switcher */}
            <PersonaSwitcher
              currentProfile={profile}
              onSelectPersona={handleSelectPersona}
              onNewAssessment={() => setView('onboarding')}
            />

            {/* Quick Command Palette */}
            <button
              onClick={() => setShowCommandPalette(true)}
              aria-label="Search"
              className="rounded-lg p-1.5 text-xs text-emerald-400/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition"
              title="Search & Commands (⌘K)"
            >
              🔍
            </button>

            {/* User Guide */}
            <button
              onClick={() => openGuide('app')}
              aria-label="User guide"
              className="rounded-lg px-2 py-1 text-xs text-emerald-400/70 transition hover:bg-emerald-900/40 hover:text-emerald-200"
            >
              ?
            </button>

            {/* Night Ritual */}
            <button
              onClick={() => setShowGoodNight(v => !v)}
              aria-label="Close the day"
              className="rounded-lg px-1.5 py-1 text-sm transition hover:bg-emerald-900/40"
              title="Bedtime Closing Ritual"
            >
              🌙
            </button>

            {/* User Avatar */}
            <button
              onClick={() => setView('profile')}
              aria-label="Profile"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-700/50 bg-emerald-900/60 text-[11px] font-medium text-emerald-200 transition hover:bg-emerald-800/60 shadow-sm"
            >
              {(profile.name || 'J').charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="mx-auto max-w-lg">{renderTab()}</main>

      {/* Living companion proactive smart popups */}
      <SmartPopups
        profile={profile}
        onNavigate={navigate}
        onCloseDay={() => setShowGoodNight(true)}
        refreshKey={popupTick}
      />

      {/* Good Night Bedtime Ritual */}
      {showGoodNight && <GoodNightRitual profile={profile} onClose={() => setShowGoodNight(false)} />}

      {/* AYUSH Grant & Seed Round Pitch Deck Modal */}
      <GrantPitchModal isOpen={showGrantPitch} onClose={() => setShowGrantPitch(false)} />

      {/* Clinical Health Intake & Vector Matching Modal */}
      {showHealthIntake && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
          <div className="max-w-4xl mx-auto">
            <HealthIntakeConsultation
              profile={profile}
              onClose={() => setShowHealthIntake(false)}
              onNavigateTab={nextTab => {
                setShowHealthIntake(false)
                setTab(nextTab as Tab)
              }}
            />
          </div>
        </div>
      )}

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={navigate}
        onOpenGrantDeck={() => setShowGrantPitch(true)}
        onOpenHealthIntake={() => setShowHealthIntake(true)}
      />

      {/* Bottom Floating Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-lg">
          <div className="mx-2 mb-2 rounded-2xl border border-emerald-800/30 bg-[#0a1a0a]/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-0.5 overflow-x-auto px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex min-w-[46px] flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition ${
                    tab === t.key
                      ? 'bg-emerald-800/50 text-emerald-100 shadow-inner'
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
