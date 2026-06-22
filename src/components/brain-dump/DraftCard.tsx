'use client'

import { TweetDraft, DraftStatus } from '@/types'
import { useState } from 'react'

const MAX_CHARS = 280

interface DraftCardProps {
  draft: TweetDraft
  onSave?: (draft: TweetDraft) => void
  onStatusChange?: (id: string, status: DraftStatus) => void
}

export default function DraftCard({ draft, onSave, onStatusChange }: DraftCardProps) {
  const [text, setText] = useState(draft.content)
  const [activeHook, setActiveHook] = useState<number | null>(null)

  const chars = text.length
  const over = chars > MAX_CHARS
  const remaining = MAX_CHARS - chars

  const displayText = activeHook !== null ? draft.hookVariations[activeHook] + '\n' + text.split('\n').slice(1).join('\n') : text

  function applyHook(idx: number) {
    const lines = text.split('\n')
    const rest = lines.slice(1).join('\n')
    const newHook = draft.hookVariations[idx]
    const newText = rest ? newHook + '\n' + rest : newHook
    setText(newText)
    setActiveHook(idx)
  }

  function resetHook() {
    setText(draft.content)
    setActiveHook(null)
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
          {draft.momentType}
        </span>
        {draft.pillarId && (
          <span className="text-xs text-[var(--accent)]">
            {draft.pillarId}
          </span>
        )}
        <span
          className="ml-auto text-xs font-mono"
          style={{ color: over ? 'var(--fail)' : remaining < 30 ? 'var(--warn)' : 'var(--text-muted)' }}
        >
          {remaining} left
        </span>
      </div>

      {/* Tweet textarea */}
      <textarea
        className="w-full bg-[var(--surface-2)] text-[var(--text)] text-sm rounded-md p-3 resize-none outline-none border border-transparent focus:border-[var(--accent)] transition-colors min-h-[100px]"
        value={text}
        onChange={(e) => { setText(e.target.value); setActiveHook(null) }}
        rows={4}
      />

      {/* Char count bar */}
      <div className="h-0.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${Math.min((chars / MAX_CHARS) * 100, 100)}%`,
            background: over ? 'var(--fail)' : chars > 240 ? 'var(--warn)' : 'var(--accent)',
          }}
        />
      </div>

      {/* Hook variations */}
      {draft.hookVariations.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-[var(--text-muted)]">Hook variations</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.hookVariations.map((hook, i) => (
              <button
                key={i}
                onClick={() => activeHook === i ? resetHook() : applyHook(i)}
                className="text-xs px-2 py-1 rounded border transition-colors text-left max-w-full truncate"
                style={{
                  background: activeHook === i ? 'var(--accent)' : 'var(--surface-2)',
                  borderColor: activeHook === i ? 'var(--accent)' : 'var(--border)',
                  color: activeHook === i ? '#fff' : 'var(--text-muted)',
                  maxWidth: '100%',
                }}
                title={hook}
              >
                {hook.length > 50 ? hook.slice(0, 50) + '…' : hook}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSave?.({ ...draft, content: text, updatedAt: new Date().toISOString() })}
          disabled={over}
          className="text-xs px-3 py-1.5 rounded bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save draft
        </button>
        {onStatusChange && (
          <button
            onClick={() => onStatusChange(draft.id, 'posted')}
            className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--pass)] hover:text-[var(--pass)] transition-colors"
          >
            Mark posted ✓
          </button>
        )}
        {over && (
          <span className="text-xs text-[var(--fail)] self-center">
            {chars - MAX_CHARS} chars over limit
          </span>
        )}
      </div>
    </div>
  )
}
