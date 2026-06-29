'use client'

import { useState } from 'react'
import { useProfileStore } from '@/store/useProfileStore'
import AppShell from '@/components/layout/AppShell'
import ModalTextarea from '@/components/ui/ModalTextarea'
import { Check, Save, Sparkles, Key, User, BookOpen, AlertCircle } from 'lucide-react'

const inp = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/60 focus:bg-white/[0.05] transition-all duration-150 resize-none font-sans'
const lbl = 'block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5'

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Core fields
  const [name, setName] = useState(profile.name)
  const [twitterHandle, setTwitterHandle] = useState(profile.twitterHandle)
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '')
  
  // Text blocks (Large Textareas)
  const [niche, setNiche] = useState(profile.niche || '')
  const [tone, setTone] = useState(profile.voice.tone || '')
  const [writingStyle, setWritingStyle] = useState(profile.voice.writingStyle || '')
  const [inspirationsContext, setInspirationsContext] = useState(profile.inspirationsContext || '')
  
  // Comma-separated or Newline-separated parsed inputs for better viewing space
  const [avoidListString, setAvoidListString] = useState((profile.voice.avoidList || []).join(', '))
  const [exampleTweetsString, setExampleTweetsString] = useState((profile.voice.exampleTweets || []).join('\n\n'))

  const [copiedPrompt, setCopiedPrompt] = useState(false)

  function copyGrokPrompt() {
    const prompt = `Analyze the last 100 tweets from @[CREATOR]. I want to adopt their personality, thinking frameworks, tweet structures, and topics, but I will be writing them using my own voice. 
Give me a comprehensive breakdown of their: 
1. Core philosophy and mental models 
2. Tweet structural habits (hooks, formatting, length) 
3. Content pillars and topics they dominate 
4. Psychological framing (how they present ideas). 

Output this as a structured text block I can save as my master Creator DNA Blueprint.`
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  function handleSave() {
    setSaving(true)
    
    // Parse strings back to arrays
    const parsedAvoidList = avoidListString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      
    const parsedExampleTweets = exampleTweetsString
      .split('\n\n')
      .map(s => s.trim())
      .filter(Boolean)

    const updated = {
      ...profile,
      name,
      twitterHandle,
      geminiApiKey,
      niche,
      inspirationsContext,
      voice: {
        ...profile.voice,
        tone,
        writingStyle,
        avoidList: parsedAvoidList,
        exampleTweets: parsedExampleTweets
      },
      updatedAt: new Date().toISOString()
    }
    
    updateProfile(updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AppShell>
      <div className="min-h-full p-4 md:p-6 max-w-3xl mx-auto pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-400" />
              Creator Settings
            </h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Configure your target voice, API settings, and Inspiration DNA</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-green-300" />
                <span>Saved Settings</span>
              </>
            ) : saving ? (
              <span>Saving Changes…</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          
          {/* 1. API & HANDLE CONFIG (Core Settings) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.01] border border-white/[0.03] p-6 rounded-2xl">
            <div>
              <label className={lbl}>
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Gemini API Key
              </label>
              <input
                type="password"
                className={`${inp} font-mono text-xs`}
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
              />
              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                Powers local draft tailoring. Get a free key from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 hover:underline">Google AI Studio</a>.
              </p>
            </div>
            
            <div>
              <label className={lbl}>Name</label>
              <input
                type="text"
                className={inp}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Karan"
              />
            </div>

            <div>
              <label className={lbl}>Twitter Handle</label>
              <input
                type="text"
                className={`${inp} font-mono`}
                value={twitterHandle}
                onChange={e => setTwitterHandle(e.target.value)}
                placeholder="kwakhare5"
              />
            </div>
          </div>

          {/* 2. INSPIRATIONS CONTEXT (The Creator DNA Blueprint) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className={lbl}>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Inspirations Context (Creator DNA Blueprint)
              </label>
            </div>
            
            {/* Grok Prompt Generator */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Get the DNA Blueprint from Grok</p>
                <p className="text-[11px] text-indigo-200/70 leading-relaxed">
                  Copy this prompt, paste it into Grok, and replace <b>@[CREATOR]</b> with their actual handle. Grok will analyze their style. Paste the result in the box below.
                </p>
              </div>
              <button
                onClick={copyGrokPrompt}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl whitespace-nowrap transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
              >
                {copiedPrompt ? 'Copied Prompt!' : 'Copy Grok Prompt'}
              </button>
            </div>

            <ModalTextarea
              label="Inspirations Context"
              className={`${inp} font-mono text-xs min-h-[350px] leading-relaxed border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04]`}
              value={inspirationsContext}
              onChange={setInspirationsContext}
              placeholder="Paste the Grok DNA Blueprint output here..."
              rows={15}
              fontClass="font-mono text-xs"
            />
          </div>

          {/* 3. CORE IDENTITY DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className={lbl}>Niche & Bio</label>
              <p className="text-[10px] text-[var(--text-muted)]">Describe what you do, who you talk to, and your expertise.</p>
              <ModalTextarea
                label="Niche & Bio"
                className={`${inp} min-h-[140px] leading-relaxed`}
                value={niche}
                onChange={setNiche}
                placeholder="CS student building full-stack AI apps in Pune..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className={lbl}>Voice & Tone</label>
              <p className="text-[10px] text-[var(--text-muted)]">Describe your primary speaking tone (e.g., dry humor, student jargon).</p>
              <ModalTextarea
                label="Voice & Tone"
                className={`${inp} min-h-[140px] leading-relaxed`}
                value={tone}
                onChange={setTone}
                placeholder="relatable Pune student, casual slang, punchy sentence lengths..."
                rows={6}
              />
            </div>

          </div>

          {/* 4. WRITING STYLE RULES & AVOID LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className={lbl}>Avoid List (Comma-separated)</label>
              <p className="text-[10px] text-[var(--text-muted)]">List words or phrases that sound fake, corporate, or unnatural.</p>
              <ModalTextarea
                label="Avoid List"
                className={`${inp} min-h-[120px] leading-relaxed font-mono text-xs`}
                value={avoidListString}
                onChange={setAvoidListString}
                placeholder="excited, announcement, game-changer, revolutionary, pleased to share..."
                rows={5}
                fontClass="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className={lbl}>Writing Style Rules</label>
              <p className="text-[10px] text-[var(--text-muted)]">Rules for formatting (e.g., lower-case, short hooks, no emojis).</p>
              <ModalTextarea
                label="Writing Style Rules"
                className={`${inp} min-h-[120px] leading-relaxed`}
                value={writingStyle}
                onChange={setWritingStyle}
                placeholder="Use 1 hook sentence. Never use emojis. Use numbers where possible."
                rows={5}
              />
            </div>

          </div>

          {/* 5. MY VOICE EXAMPLES */}
          <div className="space-y-2 border-t border-white/[0.05] pt-8">
            <label className={lbl}>
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              My Example Tweets (Separate with double newlines)
            </label>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Paste your best, highest-performing historical tweets here. Separate each tweet with an empty line (double newlines) so the parser can index them.
            </p>
            <ModalTextarea
              label="My Example Tweets"
              className={`${inp} font-mono text-xs min-h-[220px] leading-relaxed`}
              value={exampleTweetsString}
              onChange={setExampleTweetsString}
              placeholder={"vibe coding git-for-prompts today. Claude wrote 80%...\n\npune college life + code: lectures till 4, code till 2am..."}
              rows={10}
              fontClass="font-mono text-xs"
            />
          </div>

        </div>

      </div>
    </AppShell>
  )
}
