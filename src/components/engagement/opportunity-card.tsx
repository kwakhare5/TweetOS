import { useState } from 'react'
import { EngagementOpportunity } from '@/types'
import { Button } from '@/components/ui/button'
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
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm relative flex flex-col">
      {/* Top section: Original Tweet */}
      <div className="p-4 bg-background border-b border-border">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-foreground">
              @{opportunity.authorHandle}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              {opportunity.opportunityType === 'reply' ? (
                <><MessageCircle size={10} /> Reply</>
              ) : (
                <><Quote size={10} /> Quote Tweet</>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-muted-foreground/60 bg-card px-2 py-1 rounded-md border border-border">
              Score: {opportunity.opportunityScore}/10
            </div>
            {opportunity.tweetUrl && (
              <a 
                href={opportunity.tweetUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground/60 hover:text-primary transition-colors"
                title="View original on X"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
        
        <p className="text-sm font-sans text-foreground/80 whitespace-pre-wrap pl-3 border-l-2 border-border py-1">
          {opportunity.originalTweet}
        </p>

        <div className="mt-3 text-xs text-muted-foreground font-sans bg-card/50 p-2 rounded border border-amber-900/5">
          <span className="font-semibold text-foreground/80">Relevance:</span> {opportunity.relevance}
        </div>
      </div>

      {/* Bottom section: Reply Options */}
      <div className="p-4 bg-card flex flex-col gap-3">
        <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1">
          Draft Options
        </div>
        
        {opportunity.replies.map((reply, index) => (
          <div key={index} className="group relative bg-background border border-border rounded-lg p-3 hover:border-ring/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                Option {reply.option}: {reply.tone}
              </span>
              <span className={`text-xs font-mono ${reply.charCount > 280 ? 'text-red-500' : 'text-muted-foreground/60'}`}>
                {reply.charCount}/280
              </span>
            </div>
            
            <p className="text-sm font-sans text-foreground whitespace-pre-wrap pr-8">
              {reply.content}
            </p>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(reply.content, index)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground bg-card"
              title="Copy reply"
            >
              {copiedIndex === index ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
