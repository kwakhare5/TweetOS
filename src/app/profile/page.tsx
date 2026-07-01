"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useProfileStore } from "@/store/use-profile-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { 
  UserCircle, 
  BrainCircuit, 
  Network, 
  Terminal, 
  Tag, 
  Save, 
  RefreshCw 
} from "lucide-react"



// Realistic 3D SVG Paperclip Icon
const PaperclipIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 40 40" 
    className={className} 
    width="40" 
    height="40"
    fill="none"
  >
    <path 
      d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5" 
      stroke="rgba(0,0,0,0.12)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="translate-x-[1px] translate-y-[2px]"
    />
    <path 
      d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5" 
      stroke="#94A3B8" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5" 
      stroke="#F1F5F9" 
      strokeWidth="0.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
)

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
      {/* Header section (matches Dashboard style) */}
      <div className="flex flex-row items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Creator DNA</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Configure your local state, voice definitions, and context settings.</p>
        </div>
        {/* Save button visible at the top on mobile */}
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
        
        {/* Left Column: Core Identity (Skeuomorphic index card) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Core Identity Card */}
          <div className="relative flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm sm:rotate-[-0.3deg] rotate-0 transition-transform hover:rotate-0">
            {/* Translucent Washi Tape with diagonal stripes pattern */}
            <div 
              className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs rotate-[-2deg] opacity-75 z-10 select-none pointer-events-none"
              style={{
                backgroundColor: "rgba(254, 240, 138, 0.4)",
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
                backdropFilter: "blur(1.5px)"
              }}
            />
            
            <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <UserCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-900 leading-tight">Core Identity</h3>
                <span className="text-xs text-slate-400">Foundational elements of your digital persona.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Karan"
                    className="bg-background/50 h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="handle" className="text-xs font-bold text-slate-500 uppercase tracking-wider">X Handle</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm select-none font-semibold">@</span>
                    <Input 
                      id="handle" 
                      value={twitterHandle} 
                      onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))} 
                      placeholder="kwakhare5"
                      className="pl-8 bg-background/50 h-9"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="niche" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Niche & Focus Areas</Label>
                <Input 
                  id="niche" 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)} 
                  placeholder="e.g. low-level systems, code aesthetics, sarcastic student takes"
                  className="bg-background/50 h-9"
                />
              </div>
            </div>
          </div>

          {/* Subroutines Card */}
          <div className="relative flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm sm:rotate-[0.2deg] rotate-0 transition-transform hover:rotate-0">
            {/* Paperclip overlay */}
            <PaperclipIcon className="absolute top-[-16px] left-[10%] z-20 select-none pointer-events-none rotate-[-5deg]" />

            <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Network className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-900 leading-tight">Subroutines</h3>
                <span className="text-xs text-slate-400">Automated guards running on local compiles.</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-slate-100 bg-[#FAF8F5]/30">
                <div className="space-y-0.5">
                  <Label className="cursor-pointer text-sm font-semibold text-slate-800">Auto-Score Drafts</Label>
                  <p className="text-xs text-slate-400 leading-normal">Evaluate generated drafts automatically against your DNA profile.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-slate-100 bg-[#FAF8F5]/30">
                <div className="space-y-0.5">
                  <Label className="cursor-pointer text-sm font-semibold text-slate-800">Strict Tone Guard</Label>
                  <p className="text-xs text-slate-400 leading-normal">Reject any AI generation that breaches your Lexicon Filters.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* System API Key (Developer Console style) */}
          <div className="relative flex flex-col bg-slate-950 border border-slate-900 text-slate-100 rounded-xl p-5 shadow-xl font-mono sm:rotate-[-0.2deg] rotate-0">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 select-none">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">gemini-api-console</span>
              <Terminal className="h-3.5 w-3.5 text-slate-600" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apikey" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <span className="text-emerald-500 font-bold">$</span> API Authorization
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-emerald-500/80 text-sm select-none font-bold">&gt;_</span>
                  <Input 
                    id="apikey" 
                    type="password"
                    value={geminiApiKey} 
                    onChange={(e) => setGeminiApiKey(e.target.value)} 
                    placeholder="AIzaSy..."
                    className="pl-9 bg-slate-900/60 border-slate-800 text-emerald-400 font-mono text-sm placeholder:text-slate-700 focus-visible:border-slate-700 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:ring-slate-800/50 hover:border-slate-800 h-9"
                  />
                </div>
                <div className="text-[10px] text-emerald-500/80 mt-1 select-none flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Processed locally. State stored strictly in device storage.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Yellow Notes for Brain & Inspiration, and Lexicon */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* macOS Yellow Sticky Note */}
          <div className="relative flex flex-col bg-[#FEF9C3] rounded-xl border border-yellow-200 shadow-[0_8px_30px_rgba(234,179,8,0.12)] sm:rotate-[0.3deg] rotate-0">
            {/* Paperclip overlay */}
            <PaperclipIcon className="absolute top-[-16px] left-[85%] z-20 select-none pointer-events-none rotate-[10deg]" />

            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FEF08A]/60 border-b border-yellow-200/60 select-none rounded-t-xl">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400 border border-red-500/20 shadow-xs" />
                <div className="h-3 w-3 rounded-full bg-yellow-400 border border-yellow-500/20 shadow-xs" />
                <div className="h-3 w-3 rounded-full bg-green-400 border border-green-500/20 shadow-xs" />
              </div>
              <span className="text-[11px] font-bold text-yellow-800/80 uppercase tracking-wider font-mono">
                Neural Context
              </span>
              <BrainCircuit className="h-3.5 w-3.5 text-yellow-700/60" />
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="brain" className="text-xs font-bold text-yellow-800/80 uppercase tracking-wider flex items-center justify-between select-none">
                  <span>Second Brain</span>
                  <span className="text-[9px] font-semibold bg-yellow-400/30 px-1.5 py-0.5 rounded border border-yellow-400/20 text-yellow-900">Live Context</span>
                </Label>
                <Textarea 
                  id="brain"
                  value={secondBrain} 
                  onChange={(e) => setSecondBrain(e.target.value)} 
                  placeholder="Daily context dump... e.g. shipping local compilers, Pune weather sucks, debugging zustand hydration issues"
                  className="bg-transparent border-0 outline-hidden focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none min-h-[110px] text-yellow-950/95 placeholder:text-yellow-600/50 leading-[28px] font-handwriting text-base"
                  style={{
                    backgroundImage: "linear-gradient(to bottom, transparent 27px, rgba(202,138,4,0.15) 27px)",
                    backgroundSize: "100% 28px"
                  }}
                />
              </div>

              <div className="space-y-1.5 border-t border-yellow-200/50 pt-4">
                <Label htmlFor="inspiration" className="text-xs font-bold text-yellow-800/80 uppercase tracking-wider flex items-center justify-between select-none">
                  <span>Inspiration DNA Vectors</span>
                  <span className="text-[9px] font-semibold bg-yellow-400/30 px-1.5 py-0.5 rounded border border-yellow-400/20 text-yellow-900">Reference Style</span>
                </Label>
                <Textarea 
                  id="inspiration"
                  value={inspirationsContext} 
                  onChange={(e) => setInspirationsContext(e.target.value)} 
                  placeholder="Paste tweet structures, copywriting hooks, formatting styles or blueprints from creators you admire..."
                  className="bg-transparent border-0 outline-hidden focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 resize-none min-h-[110px] text-yellow-950/95 placeholder:text-yellow-600/50 leading-[28px] font-handwriting text-base"
                  style={{
                    backgroundImage: "linear-gradient(to bottom, transparent 27px, rgba(202,138,4,0.15) 27px)",
                    backgroundSize: "100% 28px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Lexicon Filters Card */}
          <div className="relative flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm sm:rotate-[-0.3deg] rotate-0 transition-transform hover:rotate-0">
            {/* Translucent Washi Tape with diagonal stripes pattern */}
            <div 
              className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs rotate-[2deg] opacity-75 z-10 select-none pointer-events-none"
              style={{
                backgroundColor: "rgba(254, 240, 138, 0.4)",
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
                backdropFilter: "blur(1.5px)"
              }}
            />

            <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Tag className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-900 leading-tight">Lexicon Filters</h3>
                <span className="text-xs text-slate-400">Avoid lists to eliminate generic AI copywriting jargon.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="avoid" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avoid Words (comma-separated)</Label>
                <Textarea 
                  id="avoid" 
                  value={avoidListString} 
                  onChange={(e) => setAvoidListString(e.target.value)} 
                  placeholder="e.g. delve, supercharge, unlock, testament, paradigm shift, revolutionary"
                  className="bg-background/50 min-h-[70px] text-sm resize-none"
                />
              </div>

              {/* Tactile Avoid Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {avoidListString.split(",")
                  .map(word => word.trim())
                  .filter(word => word.length > 0)
                  .map((word, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 border border-slate-200 text-slate-700 select-none shadow-3xs hover:bg-slate-50 transition-colors">
                      <span>{word}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          const words = avoidListString.split(",").map(w => w.trim());
                          const filtered = words.filter((_, i) => i !== idx);
                          setAvoidListString(filtered.join(", "));
                        }}
                        className="hover:text-slate-900 text-slate-400 font-bold focus:outline-hidden cursor-pointer size-3.5 inline-flex items-center justify-center rounded-full hover:bg-slate-200/50"
                      >
                        ×
                      </button>
                    </span>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Main Action Bar (Standard primary charcoal button) */}
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
