"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useProfileStore } from "@/store/use-profile-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  HelpCircle,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { geminiText } from "@/lib/gemini"
import { UNIFIED_ROUTER_PROMPT } from "@/lib/prompts"
import { generateDraftPacket } from "@/lib/grok-packager"
import { TweetDraft } from "@/types"

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

  if (!mounted) return null

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
          <p className="text-sm text-muted-foreground">Draft ideas, customize output tone, and sync real-time brain dumps.</p>
        </div>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Raw Tweet Editor */}
        <Card className="lg:col-span-7 flex flex-col border border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-bold tracking-tight">Tweet Editor & Tailoring</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Write raw thoughts, select tone, and generate tailored, high-performance tweets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            
            {/* Raw Input */}
            <div className="space-y-2 flex-1 flex flex-col min-h-[160px]">
              <div className="flex justify-between items-center">
                <Label htmlFor="raw-tweet" className="text-sm font-medium">Raw Tweet / Topic Idea</Label>
                <span className="text-xs text-muted-foreground">{rawTweet.length} chars</span>
              </div>
              <Textarea 
                id="raw-tweet"
                value={rawTweet}
                onChange={(e) => setRawTweet(e.target.value)}
                placeholder="Dump raw thoughts or copy a rough tweet draft here..."
                className="bg-background resize-none flex-1 min-h-[140px] text-base leading-relaxed"
              />
            </div>

            {/* Mode Select Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tone Mode</Label>
              <div className="flex gap-1.5 p-1 bg-slate-100/80 rounded-lg border border-slate-200">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
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

            {/* Action Trigger */}
            <div className="pt-2">
              <Button 
                onClick={handleTailor} 
                disabled={isTailoring}
                className="w-full h-11 cursor-pointer font-semibold"
              >
                {isTailoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Tailoring Draft with DNA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tailor Draft
                  </>
                )}
              </Button>
            </div>

            {/* Tailored Output Display */}
            {tailoredTweet && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-border/80 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Polished DNA Draft
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

          </CardContent>
        </Card>

        {/* Right Card: Second Brain Dump */}
        <Card className="lg:col-span-5 flex flex-col border border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-bold tracking-tight">Second Brain Box</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Dump current thoughts, focus items, or projects. This updates your permanent Creator DNA context instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center">
              <Label htmlFor="second-brain" className="text-sm font-medium">Daily Context & Brain Dump</Label>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/10 text-blue-700">DNA Linked</span>
            </div>
            <Textarea
              id="second-brain"
              value={secondBrainText}
              onChange={(e) => setSecondBrainText(e.target.value)}
              placeholder="Dump current focus, active projects, frustrations, or what you are studying today..."
              className="bg-background resize-none flex-1 min-h-[300px] text-sm leading-relaxed"
            />
          </CardContent>
          <CardFooter className="pt-2 pb-6 flex justify-end">
            <Button 
              size="lg" 
              onClick={handleUpdateBrain} 
              disabled={isUpdatingBrain}
              className="w-full h-11 cursor-pointer font-semibold"
            >
              {isUpdatingBrain ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating DNA...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Brain Context
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </motion.div>
  )
}
