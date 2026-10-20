import { useState, useEffect } from 'react'
import {
  DISEASE_REPERTORY,
  KNOWLEDGE_SOURCES,
  getCustomResearchItems,
  saveCustomResearchItem,
  deleteCustomResearchItem,
  getChapterByCondition,
  type BodySystem,
  type DiseaseRemedy,
  type CustomResearchItem,
} from '../lib/knowledgeBase'
import type { UserProfile } from '../lib/data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CharakaExplorer from './CharakaExplorer'

interface Props {
  profile: UserProfile
}

export default function KnowledgeHub({ profile }: Props) {
  const userDosha = profile.doshaType || 'Vata'
  const [activeTab, setActiveTab] = useState<'diseases' | 'chapters' | 'sources' | 'custom'>('chapters')
  const [systemFilter, setSystemFilter] = useState<'All' | BodySystem>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDisease, setSelectedDisease] = useState<DiseaseRemedy | null>(null)
  
  // Custom research form state
  const [customItems, setCustomItems] = useState<CustomResearchItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<'Web Link' | 'PDF Excerpt' | 'Clinical Note'>('Web Link')
  const [newUrlOrCite, setNewUrlOrCite] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newTags, setNewTags] = useState('')

  useEffect(() => {
    setCustomItems(getCustomResearchItems())
  }, [])

  const systems: ('All' | BodySystem)[] = [
    'All',
    'Digestive',
    'Respiratory',
    'Musculoskeletal',
    'Nervous & Mental',
    'Metabolic & Endocrine',
    'Skin & Hair',
    'Immunity & Rasayana',
    "Women's Health & Artava",
  ]

  const filteredDiseases = DISEASE_REPERTORY.filter(d => {
    const matchesSystem = systemFilter === 'All' || d.system === systemFilter
    const matchesSearch =
      d.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.primaryHerbs.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.doshaImbalance.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSystem && matchesSearch
  })

  const handleAddResearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newSummary.trim()) return

    const item = saveCustomResearchItem({
      title: newTitle.trim(),
      sourceType: newType,
      urlOrCitation: newUrlOrCite.trim() || 'Internal Notes',
      summary: newSummary.trim(),
      tags: newTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    })

    setCustomItems([item, ...customItems])
    setNewTitle('')
    setNewUrlOrCite('')
    setNewSummary('')
    setNewTags('')
    setShowAddForm(false)
  }

  const handleDeleteCustom = (id: string) => {
    deleteCustomResearchItem(id)
    setCustomItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-black/60 border border-emerald-800/40 shadow-xl">
        <div className="flex items-center justify-between mb-1.5">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono uppercase">
            Garry Tan gstack · Clinical RAG Architecture
          </Badge>
          <span className="text-[11px] font-mono text-emerald-400">
            {DISEASE_REPERTORY.length} Clinical Protocols
          </span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>📚</span> Ayurvedic Knowledge & Disease Repertory
        </h3>
        <p className="text-xs text-emerald-300/70 mt-1 leading-relaxed">
          Evidence-grounded disease management indexed from classical Charaka Samhita manuscripts and peer-reviewed web links.
        </p>
      </div>

      {/* Primary Sub-Navigation */}
      <div className="flex p-1 rounded-2xl bg-black/40 border border-emerald-900/50 gap-1 overflow-x-auto [scrollbar-width:none]">
        <button
          onClick={() => setActiveTab('diseases')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'diseases'
              ? 'bg-emerald-700/60 text-white shadow-sm border border-emerald-500/40'
              : 'text-emerald-400/60 hover:text-emerald-200'
          }`}
        >
          🌿 Disease Repertory ({DISEASE_REPERTORY.length})
        </button>
        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'chapters'
              ? 'bg-emerald-700/60 text-white shadow-sm border border-emerald-500/40'
              : 'text-emerald-400/60 hover:text-emerald-200'
          }`}
        >
          📜 120 Chapters Explorer (120)
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'sources'
              ? 'bg-emerald-700/60 text-white shadow-sm border border-emerald-500/40'
              : 'text-emerald-400/60 hover:text-emerald-200'
          }`}
        >
          📖 Manuscripts & PDFs ({KNOWLEDGE_SOURCES.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'custom'
              ? 'bg-amber-700/60 text-white shadow-sm border border-amber-500/40'
              : 'text-emerald-400/60 hover:text-amber-300'
          }`}
        >
          ➕ Ingest Research Links ({customItems.length})
        </button>
      </div>

      {/* ─── TAB 1: DISEASE REPERTORY ─── */}
      {activeTab === 'diseases' && (
        <div className="space-y-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search diseases, herbs, or symptoms (e.g. Acid Reflux, Asthma, Ashwagandha)..."
              className="w-full bg-emerald-950/40 border border-emerald-800/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-emerald-600/60 outline-none focus:border-emerald-500/60 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-emerald-400/60 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Body System Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {systems.map(sys => (
              <button
                key={sys}
                onClick={() => setSystemFilter(sys)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition border ${
                  systemFilter === sys
                    ? 'bg-emerald-600/40 text-emerald-100 border-emerald-500/50 shadow-sm'
                    : 'bg-black/30 text-emerald-400/60 border-emerald-900/40 hover:text-emerald-200'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>

          {/* Disease Detail Modal */}
          {selectedDisease && (
            <Card className="p-5 bg-gradient-to-br from-[#0c1f13] to-[#07150c] border border-emerald-600/50 rounded-3xl space-y-4 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                      {selectedDisease.system}
                    </Badge>
                    <Badge
                      className={`text-[9px] font-mono ${
                        selectedDisease.severity === 'chronic'
                          ? 'bg-red-950/40 text-red-300 border-red-800/40'
                          : selectedDisease.severity === 'moderate'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                      }`}
                    >
                      {selectedDisease.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{selectedDisease.condition}</h3>
                  <p className="text-xs text-amber-300/80 font-serif italic">{selectedDisease.sanskrit}</p>
                </div>
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="rounded-full h-7 w-7 flex items-center justify-center bg-black/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Classical Reference Banner */}
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-900/60 text-xs space-y-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-0.5">
                    Classical Literature Grounding
                  </span>
                  <p className="text-emerald-200/90 font-medium">{selectedDisease.charakaRef}</p>
                </div>
                {(() => {
                  const linkedChapter = getChapterByCondition(selectedDisease.id)
                  if (!linkedChapter) return null
                  return (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/40 text-xs font-mono">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>📜</span>
                        <span className="text-emerald-300 font-bold">{linkedChapter.sthanaName} · #{linkedChapter.chapterNumber}</span>
                        <span className="text-emerald-400/70 truncate">({linkedChapter.sanskritTitle})</span>
                      </div>
                      <a
                        href={linkedChapter.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 underline text-[11px] shrink-0 ml-2"
                      >
                        Read Shlokas ↗
                      </a>
                    </div>
                  )
                })()}
              </div>

              {/* Pathogenesis (Samprapti) */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1 font-mono">
                  Pathogenesis (Samprapti) & Dosha Root
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed bg-emerald-950/30 p-3 rounded-2xl border border-emerald-900/40">
                  <span className="text-amber-300 font-medium">Imbalance: </span>
                  {selectedDisease.doshaImbalance}. {selectedDisease.pathogenesis}
                </p>
              </div>

              {/* Primary Formulations & Home Remedy */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
                  First-Line Herbal Formulations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDisease.primaryHerbs.map(h => (
                    <span
                      key={h}
                      className="px-2.5 py-1 rounded-xl text-xs bg-emerald-900/40 border border-emerald-700/40 text-emerald-200"
                    >
                      🌿 {h}
                    </span>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs space-y-1.5">
                  <p className="font-semibold text-white">🍵 Preparation & Dosage:</p>
                  <p className="text-emerald-200/80">{selectedDisease.homeRemedy}</p>
                  <p className="text-[11px] text-emerald-400/80 font-mono">
                    <span className="text-amber-300">Method: </span> {selectedDisease.preparation}
                  </p>
                  <p className="text-[11px] text-emerald-400/80 font-mono">
                    <span className="text-emerald-300">Dosage: </span> {selectedDisease.dosage}
                  </p>
                </div>
              </div>

              {/* Pathya (Do's) & Apathya (Don'ts) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1 mb-1.5">
                    <span>✅</span> Pathya (Dietary Do's)
                  </span>
                  <ul className="space-y-1 text-[11px] text-emerald-200/70">
                    {selectedDisease.pathya.map((p, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-500">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-red-950/20 border border-red-900/30">
                  <span className="font-semibold text-red-300 flex items-center gap-1 mb-1.5">
                    <span>⚠️</span> Apathya (Avoid)
                  </span>
                  <ul className="space-y-1 text-[11px] text-red-200/70">
                    {selectedDisease.apathya.map((a, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-400">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Red Flags & Precautions */}
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/80">
                <span className="font-semibold text-amber-300 block mb-0.5">⚠️ Clinical Safety Boundary:</span>
                {selectedDisease.precautions}
              </div>

              {/* External Evidence Links */}
              {selectedDisease.evidenceLinks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 font-mono">
                    External Clinical Research & AYUSH Monographs
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDisease.evidenceLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-emerald-900/60 text-xs text-emerald-300 hover:text-white hover:border-emerald-600 transition"
                      >
                        <span className="truncate pr-2">🔗 {link.title}</span>
                        <span className="text-[10px] font-mono text-emerald-500/70 shrink-0">{link.source}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Disease Cards List */}
          <div className="space-y-2">
            {filteredDiseases.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-400/60 bg-emerald-950/20 rounded-2xl">
                No matching conditions found. Try searching another symptom or herb.
              </div>
            ) : (
              filteredDiseases.map(disease => {
                const isDoshaMatch = disease.doshaImbalance.toLowerCase().includes(userDosha.toLowerCase())
                return (
                  <Card
                    key={disease.id}
                    onClick={() => setSelectedDisease(disease)}
                    className={`p-3.5 bg-emerald-950/25 border-emerald-800/25 rounded-2xl cursor-pointer hover:bg-emerald-900/30 hover:border-emerald-600/40 transition group ${
                      isDoshaMatch ? 'border-l-4 border-l-emerald-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-white group-hover:text-emerald-200">
                            {disease.condition}
                          </span>
                          {isDoshaMatch && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-800/40 text-emerald-300 font-mono">
                              {userDosha} Tendency
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-300/70 font-serif italic">{disease.sanskrit}</p>
                        <p className="text-[11px] text-emerald-300/60 line-clamp-1 mt-1">
                          {disease.homeRemedy}
                        </p>
                      </div>
                      <span className="text-xs text-emerald-500/40 group-hover:text-emerald-300 transition">
                        Inspect →
                      </span>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: 120 CHAPTERS EXPLORER ─── */}
      {activeTab === 'chapters' && (
        <CharakaExplorer
          onSelectCondition={disease => {
            setSelectedDisease(disease)
            setActiveTab('diseases')
          }}
        />
      )}

      {/* ─── TAB 3: MASTER SOURCE TEXTS ─── */}
      {activeTab === 'sources' && (
        <div className="space-y-3">
          <p className="text-xs text-emerald-300/70">
            Authoritative classical manuscripts and research repositories foundational to Jaya Ayurveda:
          </p>

          <div className="space-y-3">
            {KNOWLEDGE_SOURCES.map(source => (
              <Card
                key={source.id}
                className="p-4 bg-gradient-to-br from-[#0a1a0e] to-black/60 border border-emerald-800/40 rounded-2xl space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="border-amber-600/40 text-amber-300 text-[10px] font-mono">
                      {source.type}
                    </Badge>
                    <h4 className="text-sm font-bold text-white mt-1">{source.title}</h4>
                    <p className="text-[11px] text-emerald-400/80">{source.authorOrBody}</p>
                  </div>
                </div>

                <p className="text-xs text-emerald-200/80 leading-relaxed">{source.description}</p>

                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60 flex items-center justify-between text-[11px] font-mono text-emerald-400/70">
                  <span className="truncate pr-2">📍 {source.referenceLocation}</span>
                  <span className="text-emerald-300 text-[10px] shrink-0">Indexed</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: INGEST RESEARCH LINKS & PDFS ─── */}
      {activeTab === 'custom' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Your Research Knowledge Vault</h4>
              <p className="text-[11px] text-emerald-400/70">
                Incorporate custom research URLs, PDF text excerpts, and clinical observations.
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white text-xs"
            >
              {showAddForm ? 'Cancel' : '➕ Add Research Link'}
            </Button>
          </div>

          {/* Add Research Form */}
          {showAddForm && (
            <Card className="p-4 bg-gradient-to-br from-[#0c1f13] to-black/80 border border-amber-500/40 rounded-3xl space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase font-mono">
                Ingest New Knowledge Item
              </h4>
              <form onSubmit={handleAddResearch} className="space-y-2.5">
                <div>
                  <label className="text-[11px] text-emerald-300/80 block mb-1">Title / Condition</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Clinical Study on Ashwagandha for Insomnia"
                    className="w-full bg-black/40 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-emerald-300/80 block mb-1">Source Type</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full bg-emerald-950 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Web Link">Web Link (URL)</option>
                      <option value="PDF Excerpt">PDF Manuscript Excerpt</option>
                      <option value="Clinical Note">Clinical Practice Observation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-emerald-300/80 block mb-1">URL or Page Citation</label>
                    <input
                      type="text"
                      value={newUrlOrCite}
                      onChange={e => setNewUrlOrCite(e.target.value)}
                      placeholder="e.g. https://... or Charaka Vol 2 p.88"
                      className="w-full bg-black/40 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-emerald-300/80 block mb-1">Key Summary & Remedial Action</label>
                  <textarea
                    required
                    rows={3}
                    value={newSummary}
                    onChange={e => setNewSummary(e.target.value)}
                    placeholder="Describe the therapeutic mechanism, dosage, or clinical takeaway..."
                    className="w-full bg-black/40 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-emerald-300/80 block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="e.g. Vata, Sleep, Adrenal, Withania"
                    className="w-full bg-black/40 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save to Knowledge Base
                </Button>
              </form>
            </Card>
          )}

          {/* Ingested Items List */}
          <div className="space-y-2">
            {customItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-400/60 bg-emerald-950/20 rounded-2xl border border-dashed border-emerald-800/40">
                No custom research items ingested yet. Click "Add Research Link" to save web links, clinical trial notes, or excerpts from your Charaka Samhita PDFs!
              </div>
            ) : (
              customItems.map(item => (
                <Card
                  key={item.id}
                  className="p-3.5 bg-black/40 border border-emerald-900/60 rounded-2xl space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[9px] font-mono">
                          {item.sourceType}
                        </Badge>
                        <span className="text-[10px] text-emerald-500/60 font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      {item.urlOrCitation && (
                        <p className="text-[10px] text-emerald-400/70 font-mono truncate max-w-xs mt-0.5">
                          {item.urlOrCitation}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCustom(item.id)}
                      className="text-xs text-red-400/60 hover:text-red-300 p-1"
                      title="Delete item"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-emerald-200/80 leading-relaxed bg-emerald-950/30 p-2.5 rounded-xl">
                    {item.summary}
                  </p>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(t => (
                        <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
