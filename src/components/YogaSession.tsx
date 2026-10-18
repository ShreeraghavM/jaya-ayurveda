import { useState } from 'react'
import { yogaPoses, pranayamaTechniques, type UserProfile, type YogaPose } from '../lib/data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BreathingSphere from './BreathingSphere'

interface Props {
  profile: UserProfile
}

type Tab = 'yoga' | 'pranayama'

export default function YogaSession({ profile }: Props) {
  const dosha = profile.doshaType || 'Vata'
  const [activeTab, setActiveTab] = useState<Tab>('yoga')
  const [expandedPose, setExpandedPose] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | Dosha>('all')

  type Dosha = 'Vata' | 'Pitta' | 'Kapha'

  const poses = activeTab === 'yoga' ? yogaPoses : pranayamaTechniques
  const filteredPoses = filter === 'all'
    ? poses
    : poses.filter(p => p.doshaFriendly.includes(filter))

  const sortedPoses = [...filteredPoses].sort((a, b) => {
    const aFriendly = a.doshaFriendly.includes(dosha) ? 0 : 1
    const bFriendly = b.doshaFriendly.includes(dosha) ? 0 : 1
    return aFriendly - bFriendly
  })

  const getDifficultyColor = (d: string) => {
    if (d === 'beginner') return 'bg-emerald-800/30 text-emerald-300/70 border-emerald-700/20'
    if (d === 'intermediate') return 'bg-amber-900/30 text-amber-300/70 border-amber-700/20'
    return 'bg-red-900/30 text-red-300/70 border-red-700/20'
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #0a1a0a 0%, #0d1f0d 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-emerald-100 mb-1">
          {activeTab === 'yoga' ? 'Yoga Asanas' : 'Pranayama'}
        </h1>
        <p className="text-emerald-300/60 text-sm">
          {activeTab === 'yoga' 
            ? 'Postures tailored to your constitution'
            : 'Breathing techniques for balance and vitality'}
        </p>
      </div>

      {/* Tab Switch */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 bg-emerald-950/40 rounded-xl p-1 border border-emerald-800/20">
          {[
            { key: 'yoga' as Tab, icon: '🧘', label: 'Asanas' },
            { key: 'pranayama' as Tab, icon: '🫁', label: 'Breathing' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpandedPose(null) }}
              className={`flex-1 py-2 rounded-lg text-center transition-all text-sm ${
                activeTab === tab.key
                  ? 'bg-emerald-700/50 text-emerald-100 font-medium'
                  : 'text-emerald-400/50 hover:text-emerald-300/70'
              }`}
            >
              <span className="mr-1">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dosha Filter */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {(['all', 'Vata', 'Pitta', 'Kapha'] as const).map(d => (
            <button
              key={d}
              onClick={() => { setFilter(d as any); setExpandedPose(null) }}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                filter === d
                  ? 'bg-emerald-700/50 border border-emerald-600/30 text-emerald-100'
                  : 'bg-emerald-950/30 border border-emerald-800/20 text-emerald-400/50 hover:bg-emerald-900/20'
              }`}
            >
              {d === 'all' ? 'All' : d === 'Vata' ? '🌬️ Vata' : d === 'Pitta' ? '🔥 Pitta' : '🌍 Kapha'}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Banner */}
      {activeTab === 'yoga' && (
        <div className="px-5 mb-4">
          <Card className="bg-gradient-to-r from-violet-900/20 to-emerald-900/20 border-violet-800/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">⭐</span>
              <h3 className="text-violet-200/80 text-xs font-semibold tracking-wider uppercase">
                Recommended for {dosha}
              </h3>
            </div>
            <p className="text-emerald-200/60 text-xs leading-relaxed">
              {dosha === 'Vata' 
                ? 'Start with grounding poses: Child\'s Pose, Tree Pose, Bridge, and Forward Folds. Hold each for 1-2 minutes. End with a long Savasana.'
                : dosha === 'Pitta'
                ? 'Cool with Moon Salutation, Seated Forward Fold, Supine Twist, and gentle backbends. Practice in a cool room.'
                : 'Energize with Sun Salutation, Warrior II, Camel Pose, and dynamic Vinyasa. Start with Kapalabhati.'}
            </p>
          </Card>
        </div>
      )}

      {activeTab === 'pranayama' && (
        <div className="px-5 mb-4">
          <BreathingSphere userDosha={dosha} />
        </div>
      )}

      {/* Pose Cards */}
      <div className="px-5 space-y-3">
        {sortedPoses.map((pose, i) => {
          const isExpanded = expandedPose === i
          const isRecommended = pose.doshaFriendly.includes(dosha)
          
          return (
            <Card
              key={i}
              className={`overflow-hidden transition-all ${
                isRecommended
                  ? 'bg-emerald-950/40 border-emerald-700/30'
                  : 'bg-emerald-950/20 border-emerald-800/20'
              }`}
            >
              <button
                onClick={() => setExpandedPose(isExpanded ? null : i)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isRecommended && <span className="text-xs">⭐</span>}
                      <h3 className="text-emerald-100 font-semibold text-sm">{pose.name}</h3>
                    </div>
                    <p className="text-emerald-400/50 text-xs italic">{pose.sanskrit}</p>
                  </div>
                  <span className="text-emerald-500/30 text-xs mt-1">{isExpanded ? '▲' : '▼'}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getDifficultyColor(pose.difficulty)}`}>
                    {pose.difficulty}
                  </span>
                  <span className="text-emerald-500/40 text-[10px]">{pose.duration}</span>
                  <div className="flex gap-1 ml-auto">
                    {pose.doshaFriendly.map(d => (
                      <span key={d} className="text-[10px]">
                        {d === 'Vata' ? '🌬️' : d === 'Pitta' ? '🔥' : '🌍'}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-emerald-200/60 text-xs mt-2 leading-relaxed line-clamp-2">
                  {pose.description}
                </p>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-emerald-800/20">
                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Description</h4>
                      <p className="text-emerald-200/70 text-xs leading-relaxed">{pose.description}</p>
                    </div>
                    <div>
                      <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Benefits</h4>
                      <div className="flex flex-wrap gap-1">
                        {pose.benefits.map(b => (
                          <span key={b} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-800/20 text-emerald-300/60 border border-emerald-700/15">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                    {pose.contraindications && (
                      <div>
                        <h4 className="text-red-300/60 text-[10px] uppercase tracking-wider mb-1">⚠️ Precautions</h4>
                        <p className="text-red-200/40 text-[11px]">{pose.contraindications.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
