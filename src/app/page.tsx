"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useProfileStore } from "@/store/use-profile-store"
import { useTweetGenerator } from "@/hooks/use-tweet-generator"
import { RawTweetEditor } from "@/components/dashboard/raw-tweet-editor"
import { TailoredOutput } from "@/components/dashboard/tailored-output"
import { SecondBrainNote } from "@/components/dashboard/second-brain-note"
import { RecentPosts } from "@/components/dashboard/recent-posts"

export default function Dashboard() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)
  
  const tweetGen = useTweetGenerator(profile)

  useEffect(() => {
    if (profile) {
      if (profile.secondBrain?.startsWith("ACTIVE NOW (update daily):")) {
        updateProfile({ secondBrain: "" })
      }
      
      const t = setTimeout(() => {
        setMounted(true)
      }, 0)
      return () => clearTimeout(t)
    }
  }, [profile, updateProfile])

  if (!mounted) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 px-4 py-4 sm:px-6 md:px-8 lg:px-12 md:py-6 w-full max-w-7xl mx-auto"
    >
      {/* Workbench Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Creator Workbench</h1>
          <p className="text-sm text-muted-foreground">Draft ideas directly inside a live Tweet card simulator and edit sticky notes.</p>
        </div>
      </div>

      {/* Creator Workbench Grid Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-4">
        
        {/* Left Column: Tweet Editor & Output */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <RawTweetEditor 
            profile={profile}
            rawTweet={tweetGen.rawTweet}
            setRawTweet={tweetGen.setRawTweet}
            isTailoring={tweetGen.isTailoring}
            isGeneratingIdea={tweetGen.isGeneratingIdea}
            activeBrainstormAction={tweetGen.activeBrainstormAction}
            setActiveBrainstormAction={tweetGen.setActiveBrainstormAction}
            handleGenerateIdea={tweetGen.handleGenerateIdea}
            handleCopyTrending={tweetGen.handleCopyTrending}
            handleCopyEngagement={tweetGen.handleCopyEngagement}
            handleTailor={tweetGen.handleTailor}
          />
          
          <TailoredOutput 
            tailoredTweet={tweetGen.tailoredTweet}
            hooks={tweetGen.hooks}
            factCheck={tweetGen.factCheck}
            activeTone={tweetGen.activeTone}
            isTailoring={tweetGen.isTailoring}
            copiedDraft={tweetGen.copiedDraft}
            copiedGrok={tweetGen.copiedGrok}
            handleTailor={tweetGen.handleTailor}
            handleCopyDraft={tweetGen.handleCopyDraft}
            handleCopyGrok={tweetGen.handleCopyGrok}
          />
        </div>

        {/* Right Column: macOS Yellow Sticky Note */}
        <div className="lg:col-span-5 flex flex-col">
          <SecondBrainNote 
            initialText={profile.secondBrain || ""} 
            onSave={(text) => updateProfile({ secondBrain: text })} 
          />
        </div>
      </div>

      {/* Recent Tweets Section */}
      <RecentPosts profile={profile} />
    </motion.div>
  )
}
