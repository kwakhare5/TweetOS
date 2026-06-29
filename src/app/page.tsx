'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiText } from '@/lib/gemini'
import { generateDraftPacket, generateTrendingPacket, generateEngagementPacket } from '@/lib/grok-packager'
import { Sparkles, Clipboard, Check, Loader2, Search, MessageSquare } from 'lucide-react'
import { TweetDraft } from '@/types'

export default function WorkspacePage() {
  const { profile } = useProfileStore()

  const [dumpText, setDumpText] = useState('')
  const [draftOutput, setDraftOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [toast, setToast] = useState<string | null>(null)
  const [copiedGrok, setCopiedGrok] = useState(false)
  const [copiedHunt, setCopiedHunt] = useState(false)
  const [copiedEngage, setCopiedEngage] = useState(false)

  function triggerToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleTailor() {
    if (!dumpText.trim()) return
    setLoading(true)
    setError(null)
    setDraftOutput('')
    setCopiedGrok(false)

    try {
      const prompt = `You are a world-class ghostwriter for @${profile.twitterHandle}.
Take the user's raw brain dump below and turn it into a single, highly-polished tweet (strictly under 280 characters).

USER PROFILE & NICHE: ${profile.niche}
VOICE & TONE: ${profile.voice.tone}
AVOID THESE WORDS: ${profile.voice.avoidList.join(', ')}

SECOND BRAIN (Live context):
${profile.secondBrain || 'None'}

INSPIRATIONS CONTEXT (Creator DNA to clone):
${profile.inspirationsContext || 'None'}

RAW BRAIN DUMP:
"""
${dumpText}
"""

RULES:
1. Output ONLY the raw tailored tweet. No quotes, no markdown, no preamble, no hashtags unless strictly necessary.
2. Ensure it sounds exactly like their Inspirations Context merged with their own Voice Tone.
3. Must be under 280 characters.`

      const result = await geminiText(prompt)
      setDraftOutput(result.trim())
      triggerToast('Tailored draft ready!')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to tailor draft.')
    } finally {
      setLoading(false)
    }
  }

  function handleCopyToGrok() {
    if (!draftOutput) return
    
    // Create a temporary mock draft object to reuse the grok packager
    const tempDraft: TweetDraft = {
      id: 'temp_draft',
      content: draftOutput,
      isThread: false,
      pillarId: 'General',
      momentType: 'opinion',
      hookVariations: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      algorithmScore: {
        overall: 0,
        hookStrength: { score: 0, label: 'Weak', reason: '' },
        replyBait: { score: 0, label: 'Weak', reason: '' },
        specificity: { score: 0, label: 'Weak', reason: '' },
        emotionalTrigger: { score: 0, label: 'Weak', reason: '' },
        length: { score: 0, label: 'Weak', reason: '' },
        noLinksInBody: { score: 0, label: 'Weak', reason: '' },
        ctaQuality: { score: 0, label: 'Weak', reason: '' },
        threadPotential: { score: 0, label: 'Weak', reason: '' },
        suggestions: [],
        calculatedAt: new Date().toISOString()
      }
    }

    const config = {
      mode: 'draft' as const,
      selectedDraftIds: [tempDraft.id],
      includeScores: false,
      customRequest: 'Review this draft against my Creator DNA Blueprint and give me 1 final polish suggestion.'
    }

    // Generate the packet
    const packet = generateDraftPacket(profile, [tempDraft], config)
    navigator.clipboard.writeText(packet)
    
    setCopiedGrok(true)
    triggerToast('Copied Draft Review Packet to clipboard!')
    setTimeout(() => setCopiedGrok(false), 2000)
  }

  function handleTopicHunt() {
    const config = {
      mode: 'trending' as const,
      focusAreas: [], // Uses defaults in packager
      customRequest: 'Find 3 trending topics and craft tweet ideas using my Inspiration DNA.'
    }
    
    const packet = generateTrendingPacket(profile, config)
    navigator.clipboard.writeText(packet)
    
    setCopiedHunt(true)
    triggerToast('Copied Topic Hunt Packet to clipboard!')
    setTimeout(() => setCopiedHunt(false), 2000)
  }

  function handleEngagementHunt() {
    const config = {
      mode: 'engagement' as const,
      targetAccounts: [], 
      topicKeywords: [], // Relies on Identity Block defaults
      opportunityTypes: ['add_value' as const, 'share_experience' as const, 'ask_question' as const],
      customRequest: 'Find 10 high-value reply opportunities and 3 quote tweets for me right now.'
    }
    
    const packet = generateEngagementPacket(profile, config)
    navigator.clipboard.writeText(packet)
    
    setCopiedEngage(true)
    triggerToast('Copied Engagement Hunt Packet to clipboard!')
    setTimeout(() => setCopiedEngage(false), 2000)
  }

  return (
    <AppShell>
      <div className="min-h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Command Center</h1>
            <p className="text-[var(--text-muted)] text-sm">Dump thoughts → Tailor → Grok</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/5 shadow-2xl bg-[#0a0a0a]/80 backdrop-blur-xl">
            <textarea
              placeholder="Dump raw thoughts, code snippets, rants, or ideas here..."
              value={dumpText}
              onChange={(e) => setDumpText(e.target.value)}
              className="w-full h-40 bg-transparent text-sm font-sans leading-relaxed text-zinc-200 placeholder-zinc-600 resize-none outline-none focus:outline-none"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleTailor}
                disabled={loading || !dumpText.trim()}
                className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--accent)]/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Tailoring...' : 'Tailor Draft'}
              </button>
              
              <button
                onClick={handleTopicHunt}
                className={"w-full py-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 " + (copiedHunt ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10')}
              >
                {copiedHunt ? <Check className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                {copiedHunt ? 'Packet Copied!' : 'Topic Hunt Packet'}
              </button>

              <button
                onClick={handleEngagementHunt}
                className={"w-full py-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 " + (copiedEngage ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10')}
              >
                {copiedEngage ? <Check className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                {copiedEngage ? 'Packet Copied!' : 'Engage Packet'}
              </button>
            </div>
            
            {error && (
              <p className="text-xs text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-3 rounded-lg text-center">
                {error}
              </p>
            )}
          </div>

          {draftOutput && (
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-[var(--accent)]/30 shadow-2xl bg-white/[0.02] animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Tailored Draft</span>
                <span className={"text-xs font-bold " + (draftOutput.length > 280 ? 'text-[var(--fail)]' : 'text-zinc-400')}>
                  {draftOutput.length} / 280
                </span>
              </div>
              
              <textarea
                value={draftOutput}
                onChange={(e) => setDraftOutput(e.target.value)}
                className="w-full bg-transparent text-sm font-sans leading-relaxed text-white resize-none outline-none focus:outline-none min-h-[80px]"
              />

              <button
                onClick={handleCopyToGrok}
                className={"w-full py-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 " + (copiedGrok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10')}
              >
                {copiedGrok ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                {copiedGrok ? 'Packet Copied!' : 'Copy to Grok'}
              </button>
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
