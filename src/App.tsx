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
import CharakaExplorer from './components/CharakaExplorer'

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
  const [showCharakaExplorer, setShowCharakaExplorer] = useState(false)
  const [popupTick, setPopupTick] = useState(0)
  const [profileInitialTab, setProfileInitialTab] = useState<'anatomy' | 'lab_reports' | 'bedtime_review' | 'desha_satmya' | 'metabolic' | 'details'>('anatomy')

  const handleOpenAnatomy = () => {
    if (!profile) handleDemo()
    setProfileInitialTab('anatomy')
    setView('profile')
  }

  const handleOpenAharaMatra = () => {
    if (!profile) handleDemo()
    setProfileInitialTab('desha_satmya')
    setView('profile')
  }

  const handleOpenMetabolic = () => {
    if (!profile) handleDemo()
    setProfileInitialTab('metabolic')
    setView('profile')
  }

  const handleOpenDietPlan = () => {
    if (!profile) handleDemo()
    setTab('diet')
    setView('app')
  }

  const handleOpenProfile = (initialTab: 'anatomy' | 'lab_reports' | 'bedtime_review' | 'desha_satmya' | 'metabolic' | 'details' = 'anatomy') => {
    if (!profile) handleDemo()
    setProfileInitialTab(initialTab)
    setView('profile')
  }

  useEffect(() => {
    const isLandingRequested = window.location.hash === '#landing' || window.location.search.includes('landing')
    const saved = getUserProfile()
    const savedSession = getSession()
    if (saved?.completedOnboarding && !isLandingRequested) {
      setProfile(saved)
      setSession(savedSession)
      setView('app')
    } else {
      setView('landing')
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
          onOpenHealthIntake={() => setShowHealthIntake(true)}
          onOpenChapters={() => setShowCharakaExplorer(true)}
          onOpenAnatomy={handleOpenAnatomy}
          onOpenAharaMatra={handleOpenAharaMatra}
          onOpenDietPlan={handleOpenDietPlan}
          onOpenProfile={() => handleOpenProfile('anatomy')}
          onOpenSpringShield={handleOpenMetabolic}
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
        {showCharakaExplorer && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
            <div className="max-w-4xl mx-auto">
              <CharakaExplorer
                onClose={() => setShowCharakaExplorer(false)}
                onSelectCondition={() => {
                  setShowCharakaExplorer(false)
                  handleDemo()
                  setTab('remedies')
                }}
              />
            </div>
          </div>
        )}
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
          onOpenChapters={() => setShowCharakaExplorer(true)}
          onOpenAnatomy={handleOpenAnatomy}
          onOpenAharaMatra={handleOpenAharaMatra}
          onOpenDietPlan={handleOpenDietPlan}
          onOpenProfile={() => handleOpenProfile('anatomy')}
          onOpenSpringShield={handleOpenMetabolic}
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
        {showCharakaExplorer && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
            <div className="max-w-4xl mx-auto">
              <CharakaExplorer
                onClose={() => setShowCharakaExplorer(false)}
                onSelectCondition={() => {
                  setShowCharakaExplorer(false)
                  handleDemo()
                  setTab('remedies')
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
        onOpenHealthIntake={() => setShowHealthIntake(true)}
        initialTab={profileInitialTab}
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
            onOpenChapters={() => setShowCharakaExplorer(true)}
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
            <button onClick={() => setView('landing')} className="flex items-center gap-1.5 group" title="Go to Landing Page">
              <span className="text-base group-hover:scale-110 transition-transform">🌿</span>
              <span className="text-xs font-bold tracking-tight text-emerald-100">Jaya</span>
            </button>

            {/* Direct Landing Page Button */}
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-600/50 bg-emerald-950/60 text-[10px] font-semibold text-emerald-200 hover:bg-emerald-900/60 transition shadow-sm"
              title="Return to Welcome & Landing Page"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Landing</span>
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

            {/* Charaka Samhita 120 Chapters Explorer Trigger Badge */}
            <button
              onClick={() => setShowCharakaExplorer(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/15 text-[10px] font-mono text-amber-200 hover:bg-amber-500/30 transition shadow-sm"
              title="Charaka Samhita 120 Chapters Explorer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold text-amber-100 sm:hidden">📜 120</span>
              <span className="font-bold text-amber-100 hidden sm:inline">📜 120 Chapters</span>
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

            {/* User Avatar & Profile Link */}
            <button
              onClick={() => {
                setProfileInitialTab('details')
                setView('profile')
              }}
              aria-label="Profile"
              className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-700/50 bg-emerald-900/60 text-[11px] font-medium text-emerald-200 transition hover:bg-emerald-800/60 shadow-sm"
              title="User Profile & Account Hub"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-emerald-100">
                {(profile.name || 'J').charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline font-semibold text-emerald-100">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2026 CORE PILLARS FAST BAR ─── */}
      <div className="bg-[#051108]/95 border-b border-emerald-900/40 px-3 py-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sticky top-[47px] z-20 backdrop-blur-md">
        <div className="mx-auto max-w-lg flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-[11px] font-bold text-emerald-100 hover:bg-emerald-900/80 transition shadow-sm"
            title="Return to Welcome / Landing Page"
          >
            <span>🏠</span>
            <span>Landing Page</span>
          </button>

          <button
            onClick={handleOpenAnatomy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition shadow-sm ${
              view === 'profile' && profileInitialTab === 'anatomy'
                ? 'bg-emerald-700/60 border-emerald-400 text-white font-bold'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            <span>🧬</span>
            <span className="font-semibold text-emerald-100">Anatomy Visualizer</span>
          </button>

          <button
            onClick={handleOpenAharaMatra}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition shadow-sm ${
              view === 'profile' && profileInitialTab === 'desha_satmya'
                ? 'bg-amber-700/60 border-amber-400 text-white font-bold'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <span>🌾</span>
            <span className="font-semibold text-amber-100">Ahara Matra (1/3)</span>
          </button>

          <button
            onClick={handleOpenMetabolic}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition shadow-sm ${
              view === 'profile' && profileInitialTab === 'metabolic'
                ? 'bg-rose-700/60 border-rose-400 text-white font-bold'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200 hover:bg-rose-900/60'
            }`}
          >
            <span>🌸</span>
            <span className="font-semibold text-rose-100">Spring Shield & BMR</span>
          </button>

          <button
            onClick={handleOpenDietPlan}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition ${
              tab === 'diet' && view === 'app'
                ? 'bg-emerald-700/60 border-emerald-400 text-white font-bold'
                : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40'
            }`}
          >
            <span>🍽️</span>
            <span>Diet Plan</span>
          </button>

          <button
            onClick={() => handleOpenProfile('details')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition ${
              view === 'profile' && profileInitialTab === 'details'
                ? 'bg-indigo-700/60 border-indigo-400 text-white font-bold'
                : 'bg-indigo-950/40 border-indigo-800/40 text-indigo-300 hover:bg-indigo-900/40'
            }`}
          >
            <span>👤</span>
            <span>User Profile</span>
          </button>

          <button
            onClick={() => setShowCharakaExplorer(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/30 border border-amber-600/30 text-[11px] font-medium text-amber-300/90 hover:bg-amber-900/40 transition"
          >
            <span>📜</span>
            <span>120 Chapters</span>
          </button>

          <button
            onClick={() => setShowHealthIntake(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/30 border border-emerald-600/30 text-[11px] font-medium text-emerald-300/90 hover:bg-emerald-900/40 transition"
          >
            <span>🩺</span>
            <span>Health Intake</span>
          </button>
        </div>
      </div>

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

      {/* Canonical Charaka Samhita 120 Chapters Explorer Modal */}
      {showCharakaExplorer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
          <div className="max-w-4xl mx-auto">
            <CharakaExplorer
              onClose={() => setShowCharakaExplorer(false)}
              onSelectCondition={() => {
                setShowCharakaExplorer(false)
                setTab('remedies')
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
        onOpenChapters={() => setShowCharakaExplorer(true)}
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
