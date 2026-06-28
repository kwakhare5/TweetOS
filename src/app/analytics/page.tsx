'use client'

import { useState, useEffect, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLibraryStore } from '@/store/useLibraryStore'
import { useProfileStore } from '@/store/useProfileStore'
import { GROK_ANALYTICS_PACKET_PROMPT } from '@/lib/prompts'
import { 
  Check, 
  Eye, 
  Heart, 
  MessageSquare, 
  RotateCw, 
  Bookmark, 
  TrendingUp, 
  BarChart3 
} from 'lucide-react'

export default function LibraryPage() {
  const { entries, updateEntry } = useLibraryStore()
  const { profile } = useProfileStore()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Analytics Sync States
  const [importJSON, setImportJSON] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasHydrated(true)
  }, [])

  // 24hr Loopback: entries posted 24+ hours ago with no metrics synced yet
  const TWENTY_FOUR_HRS = 24 * 60 * 60 * 1000
  const dueForSync = useMemo(() => {
    const now = Date.now()
    return entries.filter(e => {
      const posted = e.postedAt ? new Date(e.postedAt).getTime() : new Date(e.createdAt).getTime()
      const isOldEnough = now - posted >= TWENTY_FOUR_HRS
      const hasNoMetrics = e.views === undefined && e.likes === undefined
      return isOldEnough && hasNoMetrics
    })
  }, [entries, TWENTY_FOUR_HRS])

  function triggerToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleCopyAnalyticsPacket() {
    if (entries.length === 0) {
      triggerToast('No tweets in library to analyze!')
      return
    }
    const handle = profile?.twitterHandle || 'kwakhare5'
    const packet = GROK_ANALYTICS_PACKET_PROMPT(entries, handle)
    navigator.clipboard.writeText(packet)
    triggerToast('Grok Analytics Prompt copied!')
  }

  function handleSyncMetrics() {
    if (!importJSON.trim()) return
    setImportError(null)
    try {
      const parsed = JSON.parse(importJSON.trim())
      if (!Array.isArray(parsed)) {
        throw new Error('Metrics must be a JSON array.')
      }
      let updatedCount = 0
      for (const item of parsed) {
        if (item.id) {
          updateEntry(item.id, {
            views: typeof item.views === 'number' ? item.views : undefined,
            likes: typeof item.likes === 'number' ? item.likes : undefined,
            retweets: typeof item.retweets === 'number' ? item.retweets : undefined,
            replies: typeof item.replies === 'number' ? item.replies : undefined,
            bookmarks: typeof item.bookmarks === 'number' ? item.bookmarks : undefined
          })
          updatedCount++
        }
      }
      setImportJSON('')
      triggerToast(`Successfully synced performance metrics for ${updatedCount} tweets!`)
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Invalid JSON format. Check Grok output.')
    }
  }

  // Sort entries newest first
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const filteredEntries = sortedEntries.filter(e => {
    const textMatch = e.tweet.toLowerCase().includes(searchTerm.toLowerCase())
    return textMatch
  })

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Library</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Your chronological history of posted tweets and performance logs.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="glass-panel p-4 rounded-xl">
          <input
            type="text"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full px-4 py-2 text-sm sm:text-base"
          />
        </div>

        {/* 24hr Loopback Alert Banner */}
        {hasHydrated && dueForSync.length > 0 && (
          <div className="flex items-center justify-between gap-3 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300 font-semibold">
                {dueForSync.length} tweet{dueForSync.length > 1 ? 's' : ''} posted 24h+ ago — time to sync metrics and close the learning loop.
              </p>
            </div>
            <button
              onClick={handleCopyAnalyticsPacket}
              className="shrink-0 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] font-bold transition-colors"
            >
              Copy Packet →
            </button>
          </div>
        )}

        {/* Grok Analytics Sync Panel */}
        {hasHydrated && entries.length > 0 && (
          <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 flex-wrap gap-2">
              <h3 className="text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>Grok Analytics Sync Loop</span>
              </h3>
              <button 
                onClick={handleCopyAnalyticsPacket}
                className="glass-button px-3 py-1.5 text-xs bg-sky-950/20 hover:bg-sky-950/40 text-sky-400 border-sky-500/10 flex items-center gap-1.5 cursor-pointer font-semibold transition-all duration-200"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Copy Grok Prompt</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Paste Grok JSON Response</label>
              <textarea
                value={importJSON}
                onChange={(e) => setImportJSON(e.target.value)}
                placeholder='[{"id": "lib_...", "views": 1050, "likes": 42}]'
                rows={3}
                className="glass-input w-full p-2.5 text-xs font-mono"
              />
              {importError && (
                <p className="text-[11px] text-[var(--fail)] mt-0.5">{importError}</p>
              )}
              <button 
                onClick={handleSyncMetrics}
                disabled={!importJSON.trim()}
                className="glass-button py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Sync Performance Metrics</span>
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-4">
          {hasHydrated && filteredEntries.map((entry) => {
            const TWENTY_FOUR = 24 * 60 * 60 * 1000
            const postedMs = entry.postedAt ? new Date(entry.postedAt).getTime() : new Date(entry.createdAt).getTime()
            const isDue = (Date.now() - postedMs >= TWENTY_FOUR) && entry.views === undefined && entry.likes === undefined
            return (
            <div key={entry.id} className={`glass-panel p-5 rounded-xl flex flex-col gap-3 ${isDue ? 'border border-amber-500/15' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{entry.pillarId}</span>
                  {isDue && <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full">Sync Due</span>}
                </div>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-base text-zinc-100 whitespace-pre-wrap leading-relaxed font-sans">
                {entry.tweet}
              </p>

              {entry.performanceNote && (
                <div className="mt-2 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Performance Note</span>
                  <p className="text-sm text-zinc-300 italic">{entry.performanceNote}</p>
                </div>
              )}

              {/* Engagement Stats Grid */}
              {(entry.views !== undefined || entry.likes !== undefined) && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-white/5 text-xs text-[var(--text-muted)] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{entry.views?.toLocaleString() ?? 0} views</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{entry.likes?.toLocaleString() ?? 0} likes</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{entry.replies?.toLocaleString() ?? 0} replies</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{entry.retweets?.toLocaleString() ?? 0} reposts</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{entry.bookmarks?.toLocaleString() ?? 0} bookmarks</span>
                  </span>
                </div>
              )}
            </div>
          )})
          }
          
          {hasHydrated && filteredEntries.length === 0 && (
            <div className="text-center py-12 text-sm text-[var(--text-muted)] italic">
              No tweets found in your library.
            </div>
          )}
        </div>

        {/* Global Toast Alert */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 glass-panel px-4 py-2.5 rounded-lg text-xs text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{toast}</span>
            </span>
          </div>
        )}

      </div>
    </AppShell>
  )
}
