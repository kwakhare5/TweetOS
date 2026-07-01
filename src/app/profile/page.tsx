"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useProfileStore } from "@/store/use-profile-store"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Save, RefreshCw } from "lucide-react"

import { CoreIdentityCard } from "@/components/profile/core-identity-card"
import { SubroutinesCard } from "@/components/profile/subroutines-card"
import { ApiKeyConfig } from "@/components/profile/api-key-config"
import { NeuralContextCard } from "@/components/profile/neural-context-card"
import { LexiconFilters } from "@/components/profile/lexicon-filters"

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [niche, setNiche] = useState("")
  const [avoidListString, setAvoidListString] = useState("")
  const [secondBrain, setSecondBrain] = useState("")
  const [inspirationsContext, setInspirationsContext] = useState("")

  useEffect(() => {
    if (!profile) return

    const initialName = profile.name
    const initialHandle = profile.twitterHandle
    const initialApiKey = profile.geminiApiKey || ""
    const initialNiche = profile.niche || ""
    const initialAvoid = (profile.voice?.avoidList || []).join(", ")
    const initialBrain = profile.secondBrain?.startsWith("ACTIVE NOW (update daily):")
      ? ""
      : (profile.secondBrain || "")
    const initialInspirations = profile.inspirationsContext || ""

    if (profile.secondBrain?.startsWith("ACTIVE NOW (update daily):")) {
      updateProfile({ secondBrain: "" })
    }

    const t = setTimeout(() => {
      setName(initialName)
      setTwitterHandle(initialHandle)
      setGeminiApiKey(initialApiKey)
      setNiche(initialNiche)
      setAvoidListString(initialAvoid)
      setSecondBrain(initialBrain)
      setInspirationsContext(initialInspirations)
      setMounted(true)
    }, 0)

    return () => clearTimeout(t)
  }, [profile, updateProfile])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      const parsedAvoidList = avoidListString
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)

      updateProfile({
        name,
        twitterHandle,
        geminiApiKey,
        niche,
        secondBrain,
        inspirationsContext,
        voice: {
          ...profile.voice,
          avoidList: parsedAvoidList,
        },
      })
      
      toast.success("DNA successfully synchronized")
      setIsSaving(false)
    }, 400)
  }

  if (!mounted) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 px-4 py-4 sm:px-6 md:px-8 lg:px-12 md:py-6 w-full max-w-7xl mx-auto"
    >
      {/* Header section */}
      <div className="flex flex-row items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Creator DNA</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Configure your local state, voice definitions, and context settings.</p>
        </div>
        <Button 
          size="sm" 
          onClick={handleSave} 
          disabled={isSaving}
          className="lg:hidden h-9 px-4 cursor-pointer font-bold rounded-lg bg-slate-950 text-white hover:bg-slate-900 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center select-none text-xs"
        >
          {isSaving ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />
          ) : (
            <Save className="h-3.5 w-3.5 mr-1" />
          )}
          {isSaving ? "Syncing..." : "Save DNA"}
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        
        {/* Left Column: Core Identity, Subroutines, API Key */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <CoreIdentityCard 
            name={name} setName={setName}
            twitterHandle={twitterHandle} setTwitterHandle={setTwitterHandle}
            niche={niche} setNiche={setNiche}
          />
          <SubroutinesCard />
          <ApiKeyConfig geminiApiKey={geminiApiKey} setGeminiApiKey={setGeminiApiKey} />
        </div>

        {/* Right Column: Neural Context, Lexicon */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <NeuralContextCard 
            secondBrain={secondBrain} setSecondBrain={setSecondBrain}
            inspirationsContext={inspirationsContext} setInspirationsContext={setInspirationsContext}
          />
          <LexiconFilters 
            avoidListString={avoidListString} setAvoidListString={setAvoidListString}
          />

          {/* Main Action Bar */}
          <div className="flex justify-end mt-2">
            <Button 
              size="lg" 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full h-11 cursor-pointer font-bold rounded-lg bg-slate-950 text-white hover:bg-slate-900 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center select-none"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing DNA...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Synchronize DNA
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
