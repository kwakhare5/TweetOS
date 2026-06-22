'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useProfileStore } from '@/store/useProfileStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { OpportunityType } from '@/types'
import { geminiJSON } from '@/lib/gemini'
import { REPLY_GENERATOR_PROMPT } from '@/lib/prompts'
import { generateEngagementPacket } from '@/lib/grok-packager'
import { Clipboard, Check, Sparkles } from 'lucide-react'

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
  const { profile } = useProfileStore()
  const { entries } = useLibraryStore()

  // Reply generator state
  const [tweetText, setTweetText] = useState('')
  const [oppType, setOppType] = useState<OpportunityType>('add_value')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyResult, setReplyResult] = useState<GeminiReplyResult | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Grok packet state
  const [topicKeywords, setTopicKeywords] = useState('nextjs, typescript, ai tools, vibe coding')
  const [copiedPacket, setCopiedPacket] = useState(false)

  // Notifications
  const [toast, setToast] = useState<string | null>(null)

  function triggerToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Generate replies using AI
  async function handleGenerateReplies() {
    if (!tweetText.trim()) return
    setLoading(true)
    setError(null)
    setReplyResult(null)
    try {
      // Pass 'unknown' as target handle since we removed target accounts list
      const data = await geminiJSON<GeminiReplyResult>(
        REPLY_GENERATOR_PROMPT(tweetText, 'unknown', oppType, profile)
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
      finalContent = `Please review and optimize this tweet reply in my Pune CS student voice:\n"${content}"`
    }
    navigator.clipboard.writeText(finalContent)
    setCopiedText(content)
    triggerToast(type === 'grok' ? 'Grok Critique Prompt copied!' : 'Tweet copied to clipboard!')
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Export grok engagement packet
  function handleCopyGrokEngagementPacket() {
    const config = {
      mode: 'engagement' as const,
      targetAccounts: [], // Removed complex target tracking
      topicKeywords: topicKeywords.split(',').map(k => k.trim()).filter(Boolean),
      opportunityTypes: OPPORTUNITY_OPTIONS.map(o => o.value),
      customRequest: ''
    }
    const packet = generateEngagementPacket(profile, config, entries)
    navigator.clipboard.writeText(packet)
    setCopiedPacket(true)
    triggerToast('Grok Engagement Packet copied!')
    setTimeout(() => setCopiedPacket(false), 2000)
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-white">Engage Hub</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Find tweets on X and generate smart, valuable replies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT PANEL: Tutorial */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">How to use this</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-sm flex items-center justify-center font-bold shrink-0">1</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">Set your topics</p>
                  <input
                    type="text"
                    value={topicKeywords}
                    onChange={(e) => setTopicKeywords(e.target.value)}
                    className="glass-input w-full px-3 py-2 text-sm bg-transparent mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-sm flex items-center justify-center font-bold shrink-0">2</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-2">Get tweets from Grok</p>
                  <button 
                    onClick={handleCopyGrokEngagementPacket}
                    className={`glass-button w-full py-2 text-sm font-semibold ${copiedPacket ? 'border-emerald-500/35 text-emerald-400' : ''}`}
                  >
                    {copiedPacket ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Packet Copied</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <Clipboard className="w-4 h-4 text-zinc-400" />
                        <span>Copy Grok Packet</span>
                      </span>
                    )}
                  </button>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    {"Paste this into X's Grok. It will find recent tweets about your topics that you can reply to."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-sm flex items-center justify-center font-bold shrink-0">3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Generate replies</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    Copy a tweet that Grok found, paste it into the generator on the right, and get 3 smart reply options written in your exact voice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Generator */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-muted)] font-semibold uppercase tracking-wider block">{"Target's Tweet"}</label>
              <textarea
                placeholder="Paste the tweet you want to reply to here..."
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                className="glass-input w-full h-28 bg-transparent text-base p-3 resize-none font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm text-[var(--text-muted)] font-semibold uppercase tracking-wider block">Reply Strategy</label>
              <div className="flex flex-wrap gap-2">
                {OPPORTUNITY_OPTIONS.map((opt) => (
                  <label 
                    key={opt.value} 
                    className={`flex items-center gap-2 p-2 rounded-lg border text-sm cursor-pointer transition-all duration-200 ${
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

            <button
              onClick={handleGenerateReplies}
              disabled={loading || !tweetText.trim()}
              className="glass-button w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] border-transparent text-white font-bold text-sm"
            >
              {loading ? (
                'Generating Options...'
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <span>Generate 3 Reply Options</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              )}
            </button>

            {error && (
              <p className="text-sm text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-3 rounded-lg">
                {error}
              </p>
            )}

            {replyResult && (
              <div className="space-y-4 mt-2">
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
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-[var(--accent)]">
                            OPTION {reply.option}
                          </span>
                          <span className={`text-xs font-semibold ${isOver ? 'text-[var(--fail)] font-bold' : 'text-[var(--text-muted)]'}`}>
                            {chars} / 280 chars
                          </span>
                        </div>

                        <p className="text-base leading-relaxed text-zinc-100 whitespace-pre-wrap select-all font-sans">
                          {reply.content}
                        </p>

                        <div className="flex justify-end gap-2 text-sm mt-1">
                          <button 
                            onClick={() => handleCopy(reply.content, 'grok')} 
                            className="glass-button px-3 py-1.5 text-xs bg-transparent text-[var(--text-muted)]"
                          >
                            Grok Prompt
                          </button>
                          <button 
                            onClick={() => handleCopy(reply.content, 'raw')} 
                            className="glass-button px-3 py-1.5 text-xs bg-transparent"
                          >
                            {isCopied ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clipboard className="w-3 h-3 text-zinc-400" />
                                <span>Copy Raw</span>
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast Alert */}
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
