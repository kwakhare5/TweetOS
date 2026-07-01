import { useState } from "react"
import { toast } from "sonner"
import { Profile, TweetDraft } from "@/types"
import { geminiText } from "@/lib/gemini"
import { UNIFIED_ROUTER_PROMPT, IDEA_GENERATOR_PROMPT } from "@/lib/prompts"
import { 
  generateDraftPacket, 
  generateTrendingPacket, 
  generateEngagementPacket 
} from "@/lib/grok-packager"

export function useTweetGenerator(profile: Profile) {
  // Core state
  const [rawTweet, setRawTweet] = useState("")
  const [activeTone, setActiveTone] = useState<"dev" | "personal" | "shitpost" | "auto">("auto")
  const [isTailoring, setIsTailoring] = useState(false)
  const [tailoredTweet, setTailoredTweet] = useState("")
  const [hooks, setHooks] = useState<string[]>([])
  const [factCheck, setFactCheck] = useState("")
  
  // UI states
  const [copiedDraft, setCopiedDraft] = useState(false)
  const [copiedGrok, setCopiedGrok] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [activeBrainstormAction, setActiveBrainstormAction] = useState<"idea" | "trending" | "engagement">("idea")

  const handleTailor = async (overrideTone?: "dev" | "personal" | "shitpost" | "auto") => {
    if (!rawTweet.trim()) {
      toast.error("Please enter a raw tweet or idea first.")
      return
    }

    setIsTailoring(true)
    setTailoredTweet("")
    setHooks([])
    setFactCheck("")

    const targetTone: "dev" | "personal" | "shitpost" | "auto" = overrideTone || "auto"
    setActiveTone(targetTone)

    try {
      const prompt = UNIFIED_ROUTER_PROMPT(rawTweet, profile, "", targetTone)
      const res = await geminiText(prompt)
      
      try {
        const parsed = JSON.parse(res)
        if (parsed.intent === "draft" && parsed.moments?.[0]) {
          const mainMoment = parsed.moments[0]
          setTailoredTweet(mainMoment.tweet || "")
          setHooks(mainMoment.hookVariations || [])
          setFactCheck(mainMoment.factCheckNote || "")
        } else if (parsed.tightenedText) {
          setTailoredTweet(parsed.tightenedText)
        } else if (parsed.tweet) {
          setTailoredTweet(parsed.tweet)
        } else {
          setTailoredTweet(res) // fallback to raw
        }
      } catch {
        // Fallback for non-JSON or raw text return
        setTailoredTweet(res)
      }

      toast.success("Tweet tailored successfully!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Tailoring failed.")
    } finally {
      setIsTailoring(false)
    }
  }

  const handleGenerateIdea = async () => {
    setIsGeneratingIdea(true)
    try {
      const prompt = IDEA_GENERATOR_PROMPT(profile, "auto")
      const res = await geminiText(prompt)
      const idea = res.trim()
      
      if (rawTweet.trim()) {
        setRawTweet(prev => `${prev}\n\n${idea}`)
      } else {
        setRawTweet(idea)
      }
      toast.success("Idea generated!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate idea.")
    } finally {
      setIsGeneratingIdea(false)
    }
  }

  const handleCopyDraft = async () => {
    if (!tailoredTweet) return
    try {
      await navigator.clipboard.writeText(tailoredTweet)
      setCopiedDraft(true)
      toast.success("Draft copied to clipboard!")
      setTimeout(() => setCopiedDraft(false), 2000)
    } catch {
      toast.error("Failed to copy.")
    }
  }

  const handleCopyGrok = async () => {
    if (!tailoredTweet) return
    try {
      const mockDraft: TweetDraft = {
        id: "temp",
        content: tailoredTweet,
        isThread: false,
        threadTweets: [],
        pillarId: "",
        momentType: "draft",
        hookVariations: hooks,
        algorithmScore: {
          overall: 85,
          suggestions: [],
          calculatedAt: new Date().toISOString()
        },
        factCheckNote: factCheck,
        status: "polished",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const packet = generateDraftPacket(profile, [mockDraft], {
        mode: "draft",
        selectedDraftIds: ["temp"],
        dumpMode: activeTone,
        includeScores: false
      })

      await navigator.clipboard.writeText(packet)
      setCopiedGrok(true)
      toast.success("Grok Packet copied! Paste into Grok for scoring & real-time X verification.")
      setTimeout(() => setCopiedGrok(false), 2000)
    } catch {
      toast.error("Failed to copy Grok Packet.")
    }
  }

  const handleCopyTrending = async () => {
    try {
      const packet = generateTrendingPacket(profile, { mode: 'trending', focusAreas: [] })
      await navigator.clipboard.writeText(packet)
      toast.success("Topic Hunt Packet copied! Paste into Grok for real-time trend discovery.")
    } catch {
      toast.error("Failed to copy Topic Hunt Packet.")
    }
  }

  const handleCopyEngagement = async () => {
    try {
      const packet = generateEngagementPacket(profile, {
        mode: 'engagement',
        targetAccounts: profile.admiredAccounts || [],
        topicKeywords: profile.contentPillars?.map(p => p.name) || [],
        opportunityTypes: []
      })
      await navigator.clipboard.writeText(packet)
      toast.success("Engagement Hunt Packet copied! Paste into Grok for reply targeting.")
    } catch {
      toast.error("Failed to copy Engagement Hunt Packet.")
    }
  }

  return {
    rawTweet, setRawTweet,
    activeTone, setActiveTone,
    isTailoring,
    tailoredTweet,
    hooks,
    factCheck,
    copiedDraft,
    copiedGrok,
    isGeneratingIdea,
    activeBrainstormAction, setActiveBrainstormAction,
    handleTailor,
    handleGenerateIdea,
    handleCopyDraft,
    handleCopyGrok,
    handleCopyTrending,
    handleCopyEngagement
  }
}
