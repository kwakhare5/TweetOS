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

const MODES = ["auto", "dev", "personal", "shitpost"] as const
type ModeType = typeof MODES[number]

// Classic Twitter bird icon matching react-tweet/tweet-card.tsx
const TwitterBirdIcon = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
)

// Verified badge icon matching react-tweet/tweet-card.tsx
const VerifiedBadgeIcon = ({ className }: { className?: string }) => (
  <svg
    aria-label="Verified Account"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
)

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
          
          {/* Mock Tweet Card matching react-tweet/tweet-card.tsx exact UI structure */}
          <div className="relative flex h-fit w-full flex-col gap-4 overflow-hidden rounded-xl border p-5 bg-card text-card-foreground shadow-sm">
            
            {/* TweetHeader structure */}
            <div className="flex flex-row items-start justify-between tracking-normal">
              <div className="flex items-center space-x-3">
                <div className="shrink-0 h-[48px] w-[48px] rounded-full border border-border/50 overflow-hidden flex items-center justify-center font-bold text-slate-700 bg-slate-100 text-base select-none">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    avatarLetter
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground flex items-center font-medium whitespace-nowrap transition-opacity hover:opacity-80 cursor-pointer">
                    {profile.name || "Karan"}
                    <VerifiedBadgeIcon className="ml-1 inline size-4 text-blue-500" />
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer">
                      @{profile.twitterHandle || "kwakhare5"}
                    </span>
                  </div>
                </div>
              </div>
              <TwitterBirdIcon className="text-muted-foreground hover:text-foreground size-5 items-start transition-all ease-in-out hover:scale-105 cursor-pointer" />
            </div>

            {/* TweetBody / Textarea */}
            <div className="pt-2 min-h-[140px] flex flex-col">
              <textarea 
                id="raw-tweet"
                value={rawTweet}
                onChange={(e) => setRawTweet(e.target.value)}
                placeholder="What's happening? Dump raw thoughts or rough drafts..."
                className="w-full bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none text-[15px] text-slate-900 placeholder:text-slate-400 leading-relaxed flex-1 font-normal"
              />
            </div>

            {/* Interactive Stats Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-400 select-none">
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer bg-transparent border-0 p-0">
                <MessageCircle className="h-4 w-4" />
                <span>0</span>
              </button>
              <button 
                onClick={toggleRetweet}
                className={`flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-0 p-0 ${hasRetweeted ? "text-green-600 font-semibold" : "hover:text-green-600"}`}
              >
                <Repeat2 className="h-4 w-4" />
                <span>{retweets}</span>
              </button>
              <button 
                onClick={toggleLike}
                className={`flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-0 p-0 ${hasLiked ? "text-red-500 font-semibold" : "hover:text-red-500"}`}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer bg-transparent border-0 p-0">
                <BarChart3 className="h-4 w-4" />
                <span>1.4K</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer bg-transparent border-0 p-0">
                <Share className="h-4 w-4" />
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
