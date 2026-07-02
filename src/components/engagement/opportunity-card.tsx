import { useState } from 'react'
import { EngagementOpportunity } from '@/types'
import { MessageCircle, Quote, Copy, Check, ExternalLink } from 'lucide-react'

interface OpportunityCardProps {
  opportunity: EngagementOpportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="bg-white border border-amber-900/10 rounded-xl overflow-hidden shadow-sm relative flex flex-col">
      {/* Top section: Original Tweet */}
      <div className="p-4 bg-[#FAF8F5] border-b border-amber-900/10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-amber-950">
              @{opportunity.authorHandle}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              {opportunity.opportunityType === 'reply' ? (
                <><MessageCircle size={10} /> Reply</>
              ) : (
                <><Quote size={10} /> Quote Tweet</>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-amber-900/40 bg-white px-2 py-1 rounded-md border border-amber-900/10">
              Score: {opportunity.opportunityScore}/10
            </div>
            {opportunity.tweetUrl && (
              <a 
                href={opportunity.tweetUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-amber-900/40 hover:text-amber-600 transition-colors"
                title="View original on X"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
        
        <p className="text-sm font-sans text-amber-900/80 whitespace-pre-wrap pl-3 border-l-2 border-amber-900/20 py-1">
          {opportunity.originalTweet}
        </p>

        <div className="mt-3 text-xs text-amber-900/60 font-sans bg-white/50 p-2 rounded border border-amber-900/5">
          <span className="font-semibold text-amber-900/80">Relevance:</span> {opportunity.relevance}
        </div>
      </div>

      {/* Bottom section: Reply Options */}
      <div className="p-4 bg-white flex flex-col gap-3">
        <div className="text-xs font-semibold text-amber-900/40 uppercase tracking-wider mb-1">
          Draft Options
        </div>
        
        {opportunity.replies.map((reply, index) => (
          <div key={index} className="group relative bg-[#FAF8F5] border border-amber-900/10 rounded-lg p-3 hover:border-amber-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                Option {reply.option}: {reply.tone}
              </span>
              <span className={`text-[10px] font-mono ${reply.charCount > 280 ? 'text-red-500' : 'text-amber-900/40'}`}>
                {reply.charCount}/280
              </span>
            </div>
            
            <p className="text-sm font-sans text-amber-950 whitespace-pre-wrap pr-8">
              {reply.content}
            </p>

            <button
              onClick={() => handleCopy(reply.content, index)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white border border-amber-900/10 text-amber-900/40 opacity-0 group-hover:opacity-100 hover:text-amber-950 hover:border-amber-900/30 transition-all shadow-sm active:scale-95"
              title="Copy reply"
            >
              {copiedIndex === index ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
