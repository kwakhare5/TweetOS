'use client'

import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiText } from '@/lib/gemini'
import { BRAIN_UPDATER_PROMPT } from '@/lib/prompts'
import { createClient } from '@/lib/supabase/client'
import { saveProfile } from '@/lib/storage'

export default function SecondBrainPanel() {
  const { profile, setProfile } = useProfileStore()
  const [brainText, setBrainText] = useState(profile.secondBrain || '')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Keep in sync if profile loads from DB after mount
  useEffect(() => {
    setBrainText(profile.secondBrain || '')
  }, [profile.secondBrain])

  async function handleSend() {
    if (!input.trim() || loading) return
    setLoading(true)
    try {
      const updated = await geminiText(BRAIN_UPDATER_PROMPT(brainText, input.trim()))
      setBrainText(updated)
      setInput('')
      setDirty(true)
    } catch (e) {
      console.error('Brain update failed:', e)
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
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await saveProfile(user.id, updatedProfile)
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
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-200">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Second Brain</span>
          {dirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {dirty && !collapsed && (
            <button
              onClick={e => { e.stopPropagation(); handleSave() }}
              disabled={saving}
              className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 text-[11px] font-bold transition-colors"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? '✓ Saved' : <><Save className="w-3 h-3" /><span>Save</span></>}
            </button>
          )}
          {collapsed
            ? <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            : <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          }
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="border-t border-white/[0.05]">
          {/* Brain text — editable */}
          <textarea
            value={brainText}
            onChange={e => { setBrainText(e.target.value); setDirty(true) }}
            rows={6}
            placeholder={"Tell me what's happening today...\n– new project started\n– swiggy replied\n– shipped X, broke Y\n– feeling productive / burned out"}
            className="w-full bg-transparent px-4 pt-3 pb-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)] font-mono leading-relaxed resize-none focus:outline-none"
          />

          {/* Chat input */}
          <div className="flex items-end gap-2 px-3 pb-3 pt-1 border-t border-white/[0.05]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Tell me something… (Enter to update)"
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500/40 resize-none transition-colors"
              style={{ minHeight: '34px', maxHeight: '80px' }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="shrink-0 p-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 disabled:opacity-40 transition-colors"
            >
              {loading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
