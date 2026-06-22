'use client'

import { useState } from 'react'
import { OpportunityType, EngagementLog } from '@/types'
import { geminiJSON } from '@/lib/gemini'
import { REPLY_GENERATOR_PROMPT } from '@/lib/prompts'
import { SEED_PROFILE } from '@/data/seedProfile'

const OPPORTUNITY_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: 'add_value', label: 'Add value or insight' },
  { value: 'share_experience', label: 'Share related experience' },
  { value: 'ask_question', label: 'Ask a genuine question' },
  { value: 'agree_expand', label: 'Agree and expand' },
  { value: 'respectful_push', label: 'Push back respectfully' },
]

interface GeminiReplyResult {
  context: string
  replies: { option: string; tone: string; content: string }[]
}

interface Props {
  initialHandle?: string
  onLog: (log: EngagementLog, tweetSnippet: string) => void
}

export default function ReplyGenerator({ initialHandle = '', onLog }: Props) {
  const [tweetText, setTweetText] = useState('')
  const [authorHandle, setAuthorHandle] = useState(initialHandle)
  const [oppType, setOppType] = useState<OpportunityType>('add_value')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeminiReplyResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [logged, setLogged] = useState<string | null>(null)

  async function handleGenerate() {
    if (!tweetText.trim() || !authorHandle.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await geminiJSON<GeminiReplyResult>(
        REPLY_GENERATOR_PROMPT(tweetText, authorHandle.replace('@', ''), oppType, SEED_PROFILE)
      )
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gemini call failed')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy(content: string, option: string) {
    navigator.clipboard.writeText(content)
    setCopied(option)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleLog(content: string, option: string) {
    const now = new Date().toISOString()
    onLog({
      id: `log_${Date.now()}`,
      targetHandle: authorHandle.replace('@', ''),
      tweetSnippet: tweetText.slice(0, 60),
      replyUsed: content,
      repliedAt: now,
    }, tweetText.slice(0, 60))
    setLogged(option)
    setTimeout(() => setLogged(null), 2000)
  }

  const charCount = (s: string) => s.length

  return (
    <div className="flex flex-col gap-4">
      {/* Input section */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex flex-col gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)] block mb-1">Tweet to reply to</label>
          <textarea
            className="w-full min-h-[100px] bg-[var(--bg)] border border-[var(--border)] rounded-md p-3 text-sm resize-none outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
            placeholder="Paste tweet text here..."
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-muted)] block mb-1">Author handle</label>
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
            placeholder="@handle"
            value={authorHandle}
            onChange={(e) => setAuthorHandle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-muted)] block mb-1">I want to</label>
          <div className="flex flex-col gap-1.5">
            {OPPORTUNITY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="oppType"
                  value={opt.value}
                  checked={oppType === opt.value}
                  onChange={() => setOppType(opt.value)}
                  className="accent-[var(--accent)]"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!tweetText.trim() || !authorHandle.trim() || loading}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating…
            </>
          ) : 'Generate replies →'}
        </button>

        {error && <p className="text-[var(--fail)] text-sm">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
            <p className="text-xs text-[var(--text-muted)] mb-1">Context</p>
            <p className="text-sm">{result.context}</p>
          </div>

          {result.replies.map((reply) => {
            const chars = charCount(reply.content)
            const over = chars > 280
            return (
              <div key={reply.option} className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)]">OPTION {reply.option}</span>
                    <span className="text-xs text-[var(--text-muted)]">[{reply.tone}]</span>
                  </div>
                  <span className={`text-xs font-mono ${over ? 'text-[var(--fail)]' : 'text-[var(--text-muted)]'}`}>
                    {chars}/280 {over && '⚠️ OVER LIMIT'}
                  </span>
                </div>
                <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(reply.content, reply.option)}
                    className="text-xs px-3 py-1.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                  >
                    {copied === reply.option ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleLog(reply.content, reply.option)}
                    className="text-xs px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--pass)] hover:text-[var(--pass)] transition-colors"
                  >
                    {logged === reply.option ? '✓ Logged' : 'Log Reply'}
                  </button>
                </div>
              </div>
            )
          })}

          <p className="text-xs text-[var(--text-muted)] text-center">
            → Copy → reply on X → tap Log Reply (5 sec)
          </p>
        </div>
      )}
    </div>
  )
}
