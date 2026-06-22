'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useEngagementStore } from '@/store/useEngagementStore'
import { useProfileStore } from '@/store/useProfileStore'
import { seedTargetAccounts, updateAccountTemperature } from '@/lib/engagement'
import { TargetAccount, EngagementLog, OpportunityType, AccountTemperature } from '@/types'
import { geminiJSON } from '@/lib/gemini'
import { REPLY_GENERATOR_PROMPT } from '@/lib/prompts'
import { generateEngagementPacket } from '@/lib/grok-packager'

const TEMP_CONFIG: Record<AccountTemperature, { icon: string; label: string; color: string }> = {
  cold: { icon: '❄️', label: 'COLD', color: 'var(--temp-cold)' },
  warm: { icon: '🌡️', label: 'WARM', color: 'var(--temp-warm)' },
  hot: { icon: '🔥', label: 'HOT', color: 'var(--temp-hot)' },
  connection: { icon: '🤝', label: 'CONNECTION', color: 'var(--temp-connection)' },
}

const OPPORTUNITY_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: 'add_value', label: 'Add Value' },
  { value: 'share_experience', label: 'Share Experience' },
  { value: 'ask_question', label: 'Ask Question' },
  { value: 'agree_expand', label: 'Agree & Expand' },
  { value: 'respectful_push', label: 'Respectful Pushback' },
]

interface GeminiReplyResult {
  context: string
  replies: { option: string; tone: string; content: string }[]
}

export default function EngagePage() {
  const { 
    targetAccounts, 
    engagementLog, 
    setTargetAccounts, 
    addTargetAccount, 
    updateTargetAccount, 
    addEngagementLog, 
    setEngagementLog 
  } = useEngagementStore()

  const { profile } = useProfileStore()

  // Left Panel Navigation
  const [leftTab, setLeftTab] = useState<'targets' | 'logs'>('targets')
  const [selectedTarget, setSelectedTarget] = useState<TargetAccount | null>(null)

  // Targets state
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [newHandle, setNewHandle] = useState('')
  const [newName, setNewName] = useState('')
  const [newWhy, setNewWhy] = useState('')

  // Reply generator state
  const [tweetText, setTweetText] = useState('')
  const [oppType, setOppType] = useState<OpportunityType>('add_value')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyResult, setReplyResult] = useState<GeminiReplyResult | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [loggedOption, setLoggedOption] = useState<string | null>(null)

  // Grok packet state
  const [showGrokConfig, setShowGrokConfig] = useState(false)
  const [grokCustomRequest, setGrokCustomRequest] = useState('')
  const [topicKeywords, setTopicKeywords] = useState('nextjs, typescript, cs student, vibe coding')
  const [copiedPacket, setCopiedPacket] = useState(false)

  // Notifications
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (targetAccounts.length === 0) {
      setTargetAccounts(seedTargetAccounts())
    }
  }, [targetAccounts.length, setTargetAccounts])

  function triggerToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Handle selected target change
  function handleSelectTarget(target: TargetAccount) {
    setSelectedTarget(target)
    setReplyResult(null)
    setTweetText('')
  }

  function handleAddAccount() {
    if (!newHandle.trim()) return
    const now = new Date().toISOString()
    const newAcct: TargetAccount = {
      id: `account_${newHandle.trim()}_${Date.now()}`,
      handle: newHandle.trim().replace('@', ''),
      name: newName.trim() || newHandle.trim(),
      why: newWhy.trim() || 'Manually added',
      temperature: 'cold',
      engagementCount: 0,
      addedAt: now,
    }
    addTargetAccount(newAcct)
    setNewHandle('')
    setNewName('')
    setNewWhy('')
    setShowAddAccount(false)
    triggerToast('Target account added!')
  }

  function handleTempOverride(id: string, temp: AccountTemperature) {
    updateTargetAccount(id, { temperature: temp })
  }

  // Generate replies using AI
  async function handleGenerateReplies() {
    if (!tweetText.trim() || !selectedTarget) return
    setLoading(true)
    setError(null)
    setReplyResult(null)
    try {
      const data = await geminiJSON<GeminiReplyResult>(
        REPLY_GENERATOR_PROMPT(tweetText, selectedTarget.handle, oppType, profile)
      )
      setReplyResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to call Gemini API')
    } finally {
      setLoading(false)
    }
  }

  // Copy reply text
  function handleCopy(content: string, type: 'raw' | 'grok') {
    let finalContent = content
    if (type === 'grok') {
      finalContent = `Please review and optimize this tweet reply for @${selectedTarget?.handle || 'user'} in my Pune CS student voice:\n"${content}"`
    }
    navigator.clipboard.writeText(finalContent)
    setCopiedText(content)
    triggerToast(type === 'grok' ? 'Grok Critique Prompt copied!' : 'Tweet copied to clipboard!')
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Log interaction and copy reply
  function handleCopyAndLog(content: string, option: string) {
    if (!selectedTarget) return
    navigator.clipboard.writeText(content)
    
    const now = new Date().toISOString()
    const newLog: EngagementLog = {
      id: `log_${Date.now()}`,
      targetHandle: selectedTarget.handle,
      tweetSnippet: tweetText.slice(0, 60),
      replyUsed: content,
      repliedAt: now,
      outcome: 'copied & posted'
    }

    addEngagementLog(newLog)
    
    // Update engagement count and auto recalculate temperature
    updateTargetAccount(selectedTarget.id, { 
      engagementCount: (selectedTarget.engagementCount ?? 0) + 1, 
      lastEngaged: now 
    })

    setLoggedOption(option)
    triggerToast('Logged reply & copied text!')
    setTimeout(() => setLoggedOption(null), 2000)
  }

  // Export grok engagement packet
  function handleCopyGrokEngagementPacket() {
    const config = {
      mode: 'engagement' as const,
      targetAccounts: targetAccounts.map(a => a.handle),
      topicKeywords: topicKeywords.split(',').map(k => k.trim()).filter(Boolean),
      opportunityTypes: OPPORTUNITY_OPTIONS.map(o => o.value),
      customRequest: grokCustomRequest
    }
    const packet = generateEngagementPacket(profile, config)
    navigator.clipboard.writeText(packet)
    setCopiedPacket(true)
    triggerToast('Grok Engagement Packet copied!')
    setTimeout(() => setCopiedPacket(false), 2000)
  }

  // Update outcome tag
  function handleUpdateOutcome(id: string, outcome: string) {
    const updated = engagementLog.map(l => l.id === id ? { ...l, outcome } : l)
    setEngagementLog(updated)
    triggerToast('Outcome updated!')
  }

  // Live temperatures
  const accountsWithTemp = targetAccounts.map((a) => ({
    ...a,
    temperature: updateAccountTemperature(a, engagementLog),
  }))

  const byTemp = (t: AccountTemperature) => accountsWithTemp.filter((a) => a.temperature === t)

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Engagement Hub</h1>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">
              Draft specific replies, nurture target relations, and output Grok evaluation packets.
            </p>
          </div>
          <button 
            onClick={handleCopyGrokEngagementPacket}
            className={`glass-button px-4 py-2 text-xs font-semibold ${copiedPacket ? 'border-emerald-500/35 text-emerald-400' : ''}`}
          >
            {copiedPacket ? 'Packet Copied ✓' : 'Copy Grok Engagement Packet 📋'}
          </button>
        </div>

        {/* Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Targets & Logs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Tabs Toggle */}
            <div className="flex bg-[#111111]/80 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setLeftTab('targets')}
                className={`flex-1 text-xs py-2 rounded-md font-semibold transition-colors ${
                  leftTab === 'targets' ? 'bg-white/[0.06] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                Targets ({targetAccounts.length})
              </button>
              <button
                onClick={() => setLeftTab('logs')}
                className={`flex-1 text-xs py-2 rounded-md font-semibold transition-colors ${
                  leftTab === 'logs' ? 'bg-white/[0.06] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                Log History ({engagementLog.length})
              </button>
            </div>

            {/* Targets view */}
            {leftTab === 'targets' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Tiers</span>
                  <button
                    onClick={() => setShowAddAccount(!showAddAccount)}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    {showAddAccount ? 'Cancel' : '+ Add Account'}
                  </button>
                </div>

                {/* Add target account inline form */}
                {showAddAccount && (
                  <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="@twitter_handle"
                      value={newHandle}
                      onChange={(e) => setNewHandle(e.target.value)}
                      className="glass-input px-3 py-2 bg-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Display Name (optional)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="glass-input px-3 py-2 bg-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Why follow? (e.g. Next.js Core Dev)"
                      value={newWhy}
                      onChange={(e) => setNewWhy(e.target.value)}
                      className="glass-input px-3 py-2 bg-transparent"
                    />
                    <button
                      onClick={handleAddAccount}
                      disabled={!newHandle.trim()}
                      className="glass-button w-full py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                    >
                      Save Target
                    </button>
                  </div>
                )}

                {/* Tiers List */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {(['connection', 'hot', 'warm', 'cold'] as AccountTemperature[]).map((temp) => {
                    const group = byTemp(temp)
                    const cfg = TEMP_CONFIG[temp]
                    return (
                      <div key={temp} className="space-y-2">
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="text-xs">{cfg.icon}</span>
                          <span className="text-[10px] font-bold tracking-wider font-mono uppercase" style={{ color: cfg.color }}>{cfg.label}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">({group.length})</span>
                        </div>
                        
                        <div className="space-y-2">
                          {group.map((acct) => {
                            const isSelected = selectedTarget?.id === acct.id
                            return (
                              <div 
                                key={acct.id} 
                                onClick={() => handleSelectTarget(acct)}
                                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                  isSelected 
                                    ? 'bg-white/[0.05] border-[var(--accent)] shadow-md' 
                                    : 'bg-[#111111]/45 border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-semibold text-white">@{acct.handle}</span>
                                      {acct.name !== acct.handle && (
                                        <span className="text-[10px] text-[var(--text-muted)] truncate">({acct.name})</span>
                                      )}
                                    </div>
                                    {acct.why && (
                                      <p className="text-[10px] text-[var(--text-muted)] mt-1 truncate">{acct.why}</p>
                                    )}
                                  </div>

                                  <select
                                    value={acct.temperature}
                                    onChange={(e) => handleTempOverride(acct.id, e.target.value as AccountTemperature)}
                                    onClick={(e) => e.stopPropagation()} // Prevent select click from triggering parent select
                                    className="text-[10px] bg-black border border-white/5 rounded px-1.5 py-0.5 text-zinc-300 outline-none cursor-pointer"
                                  >
                                    {(['cold', 'warm', 'hot', 'connection'] as AccountTemperature[]).map((t) => (
                                      <option key={t} value={t}>{TEMP_CONFIG[t].icon} {t}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )
                          })}
                          {group.length === 0 && (
                            <p className="text-[10px] text-[var(--text-muted)] italic pl-6">No accounts in this tier.</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Log view */}
            {leftTab === 'logs' && (
              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {engagementLog.map((logItem) => (
                  <div key={logItem.id} className="glass-panel p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white">@{logItem.targetHandle}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {new Date(logItem.repliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] italic truncate">"{logItem.tweetSnippet}..."</p>
                    <p className="text-xs font-mono text-zinc-200 whitespace-pre-wrap">{logItem.replyUsed}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Outcome:</span>
                      <select
                        value={logItem.outcome || ''}
                        onChange={(e) => handleUpdateOutcome(logItem.id, e.target.value)}
                        className="text-[10px] bg-black border border-white/5 rounded px-1.5 py-0.5 text-zinc-300 outline-none"
                      >
                        <option value="copied & posted">Copied & Posted</option>
                        <option value="they replied">They Replied</option>
                        <option value="got 3+ likes">Got 3+ Likes</option>
                        <option value="they followed me">They Followed Me</option>
                        <option value="no response">No Response</option>
                      </select>
                    </div>
                  </div>
                ))}
                {engagementLog.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] italic text-center py-10">No replies logged yet.</p>
                )}
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Active Generator (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {selectedTarget ? (
              <div className="glass-panel p-5 rounded-xl flex flex-col gap-5">
                
                {/* Selected Info */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>@{selectedTarget.handle}</span>
                      <span className="text-xs font-normal text-[var(--text-muted)] font-mono">
                        ({selectedTarget.name})
                      </span>
                    </h2>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">
                      {selectedTarget.why}
                    </p>
                  </div>
                  <a
                    href={`https://x.com/${selectedTarget.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    Open X Profile
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>

                {/* Paste Area */}
                <div className="space-y-2">
                  <label className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider block">Target's Tweet</label>
                  <textarea
                    placeholder="Paste the tweet you want to reply to here..."
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    className="glass-input w-full h-24 bg-transparent text-sm p-3 resize-none font-mono"
                  />
                </div>

                {/* Goal Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider block">Reply Strategy</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {OPPORTUNITY_OPTIONS.map((opt) => (
                      <label 
                        key={opt.value} 
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all duration-200 ${
                          oppType === opt.value 
                            ? 'bg-white/[0.05] border-[var(--accent)] text-white' 
                            : 'bg-transparent border-white/5 text-[var(--text-muted)] hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="oppType"
                          value={opt.value}
                          checked={oppType === opt.value}
                          onChange={() => setOppType(opt.value)}
                          className="sr-only"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateReplies}
                  disabled={loading || !tweetText.trim()}
                  className="glass-button w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] border-transparent text-white font-bold text-xs"
                >
                  {loading ? 'Generating Options...' : 'Generate 3 Reply Options →'}
                </button>

                {error && (
                  <p className="text-xs text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Reply Generation Results */}
                {replyResult && (
                  <div className="space-y-4 mt-2">
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-xs">
                      <span className="font-semibold text-[var(--text-muted)] uppercase text-[9px] block mb-1">Context Analysis</span>
                      <p className="text-zinc-300 leading-relaxed font-mono">{replyResult.context}</p>
                    </div>

                    <div className="space-y-3">
                      {replyResult.replies.map((reply) => {
                        const chars = reply.content.length
                        const isOver = chars > 280
                        const isCopied = copiedText === reply.content

                        return (
                          <div 
                            key={reply.option} 
                            className={`p-4 bg-white/[0.02] border rounded-xl flex flex-col gap-3 ${
                              isOver ? 'border-red-500/20 bg-red-500/[0.01]' : 'border-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold font-mono text-[var(--accent)]">
                                OPTION {reply.option} <span className="font-normal text-[var(--text-muted)] font-sans">[{reply.tone}]</span>
                              </span>
                              <span className={`font-mono text-[10px] ${isOver ? 'text-[var(--fail)] font-bold' : 'text-[var(--text-muted)]'}`}>
                                {chars} / 280 chars
                              </span>
                            </div>

                            <p className="text-sm font-mono leading-relaxed text-zinc-100 whitespace-pre-wrap select-all">
                              {reply.content}
                            </p>

                            <div className="flex justify-end gap-2 text-xs">
                              <button 
                                onClick={() => handleCopy(reply.content, 'grok')} 
                                className="glass-button px-3 py-1.5 text-[10px] bg-transparent text-[var(--text-muted)]"
                              >
                                Grok Prompt
                              </button>
                              <button 
                                onClick={() => handleCopy(reply.content, 'raw')} 
                                className="glass-button px-3 py-1.5 text-[10px] bg-transparent"
                              >
                                {isCopied ? 'Copied ✓' : 'Copy Raw'}
                              </button>
                              <button 
                                onClick={() => handleCopyAndLog(reply.content, reply.option)} 
                                className="glass-button px-3.5 py-1.5 text-[10px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-transparent"
                              >
                                Copy & Log
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="glass-panel p-10 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">🎯</span>
                <h3 className="text-sm font-bold text-white">Select a Target Account</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
                  Choose a growth target account from the left panel list to review their details and generate optimized comment replies.
                </p>
              </div>
            )}

            {/* Grok Packet Settings Drawer/Card */}
            <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
              <button
                onClick={() => setShowGrokConfig(!showGrokConfig)}
                className="w-full flex justify-between items-center text-xs font-semibold text-[var(--text-muted)]"
              >
                <span>Grok Engagement Packet Settings</span>
                <span>{showGrokConfig ? 'Hide' : 'Configure'}</span>
              </button>

              {showGrokConfig && (
                <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Topic Keywords</label>
                    <input
                      type="text"
                      value={topicKeywords}
                      onChange={(e) => setTopicKeywords(e.target.value)}
                      className="glass-input w-full px-3 py-1.5 text-xs bg-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Custom Grok Instructions</label>
                    <textarea
                      placeholder="e.g. Search for active threads about Claude 3.5 context limits..."
                      value={grokCustomRequest}
                      onChange={(e) => setGrokCustomRequest(e.target.value)}
                      className="glass-input w-full h-16 px-3 py-2 text-xs bg-transparent resize-none font-mono"
                    />
                  </div>
                  <button 
                    onClick={handleCopyGrokEngagementPacket}
                    className="glass-button w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border-transparent"
                  >
                    Compile & Copy Grok Packet
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Toast Alert */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 glass-panel px-4 py-2.5 rounded-lg text-xs text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            ✓ {toast}
          </div>
        )}

      </div>
    </AppShell>
  )
}
