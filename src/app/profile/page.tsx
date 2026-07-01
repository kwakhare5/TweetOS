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
import { UserCircle, Settings, Save, BrainCircuit, Network, Cpu, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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


export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [niche, setNiche] = useState("")
  const [avoidListString, setAvoidListString] = useState("")
  
  // Advanced DNA settings
  const [secondBrain, setSecondBrain] = useState("")
  const [inspirationsContext, setInspirationsContext] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(profile.name)
    setTwitterHandle(profile.twitterHandle)
    setGeminiApiKey(profile.geminiApiKey || "")
    setNiche(profile.niche || "")
    setAvoidListString((profile.voice?.avoidList || []).join(", "))
    setSecondBrain(profile.secondBrain || "")
    setInspirationsContext(profile.inspirationsContext || "")
    setMounted(true)
  }, [profile])

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
      className="flex flex-col gap-6 px-6 md:px-8 lg:px-12 py-6 w-full max-w-7xl mx-auto"
    >
      {/* Header section (matches Dashboard style) */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Creator DNA</h1>
          <p className="text-sm text-muted-foreground">Configure your local state, voice definitions, and context settings.</p>
        </div>
      </div>

      {/* Main Grid with top padding for skeuomorphic element clearance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-4">
        
        {/* Left Column: Core Identity & Subroutines */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Core Identity Card */}
          <Card className="relative flex flex-col border border-border bg-card text-card-foreground shadow-sm rotate-[-0.2deg]">
            {/* Translucent Washi Tape with diagonal stripes pattern */}
            <div 
              className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs rotate-[-2deg] opacity-75 z-10 select-none pointer-events-none"
              style={{
                backgroundColor: "rgba(254, 240, 138, 0.4)",
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
                backdropFilter: "blur(1.5px)"
              }}
            />
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  Core Identity
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  The foundational elements of your digital persona.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Satoshi Nakamoto"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle">X Handle</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                    <Input 
                      id="handle" 
                      value={twitterHandle} 
                      onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))} 
                      placeholder="satoshi"
                      className="pl-8 bg-background"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche">Content Niche & Focus Areas</Label>
                <Input 
                  id="niche" 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)} 
                  placeholder="e.g. AI, Startups, Design Engineering"
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Neural Context Card */}
          <Card className="relative flex flex-col border border-border bg-card text-card-foreground shadow-sm rotate-[0.3deg]">
            {/* Paperclip overlay */}
            <PaperclipIcon className="absolute top-[-16px] left-[10%] z-20 select-none pointer-events-none rotate-[-10deg]" />
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-muted-foreground" />
                  Neural Context
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Feed your local AI with live thoughts and inspirations.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="brain">Second Brain (Current State)</Label>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/10 text-blue-700">Active</span>
                </div>
                <Textarea 
                  id="brain"
                  value={secondBrain} 
                  onChange={(e) => setSecondBrain(e.target.value)} 
                  placeholder="What are you currently building, reading, or obsessing over? Dump unstructured thoughts here..."
                  className="bg-background min-h-[120px] resize-y"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inspiration">Inspiration Vectors</Label>
                <Textarea 
                  id="inspiration"
                  value={inspirationsContext} 
                  onChange={(e) => setInspirationsContext(e.target.value)} 
                  placeholder="Paste tweets, articles, or quotes from creators whose style you want to absorb..."
                  className="bg-background min-h-[120px] resize-y"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Neural Context & Engine Details */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* System Engine Card */}
          <Card className="relative flex flex-col border border-border bg-card text-card-foreground shadow-sm rotate-[0.4deg]">
            {/* Paperclip overlay */}
            <PaperclipIcon className="absolute top-[-16px] left-[10%] z-20 select-none pointer-events-none rotate-[-10deg]" />
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-muted-foreground" />
                  Engine Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apikey" className="flex items-center gap-2">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  API Authorization
                </Label>
                <Input 
                  id="apikey" 
                  type="password"
                  value={geminiApiKey} 
                  onChange={(e) => setGeminiApiKey(e.target.value)} 
                  placeholder="AIzaSy..."
                  className="bg-background font-mono text-sm"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Processed locally. Stored on your device.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="avoid">Lexicon Filters (Avoid Words)</Label>
                <Textarea 
                  id="avoid" 
                  value={avoidListString} 
                  onChange={(e) => setAvoidListString(e.target.value)} 
                  placeholder="delve, unlock, supercharge..."
                  className="bg-background min-h-[100px] resize-y"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
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
            </CardContent>
          </Card>

          {/* Subroutines Card */}
          <Card className="relative flex flex-col border border-border bg-card text-card-foreground shadow-sm rotate-[-0.3deg]">
            {/* Translucent Washi Tape with diagonal stripes pattern */}
            <div 
              className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs rotate-[2deg] opacity-75 z-10 select-none pointer-events-none"
              style={{
                backgroundColor: "rgba(254, 240, 138, 0.4)",
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
                backdropFilter: "blur(1.5px)"
              }}
            />
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <Network className="h-5 w-5 text-muted-foreground" />
                  Subroutines
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border bg-background">
                <div className="space-y-1">
                  <Label className="cursor-pointer text-sm font-medium">Auto-Score Drafts</Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">Evaluate generated drafts automatically against your DNA profile.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border bg-background">
                <div className="space-y-1">
                  <Label className="cursor-pointer text-sm font-medium">Strict Tone Guard</Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">Reject any AI generation that breaches your Lexicon Filters.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Action Bar (standard flat button) */}
          <div className="flex justify-end mt-2">
            <Button 
              size="lg" 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full h-11 cursor-pointer font-bold rounded-lg bg-slate-950 text-white hover:bg-slate-900 shadow-sm hover:translate-y-[-0.5px] active:scale-[0.98] transition-all flex items-center justify-center select-none"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.div>
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
