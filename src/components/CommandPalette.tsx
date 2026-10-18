import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { DISEASE_REPERTORY } from '../lib/knowledgeBase'

interface Props {
  isOpen: boolean
  onClose: () => void
  onNavigate: (tab: string) => void
  onOpenGrantDeck: () => void
  onOpenHealthIntake?: () => void
}

interface CommandItem {
  id: string
  title: string
  subtitle: string
  category: 'Navigation' | 'Remedies' | 'Actions'
  icon: string
  action: () => void
}

export default function CommandPalette({ isOpen, onClose, onNavigate, onOpenGrantDeck, onOpenHealthIntake }: Props) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const items: CommandItem[] = [
    {
      id: 'nav-home',
      title: 'Home Dashboard',
      subtitle: 'Sun arc, current moment guidance, water tracker',
      category: 'Navigation',
      icon: '🏠',
      action: () => { onNavigate('home'); onClose() },
    },
    {
      id: 'nav-coach',
      title: 'Ayurvedic AI Vaidya (Coach)',
      subtitle: 'Conversational shloka-backed guidance & advice',
      category: 'Navigation',
      icon: '💬',
      action: () => { onNavigate('chat'); onClose() },
    },
    {
      id: 'nav-routine',
      title: 'Dinacharya Routine',
      subtitle: 'Sunrise to sunset hour-by-hour step confirmation',
      category: 'Navigation',
      icon: '🕐',
      action: () => { onNavigate('routine'); onClose() },
    },
    {
      id: 'nav-diet',
      title: 'Diet & Shad Rasa (6 Tastes)',
      subtitle: 'Agni peak nutrition and regional Ayurvedic recipes',
      category: 'Navigation',
      icon: '🍽️',
      action: () => { onNavigate('diet'); onClose() },
    },
    {
      id: 'nav-yoga',
      title: 'Yoga & Pranayama Studio',
      subtitle: 'Interactive breathing sphere & dosha-specific asanas',
      category: 'Navigation',
      icon: '🧘',
      action: () => { onNavigate('yoga'); onClose() },
    },
    {
      id: 'nav-remedies',
      title: 'Herbal Remedies Vault',
      subtitle: 'Charaka Samhita verified natural cures & preparations',
      category: 'Navigation',
      icon: '🌿',
      action: () => { onNavigate('remedies'); onClose() },
    },
    {
      id: 'nav-goals',
      title: 'Clinical Goals & Streaks',
      subtitle: 'Mechanisms explaining why habits work for your body',
      category: 'Navigation',
      icon: '🎯',
      action: () => { onNavigate('goals'); onClose() },
    },
    {
      id: 'nav-progress',
      title: 'Weekly Progress & Ojas Index',
      subtitle: 'Sleep quality, water, and day completion trendlines',
      category: 'Navigation',
      icon: '📊',
      action: () => { onNavigate('progress'); onClose() },
    },
    {
      id: 'action-grant',
      title: 'AYUSH Seed Round & Grant Pitch Deck',
      subtitle: 'Interactive investor presentation & $100k / ₹10L allocation',
      category: 'Actions',
      icon: '🌱',
      action: () => { onClose(); onOpenGrantDeck() },
    },
    {
      id: 'action-health-intake',
      title: 'Clinical Health Issue Assessment & Vector Healing Plan',
      subtitle: 'Polite AI Vaidya intake for Blood Sugar, BP, Joints, and exact diet/yoga metrics',
      category: 'Actions',
      icon: '🩺',
      action: () => { onClose(); onOpenHealthIntake?.() },
    },
    {
      id: 'rem-ashwagandha',
      title: 'Ashwagandha (Withania somnifera)',
      subtitle: 'Calms Vata nervous exhaustion, reduces cortisol',
      category: 'Remedies',
      icon: '🌿',
      action: () => { onNavigate('remedies'); onClose() },
    },
    {
      id: 'rem-triphala',
      title: 'Triphala Churna',
      subtitle: 'Balancing for all 3 doshas, gentle digestive detoxifier',
      category: 'Remedies',
      icon: '🌿',
      action: () => { onNavigate('remedies'); onClose() },
    },
    {
      id: 'rem-brahmi',
      title: 'Brahmi (Bacopa monnieri)',
      subtitle: 'Cools Pitta mental heat, enhances focus & memory',
      category: 'Remedies',
      icon: '🌿',
      action: () => { onNavigate('remedies'); onClose() },
    },
    {
      id: 'rem-tulsi',
      title: 'Holy Basil (Tulsi)',
      subtitle: 'Clears Kapha congestion, builds Ojas and immune resilience',
      category: 'Remedies',
      icon: '🌿',
      action: () => { onNavigate('remedies'); onClose() },
    },
    ...DISEASE_REPERTORY.map(d => ({
      id: `rep-${d.id}`,
      title: `${d.condition}`,
      subtitle: `${d.sanskrit} · Primary: ${d.primaryHerbs.slice(0, 3).join(', ')}`,
      category: 'Remedies' as const,
      icon: '📜',
      action: () => { onNavigate('remedies'); onClose() },
    })),
  ]

  const filtered = items.filter(
    item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-600/40 bg-[#09160e] text-emerald-50 shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-emerald-900/60 bg-emerald-950/40">
          <span className="text-emerald-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, remedy, or feature (e.g. 'Yoga', 'Grant', 'Triphala')..."
            className="w-full bg-transparent text-sm text-emerald-100 placeholder:text-emerald-500/50 outline-none"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/40 border border-emerald-800/40 text-emerald-400/80">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 [scrollbar-width:none]">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-400/60">
              No matching commands or remedies found.
            </div>
          ) : (
            filtered.map(item => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-900/40 transition text-left group"
              >
                <div className="h-8 w-8 rounded-xl bg-black/40 border border-emerald-800/50 flex items-center justify-center text-base shrink-0 group-hover:border-emerald-500/50">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-emerald-800/60 text-emerald-400/60 font-mono">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-emerald-300/60 truncate">{item.subtitle}</p>
                </div>
                <span className="text-xs text-emerald-500/50 group-hover:text-emerald-300">→</span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-emerald-900/40 bg-black/30 flex items-center justify-between text-[10px] text-emerald-400/50 font-mono">
          <span>Navigate with mouse or tap</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  )
}
