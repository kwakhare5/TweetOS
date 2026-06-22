'use client'

import { useState } from 'react'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiJSON } from '@/lib/gemini'
import { VOICE_EXTRACTOR_PROMPT } from '@/lib/prompts'
import { Sparkles, Wand2, Check } from 'lucide-react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useProfileStore()
  const [name, setName] = useState(profile.name)
  const [twitterHandle, setTwitterHandle] = useState(profile.twitterHandle)
  const [niche, setNiche] = useState(profile.niche)
  const [tone, setTone] = useState(profile.voice.tone)
  const [writingStyle, setWritingStyle] = useState(profile.voice.writingStyle)
  
  // Lists
  const [avoidList, setAvoidList] = useState(profile.voice.avoidList)
  const [newAvoidItem, setNewAvoidItem] = useState('')
  const [exampleTweets, setExampleTweets] = useState(profile.voice.exampleTweets)
  const [newExampleItem, setNewExampleItem] = useState('')

  // AI Extractor states
  const [rawTextDump, setRawTextDump] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [modalToast, setModalToast] = useState<string | null>(null)

  function triggerModalToast(msg: string) {
    setModalToast(msg)
    setTimeout(() => setModalToast(null), 3000)
  }

  async function handleAutoExtract() {
    if (!rawTextDump.trim()) return
    setIsExtracting(true)
    setExtractError(null)
    try {
      const result = await geminiJSON<{
        name: string
        twitterHandle: string
        niche: string
        tone: string
        writingStyle: string
        avoidList: string[]
        exampleTweets: string[]
      }>(VOICE_EXTRACTOR_PROMPT(rawTextDump))

      if (result.name) setName(result.name)
      if (result.twitterHandle) setTwitterHandle(result.twitterHandle)
      if (result.niche) setNiche(result.niche)
      if (result.tone) setTone(result.tone)
      if (result.writingStyle) setWritingStyle(result.writingStyle)
      if (result.avoidList) setAvoidList(result.avoidList)
      if (result.exampleTweets) setExampleTweets(result.exampleTweets)

      setRawTextDump('')
      triggerModalToast('AI successfully structured your profile! Review below.')
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : 'AI Extraction failed')
    } finally {
      setIsExtracting(false)
    }
  }

  if (!isOpen) return null

  function handleAddAvoid() {
    if (!newAvoidItem.trim()) return
    setAvoidList([...avoidList, newAvoidItem.trim()])
    setNewAvoidItem('')
  }

  function handleRemoveAvoid(index: number) {
    setAvoidList(avoidList.filter((_, i) => i !== index))
  }

  function handleAddExample() {
    if (!newExampleItem.trim()) return
    setExampleTweets([...exampleTweets, newExampleItem.trim()])
    setNewExampleItem('')
  }

  function handleRemoveExample(index: number) {
    setExampleTweets(exampleTweets.filter((_, i) => i !== index))
  }

  function handleSave() {
    const updated = {
      name,
      twitterHandle,
      niche,
      voice: {
        tone,
        writingStyle,
        avoidList,
        exampleTweets
      }
    }
    updateProfile(updated)
    
    // Save to localstorage as fallback or database if available
    localStorage.setItem('tweetos_profile', JSON.stringify({ ...profile, ...updated }))
    
    // Auto sync to DB if user auth is wired in the future (currently using localStorage cache for localhost simplicity)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">Voice Profile Settings</h2>
          <button 
            onClick={onClose} 
            className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-xl font-semibold leading-none p-1"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 0: AI Extractor */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-wider text-[var(--accent)] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Voice Profile Extractor</span>
              </h3>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">Paste bio, tweets, or raw notes</span>
            </div>
            
            <textarea
              placeholder="Paste anything about you, your niche, your writing rules, or paste 3-5 tweets you wrote. The AI will parse it and auto-fill the settings below..."
              value={rawTextDump}
              onChange={(e) => setRawTextDump(e.target.value)}
              className="glass-input w-full h-24 p-3 bg-transparent text-xs font-sans leading-relaxed"
            />
            
            <button
              onClick={handleAutoExtract}
              disabled={isExtracting || !rawTextDump.trim()}
              className="glass-button w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold border-transparent"
            >
              {isExtracting ? (
                'Extracting and structuring...'
              ) : (
                <span className="flex items-center gap-1.5 justify-center">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Analyze & Populate Profile</span>
                </span>
              )}
            </button>

            {extractError && (
              <p className="text-xs text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 p-2.5 rounded-lg font-sans">
                {extractError}
              </p>
            )}

            {modalToast && (
              <p className="text-xs text-[var(--pass)] bg-[var(--pass)]/5 border border-[var(--pass)]/20 p-2.5 rounded-lg font-sans flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{modalToast}</span>
              </p>
            )}
          </div>

          <hr className="border-white/5" />

          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Identity & Niche</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full px-3 py-2 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Twitter Handle</label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="glass-input w-full px-3 py-2 bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">Niche / Target Topics</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="glass-input w-full px-3 py-2 bg-transparent"
                placeholder="e.g. Pune CS student, building products in public, learning AI mechanics"
              />
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section 2: Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Voice & Tone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Tone Profile</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="glass-input w-full px-3 py-2 bg-transparent"
                  placeholder="e.g. punchy, casual, direct, slightly chaotic"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Writing Style</label>
                <input
                  type="text"
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value)}
                  className="glass-input w-full px-3 py-2 bg-transparent"
                  placeholder="e.g. lower-case, brief fragments, no fluff, tech-heavy"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section 3: Word Avoid List */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Avoid List (Corporate/Influencer Words)</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. excited, leverage, game-changer"
                value={newAvoidItem}
                onChange={(e) => setNewAvoidItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAvoid()}
                className="glass-input flex-1 px-3 py-2 bg-transparent"
              />
              <button onClick={handleAddAvoid} className="glass-button px-4">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {avoidList.map((word, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-full text-xs text-[var(--text-muted)] transition-colors"
                >
                  {word}
                  <button 
                    onClick={() => handleRemoveAvoid(i)} 
                    className="hover:text-[var(--fail)] font-bold text-[10px]"
                  >
                    ×
                  </button>
                </span>
              ))}
              {avoidList.length === 0 && (
                <span className="text-xs text-[var(--text-muted)] italic">No blocked words configured.</span>
              )}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section 4: Example Tweets */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Example Voice Targets (Tweets to match)</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <textarea
                  placeholder="Paste a tweet that matches your ideal voice..."
                  value={newExampleItem}
                  onChange={(e) => setNewExampleItem(e.target.value)}
                  className="glass-input flex-1 h-20 bg-transparent text-xs font-mono"
                />
                <button onClick={handleAddExample} className="glass-button px-4 self-end">
                  Add Target
                </button>
              </div>
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
                {exampleTweets.map((tweet, i) => (
                  <div 
                    key={i} 
                    className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex items-start gap-3 group text-xs text-[var(--text)]"
                  >
                    <span className="font-mono text-[var(--text-muted)]">#{i+1}</span>
                    <p className="flex-1 font-mono leading-relaxed whitespace-pre-wrap">{tweet}</p>
                    <button 
                      onClick={() => handleRemoveExample(i)} 
                      className="opacity-0 group-hover:opacity-100 hover:text-[var(--fail)] transition-opacity text-sm font-semibold p-1"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
          <button onClick={onClose} className="glass-button px-4 py-2 bg-transparent text-[var(--text-muted)] border-transparent hover:bg-white/[0.02]">
            Cancel
          </button>
          <button onClick={handleSave} className="glass-button px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-transparent">
            Save Voice Profile
          </button>
        </div>

      </div>
    </div>
  )
}
