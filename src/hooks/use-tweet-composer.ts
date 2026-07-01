import { useState } from "react"
import { toast } from "sonner"
import { UserProfile, TweetDraft } from "@/types"
import { geminiText } from "@/lib/gemini"
import { UNIFIED_ROUTER_PROMPT, IDEA_GENERATOR_PROMPT } from "@/lib/prompts"
import { 
  generateDraftPacket, 
  generateTrendingPacket, 
  generateEngagementPacket 
} from "@/lib/grok-packager"

export function useTweetComposer(profile: UserProfile) {
  // Core state
  const [brainDump, setBrainDump] = useState("")
  const [activeStyle, setActiveStyle] = useState<"dev" | "personal" | "shitpost" | "auto">("auto")
  const [isPolishing, setIsPolishing] = useState(false)
  const [polishedDraft, setPolishedDraft] = useState("")
  const [hooks, setHooks] = useState<string[]>([])
  const [factCheck, setFactCheck] = useState("")
  
  // UI states
  const [copiedPolishedDraft, setCopiedPolishedDraft] = useState(false)
  const [copiedGrok, setCopiedGrok] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [activeBrainstormAction, setActiveBrainstormAction] = useState<"idea" | "trending" | "engagement">("idea")

  const handlePolish = async (overrideStyle?: "dev" | "personal" | "shitpost" | "auto") => {
    if (!brainDump.trim()) {
      toast.error("Please enter a raw tweet or idea first.")
      return
    }

    setIsPolishing(true)
    setPolishedDraft("")
    setHooks([])
    setFactCheck("")

    const targetStyle: "dev" | "personal" | "shitpost" | "auto" = overrideStyle || "auto"
    setActiveStyle(targetStyle)

    try {
      const prompt = UNIFIED_ROUTER_PROMPT(brainDump, profile, "", targetStyle)
      const res = await geminiText(prompt)
      
      try {
        const parsed = JSON.parse(res)
        if (parsed.intent === "draft" && parsed.moments?.[0]) {
          const mainMoment = parsed.moments[0]
          setPolishedDraft(mainMoment.tweet || "")
          setHooks(mainMoment.hookVariations || [])
          setFactCheck(mainMoment.factCheckNote || "")
        } else if (parsed.tightenedText) {
          setPolishedDraft(parsed.tightenedText)
        } else if (parsed.tweet) {
          setPolishedDraft(parsed.tweet)
        } else {
          setPolishedDraft(res) // fallback to raw
        }
      } catch {
        // Fallback for non-JSON or raw text return
        setPolishedDraft(res)
      }

      toast.success("Tweet polished successfully!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Polishing failed.")
    } finally {
      setIsPolishing(false)
    }
  }

  const handleGenerateIdea = async () => {
    setIsGeneratingIdea(true)
    try {
      const prompt = IDEA_GENERATOR_PROMPT(profile, "auto")
      const res = await geminiText(prompt)
      const idea = res.trim()
      
      if (brainDump.trim()) {
        setBrainDump(prev => `${prev}\n\n${idea}`)
      } else {
        setBrainDump(idea)
      }
      toast.success("Idea generated!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate idea.")
    } finally {
      setIsGeneratingIdea(false)
    }
  }

  const handleCopyPolishedDraft = async () => {
    if (!polishedDraft) return
    try {
      await navigator.clipboard.writeText(polishedDraft)
      setCopiedPolishedDraft(true)
      toast.success("Draft copied to clipboard!")
      setTimeout(() => setCopiedPolishedDraft(false), 2000)
    } catch {
      toast.error("Failed to copy.")
    }
  }

  const handleCopyGrok = async () => {
    if (!polishedDraft) return
    try {
      const mockDraft: TweetDraft = {
        id: "temp",
        content: polishedDraft,
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
        dumpMode: activeStyle,
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
    brainDump, setBrainDump,
    activeStyle, setActiveStyle,
    isPolishing,
    polishedDraft,
    hooks,
    factCheck,
    copiedPolishedDraft,
    copiedGrok,
    isGeneratingIdea,
    activeBrainstormAction, setActiveBrainstormAction,
    handlePolish,
    handleGenerateIdea,
    handleCopyPolishedDraft,
    handleCopyGrok,
    handleCopyTrending,
    handleCopyEngagement
  }
}
