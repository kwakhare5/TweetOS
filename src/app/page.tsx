"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useProfileStore } from "@/store/use-profile-store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Sparkles, 
  BrainCircuit, 
  Copy, 
  Check, 
  Send, 
  Save, 
  RefreshCw,
  FileText,
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Share,
  Settings
} from "lucide-react"
import { generateDraftPacket } from "@/lib/grok-packager"
import { TweetDraft } from "@/types"
import { geminiText } from "@/lib/gemini"
import { UNIFIED_ROUTER_PROMPT } from "@/lib/prompts"

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)


const MODES = ["auto", "dev", "personal", "shitpost"] as const
type ModeType = typeof MODES[number]

export default function Dashboard() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)

  // Left card state (Raw editor)
  const [rawTweet, setRawTweet] = useState("")
  const [mode, setMode] = useState<ModeType>("auto")
  const [isTailoring, setIsTailoring] = useState(false)
  const [tailoredTweet, setTailoredTweet] = useState("")
  const [hooks, setHooks] = useState<string[]>([])
  const [factCheck, setFactCheck] = useState("")
  const [copiedDraft, setCopiedDraft] = useState(false)
  const [copiedGrok, setCopiedGrok] = useState(false)

  // Right card state (Second Brain)
  const [secondBrainText, setSecondBrainText] = useState("")
  const [isUpdatingBrain, setIsUpdatingBrain] = useState(false)

  // Engagement stats for raw card
  const [likes, setLikes] = useState(12)
  const [retweets, setRetweets] = useState(3)
  const [hasLiked, setHasLiked] = useState(false)
  const [hasRetweeted, setHasRetweeted] = useState(false)

  useEffect(() => {
    if (profile) {
      setSecondBrainText(profile.secondBrain || "")
      setMounted(true)
    }
  }, [profile])

  const handleTailor = async () => {
    if (!rawTweet.trim()) {
      toast.error("Please enter a raw tweet or idea first.")
      return
    }

    setIsTailoring(true)
    setTailoredTweet("")
    setHooks([])
    setFactCheck("")

    try {
      const prompt = UNIFIED_ROUTER_PROMPT(rawTweet, profile, "", mode)
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
    } catch (err: any) {
      toast.error(err.message || "Tailoring failed.")
    } finally {
      setIsTailoring(false)
    }
  }

  const handleUpdateBrain = () => {
    setIsUpdatingBrain(true)
    setTimeout(() => {
      updateProfile({ secondBrain: secondBrainText })
      toast.success("Second Brain updated successfully")
      setIsUpdatingBrain(false)
    }, 400)
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
        dumpMode: mode,
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

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
      setHasLiked(false)
    } else {
      setLikes(likes + 1)
      setHasLiked(true)
      toast.success("Tweet liked!")
    }
  }

  const toggleRetweet = () => {
    if (hasRetweeted) {
      setRetweets(retweets - 1)
      setHasRetweeted(false)
    } else {
      setRetweets(retweets + 1)
      setHasRetweeted(true)
      toast.success("Retweeted!")
    }
  }

  if (!mounted) return null

  // Fallback initial for avatar
  const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "K"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto"
    >
      {/* Workbench Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Creator Workbench</h1>
          <p className="text-sm text-muted-foreground">Draft ideas directly inside a live Tweet card simulator and edit sticky notes.</p>
        </div>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Tweet Editor in a Mock Tweet Card shape */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative border border-border bg-card text-card-foreground shadow-sm rounded-xl p-5 space-y-4">
            
            {/* Tweet Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-slate-200 border border-border flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden select-none">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    avatarLetter
                  )}
                </div>
                {/* Name / Handle */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900 text-sm hover:underline cursor-pointer leading-tight">
                      {profile.name || "Karan"}
                    </span>
                    {/* Blue Verified Badge */}
                    <div className="h-4.5 w-4.5 bg-blue-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold select-none" title="Verified Creator">
                      ✓
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground leading-none">
                    @{profile.twitterHandle || "kwakhare5"}
                  </span>
                </div>
              </div>
              <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />
            </div>

            {/* Tweet Body / Textarea */}
            <div className="pt-2 min-h-[140px] flex flex-col">
              <textarea 
                id="raw-tweet"
                value={rawTweet}
                onChange={(e) => setRawTweet(e.target.value)}
                placeholder="What's happening? Dump raw thoughts or rough drafts..."
                className="w-full bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none text-base text-slate-900 placeholder:text-slate-400 leading-relaxed flex-1"
              />
            </div>

            {/* Tweet Action Footer (Interactive stats) */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-400 select-none">
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer group bg-transparent border-0 p-0">
                <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>0</span>
              </button>
              <button 
                onClick={toggleRetweet}
                className={`flex items-center gap-2 transition-colors cursor-pointer group bg-transparent border-0 p-0 ${hasRetweeted ? "text-green-600 font-semibold" : "hover:text-green-600"}`}
              >
                <Repeat2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{retweets}</span>
              </button>
              <button 
                onClick={toggleLike}
                className={`flex items-center gap-2 transition-colors cursor-pointer group bg-transparent border-0 p-0 ${hasLiked ? "text-red-500 font-semibold" : "hover:text-red-500"}`}
              >
                <Heart className={`h-4 w-4 group-hover:scale-110 transition-transform ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer group bg-transparent border-0 p-0">
                <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>1.4K</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer group bg-transparent border-0 p-0">
                <Share className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>

          </div>

          {/* Workbench Controls (Under the main Tweet Card) */}
          <div className="border border-border bg-card text-card-foreground shadow-sm rounded-xl p-5 space-y-4">
            
            {/* Tone Selector & Chars */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tone Profile</Label>
                <div className="flex flex-wrap gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 min-w-[70px] py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        mode === m 
                          ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {m === "auto" ? "⚡ Auto" : m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right sm:self-end">
                <span className={`text-sm font-semibold ${rawTweet.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                  {rawTweet.length} / 280 chars
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <Button 
              onClick={handleTailor} 
              disabled={isTailoring}
              className="w-full h-11 cursor-pointer font-semibold"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Synchronizing with Creator DNA...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Tailor Draft
                </>
              )}
            </Button>

            {/* Tailored Output Display */}
            {tailoredTweet && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-border/80 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Polished Draft
                    </Label>
                    <span className={`text-xs font-semibold ${tailoredTweet.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                      {tailoredTweet.length} / 280 chars
                    </span>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-slate-50/50 text-slate-900 font-normal leading-relaxed whitespace-pre-wrap select-all">
                    {tailoredTweet}
                  </div>
                </div>

                {/* Fact-check Warning if present */}
                {factCheck && (
                  <div className="p-3 rounded-md border border-orange-200 bg-orange-50/40 text-orange-800 text-xs font-normal">
                    {factCheck}
                  </div>
                )}

                {/* Hook variations if present */}
                {hooks.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">Alternative Hooks:</Label>
                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                      {hooks.map((h, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="font-semibold text-slate-800">{String.fromCharCode(65 + idx)})</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Copy Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCopyDraft}
                    className="h-10 cursor-pointer text-slate-700 hover:text-slate-900"
                  >
                    {copiedDraft ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Draft Only
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyGrok}
                    className="h-10 cursor-pointer text-slate-700 hover:text-slate-900"
                  >
                    {copiedGrok ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Send className="h-4 w-4 mr-2 text-blue-500" />}
                    Copy Grok Packet
                  </Button>
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Right Card: macOS Yellow Sticky Note */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 flex flex-col bg-[#FEF9C3] rounded-xl border border-yellow-200 shadow-[0_8px_30px_rgba(234,179,8,0.12)] overflow-hidden">
            
            {/* macOS Sticky top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FEF08A]/60 border-b border-yellow-200/60 select-none">
              {/* macOS window dots */}
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400 border border-red-500/20 shadow-sm hover:bg-red-500 transition-colors" />
                <div className="h-3 w-3 rounded-full bg-yellow-400 border border-yellow-500/20 shadow-sm hover:bg-yellow-500 transition-colors" />
                <div className="h-3 w-3 rounded-full bg-green-400 border border-green-500/20 shadow-sm hover:bg-green-500 transition-colors" />
              </div>
              <span className="text-[11px] font-bold text-yellow-800/80 uppercase tracking-wider font-mono">
                Sticky Notes
              </span>
            </div>

            {/* Note writing area */}
            <div className="p-5 flex-1 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="second-brain" className="text-xs font-bold text-yellow-800">
                  SECOND BRAIN (DAILY CONTEXT)
                </Label>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-yellow-400 bg-yellow-100 text-yellow-800">
                  AUTO-SYNCED
                </span>
              </div>
              <textarea
                id="second-brain"
                value={secondBrainText}
                onChange={(e) => setSecondBrainText(e.target.value)}
                placeholder="Studying code? Building a chrome extension? Refused to go to college? Write it down, Gemini uses this memory."
                className="w-full bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none flex-1 min-h-[300px] text-sm text-yellow-950 placeholder:text-yellow-600/60 leading-relaxed font-sans"
              />
            </div>

            {/* Sticky Note footer button */}
            <div className="px-5 pb-5 pt-2 flex justify-end">
              <Button 
                onClick={handleUpdateBrain} 
                disabled={isUpdatingBrain}
                className="w-full h-10 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border border-yellow-500/30 hover:border-yellow-500/50 shadow-sm cursor-pointer font-bold transition-all text-xs"
              >
                {isUpdatingBrain ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin text-yellow-950" />
                    SYNCING MEMORY...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-2 text-yellow-950" />
                    SAVE TO BRAIN
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  )
}
