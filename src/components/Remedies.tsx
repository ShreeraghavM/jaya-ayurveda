import { useState } from 'react'
import { remediesDatabase, type UserProfile, type Remedy } from '../lib/data'
import { Card } from '@/components/ui/card'

interface Props {
  profile: UserProfile
}

export default function Remedies({ profile }: Props) {
  const dosha = profile.doshaType || 'Vata'
  const [search, setSearch] = useState('')
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null)

  const filteredRemedies = search
    ? remediesDatabase.filter(r =>
        r.condition.toLowerCase().includes(search.toLowerCase()) ||
        r.remedy.toLowerCase().includes(search.toLowerCase())
      )
    : remediesDatabase

  const sortedRemedies = [...filteredRemedies].sort((a, b) => {
    const aMatch = a.doshaType.includes(dosha) ? 0 : 1
    const bMatch = b.doshaType.includes(dosha) ? 0 : 1
    return aMatch - bMatch
  })

  const quickSearches = ['Headache', 'Cold', 'Anxiety', 'Insomnia', 'Fatigue', 'Digestion', 'Skin', 'Joint']

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #0a1a0a 0%, #0d1f0d 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-emerald-100 mb-1">Ayurvedic Remedies</h1>
        <p className="text-emerald-300/60 text-sm">Natural healing wisdom for everyday ailments</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setSelectedRemedy(null) }}
          placeholder="Search remedies... (e.g. headache, cold, anxiety)"
          className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-4 py-3 text-sm text-emerald-100 placeholder:text-emerald-600/50 outline-none focus:border-emerald-600/50 transition-colors"
        />
      </div>

      {/* Quick Search */}
      {!search && (
        <div className="px-5 mb-6">
          <div className="flex flex-wrap gap-2">
            {quickSearches.map(q => (
              <button
                key={q}
                onClick={() => setSearch(q)}
                className="px-3 py-1.5 rounded-full text-xs bg-emerald-900/30 border border-emerald-800/20 text-emerald-300/60 hover:bg-emerald-800/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Important Disclaimer */}
      {!search && (
        <div className="px-5 mb-6">
          <div className="bg-amber-900/15 border border-amber-800/20 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <p className="text-amber-200/60 text-xs leading-relaxed">
                These remedies are for mild, everyday ailments. For serious or persistent conditions, always consult a qualified Ayurvedic practitioner or medical doctor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Remedy Detail */}
      {selectedRemedy && (
        <div className="px-5 mb-6">
          <Card className="bg-emerald-950/50 border-emerald-700/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-emerald-100 font-semibold text-lg">{selectedRemedy.condition}</h2>
              <button
                onClick={() => setSelectedRemedy(null)}
                className="text-emerald-400/50 hover:text-emerald-300 text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Remedy</h4>
                <p className="text-emerald-100/80 text-sm leading-relaxed">{selectedRemedy.remedy}</p>
              </div>

              <div>
                <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Preparation</h4>
                <p className="text-emerald-200/70 text-xs leading-relaxed">{selectedRemedy.preparation}</p>
              </div>

              <div>
                <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Dosage</h4>
                <p className="text-emerald-200/70 text-xs leading-relaxed">{selectedRemedy.dosage}</p>
              </div>

              <div>
                <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-2">Ingredients</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRemedy.ingredients.map(ing => (
                    <span key={ing} className="px-2 py-0.5 rounded-full text-[10px] bg-amber-900/20 text-amber-200/60 border border-amber-800/20">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs">⚠️</span>
                  <p className="text-amber-200/50 text-[11px]">{selectedRemedy.precautions}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-500/40 uppercase tracking-wider">Best for:</span>
                {selectedRemedy.doshaType.map(d => (
                  <span key={d} className="text-xs">
                    {d === 'Vata' ? '🌬️ Vata' : d === 'Pitta' ? '🔥 Pitta' : '🌍 Kapha'}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Remedy List */}
      <div className="px-5 space-y-3">
        {sortedRemedies.map((remedy, i) => {
          const isRecommended = remedy.doshaType.includes(dosha)
          const isSelected = selectedRemedy?.condition === remedy.condition
          
          return (
            <button
              key={i}
              onClick={() => setSelectedRemedy(isSelected ? null : remedy)}
              className={`w-full text-left rounded-xl p-4 transition-all ${
                isSelected
                  ? 'bg-emerald-800/40 border border-emerald-600/30'
                  : isRecommended
                  ? 'bg-emerald-950/40 border border-emerald-700/20 hover:bg-emerald-900/20'
                  : 'bg-emerald-950/20 border border-emerald-800/10 hover:bg-emerald-900/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isRecommended && <span className="text-xs">⭐</span>}
                    <h3 className="text-emerald-100 font-semibold text-sm">{remedy.condition}</h3>
                  </div>
                  <p className="text-emerald-200/50 text-xs leading-relaxed line-clamp-2">{remedy.remedy}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                  remedy.severity === 'mild' 
                    ? 'bg-emerald-800/20 text-emerald-300/60 border-emerald-700/20'
                    : 'bg-amber-900/20 text-amber-300/60 border-amber-700/20'
                }`}>
                  {remedy.severity}
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {remedy.doshaType.map(d => (
                  <span key={d} className="text-[10px]">
                    {d === 'Vata' ? '🌬️' : d === 'Pitta' ? '🔥' : '🌍'}
                  </span>
                ))}
              </div>
            </button>
          )
        })}

        {filteredRemedies.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-emerald-400/50 text-sm">No remedies found for "{search}"</p>
            <p className="text-emerald-500/30 text-xs mt-1">Try: headache, cold, anxiety, insomnia, fatigue</p>
          </div>
        )}
      </div>
    </div>
  )
}
