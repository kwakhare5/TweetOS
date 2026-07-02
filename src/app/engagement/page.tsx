'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { useProfileStore } from '@/store/use-profile-store'
import { EngagementOpportunity } from '@/types'
import { HuntModal } from '@/components/ui/hunt-modal'
import { OpportunityCard } from '@/components/engagement/opportunity-card'

export default function EngagementPage() {
  const profile = useProfileStore((state) => state.profile)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHunting, setIsHunting] = useState(false)
  const [opportunities, setOpportunities] = useState<EngagementOpportunity[]>([])
  const [strategyNote, setStrategyNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasRun, setHasRun] = useState(false)

  const handleRunApify = async (keywords: string[], targetAccounts: string[] = []) => {
    setIsHunting(true)
    setError(null)
    setHasRun(true)

    try {
      const response = await fetch('/api/engagement-hunt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_TWEETOS_API_KEY || ''
        },
        body: JSON.stringify({
          keywords,
          targetAccounts,
          mode: 'apify',
          profile
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run engagement hunt')
      }

      setOpportunities(data.opportunities || [])
      setStrategyNote(data.strategyNote || null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setOpportunities([])
    } finally {
      setIsHunting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-sans text-amber-950">Engagement Hunt</h1>
          <p className="text-sm text-amber-900/60 font-sans mt-1">
            Find high-value reply and quote-tweet opportunities to grow your network.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isHunting}
          className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors active:scale-[0.98] disabled:opacity-50"
        >
          <Search size={16} /> New Hunt
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-6">
        <AnimatePresence mode="wait">
          {!hasRun && !isHunting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-amber-900/10 rounded-xl bg-white/50"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-medium text-amber-950 font-sans">Ready to hunt?</h3>
              <p className="text-sm text-amber-900/60 max-w-sm text-center mt-2 font-sans">
                Click &quot;New Hunt&quot; to scan your target accounts and keywords for engagement opportunities.
              </p>
            </motion.div>
          )}

          {isHunting && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 space-y-4"
            >
              <Loader2 size={32} className="text-amber-600 animate-spin" />
              <div className="text-center">
                <p className="font-medium text-amber-950 font-sans">Scraping the timeline...</p>
                <p className="text-sm text-amber-900/60 font-sans mt-1">Analyzing tweets and drafting reply options</p>
              </div>
            </motion.div>
          )}

          {error && !isHunting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-sans"
            >
              {error}
            </motion.div>
          )}

          {!isHunting && hasRun && opportunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {strategyNote && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Strategy Note</h4>
                  <p className="text-sm text-amber-900 font-sans">{strategyNote}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </motion.div>
          )}

          {!isHunting && hasRun && opportunities.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center bg-white border border-amber-900/10 rounded-xl"
            >
              <p className="text-amber-950 font-medium">No strong opportunities found.</p>
              <p className="text-sm text-amber-900/60 mt-1">Try expanding your target accounts or keywords.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HuntModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="engagement"
        profile={profile}
        onRunApify={handleRunApify}
        isLoading={isHunting}
      />
    </div>
  )
}
