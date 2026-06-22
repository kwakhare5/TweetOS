'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLibraryStore } from '@/store/useLibraryStore'
import { useEngagementStore } from '@/store/useEngagementStore'
import { SEED_PROFILE } from '@/data/seedProfile'
import { LibraryEntry, AlgorithmScore } from '@/types'
import { saveLibraryEntry, saveProfile } from '@/lib/storage'
import ScoreCard from '@/components/scorer/ScoreCard'
import { getPostingWindowStatus, PostingWindow } from '@/lib/utils'

const TARGET_REPLIES = 10
const TARGET_POSTS = 3
const TARGET_QUOTES = 4

const MOCK_LIBRARY_ENTRIES: LibraryEntry[] = [
  {
    id: 'lib_1',
    tweet: "vibe coding Git-for-Prompts today: Claude generated 80% of the Monaco editor integration perfectly. then it hallucinated the Drizzle schema twice 💀 pro tip: explicit 'no assumptions on relationships' in the prompt fixed it.",
    isThread: false,
    pillarId: 'Vibe Coding Logs',
    algorithmScore: {
      overall: 82,
      hookStrength: { score: 8.5, label: 'Strong', reason: 'Strong verb and tool mention.' },
      replyBait: { score: 7.5, label: 'Strong', reason: 'Engaging developer pain point.' },
      specificity: { score: 9.0, label: 'Strong', reason: 'Monaco editor, Drizzle, Claude specific mentions.' },
      emotionalTrigger: { score: 7.0, label: 'Strong', reason: 'Relatable developer struggle.' },
      length: { score: 9.0, label: 'Strong', reason: 'Good length check.' },
      noLinksInBody: { score: 10, label: 'Strong', reason: 'No links.' },
      ctaQuality: { score: 6.0, label: 'Weak', reason: 'No explicit question at end.' },
      threadPotential: { score: 5.0, label: 'Weak', reason: 'Formatted as single tweet.' },
      suggestions: ['Consider ending with a question about how others version control prompts.'],
      calculatedAt: new Date().toISOString()
    },
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    performanceNote: "42 likes, 4 retweets, 3 DMs about the prompt manager setup",
    tags: ['vibe-coding', 'claude', 'drizzle'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'lib_2',
    tweet: "Pune college + building full-stack: lectures till 4, then vibe code till 2am because Claude doesn't judge your sleep schedule. shipped the prompt VCS today. if you're a 3rd year feeling behind, you're not — just start documenting the mess. it compounds.",
    isThread: false,
    pillarId: 'Student Builder Journey',
    algorithmScore: {
      overall: 78,
      hookStrength: { score: 8.0, label: 'Strong', reason: 'Relatable student hook.' },
      replyBait: { score: 7.0, label: 'Strong', reason: 'Inspirational student arc.' },
      specificity: { score: 7.5, label: 'Strong', reason: 'Pune college, lectures till 4, VCS.' },
      emotionalTrigger: { score: 9.0, label: 'Strong', reason: 'High relatability and hope.' },
      length: { score: 9.0, label: 'Strong', reason: 'Good length.' },
      noLinksInBody: { score: 10, label: 'Strong', reason: 'No links.' },
      ctaQuality: { score: 5.0, label: 'Weak', reason: 'No question.' },
      threadPotential: { score: 5.0, label: 'Weak', reason: 'Single tweet.' },
      suggestions: ['Add a question targeting Tier 2/3 CS students feeling behind.'],
      calculatedAt: new Date().toISOString()
    },
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    performanceNote: "115 likes, 12 retweets, 8 follows. Viral for my standards!",
    tags: ['college-life', 'career', 'motivation'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export default function AnalyticsPage() {
  const { entries, setEntries, updateEntry } = useLibraryStore()
  const { targetAccounts, engagementLog } = useEngagementStore()
  const [userId] = useState<string | null>(null)
  
  // States
  const [windowStatus, setWindowStatus] = useState<PostingWindow | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [pillarFilter, setPillarFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Posted' | 'Unposted'>('All')
  const [scoreFilter, setScoreFilter] = useState<'All' | 'High' | 'Low'>('All')
  
  const [selectedScore, setSelectedScore] = useState<AlgorithmScore | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [perfNoteValue, setPerfNoteValue] = useState('')

  // Time-window check + load seed
  useEffect(() => {
    setWindowStatus(getPostingWindowStatus())
    const interval = setInterval(() => {
      setWindowStatus(getPostingWindowStatus())
    }, 60000)

    if (entries.length === 0) {
      setEntries(MOCK_LIBRARY_ENTRIES)
    }

    return () => clearInterval(interval)
  }, [entries.length, setEntries])

  function showNotification(msg: string) {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  // Streak calculation
  function calculateStreak(): number {
    const postedDates = entries
      .filter(e => e.postedAt)
      .map(e => new Date(e.postedAt!).toDateString())
    const uniqueDates = Array.from(new Set(postedDates))
    
    let streak = 0
    let checkDate = new Date()
    
    const todayStr = checkDate.toDateString()
    checkDate.setDate(checkDate.getDate() - 1)
    const yesterdayStr = checkDate.toDateString()
    
    if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) return 0
    
    checkDate = new Date()
    while (true) {
      const dateStr = checkDate.toDateString()
      if (uniqueDates.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const streakCount = calculateStreak()

  // Targets today
  const todayStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
  const repliesToday = engagementLog.filter(log => {
    const logDate = new Date(log.repliedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    return logDate === todayStr
  }).length

  const postsToday = entries.filter(e => {
    if (!e.postedAt) return false
    const postDate = new Date(e.postedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    return postDate === todayStr
  }).length

  const quotesToday = engagementLog.filter(log => {
    const logDate = new Date(log.repliedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    const isQuote = log.outcome?.toLowerCase().includes('quote') || log.replyUsed.toLowerCase().includes('quote')
    return logDate === todayStr && isQuote
  }).length

  // Temperature Status
  const hotCount = targetAccounts.filter(a => a.temperature === 'hot').length
  const warmCount = targetAccounts.filter(a => a.temperature === 'warm').length
  const coldCount = targetAccounts.filter(a => a.temperature === 'cold').length
  const connCount = targetAccounts.filter(a => a.temperature === 'connection').length

  function handleSavePerfNote(id: string) {
    updateEntry(id, { performanceNote: perfNoteValue })
    const entry = entries.find(e => e.id === id)
    if (userId && entry) {
      saveLibraryEntry(userId, { ...entry, performanceNote: perfNoteValue })
    }
    setEditingId(null)
    showNotification('Performance note updated! ✓')
  }

  function handleTogglePosted(id: string, currentStatus: boolean) {
    const newPostedAt = currentStatus ? undefined : new Date().toISOString()
    updateEntry(id, { postedAt: newPostedAt })
    const entry = entries.find(e => e.id === id)
    if (userId && entry) {
      saveLibraryEntry(userId, { ...entry, postedAt: newPostedAt })
    }
    showNotification(currentStatus ? 'Marked as unposted' : 'Marked as posted ✓')
  }

  // --- Export Actions ---
  function exportAsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `tweetOS_library_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showNotification('JSON exported successfully!')
  }

  function exportAsCSV() {
    const headers = ['ID', 'Tweet text', 'Thread', 'Pillar', 'Score', 'Posted At', 'Performance Note', 'Created At']
    const rows = entries.map(e => [
      e.id,
      `"${e.tweet.replace(/"/g, '""')}"`,
      e.isThread ? 'YES' : 'NO',
      e.pillarId,
      e.algorithmScore?.overall ?? 'N/A',
      e.postedAt ? new Date(e.postedAt).toLocaleDateString() : 'N/A',
      `"${(e.performanceNote ?? '').replace(/"/g, '""')}"`,
      new Date(e.createdAt).toLocaleDateString()
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", encodeURI(csvContent))
    downloadAnchor.setAttribute("download", `tweetOS_library_${Date.now()}.csv`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showNotification('CSV exported successfully!')
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.tweet.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPillar = pillarFilter === 'All' || entry.pillarId === pillarFilter
    const isPosted = !!entry.postedAt
    const matchesStatus = statusFilter === 'All' 
      || (statusFilter === 'Posted' && isPosted)
      || (statusFilter === 'Unposted' && !isPosted)
      
    const score = entry.algorithmScore?.overall ?? 0
    const matchesScore = scoreFilter === 'All'
      || (scoreFilter === 'High' && score >= 75)
      || (scoreFilter === 'Low' && score < 75)

    return matchesSearch && matchesPillar && matchesStatus && matchesScore
  })

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">System Analytics & Archive</h1>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">
              Review posted statistics, active streaking status, and past voice histories.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportAsJSON} className="glass-button px-3 py-1.5 text-xs">
              Export JSON
            </button>
            <button onClick={exportAsCSV} className="glass-button px-3 py-1.5 text-xs">
              Export CSV
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Column 1: Posting Window & Streak */}
          <div className="flex flex-col gap-5">
            {windowStatus && (
              <div className={`glass-panel p-4 rounded-xl border flex flex-col gap-1.5 transition-all ${
                windowStatus.status === 'green' ? 'glow-green' : windowStatus.status === 'yellow' ? 'glow-amber' : 'glow-red'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  <span>Posting Window</span>
                  <span>IST ZONE</span>
                </div>
                <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                    windowStatus.status === 'green' ? 'bg-emerald-500' : windowStatus.status === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  {windowStatus.label}
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
                  {windowStatus.suggestion}
                </p>
              </div>
            )}

            <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Post Streak</p>
                <h3 className="text-lg font-bold mt-1 text-white">
                  {streakCount > 0 ? `${streakCount} Days Active` : 'No Active Streak'}
                </h3>
              </div>
              <span className="text-2xl">{streakCount > 0 ? '🔥' : '❄️'}</span>
            </div>
          </div>

          {/* Column 2: Progress Targets */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-3.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Today's Content Progress</h3>
            
            <div className="space-y-3">
              {/* Replies */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Replies logged</span>
                  <span className="font-mono text-[var(--text-muted)]">{repliesToday} / {TARGET_REPLIES}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.03] border border-white/5 overflow-hidden">
                  <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${Math.min((repliesToday / TARGET_REPLIES) * 100, 100)}%` }} />
                </div>
              </div>

              {/* Anchor Posts */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Anchor Posts</span>
                  <span className="font-mono text-[var(--text-muted)]">{postsToday} / {TARGET_POSTS}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.03] border border-white/5 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${Math.min((postsToday / TARGET_POSTS) * 100, 100)}%` }} />
                </div>
              </div>

              {/* Quotes */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Quote Takes</span>
                  <span className="font-mono text-[var(--text-muted)]">{quotesToday} / {TARGET_QUOTES}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.03] border border-white/5 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${Math.min((quotesToday / TARGET_QUOTES) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Relationship Summary */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Relationship Temperature Status</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs mt-1">
              <div className="bg-red-500/[0.02] border border-red-500/10 p-2.5 rounded-lg">
                <p className="text-[var(--fail)] font-semibold">🔥 Hot</p>
                <p className="text-base font-bold font-mono text-white mt-0.5">{hotCount}</p>
              </div>
              <div className="bg-amber-500/[0.02] border border-amber-500/10 p-2.5 rounded-lg">
                <p className="text-[var(--warn)] font-semibold">🌡️ Warm</p>
                <p className="text-base font-bold font-mono text-white mt-0.5">{warmCount}</p>
              </div>
              <div className="bg-blue-500/[0.02] border border-blue-500/10 p-2.5 rounded-lg">
                <p className="text-[var(--cold)] font-semibold">❄️ Cold</p>
                <p className="text-base font-bold font-mono text-white mt-0.5">{coldCount}</p>
              </div>
              <div className="bg-purple-500/[0.02] border border-purple-500/10 p-2.5 rounded-lg">
                <p className="text-purple-400 font-semibold">🤝 Connection</p>
                <p className="text-base font-bold font-mono text-white mt-0.5">{connCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="glass-panel p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="glass-input px-3 py-1.5"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Pillar</label>
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value)}
              className="glass-input px-2 py-1.5"
            >
              <option value="All">All Pillars</option>
              {SEED_PROFILE.contentPillars.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="glass-input px-2 py-1.5"
            >
              <option value="All">All Statuses</option>
              <option value="Posted">Posted</option>
              <option value="Unposted">Unposted</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Score Range</label>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="glass-input px-2 py-1.5"
            >
              <option value="All">All Scores</option>
              <option value="High">High potential (&gt;= 75)</option>
              <option value="Low">Needs work (&lt; 75)</option>
            </select>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 z-50 glass-panel px-4 py-2.5 rounded-lg text-xs text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            ✓ {notification}
          </div>
        )}

        {/* Library Entries */}
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            Showing {filteredEntries.length} archive records
          </p>

          <div className="grid grid-cols-1 gap-4">
            {filteredEntries.map((entry) => {
              const isPosted = !!entry.postedAt
              return (
                <div key={entry.id} className="glass-panel p-4 rounded-xl flex flex-col gap-3 transition-colors hover:bg-white/[0.01]">
                  <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white/[0.03] border border-white/5 rounded text-[10px] text-[var(--text-muted)] font-medium">
                        {entry.pillarId}
                      </span>
                      {entry.algorithmScore && (
                        <button
                          onClick={() => setSelectedScore(entry.algorithmScore ?? null)}
                          className="px-2 py-0.5 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 rounded transition-colors"
                        >
                          Scored: {entry.algorithmScore.overall}/100 📊
                        </button>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${
                      isPosted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {isPosted ? 'POSTED' : 'UNPOSTED DRAFT'}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-200 leading-relaxed font-mono whitespace-pre-wrap">
                    {entry.tweet}
                  </p>

                  {/* Performance Notes */}
                  {isPosted && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[var(--text-muted)] uppercase text-[9px] tracking-wide">Performance Loopback (X/Grok notes)</span>
                        <button
                          onClick={() => {
                            setEditingId(entry.id)
                            setPerfNoteValue(entry.performanceNote ?? '')
                          }}
                          className="text-[10px] text-[var(--accent)] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      
                      {editingId === entry.id ? (
                        <div className="flex gap-2 items-center mt-1.5">
                          <input
                            type="text"
                            value={perfNoteValue}
                            onChange={(e) => setPerfNoteValue(e.target.value)}
                            placeholder="E.g., 52 likes, 3 retweets..."
                            className="glass-input flex-1 px-2.5 py-1 text-xs"
                          />
                          <button onClick={() => handleSavePerfNote(entry.id)} className="glass-button px-3 py-1 text-[10px]">
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-[10px] text-[var(--text-muted)]">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-zinc-300 italic">
                          {entry.performanceNote || "No performance notes logged yet."}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1 text-[10px] text-[var(--text-muted)]">
                    <span>Created {new Date(entry.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleTogglePosted(entry.id, isPosted)}
                      className="glass-button px-2.5 py-1 text-[10px]"
                    >
                      {isPosted ? 'Mark as Unposted' : 'Mark Posted'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ScoreCard Modal Overlay */}
        {selectedScore && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-2xl rounded-2xl relative max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedScore(null)}
                className="absolute top-4 right-4 glass-button px-2.5 py-1 text-[10px]"
              >
                Close ×
              </button>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                X Algorithm Score Details
              </h2>
              <ScoreCard score={selectedScore} />
            </div>
          </div>
        )}

      </div>
    </AppShell>
  )
}
