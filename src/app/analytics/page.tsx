'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLibraryStore } from '@/store/useLibraryStore'

export default function LibraryPage() {
  const { entries } = useLibraryStore()
  const [searchTerm, setSearchTerm] = useState('')

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

        {/* List */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="glass-panel p-5 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{entry.pillarId}</span>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-base text-zinc-100 whitespace-pre-wrap leading-relaxed">
                {entry.tweet}
              </p>

              {entry.performanceNote && (
                <div className="mt-2 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Performance Note</span>
                  <p className="text-sm text-zinc-300 italic">{entry.performanceNote}</p>
                </div>
              )}
            </div>
          ))}
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-sm text-[var(--text-muted)] italic">
              No tweets found in your library.
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
