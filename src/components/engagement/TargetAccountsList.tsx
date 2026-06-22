'use client'

import { useState } from 'react'
import { TargetAccount, EngagementLog, AccountTemperature } from '@/types'
import { updateAccountTemperature } from '@/lib/engagement'

const TEMP_CONFIG: Record<AccountTemperature, { icon: string; label: string; color: string }> = {
  cold: { icon: '❄️', label: 'COLD', color: 'var(--temp-cold)' },
  warm: { icon: '🌡️', label: 'WARM', color: 'var(--temp-warm)' },
  hot: { icon: '🔥', label: 'HOT', color: 'var(--temp-hot)' },
  connection: { icon: '💜', label: 'CONNECTION', color: 'var(--temp-connection)' },
}

interface Props {
  accounts: TargetAccount[]
  log: EngagementLog[]
  onAdd: (account: TargetAccount) => void
  onUpdate: (id: string, partial: Partial<TargetAccount>) => void
  onReplyGen: (handle: string) => void
}

export default function TargetAccountsList({ accounts, log, onAdd, onUpdate, onReplyGen }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [newHandle, setNewHandle] = useState('')
  const [newName, setNewName] = useState('')
  const [newWhy, setNewWhy] = useState('')

  // Compute live temperatures from log
  const accountsWithTemp = accounts.map((a) => ({
    ...a,
    temperature: updateAccountTemperature(a, log),
  }))

  const byTemp = (t: AccountTemperature) => accountsWithTemp.filter((a) => a.temperature === t)

  function handleAdd() {
    if (!newHandle.trim()) return
    const now = new Date().toISOString()
    onAdd({
      id: `account_${newHandle.trim()}_${Date.now()}`,
      handle: newHandle.trim().replace('@', ''),
      name: newName.trim() || newHandle.trim(),
      why: newWhy.trim() || 'Manually added',
      temperature: 'cold',
      engagementCount: 0,
      addedAt: now,
    })
    setNewHandle(''); setNewName(''); setNewWhy(''); setShowAdd(false)
  }

  function handleTempOverride(id: string, temp: AccountTemperature) {
    onUpdate(id, { temperature: temp })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">{accounts.length} accounts tracked</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
        >
          + Add account
        </button>
      </div>

      {showAdd && (
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex flex-col gap-3">
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
            placeholder="@handle"
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
          />
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
            placeholder="Display name (optional)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
            placeholder="Why this account? (optional)"
            value={newWhy}
            onChange={(e) => setNewWhy(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newHandle.trim()}
              className="px-4 py-2 text-sm rounded-md bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40"
            >
              Add
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm rounded-md bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(['connection', 'hot', 'warm', 'cold'] as AccountTemperature[]).map((temp) => {
        const group = byTemp(temp)
        const cfg = TEMP_CONFIG[temp]
        return (
          <div key={temp}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{cfg.icon}</span>
              <span className="text-xs font-mono font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
              <span className="text-xs text-[var(--text-muted)]">({group.length})</span>
            </div>
            {group.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] pl-6 italic">
                {temp === 'hot' ? 'Keep engaging — none yet' :
                 temp === 'connection' ? 'No connections yet — get replying' :
                 'None in this tier'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {group.map((account) => {
                  const replies = log.filter((l) => l.targetHandle === account.handle)
                  return (
                    <div key={account.id} className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">@{account.handle}</span>
                            {account.name !== account.handle && (
                              <span className="text-xs text-[var(--text-muted)]">{account.name}</span>
                            )}
                            <span className="text-xs text-[var(--text-muted)]">·</span>
                            <span className="text-xs text-[var(--text-muted)]">{replies.length} replies</span>
                          </div>
                          {account.why && (
                            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{account.why}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={account.temperature}
                            onChange={(e) => handleTempOverride(account.id, e.target.value as AccountTemperature)}
                            className="text-xs bg-[var(--bg)] border border-[var(--border)] rounded px-1.5 py-1 outline-none cursor-pointer"
                          >
                            {(['cold', 'warm', 'hot', 'connection'] as AccountTemperature[]).map((t) => (
                              <option key={t} value={t}>{TEMP_CONFIG[t].icon} {t}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => onReplyGen(account.handle)}
                            className="text-xs px-2.5 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                          >
                            Reply Gen →
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
