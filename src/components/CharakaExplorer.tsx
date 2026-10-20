import { useState, useMemo } from 'react'
import {
  getCharakaSthanas,
  getAllCharakaChapters,
  type CharakaChapter,
  type CharakaSthanaMeta,
  DISEASE_REPERTORY,
  type DiseaseRemedy,
} from '@/lib/knowledgeBase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  onSelectCondition?: (condition: DiseaseRemedy) => void
  onClose?: () => void
}

export default function CharakaExplorer({ onSelectCondition, onClose }: Props) {
  const [selectedSthana, setSelectedSthana] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [onlyClinicallyLinked, setOnlyClinicallyLinked] = useState<boolean>(false)

  const sthanas = useMemo(() => getCharakaSthanas(), [])
  const allChapters = useMemo(() => getAllCharakaChapters(), [])

  const filteredChapters = useMemo(() => {
    return allChapters.filter(ch => {
      // Sthana filter
      if (selectedSthana !== 'all' && ch.sthanaId !== selectedSthana) {
        return false
      }
      // Clinically linked filter
      if (onlyClinicallyLinked && !ch.matchedConditionId) {
        return false
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = ch.englishTitle.toLowerCase().includes(q)
        const matchSanskrit = ch.sanskritTitle.toLowerCase().includes(q)
        const matchFull = ch.fullTitle.toLowerCase().includes(q)
        const matchSthana = ch.sthanaName.toLowerCase().includes(q)
        return matchTitle || matchSanskrit || matchFull || matchSthana
      }
      return true
    })
  }, [allChapters, selectedSthana, searchQuery, onlyClinicallyLinked])

  const currentSthanaMeta: CharakaSthanaMeta | undefined = useMemo(() => {
    if (selectedSthana === 'all') return undefined
    const found = sthanas.find(s => s.id === selectedSthana)
    return found?.meta
  }, [sthanas, selectedSthana])

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0c2317] via-[#091b11] to-[#06120b] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📜</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-mono">
                CANONICAL VAULT · 120 ADHYAYAS
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-mono">
                VIII STHANAS
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-50">
              Charaka Samhita 120 Chapters Explorer
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/70 mt-1 max-w-2xl">
              The foundational encyclopedic authority of Ayurvedic medicine from{' '}
              <a
                href="https://www.carakasamhitaonline.com/index.php?title=Adhyaya(chapters)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                carakasamhitaonline.com
              </a>
              , indexed by chapter number, Sanskrit title, and clinical therapeutics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {filteredChapters.length} <span className="text-xs text-emerald-500 font-normal">/ 120</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-400/60 font-mono">
                Chapters Listed
              </div>
            </div>
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-emerald-700/60 bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 hover:text-white rounded-xl text-xs font-mono ml-2"
              >
                ✕ Close
              </Button>
            )}
          </div>
        </div>

        {/* SEARCH AND QUICK FILTERS */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-emerald-900/50">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              placeholder="Search across 120 chapters (e.g. 'Matrashiteeya', 'Prameha', 'Sleep', 'Fever', 'Yonivyapat')..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-emerald-700/50 bg-black/40 px-4 py-2.5 text-xs sm:text-sm text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-emerald-400 hover:text-emerald-200"
              >
                ✕
              </button>
            )}
          </div>
          <div className="sm:col-span-4 flex items-center">
            <button
              onClick={() => setOnlyClinicallyLinked(!onlyClinicallyLinked)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-mono transition ${
                onlyClinicallyLinked
                  ? 'border-emerald-400 bg-emerald-500/25 text-emerald-100'
                  : 'border-emerald-800/60 bg-black/30 text-emerald-400/70 hover:border-emerald-700 hover:text-emerald-300'
              }`}
            >
              <span>🩺</span>
              <span>With Clinical Protocols ({allChapters.filter(c => c.matchedConditionId).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 STHANA NAVIGATION PILLS */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/70 flex items-center justify-between">
          <span>Filter By Section (Sthana)</span>
          {selectedSthana !== 'all' && (
            <button
              onClick={() => setSelectedSthana('all')}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer"
            >
              Reset to All (120)
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSthana('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedSthana === 'all'
                ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
                : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
            }`}
          >
            All Sections (120)
          </button>
          {sthanas.map(s => {
            const isSelected = selectedSthana === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSthana(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
                    : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
                }`}
              >
                <span>{s.meta.themeIcon}</span>
                <span>{s.meta.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-emerald-900/60 text-emerald-400'}`}>
                  {s.meta.chapterCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ACTIVE STHANA DETAIL CARD (if a specific Sthana is selected) */}
      {currentSthanaMeta && (
        <Card className="border border-emerald-500/30 bg-[#0a2315]/80 p-4 sm:p-5 text-emerald-50 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentSthanaMeta.themeIcon}</span>
                <h3 className="text-lg font-bold text-emerald-100">{currentSthanaMeta.name}</h3>
                <span className="text-sm font-serif text-amber-300/90">{currentSthanaMeta.sanskritName}</span>
                <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {currentSthanaMeta.chapterCount} Chapters
                </Badge>
              </div>
              <p className="text-xs text-emerald-400/80 font-mono mt-0.5">{currentSthanaMeta.englishName}</p>
              <p className="text-xs text-emerald-200/80 mt-2 max-w-3xl leading-relaxed">
                {currentSthanaMeta.description}
              </p>
            </div>
            <a
              href={`https://www.carakasamhitaonline.com/index.php?title=${currentSthanaMeta.name.replace(' ', '_')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-400/50 bg-emerald-500/10 text-xs font-mono text-emerald-300 hover:bg-emerald-500/20 transition whitespace-nowrap self-start sm:self-auto"
            >
              <span>Explore Section on Wiki</span>
              <span>↗</span>
            </a>
          </div>
        </Card>
      )}

      {/* CHAPTERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredChapters.map(chapter => {
          const linkedCondition = chapter.matchedConditionId
            ? DISEASE_REPERTORY.find(d => d.id === chapter.matchedConditionId)
            : undefined

          return (
            <Card
              key={`${chapter.sthanaId}-${chapter.chapterNumber}`}
              className="group border border-emerald-900/60 bg-[#07170e]/90 hover:border-emerald-500/50 p-4 transition duration-200 flex flex-col justify-between shadow-md hover:shadow-emerald-950/50"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono font-bold">
                      #{chapter.chapterNumber < 10 ? `0${chapter.chapterNumber}` : chapter.chapterNumber}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/70 truncate max-w-[130px]">
                      {chapter.sthanaName}
                    </span>
                  </div>
                  {linkedCondition && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[9px] font-mono">
                      Clinical Match
                    </Badge>
                  )}
                </div>

                {/* Sanskrit & English Titles */}
                <h4 className="text-sm font-bold text-emerald-100 group-hover:text-emerald-300 transition leading-snug">
                  {chapter.sanskritTitle}
                </h4>
                <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed">
                  {chapter.englishTitle}
                </p>

                {/* Linked Clinical Disease Callout if available */}
                {linkedCondition && (
                  <div className="mt-3 p-2.5 rounded-lg border border-emerald-700/40 bg-emerald-950/40 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 mb-1">
                      <span>🩺 INTEGRATED PROTOCOL</span>
                      <span className="text-amber-400">{linkedCondition.doshaImbalance}</span>
                    </div>
                    <div className="font-medium text-emerald-200 truncate">{linkedCondition.condition}</div>
                    <p className="text-[11px] text-emerald-300/70 truncate mt-0.5">
                      Herbs: {linkedCondition.primaryHerbs.slice(0, 3).join(', ')}
                    </p>
                    {onSelectCondition && (
                      <button
                        onClick={() => onSelectCondition(linkedCondition)}
                        className="mt-2 w-full text-center py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[10px] font-mono border border-emerald-500/30 transition"
                      >
                        Open Clinical Healing Dossier ➔
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Links */}
              <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-500">Charaka Samhita</span>
                <a
                  href={chapter.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-200 transition"
                  title="View complete original Sanskrit shlokas and commentary on CarakaSamhitaOnline"
                >
                  <span>Read Chapter</span>
                  <span>↗</span>
                </a>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="rounded-2xl border border-dashed border-emerald-800/60 p-12 text-center">
          <span className="text-3xl mb-2 block">🔍</span>
          <p className="text-sm text-emerald-300">No chapters match your search criteria.</p>
          <Button
            onClick={() => {
              setSearchQuery('')
              setSelectedSthana('all')
              setOnlyClinicallyLinked(false)
            }}
            variant="outline"
            className="mt-4 text-xs font-mono border-emerald-700 text-emerald-300 hover:bg-emerald-950"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
