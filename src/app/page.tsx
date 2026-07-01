"use client"

import { useState, useEffect } from "react"

import { useProfileStore } from "@/store/use-profile-store"
import { useTweetComposer } from "@/hooks/use-tweet-composer"
import { TweetComposer } from "@/components/dashboard/tweet-composer"
import { PolishedDraftPreview } from "@/components/dashboard/polished-draft-preview"
import { SecondBrainNote } from "@/components/dashboard/second-brain-note"
import { RecentTweets } from "@/components/dashboard/recent-tweets"

export default function Dashboard() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)
  
  const tweetGen = useTweetComposer(profile)

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
    <div 
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
          <TweetComposer 
            profile={profile}
            brainDump={tweetGen.brainDump}
            setBrainDump={tweetGen.setBrainDump}
            isPolishing={tweetGen.isPolishing}
            isGeneratingIdea={tweetGen.isGeneratingIdea}
            activeBrainstormAction={tweetGen.activeBrainstormAction}
            setActiveBrainstormAction={tweetGen.setActiveBrainstormAction}
            handleGenerateIdea={tweetGen.handleGenerateIdea}
            handleCopyTrending={tweetGen.handleCopyTrending}
            handleCopyEngagement={tweetGen.handleCopyEngagement}
            handlePolish={tweetGen.handlePolish}
          />
          
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
      <RecentTweets profile={profile} />
    </div>
  )
}
