"use client"

import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "@/store/use-profile-store"
import { useTweetComposer } from "@/hooks/use-tweet-composer"
import { TweetComposer } from "@/components/dashboard/tweet-composer"
import { PolishedDraftPreview } from "@/components/dashboard/polished-draft-preview"
import { SecondBrainNote } from "@/components/dashboard/second-brain-note"
import { RecentTweets } from "@/components/dashboard/recent-tweets"
import { PageHeader } from "@/components/ui/page-header"
import { TopicHuntResults } from "@/components/dashboard/topic-hunt-results"
import { HuntModal } from "@/components/ui/hunt-modal"
import { TopicHuntAngle } from "@/types"
import { motion, useReducedMotion } from "motion/react"
import { containerVariants, itemVariants, reducedContainerVariants, reducedItemVariants } from "@/lib/motion-variants"

export default function Dashboard() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)
  const tweetGen = useTweetComposer(profile)
  const hasInit = useRef(false)
  const prefersReduced = useReducedMotion()

  // Hunt Modal State
  const [huntModalOpen, setHuntModalOpen] = useState(false)
  const [huntType, setHuntType] = useState<'topic' | 'engagement'>('topic')
  const [isHunting, setIsHunting] = useState(false)
  
  // Topic Hunt Results State
  const [topicResults, setTopicResults] = useState<TopicHuntAngle[]>([])
  const [lastTopicKeywords, setLastTopicKeywords] = useState<string[]>([])

  const openHuntModal = (type: 'topic' | 'engagement') => {
    setHuntType(type)
    setHuntModalOpen(true)
  }

  const handleRunApifyHunt = async (keywords: string[]) => {
    setIsHunting(true)
    
    if (huntType === 'topic') {
      try {
        const response = await fetch('/api/topic-hunt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_TWEETOS_API_KEY || ''
          },
          body: JSON.stringify({
            keywords,
            mode: 'apify',
            profile
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to run topic hunt')
        }

        setTopicResults(data.angles || [])
        setLastTopicKeywords(keywords)
      } catch (err: unknown) {
        console.error(err)
        alert('Hunt failed: ' + (err instanceof Error ? err.message : String(err)))
      }
    } else {
      // For engagement hunt from dashboard, we just alert or ideally we'd navigate to /engagement
      alert("Engagement results are best viewed on the dedicated Engagement page. Use the Engage tab.")
      // Alternative: window.location.href = '/engagement'
    }
    
    setIsHunting(false)
  }

  const handleLoadAngle = (angle: TopicHuntAngle) => {
    tweetGen.setBrainDump(angle.rewrittenAngle)
    setTopicResults([])
  }

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true

    // Clear legacy placeholder text shipped in an earlier seed
    if (profile?.secondBrain?.startsWith("ACTIVE NOW (update daily):")) {
      updateProfile({ secondBrain: "" })
    }
    setMounted(true)
  // Run once on mount — profile/updateProfile are stable Zustand refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Creator Workbench"
          subtitle="Draft ideas directly inside a live Tweet card simulator and edit sticky notes."
        />
      </motion.div>

      <motion.div
        variants={prefersReduced ? reducedContainerVariants : containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-4"
      >
        {/* Left: Tweet Editor & Output */}
        <motion.div variants={prefersReduced ? reducedItemVariants : itemVariants} className="lg:col-span-7 flex flex-col gap-6">
          <TweetComposer
            profile={profile}
            brainDump={tweetGen.brainDump}
            setBrainDump={tweetGen.setBrainDump}
            isPolishing={tweetGen.isPolishing}
            isGeneratingIdea={tweetGen.isGeneratingIdea}
            activeBrainstormAction={tweetGen.activeBrainstormAction}
            setActiveBrainstormAction={tweetGen.setActiveBrainstormAction}
            handleGenerateIdea={tweetGen.handleGenerateIdea}
            handleCopyTrending={() => openHuntModal('topic')}
            handleCopyEngagement={() => openHuntModal('engagement')}
            copiedTrending={tweetGen.copiedTrending}
            copiedEngagement={tweetGen.copiedEngagement}
            handlePolish={tweetGen.handlePolish}
          />

          {topicResults.length > 0 && (
            <TopicHuntResults
              results={topicResults}
              keywords={lastTopicKeywords}
              onDismiss={() => setTopicResults([])}
              onLoadIntoComposer={handleLoadAngle}
            />
          )}

          {tweetGen.polishedDraft ? (
            <PolishedDraftPreview
              polishedDraft={tweetGen.polishedDraft}
              hooks={tweetGen.hooks}
              factCheck={tweetGen.factCheck}
              activeStyle={tweetGen.activeStyle}
              isPolishing={tweetGen.isPolishing}
              copiedPolishedDraft={tweetGen.copiedPolishedDraft}
              copiedGrok={tweetGen.copiedGrok}
              handlePolish={tweetGen.handlePolish}
              handleCopyPolishedDraft={tweetGen.handleCopyPolishedDraft}
              handleCopyGrok={tweetGen.handleCopyGrok}
            />
          ) : (
            <div className="flex items-center justify-center min-h-32 rounded-xl border border-dashed border-border/50 bg-card/50">
              <p className="text-sm text-muted-foreground/50 select-none font-sans">
                Polished draft will appear here…
              </p>
            </div>
          )}
        </motion.div>

        {/* Right: Sticky Note */}
        <motion.div variants={prefersReduced ? reducedItemVariants : itemVariants} className="lg:col-span-5 flex flex-col">
          <SecondBrainNote
            initialText={profile.secondBrain || ""}
            onSave={(text) => updateProfile({ secondBrain: text })}
          />
        </motion.div>
      </motion.div>

      <RecentTweets profile={profile} />

      <HuntModal
        isOpen={huntModalOpen}
        onClose={() => setHuntModalOpen(false)}
        type={huntType}
        profile={profile}
        onRunApify={handleRunApifyHunt}
        isLoading={isHunting}
      />
    </div>
  )
}
