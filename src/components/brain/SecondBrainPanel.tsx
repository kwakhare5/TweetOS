'use client'

import { useState, useRef } from 'react'
import { Brain, Loader2, ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiText } from '@/lib/gemini'
import { BRAIN_UPDATER_PROMPT } from '@/lib/prompts'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function SecondBrainPanel() {
  const { profile, setProfile } = useProfileStore()
  const [brainText, setBrainText] = useState(profile.secondBrain || '')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [prevSecondBrain, setPrevSecondBrain] = useState(profile.secondBrain)
  if (profile.secondBrain !== prevSecondBrain) {
    setPrevSecondBrain(profile.secondBrain)
    setBrainText(profile.secondBrain || '')
  }

  async function handleSend() {
    if (!input.trim() || loading) return
    setLoading(true)
    try {
      const updated = await geminiText(BRAIN_UPDATER_PROMPT(brainText, input.trim()))
      setBrainText(updated)
      setInput('')
      setDirty(true)
      toast.success('Brain context updated by AI')
    } catch (e) {
      console.error('Brain update failed:', e)
      toast.error(e instanceof Error ? e.message : 'Brain update failed')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleSave() {
    setSaving(true)
    const updatedProfile = {
      ...profile,
      secondBrain: brainText,
      updatedAt: new Date().toISOString(),
    }
    setProfile(updatedProfile)
    setDirty(false)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`border border-border/40 rounded-xl transition-all duration-300 overflow-hidden ${collapsed ? 'bg-secondary/10 hover:bg-secondary/20' : 'bg-background shadow-[0_0_40px_rgba(147,51,234,0.05)] border-primary/20'}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors group"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${collapsed ? 'bg-secondary/50 text-muted-foreground group-hover:text-foreground' : 'bg-primary/20 text-primary'}`}>
            <Brain className="w-4 h-4" />
          </div>
          <span className={`text-sm font-semibold transition-colors ${collapsed ? 'text-foreground/70 group-hover:text-foreground' : 'text-foreground'}`}>
            Second Brain
          </span>
          {dirty && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {dirty && !collapsed && (
            <Button
              onClick={e => { e.stopPropagation(); handleSave() }}
              disabled={saving}
              size="sm"
              className="h-7 text-xs font-semibold px-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(147,51,234,0.3)] transition-all"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? '✓ Saved' : 'Save'}
            </Button>
          )}
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary transition-colors" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 space-y-4">
            
            <textarea
              value={brainText}
              onChange={e => { setBrainText(e.target.value); setDirty(true) }}
              rows={6}
              placeholder="Dump context facts, rules, or live notes here..."
              className="w-full bg-secondary/10 border border-border/30 rounded-lg p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 font-mono transition-all"
            />

            <div className="flex items-end gap-2 relative group/input">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask AI to update brain (Press Enter)"
                className="flex-1 bg-secondary/20 border border-border/40 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none transition-all pr-12"
                style={{ minHeight: '44px', maxHeight: '100px' }}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                size="icon"
                className="absolute right-1.5 bottom-1.5 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-all shadow-[0_0_10px_rgba(147,51,234,0.2)] disabled:shadow-none disabled:bg-secondary disabled:text-muted-foreground"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
