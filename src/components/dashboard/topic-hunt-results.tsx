import { motion } from 'framer-motion'
import { TopicHuntAngle } from '@/types'
import { Button } from '@/components/ui/button'
import { X, Zap, Tag, Pencil } from 'lucide-react'

interface TopicHuntResultsProps {
  results: TopicHuntAngle[]
  keywords: string[]
  onDismiss: () => void
  onLoadIntoComposer: (angle: TopicHuntAngle) => void
}

export function TopicHuntResults({ results, keywords, onDismiss, onLoadIntoComposer }: TopicHuntResultsProps) {
  if (!results || results.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mt-6 bg-background border border-amber-900/10 rounded-xl overflow-hidden shadow-sm relative"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-200/40 opacity-70" />
      
      <div className="flex items-center justify-between p-4 border-b border-amber-900/10 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-md uppercase tracking-wider">
            <Zap size={12} className="text-amber-600" /> Apify Auto
          </div>
          <div className="text-sm text-amber-900/60 font-medium">
            Found {results.length} viral angles for: {keywords.join(', ')}
          </div>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Dismiss results"
          className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((angle) => (
          <div key={angle.id} className="bg-card border border-amber-900/10 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group">
            
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                <Tag size={10} /> {angle.pillarMatch}
              </span>
              <span className={`text-xs font-mono ${angle.charCount > 280 ? 'text-red-500' : 'text-amber-900/40'}`}>
                {angle.charCount}/280
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-sans text-amber-950 whitespace-pre-wrap">
                {angle.rewrittenAngle}
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-amber-900/5">
              <div className="text-xs text-amber-900/50">
                <span className="font-semibold text-amber-900/70">Source insight:</span> {angle.originalViral}
              </div>
              {angle.secondBrainAnchor !== 'none' && (
                <div className="text-xs text-amber-900/50">
                  <span className="font-semibold text-amber-900/70">Context:</span> Anchored to {angle.secondBrainAnchor}
                </div>
              )}
            </div>

            {/* Load Button (shows on hover) */}
            <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Button
                onClick={() => onLoadIntoComposer(angle)}
              >
                <Pencil size={16} /> Load to Composer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
