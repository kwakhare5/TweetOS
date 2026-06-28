'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useDraftStore } from '@/store/useDraftStore'
import { useProfileStore } from '@/store/useProfileStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { scoreTweet } from '@/lib/scorer'
import { geminiJSON } from '@/lib/gemini'
import { UNIFIED_ROUTER_PROMPT } from '@/lib/prompts'
import { generateDraftPacket, generateTrendingPacket } from '@/lib/grok-packager'
import { TweetDraft, AlgorithmScore, MomentType } from '@/types'
import ScoreCard from '@/components/scorer/ScoreCard'
import { 
  Plus, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Clipboard, 
  Check
} from 'lucide-react'

export default function WorkspacePage() {
  // Stores
  const { drafts, addDraft, updateDraft, setDrafts } = useDraftStore()
  const { profile } = useProfileStore()
  const { addEntry, entries } = useLibraryStore()

  // States
  const [activeDraft, setActiveDraft] = useState<TweetDraft | null>(null)
  
  // Unified Composer States
  const [unifiedText, setUnifiedText] = useState('')
  const [unifiedLoading, setUnifiedLoading] = useState(false)
  const [unifiedError, setUnifiedError] = useState<string | null>(null)
  const [replyResult, setReplyResult] = useState<{ context: string; replies: { option: string; tone: string; content: string }[] } | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  // Tool Results
  const [hookResults, setHookResults] = useState<{ technique: string; text: string }[]>([])
  const [threadResults, setThreadResults] = useState<{ number: number; content: string }[]>([])
  const [tightenResult, setTightenResult] = useState<string | null>(null)

  // Scorer State (dynamic scoring)
  const [score, setScore] = useState<AlgorithmScore | null>(null)

  // Clipboard notify
  const [toast, setToast] = useState<string | null>(null)

  // Trigger toast notification
  function triggerToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Synchronize helper to change draft and content
  function selectActiveDraft(d: TweetDraft | null) {
    setActiveDraft(d)
    setUnifiedText(d ? d.content : '')
  }

  // Load drafts if none on mount
  useEffect(() => {
    if (drafts.length > 0 && !activeDraft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      selectActiveDraft(drafts[0])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts])

  // Real-time score calculator
  useEffect(() => {
    if (activeDraft) {
      const calculated = scoreTweet(activeDraft.content, activeDraft.isThread)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScore(calculated)
      updateDraft(activeDraft.id, { algorithmScore: calculated })
    } else {
      setScore(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDraft?.content, activeDraft?.isThread])

  // Get Top 10 posted tweets for Closed-Loop prompt learning
  function getTopPerformersContext(): string {
    const postedWithNotes = [...entries]
      .filter(e => e.postedAt && e.performanceNote)
      .sort((a, b) => new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime())
      .slice(0, 10)

    if (postedWithNotes.length === 0) return ''

    return postedWithNotes.map((e, idx) => {
      return `[Past Tweet #${idx + 1}]
Tweet: ${e.tweet}
Original Score: ${e.algorithmScore?.overall ?? 'N/A'}/100
Result Notes: ${e.performanceNote}
---`
    }).join('\n')
  }

  // Active editor updates
  function handleContentChange(val: string) {
    if (!activeDraft) return
    
    let cleanVal = val
    let matchedPillarId = activeDraft.pillarId
    const pillars = profile?.contentPillars || []

    // Try to match content pillar prefix
    for (const pillar of pillars) {
      const name = pillar.name
      const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const regexes = [
        new RegExp(`^\\[Pillar:\\s*${escapedName}\\]\\s*`, 'i'),
        new RegExp(`^\\[${escapedName}\\]\\s*`, 'i'),
        new RegExp(`^${escapedName}\\s*[|:]\\s*`, 'i'),
        new RegExp(`^•\\s*\\*\\*.*?\\[Pillar:\\s*${escapedName}\\]\\s*\\*\\*:\\s*`, 'i'),
        new RegExp(`^\\*\\s*\\*\\*.*?\\[Pillar:\\s*${escapedName}\\]\\s*\\*\\*:\\s*`, 'i'),
        new RegExp(`^\\*\\*.*?\\[Pillar:\\s*${escapedName}\\]\\s*\\*\\*:\\s*`, 'i')
      ]

      let matched = false
      for (const rx of regexes) {
        if (rx.test(cleanVal)) {
          cleanVal = cleanVal.replace(rx, '')
          matchedPillarId = name
          matched = true
          break
        }
      }
      if (matched) break
    }

    // Strip trailing character counts like " (120)" or " (120 chars)"
    cleanVal = cleanVal.replace(/\s*\(\d+(?:\s*chars)?\)\s*$/, '')

    setActiveDraft({ ...activeDraft, content: cleanVal, pillarId: matchedPillarId })
    updateDraft(activeDraft.id, { content: cleanVal, pillarId: matchedPillarId })
  }

  function handleThreadToggle(isThread: boolean) {
    if (!activeDraft) return
    const initialThread = isThread ? [activeDraft.content, ''] : []
    setActiveDraft({ ...activeDraft, isThread, threadTweets: initialThread })
    updateDraft(activeDraft.id, { isThread, threadTweets: initialThread })
  }

  function handleThreadTweetChange(index: number, val: string) {
    if (!activeDraft || !activeDraft.threadTweets) return
    const updated = [...activeDraft.threadTweets]
    updated[index] = val
    
    // Combine thread text for main scorer evaluation or calculate score per item
    const combinedText = updated.join('\n\n')
    
    setActiveDraft({ ...activeDraft, content: combinedText, threadTweets: updated })
    updateDraft(activeDraft.id, { content: combinedText, threadTweets: updated })
  }

  function handleAddThreadTweet() {
    if (!activeDraft || !activeDraft.threadTweets) return
    const updated = [...activeDraft.threadTweets, '']
    setActiveDraft({ ...activeDraft, threadTweets: updated })
    updateDraft(activeDraft.id, { threadTweets: updated })
  }

  function handleRemoveThreadTweet(index: number) {
    if (!activeDraft || !activeDraft.threadTweets || activeDraft.threadTweets.length <= 2) return
    const updated = activeDraft.threadTweets.filter((_, i) => i !== index)
    const combinedText = updated.join('\n\n')
    setActiveDraft({ ...activeDraft, content: combinedText, threadTweets: updated })
    updateDraft(activeDraft.id, { content: combinedText, threadTweets: updated })
  }

  // Delete draft
  function handleDeleteDraft(id: string) {
    const updated = drafts.filter(d => d.id !== id)
    setDrafts(updated)
    if (activeDraft?.id === id) {
      selectActiveDraft(updated[0] || null)
    }
    triggerToast('Draft deleted!')
  }

  // Create new blank draft
  function handleCreateDraft() {
    const now = new Date().toISOString()
    const newDraft: TweetDraft = {
      id: `draft_${Date.now()}`,
      content: '',
      isThread: false,
      threadTweets: [],
      pillarId: profile.contentPillars[0]?.name || 'General',
      momentType: 'progress',
      hookVariations: [],
      algorithmScore: {
        overall: 0,
        hookStrength: { score: 0, label: 'Weak', reason: 'Empty' },
        replyBait: { score: 0, label: 'Weak', reason: 'Empty' },
        specificity: { score: 0, label: 'Weak', reason: 'Empty' },
        emotionalTrigger: { score: 0, label: 'Weak', reason: 'Empty' },
        length: { score: 0, label: 'Weak', reason: 'Empty' },
        noLinksInBody: { score: 10, label: 'Strong', reason: 'Empty' },
        ctaQuality: { score: 0, label: 'Weak', reason: 'Empty' },
        threadPotential: { score: 0, label: 'Weak', reason: 'Empty' },
        suggestions: [],
        calculatedAt: now
      },
      status: 'draft',
      createdAt: now,
      updatedAt: now
    }
    addDraft(newDraft)
    selectActiveDraft(newDraft)
    triggerToast('New draft started!')
  }  // Unified Action Generator
  async function handleRunUnifiedAction() {
    if (!unifiedText.trim()) return
    setUnifiedLoading(true)
    setUnifiedError(null)

    // Clear previous results
    setHookResults([])
    setThreadResults([])
    setTightenResult(null)
    setReplyResult(null)

    try {
      const topPerformers = getTopPerformersContext()
      const prompt = UNIFIED_ROUTER_PROMPT(unifiedText, profile, topPerformers)
      
      const result = await geminiJSON<{
        intent: 'draft' | 'hooks' | 'thread' | 'tighten' | 'replies'
        moments?: { id: string; insight: string; type: string; pillarName: string; tweet: string; hookVariations: string[]; isThread: boolean; threadTweets: string[] }[]
        hooks?: { technique: string; text: string }[]
        thread?: { number: number; content: string }[]
        tightenedText?: string
        replies?: { option: string; tone: string; content: string }[]
      }>(prompt)

      if (result.intent === 'draft' && result.moments) {
        const newDrafts: TweetDraft[] = result.moments.map(m => {
          const now = new Date().toISOString()
          return {
            id: `draft_${Date.now()}_${m.id}`,
            content: m.tweet,
            isThread: m.isThread,
            threadTweets: m.threadTweets || [],
            pillarId: m.pillarName,
            momentType: (m.type as MomentType) || 'progress',
            hookVariations: m.hookVariations || [],
            algorithmScore: {
              overall: 0,
              hookStrength: { score: 0, label: 'Weak', reason: 'Not scored' },
              replyBait: { score: 0, label: 'Weak', reason: 'Not scored' },
              specificity: { score: 0, label: 'Weak', reason: 'Not scored' },
              emotionalTrigger: { score: 0, label: 'Weak', reason: 'Not scored' },
              length: { score: 0, label: 'Weak', reason: 'Not scored' },
              noLinksInBody: { score: 10, label: 'Strong', reason: 'Not scored' },
              ctaQuality: { score: 0, label: 'Weak', reason: 'Not scored' },
              threadPotential: { score: 0, label: 'Weak', reason: 'Not scored' },
              suggestions: [],
              calculatedAt: now
            },
            status: 'draft',
            createdAt: now,
            updatedAt: now
          }
        })

        newDrafts.forEach(d => addDraft(d))
        if (newDrafts.length > 0) {
          selectActiveDraft(newDrafts[0])
        }
        setUnifiedText('')
        triggerToast(`Auto-detected: Draft writing. Extracted ${newDrafts.length} drafts!`)
      } else if (result.intent === 'hooks' && result.hooks) {
        setHookResults(result.hooks)
        triggerToast(`Auto-detected: Hook generation. Generated ${result.hooks.length} hooks!`)
      } else if (result.intent === 'thread' && result.thread) {
        setThreadResults(result.thread)
        triggerToast(`Auto-detected: Thread builder. Structured thread!`)
      } else if (result.intent === 'tighten' && result.tightenedText) {
        setTightenResult(result.tightenedText)
        triggerToast(`Auto-detected: Tighten Copy. Condensed tweet text!`)
      } else if (result.intent === 'replies' && result.replies) {
        setReplyResult({
          context: 'Replies generated via ChatGPT intent analysis',
          replies: result.replies
        })
        triggerToast(`Auto-detected: Reply generator. Suggested ${result.replies.length} replies!`)
      } else {
        // Fallback if schema match failed
        throw new Error('Unrecognized response format from routing engine.')
      }
    } catch (e) {
      setUnifiedError(e instanceof Error ? e.message : 'Action execution failed')
    } finally {
      setUnifiedLoading(false)
    }
  }

  // Apply Refinement Content
  function applyWorkshopContent(newText: string, isThread = false, threadList: string[] = []) {
    if (!activeDraft) return
    setActiveDraft({
      ...activeDraft,
      content: newText,
      isThread,
      threadTweets: threadList
    })
    updateDraft(activeDraft.id, {
      content: newText,
      isThread,
      threadTweets: threadList
    })
    // Clear the active tool outputs after applying
    setHookResults([])
    setThreadResults([])
    setTightenResult(null)
    triggerToast('Applied refined text to editor!')
  }

  // Copy reply text
  function handleCopyReply(content: string, type: 'raw' | 'grok') {
    let finalContent = content
    if (type === 'grok') {
      finalContent = `Please review and optimize this tweet reply in my Pune CS student voice:\n"${content}"`
    }
    navigator.clipboard.writeText(finalContent)
    setCopiedText(content)
    triggerToast(type === 'grok' ? 'Grok Critique Prompt copied!' : 'Tweet copied to clipboard!')
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Copy Option C payload (critique prompt or raw text)
  function handleClipboardAction(type: 'raw' | 'grok' | 'trending') {
    if (type === 'trending') {
      const packet = generateTrendingPacket(profile, {
        mode: 'trending',
        focusAreas: [],
        customRequest: ''
      }, entries)
      navigator.clipboard.writeText(packet)
      triggerToast('Trending Radar Packet copied! Paste into Grok.')
      return
    }
    if (!activeDraft) return
    let textToCopy = activeDraft.content
    if (type === 'grok') {
      const config = {
        mode: 'draft' as const,
        selectedDraftIds: [activeDraft.id],
        includeScores: true,
        dumpMode: 'auto' as const,
        customRequest: 'Standard validation feedback'
      }
      textToCopy = generateDraftPacket(profile, [activeDraft], config, entries)
    }
    navigator.clipboard.writeText(textToCopy)
    triggerToast(type === 'grok' ? 'Grok Critique Packet copied!' : 'Raw tweet copied!')
  }

  // Save to Library & Mark Posted
  function handleMarkAsPosted() {
    if (!activeDraft || !activeDraft.content.trim()) return
    
    const now = new Date().toISOString()
    const newEntryObj = {
      id: `lib_${Date.now()}`,
      tweet: activeDraft.content,
      isThread: activeDraft.isThread,
      threadTweets: activeDraft.threadTweets,
      pillarId: activeDraft.pillarId,
      algorithmScore: score || undefined,
      postedAt: now,
      performanceNote: '',
      tags: [activeDraft.pillarId.toLowerCase()],
      createdAt: now
    }

    // Save library entry
    addEntry(newEntryObj)
    
    // Remove from drafts store (or mark it archived)
    const updatedDrafts = drafts.filter(d => d.id !== activeDraft.id)
    setDrafts(updatedDrafts)
    
    if (updatedDrafts.length > 0) {
      selectActiveDraft(updatedDrafts[0])
    } else {
      selectActiveDraft(null)
    }

    triggerToast('Tweet saved to Library! Loopback locked.')
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Workspace Title bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Creator Workspace</h1>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">
              Draft, polish, run through automated scorer, and export content for validation.
            </p>
          </div>
          <button 
            onClick={handleCreateDraft}
            className="glass-button px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs border-transparent flex items-center gap-1.5 cursor-pointer shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Write Draft</span>
          </button>
        </div>        {/* Unified Workspace Dashboard */}
        <div className="max-w-2xl mx-auto flex flex-col gap-6 w-full">
          
          {/* AI Composer Section */}
          <div className="glass-panel p-5 rounded-xl flex flex-col gap-4 border border-white/5 bg-white/[0.01]">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>AI Composer</span>
              </h3>
            </div>

            {/* Active Draft Control Row (Pillar select & Thread toggle & Clear/New) */}
            {activeDraft && (
              <div className="flex justify-between items-center flex-wrap gap-3 bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Pillar Label */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">Pillar:</span>
                    <span className="text-zinc-200 font-semibold px-2 py-0.5 bg-white/[0.03] border border-white/5 rounded">
                      {activeDraft.pillarId}
                    </span>
                  </div>

                  {/* Thread Mode checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    <input 
                      type="checkbox"
                      checked={activeDraft.isThread}
                      onChange={(e) => handleThreadToggle(e.target.checked)}
                      className="accent-[var(--accent)]"
                    />
                    <span>Thread Mode</span>
                  </label>
                </div>

                {/* Deselect / New Draft */}
                <button 
                  onClick={() => selectActiveDraft(null)}
                  className="text-[11px] text-[var(--text-muted)] hover:text-white underline"
                  title="Deselect active draft to write raw thoughts dump"
                >
                  Write Raw Thoughts / New
                </button>
              </div>
            )}

            {/* Input / Editor Textarea Box */}
            <div className="space-y-3">
              {activeDraft?.isThread ? (
                /* Thread Mode Editor */
                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                  {(activeDraft.threadTweets || []).map((tText, idx) => (
                    <div key={idx} className="flex gap-3 items-start border-l-2 border-white/5 pl-3 focus-within:border-[var(--accent)]">
                      <span className="text-xs font-bold text-[var(--accent)] mt-2 shrink-0">{idx + 1}/</span>
                      <textarea
                        value={tText}
                        onChange={(e) => handleThreadTweetChange(idx, e.target.value)}
                        placeholder={idx === 0 ? "Thread hook tweet..." : "Next thread point..."}
                        rows={3}
                        className="w-full bg-transparent text-sm font-sans p-1 resize-none outline-none focus:outline-none whitespace-pre-wrap leading-relaxed text-zinc-200 border-none"
                      />
                      {idx > 1 && (
                        <button 
                          onClick={() => handleRemoveThreadTweet(idx)}
                          className="text-xs text-[var(--fail)] hover:text-red-400 p-1 shrink-0 font-bold text-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={handleAddThreadTweet}
                    className="glass-button py-1.5 px-3 text-xs w-full justify-center"
                  >
                    + Add Tweet to Thread
                  </button>
                </div>
              ) : (
                /* Standard Composer Textarea */
                <textarea
                  placeholder="Type anything... Dump raw thoughts, write a topic for a thread, paste a tweet to reply to, or ask to generate hooks/shorten text."
                  value={unifiedText}
                  onChange={(e) => {
                    const val = e.target.value
                    setUnifiedText(val)
                    if (activeDraft) {
                      handleContentChange(val)
                    }
                  }}
                  className="glass-input w-full h-36 p-3 bg-transparent text-sm font-sans leading-relaxed focus:border-[var(--accent)] transition-all duration-200"
                />
              )}

              {/* Action Buttons Row */}
              <div className="flex justify-between items-center gap-3 flex-wrap text-xs pt-1">
                <div className="flex items-center gap-2">
                  {activeDraft && !activeDraft.isThread && (
                    <span className={`font-semibold ${
                      unifiedText.length > 280 ? 'text-[var(--fail)] font-bold animate-pulse' : 'text-[var(--text-muted)]'
                    }`}>
                      {unifiedText.length} / 280
                    </span>
                  )}
                  {activeDraft && activeDraft.isThread && (
                    <span className="text-[var(--text-muted)] font-semibold">
                      {activeDraft.threadTweets?.length || 0} tweets in thread
                    </span>
                  )}
                  {activeDraft && unifiedText !== activeDraft.content && (
                    <button 
                      onClick={() => setUnifiedText(activeDraft.content)} 
                      className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 font-semibold"
                    >
                      Reset input to Active Draft
                    </button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  {activeDraft && (
                    <div className="flex gap-1.5 flex-wrap">
                      <button 
                        onClick={() => handleDeleteDraft(activeDraft.id)}
                        className="glass-button px-2.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border-red-500/10 flex items-center gap-1 cursor-pointer font-semibold"
                        title="Delete current draft"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => handleClipboardAction('trending')}
                        className="glass-button px-2.5 py-1.5 bg-transparent text-[var(--text-muted)] flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-white"
                        title="Generate a Trending Radar packet to paste into Grok"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                        <span>Trending</span>
                      </button>
                      <button 
                        onClick={() => handleClipboardAction('grok')}
                        disabled={!activeDraft.content.trim()}
                        className="glass-button px-2.5 py-1.5 bg-transparent text-[var(--text-muted)] flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Grok Packet</span>
                      </button>
                      <button 
                        onClick={() => handleClipboardAction('raw')}
                        disabled={!activeDraft.content.trim()}
                        className="glass-button px-2.5 py-1.5 bg-transparent text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                        <span>Copy Raw</span>
                      </button>
                      <button 
                        onClick={handleMarkAsPosted}
                        disabled={!activeDraft.content.trim() || activeDraft.content.length > 280}
                        className="glass-button px-3 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-transparent flex items-center gap-1 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Posted</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleRunUnifiedAction}
                    disabled={unifiedLoading || !unifiedText.trim()}
                    className="glass-button px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {unifiedLoading ? (
                      <>
                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/50 border-t-transparent rounded-full" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>Run Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {unifiedError && (
              <p className="text-xs text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-2.5 rounded-lg">
                {unifiedError}
              </p>
            )}
          </div>

          {/* AI Action Results View (Hooks, Threads, Replies) */}
          {(hookResults.length > 0 || threadResults.length > 0 || tightenResult || replyResult) && (
            <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="text-xs uppercase tracking-wider text-white font-bold">Generation Results</h4>
                <button 
                  onClick={() => {
                    setHookResults([])
                    setThreadResults([])
                    setTightenResult(null)
                    setReplyResult(null)
                  }} 
                  className="text-[11px] text-[var(--text-muted)] hover:text-white"
                >
                  Clear
                </button>
              </div>

              {/* Hook Results */}
              {hookResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Click a hook to apply as first line of active draft:</p>
                  {hookResults.map((h, i) => (
                    <div 
                      key={i}
                      onClick={() => {
                        if (activeDraft) {
                          const lines = activeDraft.content.split('\n')
                          lines[0] = h.text
                          applyWorkshopContent(lines.join('\n'))
                        } else {
                          triggerToast("Select a draft first to apply hooks!")
                        }
                      }}
                      className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs cursor-pointer text-zinc-300 leading-relaxed font-sans transition-all duration-200 group"
                    >
                      <p className="font-bold text-[9px] text-[var(--accent)] uppercase tracking-wide mb-1 group-hover:text-white transition-colors">{h.technique}</p>
                      <p>{h.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tighten Result */}
              {tightenResult && (
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-zinc-300 leading-relaxed font-sans space-y-3">
                  <p>{tightenResult}</p>
                  <button 
                    onClick={() => applyWorkshopContent(tightenResult)}
                    className="glass-button w-full py-1.5 text-xs bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Tightened Text to Active Draft</span>
                  </button>
                </div>
              )}

              {/* Thread Results */}
              {threadResults.length > 0 && (
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col gap-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {threadResults.map((tweet) => (
                      <div key={tweet.number} className="text-xs text-zinc-300 leading-relaxed font-sans flex gap-2">
                        <span className="font-bold text-[var(--accent)]">{tweet.number}/</span>
                        <span className="flex-1">{tweet.content}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => applyWorkshopContent(
                      threadResults.map(t => t.content).join('\n\n'), 
                      true, 
                      threadResults.map(t => t.content)
                    )}
                    className="glass-button w-full py-1.5 text-xs bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply as Multi-Tweet Thread</span>
                  </button>
                </div>
              )}

              {/* Reply Results */}
              {replyResult && (
                <div className="space-y-3">
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">{replyResult.context}</p>
                  {replyResult.replies.map((reply) => {
                    const chars = reply.content.length
                    const isOver = chars > 280
                    const isCopied = copiedText === reply.content

                    return (
                      <div 
                        key={reply.option} 
                        className={`p-3 bg-white/[0.02] border rounded-xl flex flex-col gap-2 ${
                          isOver ? 'border-red-500/20 bg-red-500/[0.01]' : 'border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[var(--accent)]">
                            OPTION {reply.option} ({reply.tone})
                          </span>
                          <span className={`text-[10px] font-semibold ${isOver ? 'text-[var(--fail)] font-bold' : 'text-[var(--text-muted)]'}`}>
                            {chars} / 280 chars
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap select-all font-sans">
                          {reply.content}
                        </p>

                        <div className="flex justify-end gap-1.5 text-xs mt-1">
                          <button 
                            onClick={() => handleCopyReply(reply.content, 'grok')} 
                            className="glass-button px-2.5 py-1 text-[10px] bg-transparent text-[var(--text-muted)]"
                          >
                            Grok Prompt
                          </button>
                          <button 
                            onClick={() => handleCopyReply(reply.content, 'raw')} 
                            className="glass-button px-2.5 py-1 text-[10px] bg-transparent text-zinc-300"
                          >
                            {isCopied ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clipboard className="w-3 h-3 text-zinc-400" />
                                <span>Copy</span>
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Saved Drafts List (Underneath composer) */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Your Drafts ({drafts.length})</span>
              </span>
              
              {drafts.length > 0 && activeDraft && (
                <button 
                  onClick={() => selectActiveDraft(null)} 
                  className="text-[11px] text-[var(--text-muted)] hover:text-white"
                >
                  Deselect Active
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[35vh] overflow-y-auto pr-1">
              {drafts.map(d => {
                const isActive = activeDraft?.id === d.id
                const snippet = d.content.trim() ? d.content.slice(0, 80) + (d.content.length > 80 ? '...' : '') : 'Empty draft...'
                return (
                  <div 
                    key={d.id}
                    onClick={() => selectActiveDraft(d)}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-white/[0.05] border-[var(--accent)] shadow-md' 
                        : 'bg-[#111111]/45 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] px-1.5 py-0.5 bg-white/[0.02] border border-white/5 rounded">
                        {d.pillarId}
                      </span>
                      {d.algorithmScore?.overall > 0 && (
                        <span className="text-[11px] text-zinc-300 font-medium">
                          Score: {d.algorithmScore.overall}/100
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-200 mt-2 line-clamp-2 leading-relaxed">
                      {snippet}
                    </p>
                  </div>
                )
              })}
              {drafts.length === 0 && (
                <div className="text-center py-6 text-xs text-[var(--text-muted)] border border-white/5 border-dashed rounded-lg">
                  No drafts. Use composer above to generate drafts!
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Scorecard at the very bottom */}
          {activeDraft && score && (
            <div className="mt-2">
              <ScoreCard score={score} />
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
