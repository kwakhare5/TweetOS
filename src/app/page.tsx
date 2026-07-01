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
  Settings,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateDraftPacket } from "@/lib/grok-packager"
import { TweetDraft } from "@/types"
import { geminiText } from "@/lib/gemini"
import { UNIFIED_ROUTER_PROMPT } from "@/lib/prompts"

const MODES = ["auto", "dev", "personal", "shitpost"] as const
type ModeType = typeof MODES[number]

// Official X logo icon
const XLogoIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    width="1em" 
    height="1em" 
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

// Realistic 3D SVG Paperclip Icon
const PaperclipIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 40 40" 
    className={className} 
    width="40" 
    height="40"
    fill="none"
  >
    {/* Shadow path */}
    <path 
      d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5" 
      stroke="rgba(0,0,0,0.12)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="translate-x-[1px] translate-y-[2px]"
    />
    {/* Metal body */}
    <path 
      d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5" 
      stroke="#94A3B8" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Metal highlight */}
    <path 
      d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5" 
      stroke="#F1F5F9" 
      strokeWidth="0.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
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
      className="flex flex-col gap-6 px-6 md:px-8 lg:px-12 py-6 w-full max-w-7xl mx-auto"
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
          
          {/* Mock Tweet Card matching react-tweet/tweet-card.tsx exact UI structure */}
          <div className="relative flex h-fit w-full flex-col gap-4 rounded-xl border p-5 bg-card text-card-foreground shadow-sm rotate-[-0.3deg]">
            
            {/* Translucent Washi Tape with diagonal stripes pattern */}
            <div 
              className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs rotate-[-2deg] opacity-75 z-10 select-none pointer-events-none"
              style={{
                backgroundColor: "rgba(254, 240, 138, 0.4)",
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
                backdropFilter: "blur(1.5px)"
              }}
            />
            
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
              <XLogoIcon className="text-muted-foreground hover:text-foreground size-5 items-start transition-all ease-in-out hover:scale-105 cursor-pointer" />
            </div>

            {/* Tweet Body / Textarea */}
            <div className="pt-2 min-h-[240px] flex flex-col gap-3">
              <textarea 
                id="raw-tweet"
                value={rawTweet}
                onChange={(e) => setRawTweet(e.target.value)}
                placeholder="What's happening? Dump raw thoughts or rough drafts..."
                className="w-full bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none text-[15px] text-slate-900 placeholder:text-slate-400 leading-relaxed flex-1 font-normal"
              />
              
              {/* Tone Profile Selector & Tailor Action inside Card */}
              <div className="flex items-center justify-between border-t border-slate-100/80 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tone:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-3xs transition-all cursor-pointer outline-hidden select-none">
                      <span>{mode === "auto" ? "⚡ Auto" : mode.toUpperCase()}</span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-32 bg-white border border-slate-200 rounded-md shadow-sm">
                      {MODES.map((m) => (
                        <DropdownMenuItem 
                          key={m} 
                          onClick={() => setMode(m)}
                          className={`text-xs font-semibold px-2 py-1.5 cursor-pointer capitalize hover:bg-slate-50 transition-colors ${
                            mode === m ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600'
                          }`}
                        >
                          {m === "auto" ? "⚡ Auto" : m}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${rawTweet.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                    {rawTweet.length} / 280
                  </span>
                  <Button 
                    onClick={handleTailor} 
                    disabled={isTailoring}
                    size="sm"
                    className="h-8 px-4 cursor-pointer font-bold rounded-full bg-slate-950 text-white hover:bg-slate-900 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center select-none text-xs"
                  >
                    {isTailoring ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        Tailor
                      </>
                    )}
                  </Button>
                </div>
              </div>
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

          {/* Tailored Output Display (rendered when output exists) */}
          {tailoredTweet && (
            <div className="border border-border bg-card text-card-foreground shadow-sm rounded-xl p-5 space-y-4">
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

              {/* Copy Actions styled in a subtle premium theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Button 
                  variant="outline" 
                  onClick={handleCopyDraft}
                  className="h-10 cursor-pointer font-semibold rounded-lg border border-border bg-background text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center select-none"
                >
                  {copiedDraft ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Draft Only
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCopyGrok}
                  className="h-10 cursor-pointer font-semibold rounded-lg border border-border bg-background text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center select-none"
                >
                  {copiedGrok ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Send className="h-4 w-4 mr-2 text-blue-500" />}
                  Copy Grok Packet
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: macOS Yellow Sticky Note */}
        <div className="lg:col-span-5 flex flex-col rotate-[0.5deg]">
          <div className="relative flex-1 flex flex-col bg-[#FEF9C3] rounded-xl border border-yellow-200 shadow-[0_8px_30px_rgba(234,179,8,0.12)]">
            
            {/* Paperclip overlay */}
            <PaperclipIcon className="absolute top-[-16px] left-[10%] z-20 select-none pointer-events-none rotate-[-10deg]" />
            
            {/* macOS Sticky top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FEF08A]/60 border-b border-yellow-200/60 select-none rounded-t-xl">
              {/* macOS window dots */}
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400 border border-red-500/20 shadow-sm hover:bg-red-500 transition-colors" />
                <div className="h-3 w-3 rounded-full bg-yellow-400 border border-yellow-500/20 shadow-sm hover:bg-yellow-500 transition-colors" />
                <div className="h-3 w-3 rounded-full bg-green-400 border border-green-500/20 shadow-sm hover:bg-green-500 transition-colors" />
              </div>
              <span className="text-[11px] font-bold text-yellow-800/80 uppercase tracking-wider font-mono">
                Sticky Notes
              </span>
              
              {/* Top Bar Save Action Button */}
              <button 
                onClick={handleUpdateBrain} 
                disabled={isUpdatingBrain}
                className="p-1 hover:bg-yellow-200/50 rounded text-yellow-800/80 cursor-pointer transition-colors bg-transparent border-0 flex items-center justify-center"
                title="Save Brain Memory"
              >
                {isUpdatingBrain ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Note writing area with yellow rule lining texture */}
            <div className="p-5 flex-1 flex flex-col">
              <textarea
                id="second-brain"
                value={secondBrainText}
                onChange={(e) => setSecondBrainText(e.target.value)}
                placeholder="Studying code? Building a chrome extension? Write it down, Gemini uses this memory..."
                className="w-full bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none flex-1 min-h-[240px] text-[15px] font-medium text-yellow-950 placeholder:text-yellow-600/50 leading-[28px] font-sans pt-[4px]"
                style={{
                  backgroundImage: "linear-gradient(to bottom, transparent 27px, rgba(202,138,4,0.15) 27px)",
                  backgroundSize: "100% 28px"
                }}
              />
            </div>

          </div>
        </div>

      </div>

      {/* Recent Tweets Section with clear clearance spacing */}
      <div className="mt-16 space-y-6 max-w-7xl mx-auto w-full border-t border-slate-200/50 pt-10 select-none">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Recent X Posts</h2>
          <p className="text-sm text-slate-500">Your recent outputs published to the feed.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pb-8">
          {[
            {
              id: "1",
              content: "spent 4 hours debugging a typescript configuration only to realize i misspelled a package in tsconfig.json.\n\nreal software engineering is just suffering in typescript.",
              timestamp: "2 hours ago",
              likes: 42,
              retweets: 8,
              replies: 3,
              views: "1.2K"
            },
            {
              id: "2",
              content: "everyone's talking about multi-agent systems and custom cognitive architectures while i'm just trying to make my docker container build in under 10 minutes.\n\nkeep it simple.",
              timestamp: "8 hours ago",
              likes: 89,
              retweets: 14,
              replies: 5,
              views: "3.4K"
            },
            {
              id: "3",
              content: "vibe coding is fun until you have to push to production and you realize your local state isn't synced to anything.\n\nback to writing git commits manually.",
              timestamp: "1 day ago",
              likes: 124,
              retweets: 22,
              replies: 11,
              views: "5.1K"
            },
            {
              id: "4",
              content: "my second brain is just a folder of unorganized notes and half-baked hooks.\n\nif it works, it works.",
              timestamp: "3 days ago",
              likes: 56,
              retweets: 4,
              replies: 2,
              views: "980"
            }
          ].map((tweet, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={tweet.id} 
                className={`relative flex flex-col gap-4 rounded-xl border p-5 bg-card text-card-foreground shadow-xs transition-all hover:translate-y-[-1px] ${
                  isEven ? 'rotate-[-0.2deg]' : 'rotate-[0.3deg]'
                }`}
              >
                {/* Washi Tape overlay on every second card */}
                {isEven && (
                  <div 
                    className="absolute top-[-8px] left-[15%] w-20 h-4 border border-amber-200/20 shadow-xs rotate-[-3deg] opacity-75 z-10 select-none pointer-events-none"
                    style={{
                      backgroundColor: "rgba(254, 240, 138, 0.4)",
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
                      backdropFilter: "blur(1.5px)"
                    }}
                  />
                )}
                
                {/* Paperclip overlay on every other card */}
                {!isEven && (
                  <PaperclipIcon className="absolute top-[-14px] left-[12%] z-20 select-none pointer-events-none rotate-[-5deg]" />
                )}

                {/* Tweet Header */}
                <div className="flex flex-row items-start justify-between tracking-normal">
                  <div className="flex items-center space-x-3">
                    <div className="shrink-0 h-10 w-10 rounded-full border border-border/50 overflow-hidden flex items-center justify-center font-bold text-slate-700 bg-slate-100 text-sm select-none">
                      {profile.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground flex items-center font-semibold text-sm whitespace-nowrap transition-opacity hover:opacity-80 cursor-pointer">
                        {profile.name || "Karan"}
                        <VerifiedBadgeIcon className="ml-1 inline size-3.5 text-blue-500" />
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer">
                          @{profile.twitterHandle || "kwakhare5"}
                        </span>
                        <span className="text-muted-foreground text-xs select-none">·</span>
                        <span className="text-muted-foreground text-xs">{tweet.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <XLogoIcon className="text-muted-foreground size-4.5" />
                </div>

                {/* Tweet Content */}
                <div className="text-[14px] text-slate-900 leading-relaxed font-normal whitespace-pre-wrap">
                  {tweet.content}
                </div>

                {/* Tweet Stats */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-400 select-none">
                  <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{tweet.replies}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                    <Repeat2 className="h-3.5 w-3.5" />
                    <span>{tweet.retweets}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{tweet.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>{tweet.views}</span>
                  </div>
                  <div className="flex items-center hover:text-blue-500 transition-colors">
                    <Share className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  )
}
