'use client'

import { useState } from 'react'
import { useProfileStore } from '@/store/useProfileStore'
import AppShell from '@/components/layout/AppShell'
import ModalTextarea from '@/components/ui/ModalTextarea'
import { Check, Save, Sparkles, Key, BookOpen, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const inp = 'w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-border/80 focus:ring-1 focus:ring-ring transition-all duration-150 font-sans'
const lbl = 'block text-xs font-bold tracking-wide text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5'

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
      <div className="w-full max-w-3xl mx-auto px-6 md:px-12 py-5 font-sans">
        
        {/* Notion Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-12 select-none">
          <span>Workspace</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground/80 font-medium">Settings</span>
        </div>

        {/* Notion Title & Icon Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-14 rounded-lg bg-secondary text-foreground/80 select-none shrink-0">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground select-text outline-none">
                Settings
              </h1>
              <p className="text-muted-foreground text-xs mt-1.5">Configure your voice tone, API keys, and Creator DNA profile.</p>
            </div>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-semibold h-9 bg-foreground text-background hover:bg-foreground/90 px-4 shrink-0"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                <span>Saved</span>
              </>
            ) : saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                <span>Save Settings</span>
              </>
            )}
          </Button>
        </div>

        {/* Form Sections */}
        <div className="space-y-10">
          
          {/* 1. Core Profile & API key */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 border border-border rounded-lg bg-secondary/20">
            <div className="md:col-span-3">
              <label className={lbl}>
                <Key className="w-3.5 h-3.5 text-muted-foreground/80" />
                Gemini API Key
              </label>
              <input
                type="password"
                className={`${inp} font-mono text-xs`}
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                placeholder="Paste Gemini API Key..."
              />
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                Used to analyze and rewrite your raw drafts locally. Get a free key from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-foreground">Google AI Studio</a>.
              </p>
            </div>
            
            <div>
              <label className={lbl}>Name</label>
              <input
                type="text"
                className={inp}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <div className="md:col-span-2">
              <label className={lbl}>Twitter Handle</label>
              <input
                type="text"
                className={`${inp} font-mono`}
                value={twitterHandle}
                onChange={e => setTwitterHandle(e.target.value)}
                placeholder="username (no @)"
              />
            </div>
          </div>

          {/* 2. Creator DNA Blueprint Callout & Input */}
          <div className="space-y-4">
            <label className={lbl}>
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground/80" />
              Creator DNA Blueprint
            </label>
            
            {/* Notion Callout Banner */}
            <div className="flex items-start gap-3 p-4 bg-secondary/40 border border-border/65 rounded-lg select-text">
              <Sparkles className="w-4 h-4 text-muted-foreground/80 mt-0.5 shrink-0" />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground">Style Analysis Prompt</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Paste this prompt into Grok to analyze your target creator profile, then copy-paste the output blueprint below.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyGrokPrompt}
                  className="h-8 text-xs font-semibold border-border bg-background hover:bg-secondary shrink-0"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 mr-1.5" /> : null}
                  {copiedPrompt ? 'Copied' : 'Copy Prompt'}
                </Button>
              </div>
            </div>

            <ModalTextarea
              label="Inspirations Context"
              className={`${inp} font-mono text-xs h-36 leading-relaxed bg-transparent`}
              value={inspirationsContext}
              onChange={setInspirationsContext}
              placeholder="Paste the Grok DNA Blueprint output here..."
              rows={5}
              fontClass="font-mono text-xs"
            />
          </div>

          {/* 3. Core Persona Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={lbl}>Niche & Content Focus</label>
              <p className="text-[10px] text-muted-foreground">Describe your core topics, audience, and area of expertise.</p>
              <ModalTextarea
                label="Niche & Bio"
                className={`${inp} h-36 leading-relaxed bg-transparent`}
                value={niche}
                onChange={setNiche}
                placeholder="E.g. fullstack developer sharing startup coding logs..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <label className={lbl}>Voice & Style Rules</label>
              <p className="text-[10px] text-muted-foreground">Describe your main speaking style (e.g., student slang, lower-case).</p>
              <ModalTextarea
                label="Voice & Tone"
                className={`${inp} h-36 leading-relaxed bg-transparent`}
                value={tone}
                onChange={setTone}
                placeholder="E.g. dry humor, lowercase, short sentences..."
                rows={5}
              />
            </div>
          </div>

          {/* 4. Format & Avoid Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={lbl}>Words to Avoid (Comma-separated)</label>
              <p className="text-[10px] text-muted-foreground">Words that sound robotic, corporate, or artificial.</p>
              <ModalTextarea
                label="Avoid List"
                className={`${inp} h-36 leading-relaxed bg-transparent font-mono text-xs`}
                value={avoidListString}
                onChange={setAvoidListString}
                placeholder="excited, announce, game-changer, revolutionary..."
                rows={5}
                fontClass="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className={lbl}>Writing Rules</label>
              <p className="text-[10px] text-muted-foreground">Formatting constraints (e.g. no links, no emojis, max 1 hook sentence).</p>
              <ModalTextarea
                label="Writing Style Rules"
                className={`${inp} h-36 leading-relaxed bg-transparent`}
                value={writingStyle}
                onChange={setWritingStyle}
                placeholder="E.g. No emojis. Bold first line. Maximum 3 bullet points."
                rows={5}
              />
            </div>
          </div>

          {/* 5. Example Tweets */}
          <div className="space-y-2 pt-6 border-t border-border/80">
            <label className={lbl}>
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground/80" />
              Example Tweets (Separate with double newlines)
            </label>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
              Add your best performing past tweets here as styling references. Use double blank lines to separate multiple tweets.
            </p>
            <ModalTextarea
              label="My Example Tweets"
              className={`${inp} font-mono text-xs h-36 leading-relaxed bg-transparent`}
              value={exampleTweetsString}
              onChange={setExampleTweetsString}
              placeholder="Paste historical tweets here..."
              rows={5}
              fontClass="font-mono text-xs"
            />
          </div>

        </div>

      </div>
    </AppShell>
  )
}
