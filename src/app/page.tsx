'use client'

import { useState, useEffect, useRef } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useDraftStore } from '@/store/useDraftStore'
import { useProfileStore } from '@/store/useProfileStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { scoreTweet } from '@/lib/scorer'
import { geminiJSON } from '@/lib/gemini'
import { 
  BRAIN_DUMP_PROMPT, 
  HOOK_GENERATOR_PROMPT, 
  VARIATION_GENERATOR_PROMPT, 
  TIGHTENER_PROMPT, 
  THREAD_BUILDER_PROMPT 
} from '@/lib/prompts'
import { generateDraftPacket, generateTrendingPacket } from '@/lib/grok-packager'
import { TweetDraft, AlgorithmScore, MomentType, DumpMode } from '@/types'
import ScoreCard from '@/components/scorer/ScoreCard'

// SVG Icons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813zM18 10.5l-.563 2.25L15 13l2.437.25.563 2.25.563-2.25L21 13l-2.437-.25-.563-2.25z" />
  </svg>
)

export default function WorkspacePage() {
  // Stores
  const { drafts, addDraft, updateDraft, setDrafts } = useDraftStore()
  const { profile } = useProfileStore()
  const { addEntry, entries } = useLibraryStore()

  // States
  const [activeTab, setActiveTab] = useState<'drafts' | 'dump' | 'workshop'>('drafts')
  const [activeDraft, setActiveDraft] = useState<TweetDraft | null>(null)
  
  // Brain Dump States
  const [dumpText, setDumpText] = useState('')
  const [dumpMode, setDumpMode] = useState<DumpMode>('dev')
  const [dumpLoading, setDumpLoading] = useState(false)
  const [dumpError, setDumpError] = useState<string | null>(null)

  // Workshop States
  const [workshopTool, setWorkshopTool] = useState<'hooks' | 'variations' | 'tighten' | 'thread' | null>(null)
  const [workshopLoading, setWorkshopLoading] = useState(false)
  const [workshopError, setWorkshopError] = useState<string | null>(null)
  
  // Tool Results
  const [hookResults, setHookResults] = useState<{ technique: string; text: string }[]>([])
  const [variationResults, setVariationResults] = useState<{ angle: string; text: string }[]>([])
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

  // Load drafts if none on mount
  useEffect(() => {
    if (drafts.length > 0 && !activeDraft) {
      setActiveDraft(drafts[0])
    }
  }, [drafts, activeDraft])

  // Real-time score calculator
  useEffect(() => {
    if (activeDraft) {
      const calculated = scoreTweet(activeDraft.content, activeDraft.isThread)
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
    setActiveDraft({ ...activeDraft, content: val })
    updateDraft(activeDraft.id, { content: val })
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
    setActiveDraft(newDraft)
    setActiveTab('drafts')
    triggerToast('New draft started!')
  }

  // Extract drafts from raw text (Brain Dump)
  async function handleExtractFromDump() {
    if (dumpText.trim().length < 15) return
    setDumpLoading(true)
    setDumpError(null)
    try {
      const topPerformers = getTopPerformersContext()
      const prompt = BRAIN_DUMP_PROMPT(dumpText, profile, topPerformers, dumpMode)
      
      const result = await geminiJSON<{ moments: { id: string; insight: string; type: string; pillarName: string; tweet: string; hookVariations: string[]; isThread: boolean; threadTweets: string[] }[] }>(prompt)
      
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

      // Add to store
      newDrafts.forEach(d => addDraft(d))
      if (newDrafts.length > 0) {
        setActiveDraft(newDrafts[0])
      }
      setDumpText('')
      setActiveTab('drafts')
      triggerToast(`Extracted ${newDrafts.length} drafts!`)
    } catch (e) {
      setDumpError(e instanceof Error ? e.message : 'Brain dump extraction failed')
    } finally {
      setDumpLoading(false)
    }
  }

  // AI Workshop Actions
  async function handleRunWorkshopTool(tool: 'hooks' | 'variations' | 'tighten' | 'thread') {
    if (!activeDraft?.content.trim()) return
    setWorkshopTool(tool)
    setWorkshopLoading(true)
    setWorkshopError(null)
    
    // Clear previous results
    setHookResults([])
    setVariationResults([])
    setThreadResults([])
    setTightenResult(null)

    try {
      if (tool === 'hooks') {
        const result = await geminiJSON<{ hooks: { technique: string; text: string }[] }>(
          HOOK_GENERATOR_PROMPT(activeDraft.content, profile)
        )
        setHookResults(result.hooks)
      } else if (tool === 'variations') {
        const result = await geminiJSON<{ variations: { angle: string; text: string }[] }>(
          VARIATION_GENERATOR_PROMPT(activeDraft.content, profile)
        )
        setVariationResults(result.variations)
      } else if (tool === 'tighten') {
        const result = await geminiJSON<{ tightenedText: string }>(
          TIGHTENER_PROMPT(activeDraft.content, profile)
        )
        setTightenResult(result.tightenedText)
      } else if (tool === 'thread') {
        const result = await geminiJSON<{ thread: { number: number; content: string }[] }>(
          THREAD_BUILDER_PROMPT(activeDraft.content, profile)
        )
        setThreadResults(result.thread)
      }
    } catch (e) {
      setWorkshopError(e instanceof Error ? e.message : 'Workshop tool execution failed')
    } finally {
      setWorkshopLoading(false)
    }
  }

  // Apply Workshop Tool content
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
    setWorkshopTool(null)
    triggerToast('Applied workshop draft change!')
  }

  // Copy Option C payload (critique prompt or raw text)
  function handleClipboardAction(type: 'raw' | 'grok' | 'trending') {
    if (type === 'trending') {
      const packet = generateTrendingPacket(profile, {
        mode: 'trending',
        focusAreas: [],
        customRequest: ''
      })
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
        dumpMode,
        customRequest: 'Standard validation feedback'
      }
      textToCopy = generateDraftPacket(profile, [activeDraft], config)
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
      setActiveDraft(updatedDrafts[0])
    } else {
      setActiveDraft(null)
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
            className="glass-button px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs border-transparent"
          >
            <PlusIcon /> Write Draft
          </button>
        </div>

        {/* Dual Panels Workspace split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Sources & Tools (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Tabs selector */}
            <div className="flex bg-[#111111]/80 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setActiveTab('drafts')}
                className={`flex-1 text-xs py-2 rounded-md font-semibold transition-colors ${
                  activeTab === 'drafts' ? 'bg-white/[0.06] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                Drafts ({drafts.length})
              </button>
              <button 
                onClick={() => setActiveTab('dump')}
                className={`flex-1 text-xs py-2 rounded-md font-semibold transition-colors ${
                  activeTab === 'dump' ? 'bg-white/[0.06] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                Brain Dump
              </button>
              <button 
                onClick={() => setActiveTab('workshop')}
                className={`flex-1 text-xs py-2 rounded-md font-semibold transition-colors ${
                  activeTab === 'workshop' ? 'bg-white/[0.06] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                Workshop
              </button>
            </div>

            {/* Drafts Tab View */}
            {activeTab === 'drafts' && (
              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {drafts.map(d => {
                  const isActive = activeDraft?.id === d.id
                  const snippet = d.content.trim() ? d.content.slice(0, 80) + (d.content.length > 80 ? '...' : '') : 'Empty draft...'
                  return (
                    <div 
                      key={d.id}
                      onClick={() => setActiveDraft(d)}
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-white/[0.05] border-[var(--accent)] shadow-md' 
                          : 'bg-[#111111]/45 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] px-1.5 py-0.5 bg-white/[0.02] border border-white/5 rounded font-mono">
                          {d.pillarId}
                        </span>
                        {d.algorithmScore?.overall > 0 && (
                          <span className="text-[10px] text-zinc-400 font-mono">
                            Score: {d.algorithmScore.overall}/100
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-zinc-200 mt-2 line-clamp-2 leading-relaxed">
                        {snippet}
                      </p>
                    </div>
                  )
                })}
                {drafts.length === 0 && (
                  <div className="text-center py-10 text-xs text-[var(--text-muted)]">
                    No drafts. Click "+ Write Draft" above to begin.
                  </div>
                )}
              </div>
            )}

            {/* Brain Dump Tab View */}
            {activeTab === 'dump' && (
              <div className="glass-panel p-4 rounded-xl flex flex-col gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Raw Dump</h3>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                    Dump anything. AI adapts to the mode you pick.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 text-[10px]">
                  {(['dev', 'personal', 'shitpost'] as DumpMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setDumpMode(m)}
                      className={`flex-1 py-1.5 rounded-md font-bold uppercase tracking-wide transition-colors ${
                        dumpMode === m
                          ? 'bg-white/[0.08] text-white'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                    >
                      {m === 'dev' ? '⚡ Dev' : m === 'personal' ? '🙋 Personal' : '💀 Shit Post'}
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder={
                    dumpMode === 'dev'
                      ? 'e.g. spent 4hrs fighting TS types, Swiggy webhook kept throwing union error...'
                      : dumpMode === 'personal'
                      ? 'e.g. woke up late, skipped breakfast, still somehow managed to attend the 8am lecture...'
                      : 'e.g. bro placement season starts tmrw and I still cant reverse a linked list 💀'
                  }
                  value={dumpText}
                  onChange={(e) => setDumpText(e.target.value)}
                  className="glass-input w-full h-44 p-3 bg-transparent text-xs font-mono"
                />

                <button
                  onClick={handleExtractFromDump}
                  disabled={dumpLoading || dumpText.trim().length < 15}
                  className="glass-button w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold border-transparent"
                >
                  {dumpLoading ? 'Extracting Ideas...' : 'Extract Drafts 🔮'}
                </button>

                {dumpError && (
                  <p className="text-xs text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-2.5 rounded-lg">
                    {dumpError}
                  </p>
                )}
              </div>
            )}

            {/* Workshop Tab View */}
            {activeTab === 'workshop' && (
              <div className="glass-panel p-4 rounded-xl flex flex-col gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Refining Workshop</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Run specialized prompts on your active draft. Select a tool below:
                  </p>
                </div>

                {activeDraft?.content.trim() ? (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <button 
                        onClick={() => handleRunWorkshopTool('hooks')}
                        className={`glass-button py-2 ${workshopTool === 'hooks' ? 'bg-white/[0.08]' : ''}`}
                      >
                        Hook Variations
                      </button>
                      <button 
                        onClick={() => handleRunWorkshopTool('variations')}
                        className={`glass-button py-2 ${workshopTool === 'variations' ? 'bg-white/[0.08]' : ''}`}
                      >
                        Generate Angles
                      </button>
                      <button 
                        onClick={() => handleRunWorkshopTool('tighten')}
                        className={`glass-button py-2 ${workshopTool === 'tighten' ? 'bg-white/[0.08]' : ''}`}
                      >
                        Tighten Copy
                      </button>
                      <button 
                        onClick={() => handleRunWorkshopTool('thread')}
                        className={`glass-button py-2 ${workshopTool === 'thread' ? 'bg-white/[0.08]' : ''}`}
                      >
                        Build Thread
                      </button>
                    </div>

                    {/* Workshop Tool Outputs */}
                    {workshopLoading && (
                      <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full" />
                        Analyzing and writing options...
                      </div>
                    )}

                    {workshopError && (
                      <p className="text-xs text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-3 rounded">
                        {workshopError}
                      </p>
                    )}

                    {/* Hook Results rendering */}
                    {hookResults.length > 0 && (
                      <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">Select hook to apply:</span>
                        {hookResults.map((h, i) => (
                          <div 
                            key={i}
                            onClick={() => {
                              const lines = activeDraft.content.split('\n')
                              lines[0] = h.text
                              applyWorkshopContent(lines.join('\n'))
                            }}
                            className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs cursor-pointer font-mono text-zinc-300"
                          >
                            <p className="font-bold text-[10px] text-[var(--accent)] capitalize mb-0.5">{h.technique}</p>
                            <p>{h.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Variation Results rendering */}
                    {variationResults.length > 0 && (
                      <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">Select variation to apply:</span>
                        {variationResults.map((v, i) => (
                          <div 
                            key={i}
                            onClick={() => applyWorkshopContent(v.text)}
                            className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs cursor-pointer font-mono text-zinc-300"
                          >
                            <p className="font-bold text-[10px] text-[var(--accent)] capitalize mb-0.5">{v.angle} angle</p>
                            <p className="line-clamp-3">{v.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tighten Copy Result */}
                    {tightenResult && (
                      <div className="space-y-2 mt-2">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">Tightened Draft:</span>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs font-mono text-zinc-300">
                          <p>{tightenResult}</p>
                          <button 
                            onClick={() => applyWorkshopContent(tightenResult)}
                            className="glass-button w-full mt-3 py-1 text-[10px] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-transparent"
                          >
                            Apply Tightened Draft
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Thread Results rendering */}
                    {threadResults.length > 0 && (
                      <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">Thread Structure:</span>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col gap-2">
                          {threadResults.map((tweet) => (
                            <div key={tweet.number} className="text-xs font-mono text-zinc-300">
                              <span className="font-bold text-[var(--accent)]">{tweet.number}/</span> {tweet.content}
                            </div>
                          ))}
                          <button 
                            onClick={() => applyWorkshopContent(
                              threadResults.map(t => t.content).join('\n\n'), 
                              true, 
                              threadResults.map(t => t.content)
                            )}
                            className="glass-button w-full mt-2 py-1 text-[10px] bg-[var(--accent)] text-white border-transparent"
                          >
                            Apply Multi-Tweet Thread
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-[var(--text-muted)] italic">
                    Select a draft and write text to use the workshop tools.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Editor & Scorer (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {activeDraft ? (
              <div className="flex flex-col gap-4">
                
                {/* Editor Container */}
                <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                  
                  {/* Category Pillar & Thread mode */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Content Pillar:</span>
                      <select
                        value={activeDraft.pillarId}
                        onChange={(e) => {
                          setActiveDraft({ ...activeDraft, pillarId: e.target.value })
                          updateDraft(activeDraft.id, { pillarId: e.target.value })
                        }}
                        className="text-xs bg-black border border-white/5 rounded px-2 py-1 outline-none text-zinc-300 cursor-pointer"
                      >
                        {profile.contentPillars.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input 
                        type="checkbox"
                        checked={activeDraft.isThread}
                        onChange={(e) => handleThreadToggle(e.target.checked)}
                        className="accent-[var(--accent)]"
                      />
                      <span>Thread Mode</span>
                    </label>
                  </div>

                  {/* Text Editor area */}
                  {!activeDraft.isThread ? (
                    <div className="space-y-1">
                      <textarea
                        placeholder="What are we building today? Write draft..."
                        value={activeDraft.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="w-full min-h-[160px] bg-transparent text-sm font-mono p-1 resize-none outline-none border-transparent focus:outline-none whitespace-pre-wrap leading-relaxed text-zinc-100"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1">
                      {(activeDraft.threadTweets || []).map((tText, idx) => (
                        <div key={idx} className="flex gap-3 items-start border-l-2 border-white/5 pl-3 focus-within:border-[var(--accent)]">
                          <span className="font-mono text-xs font-semibold text-[var(--accent)] mt-2 shrink-0">{idx + 1}/</span>
                          <textarea
                            value={tText}
                            onChange={(e) => handleThreadTweetChange(idx, e.target.value)}
                            placeholder={idx === 0 ? "Thread hook tweet..." : "Next thread point..."}
                            rows={3}
                            className="w-full bg-transparent text-xs font-mono p-1 resize-none outline-none focus:outline-none whitespace-pre-wrap leading-relaxed text-zinc-200"
                          />
                          {idx > 1 && (
                            <button 
                              onClick={() => handleRemoveThreadTweet(idx)}
                              className="text-xs text-[var(--fail)] hover:text-red-400 p-1 shrink-0"
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
                  )}

                  {/* Scorer feedback details */}
                  <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                    <span className={`font-mono text-[10px] ${
                      activeDraft.content.length > 280 ? 'text-[var(--fail)] font-bold' : 'text-[var(--text-muted)]'
                    }`}>
                      {activeDraft.content.length} / 280
                    </span>
                    
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button 
                        onClick={() => handleClipboardAction('trending')}
                        className="glass-button px-3 py-1.5 text-[10px] bg-transparent text-[var(--text-muted)]"
                        title="Generate a Trending Radar packet to paste into Grok"
                      >
                        🌊 Trending
                      </button>
                      <button 
                        onClick={() => handleClipboardAction('grok')}
                        disabled={!activeDraft.content.trim()}
                        className="glass-button px-3 py-1.5 text-[10px] bg-transparent text-[var(--text-muted)]"
                      >
                        Grok Packet
                      </button>
                      <button 
                        onClick={() => handleClipboardAction('raw')}
                        disabled={!activeDraft.content.trim()}
                        className="glass-button px-3 py-1.5 text-[10px] bg-transparent"
                      >
                        Copy Raw
                      </button>
                      <button 
                        onClick={handleMarkAsPosted}
                        disabled={!activeDraft.content.trim() || activeDraft.content.length > 280}
                        className="glass-button px-3.5 py-1.5 text-[10px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-transparent"
                      >
                        Mark Posted
                      </button>
                    </div>
                  </div>

                </div>

                {/* ScoreCard Display Panel */}
                {score && (
                  <ScoreCard score={score} />
                )}

              </div>
            ) : (
              <div className="glass-panel p-10 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">📝</span>
                <h3 className="text-sm font-bold text-white">No active draft selected</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
                  Start writing a new draft by tapping "+ Write Draft" at the top right, or enter raw thoughts in the Brain Dump tab.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Global Toast Alert */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 glass-panel px-4 py-2.5 rounded-lg text-xs text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            ✓ {toast}
          </div>
        )}

      </div>
    </AppShell>
  )
}
