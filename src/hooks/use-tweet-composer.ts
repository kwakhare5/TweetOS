import { useState } from "react"
import { toast } from "sonner"
import { UserProfile } from "@/types"
import { geminiText } from "@/lib/gemini"
import { UNIFIED_ROUTER_PROMPT, DAILY_INSPIRATION_PROMPT } from "@/lib/prompts"
import {
  generateDraftPacket,
  generateTrendingPacket,
  generateEngagementPacket
} from "@/lib/grok-packager"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function useTweetComposer(profile: UserProfile) {
  // Core state
  const [brainDump, setBrainDump] = useState("")
  const [activeStyle, setActiveStyle] = useState<"dev" | "personal" | "shitpost" | "auto">("auto")
  const [isPolishing, setIsPolishing] = useState(false)
  const [polishedDraft, setPolishedDraft] = useState("")
  const [hooks, setHooks] = useState<string[]>([])
  const [factCheck, setFactCheck] = useState("")

  // UI state — brainstorm action selector
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [activeBrainstormAction, setActiveBrainstormAction] = useState<"idea" | "trending" | "engagement">("idea")

  // Copy states — consolidated via shared hook
  const [copiedPolishedDraft, copyPolishedDraft] = useCopyToClipboard()
  const [copiedGrok, copyGrok] = useCopyToClipboard()
  const [copiedTrending, copyTrending] = useCopyToClipboard()
  const [copiedEngagement, copyEngagement] = useCopyToClipboard()

  const handlePolish = async (overrideStyle?: "dev" | "personal" | "shitpost" | "auto") => {
    if (!brainDump.trim()) {
      toast.error("Please enter a raw tweet or idea first.")
      return
    }

    setIsPolishing(true)
    setPolishedDraft("")
    setHooks([])
    setFactCheck("")

    const targetStyle = overrideStyle ?? "auto"
    setActiveStyle(targetStyle)

    try {
      const prompt = UNIFIED_ROUTER_PROMPT(brainDump, profile, "", targetStyle)
      const res = await geminiText(prompt)

      try {
        const parsed = JSON.parse(res)
        if (parsed.intent === "draft" && parsed.moments?.[0]) {
          const main = parsed.moments[0]
          setPolishedDraft(main.tweet || "")
          setHooks(main.hookVariations || [])
          setFactCheck(main.factCheckNote || "")
        } else if (parsed.tightenedText) {
          setPolishedDraft(parsed.tightenedText)
        } else if (parsed.tweet) {
          setPolishedDraft(parsed.tweet)
        } else {
          setPolishedDraft(res) // fallback: raw text
        }
      } catch {
        setPolishedDraft(res) // fallback: non-JSON response
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
      const prompt = DAILY_INSPIRATION_PROMPT(profile, "")
      const res = await geminiText(prompt)
      
      try {
        const parsed = JSON.parse(res)
        if (parsed.inspirations && parsed.inspirations.length > 0) {
          const idea = parsed.inspirations[0].tweet
          setBrainDump(prev => prev.trim() ? `${prev}\\n\\n${idea}` : idea)
        } else {
          setBrainDump(prev => prev.trim() ? `${prev}\\n\\n${res}` : res)
        }
      } catch {
        setBrainDump(prev => prev.trim() ? `${prev}\\n\\n${res}` : res)
      }
      toast.success("Idea generated!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate idea.")
    } finally {
      setIsGeneratingIdea(false)
    }
  }

  const handleCopyPolishedDraft = () => {
    if (!polishedDraft) return
    copyPolishedDraft(polishedDraft, "Failed to copy draft.")
  }

  const handleCopyGrok = () => {
    if (!polishedDraft) return
    const packet = generateDraftPacket(
      profile,
      [{
        id: "temp",
        content: polishedDraft,
        isThread: false,
        threadTweets: [],
        pillarId: "",
        momentType: "draft",
        hookVariations: hooks,
        algorithmScore: { overall: 0, suggestions: [], calculatedAt: new Date().toISOString() },
        factCheckNote: factCheck,
        status: "polished",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }],
      { mode: "draft", selectedDraftIds: ["temp"], dumpMode: activeStyle, includeScores: false }
    )
    copyGrok(packet, "Failed to copy Grok Packet.")
  }

  const handleCopyTrending = () => {
    const packet = generateTrendingPacket(profile, { mode: "trending", focusAreas: [] })
    copyTrending(packet, "Failed to copy Topic Hunt Packet.")
  }

  const handleCopyEngagement = () => {
    const packet = generateEngagementPacket(profile, {
      mode: "engagement",
      targetAccounts: profile.admiredAccounts || [],
      topicKeywords: profile.contentPillars?.map(p => p.name) || [],
      opportunityTypes: []
    })
    copyEngagement(packet, "Failed to copy Engagement Hunt Packet.")
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
    copiedTrending,
    copiedEngagement,
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
