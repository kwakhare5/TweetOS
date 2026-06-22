'use client'

import { useState } from 'react'
import { EngagementLog } from '@/types'

const OUTCOME_OPTIONS = ['they replied', 'got 3+ likes', 'they followed me', 'no response', 'other']

interface Props {
  log: EngagementLog[]
  onUpdateOutcome: (id: string, outcome: string) => void
}

export default function EngagementLogList({ log, onUpdateOutcome }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [outcomeInput, setOutcomeInput] = useState('')

  if (log.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-muted)] text-sm">No replies logged yet.</p>
        <p className="text-[var(--text-muted)] text-xs mt-1">Go to Reply Generator → generate → Log Reply.</p>
      </div>
    )
  }

  function handleSaveOutcome(id: string) {
    if (outcomeInput.trim()) {
      onUpdateOutcome(id, outcomeInput.trim())
    }
    setEditingId(null)
    setOutcomeInput('')
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[var(--text-muted)]">{log.length} replies logged</p>
      {log.map((entry) => {
        const date = new Date(entry.repliedAt)
        const relTime = formatRelTime(date)
        return (
          <div key={entry.id} className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">@{entry.targetHandle}</span>
              <span className="text-xs text-[var(--text-muted)] font-mono">{relTime}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] truncate">"{entry.tweetSnippet}…"</p>
            <p className="text-xs font-mono text-[var(--text)] leading-relaxed line-clamp-2">{entry.replyUsed}</p>
            <div className="flex items-center gap-2">
              {entry.outcome ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--pass)]/10 text-[var(--pass)] border border-[var(--pass)]/20">
                  {entry.outcome}
                </span>
              ) : editingId === entry.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    className="flex-1 text-xs bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 outline-none"
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                  >
                    <option value="">Pick outcome…</option>
                    {OUTCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <input
                    className="flex-1 text-xs bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-muted)]"
                    placeholder="or type custom…"
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                  />
                  <button onClick={() => handleSaveOutcome(entry.id)} className="text-xs text-[var(--pass)]">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-[var(--text-muted)]">✕</button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingId(entry.id); setOutcomeInput('') }}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  + Add outcome
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatRelTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
