'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import AppShell from '@/components/layout/AppShell'
import SecondBrainPanel from '@/components/brain/SecondBrainPanel'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiText } from '@/lib/gemini'
import { generateDraftPacket, generateTrendingPacket, generateEngagementPacket } from '@/lib/grok-packager'
import { Clipboard, Check, Search, MessageSquare, Loader2, Zap } from 'lucide-react'
import { TweetDraft } from '@/types'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import CommandPalette from '@/components/CommandPalette'

export default function WorkspacePage() {
  const { profile } = useProfileStore()

  const [dumpText, setDumpText] = useState('')
  const [draftOutput, setDraftOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [copiedGrok, setCopiedGrok] = useState(false)
  const [copiedHunt, setCopiedHunt] = useState(false)
  const [copiedEngage, setCopiedEngage] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTailor = useCallback(async () => {
    if (!dumpText.trim()) return
    setLoading(true)
    setError(null)
    setDraftOutput('')
    setCopiedGrok(false)

    try {
      const prompt = `SYSTEM: You are an expert ghostwriter for @${profile.twitterHandle}.
Rewrite the user's raw draft below. Adopt the provided INSPIRATIONS CONTEXT (Creator DNA) but merge it with the user's specific VOICE & TONE and SECOND BRAIN facts.

# PROFILE
Niche: ${profile.niche}
Voice Tone: ${profile.voice.tone}
Avoid Words: ${profile.voice.avoidList.join(', ')}

# SECOND BRAIN (LIVE CONTEXT)
${profile.secondBrain || 'None'}

# INSPIRATIONS CONTEXT (CREATOR DNA)
${profile.inspirationsContext || 'None'}

# RAW DRAFT
"""
${dumpText}
"""

# RULES
1. Output ONLY the raw tailored tweet. No quotes, no markdown, no preamble.
2. Ensure exact stylistic match with Inspirations Context.
3. Max limit: 280 characters.`

      const result = await geminiText(prompt)
      setDraftOutput(result.trim())
      toast.success('Draft tailored successfully')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to tailor draft')
      toast.error('Failed to tailor draft')
    } finally {
      setLoading(false)
    }
  }, [dumpText, profile])

  // Handle Ctrl+Enter to tailor draft
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (dumpText.trim() && !loading) {
          handleTailor()
        }
      }
    }
    
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dumpText, loading, handleTailor])

  function handleCopyToGrok() {
    if (!draftOutput) return
    
    const tempDraft: TweetDraft = {
      id: 'temp_draft',
      content: draftOutput,
      isThread: false,
      pillarId: 'General',
      momentType: 'opinion',
      hookVariations: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      algorithmScore: {
        overall: 0,
        hookStrength: { score: 0, label: 'Weak', reason: '' },
        replyBait: { score: 0, label: 'Weak', reason: '' },
        specificity: { score: 0, label: 'Weak', reason: '' },
        emotionalTrigger: { score: 0, label: 'Weak', reason: '' },
        length: { score: 0, label: 'Weak', reason: '' },
        noLinksInBody: { score: 0, label: 'Weak', reason: '' },
        ctaQuality: { score: 0, label: 'Weak', reason: '' },
        threadPotential: { score: 0, label: 'Weak', reason: '' },
        suggestions: [],
        calculatedAt: new Date().toISOString()
      }
    }

    const config = {
      mode: 'draft' as const,
      selectedDraftIds: [tempDraft.id],
      includeScores: false,
      customRequest: 'Review this draft against my Creator DNA Blueprint and give me 1 final polish suggestion.'
    }

    const packet = generateDraftPacket(profile, [tempDraft], config)
    navigator.clipboard.writeText(packet)
    
    setCopiedGrok(true)
    toast.success('Review Packet Copied')
    setTimeout(() => setCopiedGrok(false), 2000)
  }

  function handleTopicHunt() {
    const config = {
      mode: 'trending' as const,
      focusAreas: [], 
      customRequest: 'Find 3 trending topics and craft tweet ideas using my Inspiration DNA.'
    }
    
    const packet = generateTrendingPacket(profile, config)
    navigator.clipboard.writeText(packet)
    
    setCopiedHunt(true)
    toast.success('Topic Hunt Packet Copied')
    setTimeout(() => setCopiedHunt(false), 2000)
  }

  function handleEngagementHunt() {
    const config = {
      mode: 'engagement' as const,
      targetAccounts: [], 
      topicKeywords: [], 
      opportunityTypes: ['add_value' as const, 'share_experience' as const, 'ask_question' as const],
      customRequest: 'Find 10 high-value reply opportunities and 3 quote tweets for me right now.'
    }
    
    const packet = generateEngagementPacket(profile, config)
    navigator.clipboard.writeText(packet)
    
    setCopiedEngage(true)
    toast.success('Engagement Hunt Packet Copied')
    setTimeout(() => setCopiedEngage(false), 2000)
  }

  return (
    <AppShell scrollable={false}>
      <CommandPalette />
      <div className="w-full flex flex-col md:flex-row md:overflow-hidden bg-background md:h-screen">
        
        {/* Left Pane: Raw Input (Editor) */}
        <div className="w-full md:flex-1 flex flex-col min-h-[350px] md:h-full border-b md:border-b-0 md:border-r border-border/50 bg-background/50 relative">
          
          <div className="flex-1 p-6 flex flex-col">
            <textarea
              ref={textareaRef}
              value={dumpText}
              onChange={(e) => setDumpText(e.target.value)}
              placeholder="Dump your raw thoughts here..."
              className="flex-1 w-full bg-transparent border-none text-lg md:text-xl font-normal leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:ring-0 focus:outline-none resize-none"
              autoFocus
            />
          </div>

          <div className="p-4 border-t border-border/30 bg-background/80 backdrop-blur-md flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              {dumpText.length} chars
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                Press <kbd className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[10px]">Ctrl</kbd> + <kbd className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to tailor
              </span>
              <Button 
                onClick={handleTailor}
                disabled={loading || !dumpText.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                {loading ? 'Tailoring...' : 'Tailor Draft'}
              </Button>
            </div>
          </div>

        </div>

        {/* Right Pane: Output & Tools */}
        <div className="w-full md:w-[45%] flex flex-col bg-card md:h-full md:overflow-y-auto">
          
          <div className="p-6 space-y-8">
            
            {/* Error State */}
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Output Draft Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Tailored Output
                </h3>
                {draftOutput && (
                   <Button 
                     onClick={handleCopyToGrok}
                     size="sm"
                     variant="secondary"
                     className="h-8 text-xs font-medium bg-secondary/50 hover:bg-secondary border border-border/50"
                   >
                     {copiedGrok ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Clipboard className="w-3.5 h-3.5 mr-1.5" />}
                     {copiedGrok ? 'Copied' : 'Copy for Grok'}
                   </Button>
                )}
              </div>
              
              <div className="min-h-[150px] p-5 rounded-xl border border-border/50 bg-background/50 shadow-inner relative group">
                {draftOutput ? (
                  <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
                    {draftOutput}
                  </p>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 text-sm">
                    Your tailored draft will appear here
                  </div>
                )}
              </div>
            </div>

            {/* Growth Packets Section */}
            <div className="space-y-4 pt-6 border-t border-border/30">
              <h3 className="text-sm font-semibold text-foreground/80">Growth Packets</h3>
              
              <div className="grid gap-3">
                {/* Topic Hunt Packet */}
                <div className="group flex items-center justify-between p-4 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all cursor-pointer" onClick={handleTopicHunt}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background border border-border/50 text-foreground group-hover:text-primary transition-colors">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Topic Hunt</h4>
                      <p className="text-xs text-muted-foreground">Find trending topics from your DNA</p>
                    </div>
                  </div>
                  {copiedHunt ? <Check className="w-4 h-4 text-primary" /> : <Clipboard className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>

                {/* Engagement Packet */}
                <div className="group flex items-center justify-between p-4 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all cursor-pointer" onClick={handleEngagementHunt}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background border border-border/50 text-foreground group-hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Engagement</h4>
                      <p className="text-xs text-muted-foreground">Find high-value reply targets</p>
                    </div>
                  </div>
                  {copiedEngage ? <Check className="w-4 h-4 text-primary" /> : <Clipboard className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/30">
               <SecondBrainPanel />
            </div>

          </div>
        </div>

      </div>
    </AppShell>
  )
}

