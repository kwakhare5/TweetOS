'use client'

import { AlgorithmScore, SignalScore } from '@/types'

interface ScoreCardProps {
  score: AlgorithmScore
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const {
    overall,
    hookStrength,
    replyBait,
    specificity,
    emotionalTrigger,
    length,
    noLinksInBody,
    ctaQuality,
    threadPotential,
    suggestions
  } = score

  // Determine overall status and color
  let statusText = 'Draft Not Scored'
  let statusColor = 'text-[var(--text-muted)]'
  let overallGradient = 'from-zinc-500 to-zinc-700'

  if (overall > 0 || suggestions.length > 0 || length.score > 0) {
    if (overall >= 80) {
      statusText = 'Viral Potential 🔥'
      statusColor = 'text-[var(--pass)]'
      overallGradient = 'from-emerald-500 via-teal-500 to-cyan-500'
    } else if (overall >= 65) {
      statusText = 'Solid Draft 👍'
      statusColor = 'text-[var(--accent)]'
      overallGradient = 'from-blue-500 to-indigo-500'
    } else if (overall >= 40) {
      statusText = 'Needs Work ⚠️'
      statusColor = 'text-[var(--warn)]'
      overallGradient = 'from-amber-500 to-orange-500'
    } else {
      statusText = 'Fail / Truncated ❌'
      statusColor = 'text-[var(--fail)]'
      overallGradient = 'from-red-500 to-rose-600'
    }
  }

  const signals: { name: string; val: SignalScore }[] = [
    { name: 'Hook Strength', val: hookStrength },
    { name: 'Reply Bait', val: replyBait },
    { name: 'Specificity', val: specificity },
    { name: 'Emotional Trigger', val: emotionalTrigger },
    { name: 'Length Check', val: length },
    { name: 'No Links in Body', val: noLinksInBody },
    { name: 'CTA Quality', val: ctaQuality },
    { name: 'Thread Potential', val: threadPotential }
  ]

  function getBadgeStyles(label: 'Strong' | 'Weak' | 'Fail') {
    switch (label) {
      case 'Strong':
        return 'bg-emerald-500/10 text-[var(--pass)] border-emerald-500/20'
      case 'Weak':
        return 'bg-amber-500/10 text-[var(--warn)] border-amber-500/20'
      case 'Fail':
        return 'bg-red-500/10 text-[var(--fail)] border-red-500/20'
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl flex flex-col gap-6 backdrop-blur-md">
      {/* Overall Score Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[var(--border)]">
        {/* Score Ring */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-zinc-950/40 p-2 shadow-inner border border-white/5">
          <div className={`absolute inset-2 rounded-full bg-gradient-to-tr ${overallGradient} opacity-20 blur-md`} />
          <div className="flex flex-col items-center justify-center z-10">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white">{overall}</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">/ 100</span>
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <p className="text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-1">Algorithm Score</p>
          <h2 className={`text-2xl font-bold tracking-tight ${statusColor} transition-colors duration-300`}>
            {statusText}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed max-w-sm">
            {overall >= 80 
              ? 'Excellent formatting, high hook appeal, and solid structural bait. Organic reach multiplier active.' 
              : overall >= 65 
              ? 'Good base, but tiny tweaks to specificity or CTA can bump it into viral tiers.' 
              : overall >= 40 
              ? 'Requires layout adjustments. Check key weak areas below to avoid organic downranking.'
              : 'This tweet violates X policies, contains banned triggers, or is too long.'}
          </p>
        </div>
      </div>

      {/* 8 Signals Checklist */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Signal Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {signals.map((sig, idx) => (
            <div 
              key={idx} 
              className="group p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-white/95">{sig.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">{sig.val.score}/10</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeStyles(sig.val.label)}`}>
                    {sig.val.label}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed group-hover:text-zinc-300 transition-colors duration-200">
                {sig.val.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations & Fixes */}
      <div className="pt-4 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Improvement Roadmap</h3>
        {suggestions.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {suggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                <span className="text-[var(--warn)] mt-0.5 select-none font-bold">➔</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
            <span className="text-lg">🚀</span>
            <span className="text-xs font-semibold">Perfect score! No algorithmic warnings detected. Ready to post.</span>
          </div>
        )}
      </div>
    </div>
  )
}
