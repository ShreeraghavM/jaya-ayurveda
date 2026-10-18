import { useState } from 'react'
import { remediesDatabase, type UserProfile, type Remedy } from '../lib/data'
import { Card } from '@/components/ui/card'
import CharakaSamhitaVault from './CharakaSamhitaVault'

interface Props {
  profile: UserProfile
}

export default function Remedies({ profile }: Props) {
  const dosha = profile.doshaType || 'Vata'
  const [activeSubTab, setActiveSubTab] = useState<'remedies' | 'charaka'>('remedies')
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
        <h1 className="text-2xl font-bold text-emerald-100 mb-1">
          {activeSubTab === 'remedies' ? 'Ayurvedic Remedies Vault' : 'Charaka Samhita Manuscripts'}
        </h1>
        <p className="text-emerald-300/60 text-sm">
          {activeSubTab === 'remedies'
            ? 'Natural healing wisdom & preparations for everyday ailments'
            : 'Classical Sanskrit sutras with clinical chronobiology insights'}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 bg-emerald-950/40 rounded-xl p-1 border border-emerald-800/20">
          <button
            onClick={() => { setActiveSubTab('remedies'); setSelectedRemedy(null) }}
            className={`flex-1 py-2 rounded-lg text-center transition-all text-sm font-medium ${
              activeSubTab === 'remedies'
                ? 'bg-emerald-700/50 text-emerald-100 shadow-sm'
                : 'text-emerald-400/50 hover:text-emerald-300/70'
            }`}
          >
            🌿 Home Remedies ({remediesDatabase.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('charaka'); setSelectedRemedy(null) }}
            className={`flex-1 py-2 rounded-lg text-center transition-all text-sm font-medium ${
              activeSubTab === 'charaka'
                ? 'bg-amber-700/50 text-amber-100 shadow-sm'
                : 'text-emerald-400/50 hover:text-amber-300/70'
            }`}
          >
            📜 Classical Sutras (RAG)
          </button>
        </div>
      </div>

      {activeSubTab === 'charaka' ? (
        <div className="px-5">
          <CharakaSamhitaVault />
        </div>
      ) : (
        <>
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
              <Card className="bg-emerald-950/50 border-emerald-700/30 p-5 rounded-2xl">
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
                        <span key={ing} className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-900/30 text-emerald-300/70 border border-emerald-800/20">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Precautions</h4>
                    <p className="text-amber-200/60 text-xs leading-relaxed">{selectedRemedy.precautions}</p>
                  </div>

                  <div>
                    <h4 className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Best For</h4>
                    <div className="flex gap-1">
                      {selectedRemedy.doshaType.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800/30 text-emerald-200 border border-emerald-700/20">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Remedy List */}
          <div className="px-5 space-y-3">
            {sortedRemedies.map((remedy, i) => {
              const isMatch = remedy.doshaType.includes(dosha)

              return (
                <Card
                  key={i}
                  onClick={() => setSelectedRemedy(remedy)}
                  className={`bg-emerald-950/25 border-emerald-800/20 p-4 rounded-2xl cursor-pointer hover:bg-emerald-950/40 transition-all ${
                    isMatch ? 'border-l-2 border-l-emerald-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-emerald-100 font-medium text-sm">{remedy.condition}</h3>
                        {isMatch && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-800/30 text-emerald-300 font-mono">
                            Good for you
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-300/60 text-xs mt-1 line-clamp-1">{remedy.remedy}</p>
                    </div>
                    <span className="text-emerald-500/40 text-xs">→</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
