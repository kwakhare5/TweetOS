'use client'

import { useState, useEffect } from 'react'
import { scoreTweet } from '@/lib/scorer'
import { AlgorithmScore } from '@/types'

const MAX_CHARS = 280

interface ScoreInputProps {
  onScoreChange: (score: AlgorithmScore, text: string, isThread: boolean) => void
  initialText?: string
}

export default function ScoreInput({ onScoreChange, initialText = '' }: ScoreInputProps) {
  const [text, setText] = useState(initialText)
  const [isThread, setIsThread] = useState(false)

  const chars = text.length
  const over = chars > MAX_CHARS
  const remaining = MAX_CHARS - chars

  useEffect(() => {
    const score = scoreTweet(text, isThread)
    onScoreChange(score, text, isThread)
  }, [text, isThread, onScoreChange])

  function handleClear() {
    setText('')
  }

  // Pre-fill templates to make testing easy and wow the user
  const templates = [
    {
      name: 'Strong Single',
      text: 'I spent 3 years building a Next.js boilerplate that scaled to 45% conversion rates. \n\nNo hacks, just standard optimization of API layers and Postgres connection pools. \n\nWhat is one database optimization hack that saved your team hours of debugging?',
      isThread: false
    },
    {
      name: 'Weak / Fail',
      text: 'Hey guys so i wanted to post today that react and nextjs is cool thoughts? please rt and retweet this tool! check it out: http://google.com',
      isThread: false
    },
    {
      name: 'Too Long',
      text: 'Building TweetOS has been a massive learning experience. I have spent the last month working out how to parse, extract, and format draft items without introducing heavy dependencies or over-engineering. In the future, I plan to add full auth support, automatic database syncs, customizable prompts, and multiple models so Karan can generate hooks from his phone or tablet while on the go. This is going to be the ultimate growth client.',
      isThread: false
    }
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Input Box Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <label htmlFor="tweet-input" className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Write or paste your tweet
          </label>
          <div className="flex items-center gap-3">
            {/* Thread Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[var(--text-muted)] hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={isThread}
                onChange={(e) => setIsThread(e.target.checked)}
                className="rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--accent)] focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
              />
              <span>Thread Hook Mode</span>
            </label>

            {text && (
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-[var(--fail)] hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="tweet-input"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your tweet here. Watch the algorithm scorecard update instantly..."
            className="w-full bg-[var(--surface-2)] text-white text-[15px] leading-relaxed rounded-lg p-4 resize-none outline-none border border-[var(--border)] focus:border-[var(--accent)] transition-colors placeholder:text-zinc-600 shadow-inner"
          />
          {over && (
            <div className="absolute right-3 bottom-3 bg-[var(--fail)]/15 border border-[var(--fail)]/30 text-[var(--fail)] px-2 py-0.5 rounded text-[10px] font-bold font-mono">
              {chars - MAX_CHARS} Chars Over
            </div>
          )}
        </div>

        {/* Live Metrics footer */}
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span>
              Length: <strong className="text-white">{chars}</strong> / {MAX_CHARS}
            </span>
            <span>
              Words: <strong className="text-white">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong>
            </span>
          </div>

          <span
            className="font-bold"
            style={{ color: over ? 'var(--fail)' : remaining < 30 ? 'var(--warn)' : 'var(--text-muted)' }}
          >
            {remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over limit`}
          </span>
        </div>

        {/* Char count bar */}
        <div className="h-1 rounded-full bg-[var(--surface-2)] overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${Math.min((chars / MAX_CHARS) * 100, 100)}%`,
              background: over 
                ? 'var(--fail)' 
                : chars > 240 
                ? 'var(--warn)' 
                : 'linear-gradient(90deg, var(--accent) 0%, #60A5FA 100%)',
            }}
          />
        </div>
      </div>

      {/* Preset templates */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/30 p-4 flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Test with presets</span>
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => {
                setText(tpl.text)
                setIsThread(tpl.isThread)
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)] transition-all duration-200 cursor-pointer"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
