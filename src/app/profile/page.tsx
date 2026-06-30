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
import { UserCircle, Settings, Save, Sparkles, BrainCircuit } from "lucide-react"

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)

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
  }

  if (!mounted) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col w-full min-h-screen bg-background"
    >
      {/* Edge-to-edge Hero Header */}
      <div className="w-full bg-slate-900 dark:bg-slate-950 text-slate-50 p-8 md:p-12 lg:p-16 border-b border-border/10">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <UserCircle className="w-8 h-8" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Creator DNA</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            Configure your local state, API keys, and context limits. This DNA injected into every generated draft.
          </p>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 lg:px-16 pb-32">
        <div className="flex flex-col gap-12">
          
          {/* Identity Section */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Identity Parameters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe"
                  className="bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handle">Twitter Handle</Label>
                <Input 
                  id="handle" 
                  value={twitterHandle} 
                  onChange={(e) => setTwitterHandle(e.target.value)} 
                  placeholder="@johndoe"
                  className="bg-card"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="niche">Content Niche</Label>
                <Input 
                  id="niche" 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)} 
                  placeholder="Tech, AI, Startups..."
                  className="bg-card"
                />
              </div>
            </div>
          </section>

          {/* AI Configuration */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Local Execution</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="apikey">Gemini API Key</Label>
                <Input 
                  id="apikey" 
                  type="password"
                  value={geminiApiKey} 
                  onChange={(e) => setGeminiApiKey(e.target.value)} 
                  placeholder="AIzaSy..."
                  className="bg-card font-mono"
                />
                <p className="text-xs text-muted-foreground">Stored securely in your local browser storage.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avoid">Avoid Words (Comma separated)</Label>
                <Input 
                  id="avoid" 
                  value={avoidListString} 
                  onChange={(e) => setAvoidListString(e.target.value)} 
                  placeholder="delve, unlock, supercharge..."
                  className="bg-card"
                />
              </div>
            </div>
          </section>

          {/* Context Injection */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <BrainCircuit className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Context Injection</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brain">Second Brain (Live Context)</Label>
                <Textarea 
                  id="brain"
                  value={secondBrain} 
                  onChange={(e) => setSecondBrain(e.target.value)} 
                  placeholder="What are you building, reading, or thinking about lately?"
                  className="bg-card min-h-[120px] resize-y"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inspiration">Inspiration Reference</Label>
                <Textarea 
                  id="inspiration"
                  value={inspirationsContext} 
                  onChange={(e) => setInspirationsContext(e.target.value)} 
                  placeholder="Paste tweets or styles from creators you want to mimic..."
                  className="bg-card min-h-[120px] resize-y"
                />
              </div>
            </div>
          </section>

          {/* Features Configuration */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Features Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Score Drafts</Label>
                  <p className="text-sm text-muted-foreground">Automatically evaluate new drafts against your DNA.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="space-y-0.5">
                  <Label className="text-base">Strict Tone Matching</Label>
                  <p className="text-sm text-muted-foreground">Reject AI suggestions that use your avoid words.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur-md z-50 flex justify-center md:justify-end md:px-12">
        <Button size="lg" onClick={handleSave} className="w-full md:w-auto shadow-lg hover:shadow-xl transition-all">
          <Save className="w-4 h-4 mr-2" />
          Synchronize DNA
        </Button>
      </div>

    </motion.div>
  )
}
