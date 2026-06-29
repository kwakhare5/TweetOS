'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiJSON } from '@/lib/gemini'
import { VOICE_EXTRACTOR_PROMPT } from '@/lib/prompts'
import AppShell from '@/components/layout/AppShell'
import { Sparkles, Wand2, Plus, X, Check, Brain, Key, User, Mic, BookOpen } from 'lucide-react'

type Tab = 'identity' | 'voice' | 'examples' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'voice', label: 'Voice' },
  { id: 'examples', label: 'Examples' },
  { id: 'settings', label: 'Settings' },
]

const inp = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/60 focus:bg-white/[0.05] transition-all duration-150 resize-none'
const lbl = 'block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5 font-medium'

function TagInput({ value, onChange, onAdd, onRemove, tags, placeholder, color = 'accent' }: {
  value: string; onChange: (v: string) => void
  onAdd: () => void; onRemove: (i: number) => void
  tags: string[]; placeholder: string; color?: string
}) {
  const colorMap: Record<string, string> = {
    accent: 'bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]',
    fail: 'bg-[var(--fail)]/10 border-[var(--fail)]/20 text-[var(--fail)]',
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className={inp}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
          placeholder={placeholder}
        />
        <button onClick={onAdd} className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span key={i} className={`flex items-center gap-1 px-2 py-0.5 border rounded-full text-[11px] ${colorMap[color]}`}>
              {t}
              <button onClick={() => onRemove(i)} className="hover:opacity-60 transition-opacity"><X className="w-2.5 h-2.5" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function TweetList({ tweets, onRemove }: { tweets: string[]; onRemove: (i: number) => void }) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {tweets.length === 0 && <p className="text-[11px] text-[var(--text-muted)] italic">None added yet.</p>}
      {tweets.map((t, i) => (
        <div key={i} className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg flex items-start gap-2 group">
          <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5 shrink-0">#{i + 1}</span>
          <p className="flex-1 text-xs font-mono text-[var(--text)] whitespace-pre-wrap leading-relaxed">{t}</p>
          <button onClick={() => onRemove(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--fail)] shrink-0"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  )
}

function TweetInput({ value, onChange, onAdd, placeholder }: { value: string; onChange: (v: string) => void; onAdd: () => void; placeholder: string }) {
  return (
    <div className="flex gap-2">
      <textarea className={`${inp} font-mono text-xs`} rows={2} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      <button onClick={onAdd} className="px-3 py-2 self-end bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors shrink-0"><Plus className="w-4 h-4" /></button>
    </div>
  )
}

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<Tab>('identity')

  const [name, setName] = useState(profile.name)
  const [twitterHandle, setTwitterHandle] = useState(profile.twitterHandle)
  const [bio, setBio] = useState(profile.bio || '')
  const [niche, setNiche] = useState(profile.niche)
  const [admiredAccounts, setAdmiredAccounts] = useState<string[]>(profile.admiredAccounts || [])
  const [newAdmiredAccount, setNewAdmiredAccount] = useState('')

  const [tone, setTone] = useState(profile.voice.tone)
  const [writingStyle, setWritingStyle] = useState(profile.voice.writingStyle)
  const [avoidList, setAvoidList] = useState<string[]>(profile.voice.avoidList)
  const [newAvoidItem, setNewAvoidItem] = useState('')

  const [exampleTweets, setExampleTweets] = useState<string[]>(profile.voice.exampleTweets)
  const [newExampleItem, setNewExampleItem] = useState('')
  const [admiredExampleTweets, setAdmiredExampleTweets] = useState<string[]>(profile.voice.admiredExampleTweets || [])
  const [newAdmiredItem, setNewAdmiredItem] = useState('')

  const [secondBrain, setSecondBrain] = useState(profile.secondBrain || '')
  const [inspirationsContext, setInspirationsContext] = useState(profile.inspirationsContext || '')

  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '')
  const [rawTextDump, setRawTextDump] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [extractSuccess, setExtractSuccess] = useState(false)

  const [prevProfile, setPrevProfile] = useState(profile)
  if (profile !== prevProfile) {
    setPrevProfile(profile)
    setName(profile.name)
    setTwitterHandle(profile.twitterHandle)
    setBio(profile.bio || '')
    setNiche(profile.niche)
    setTone(profile.voice.tone)
    setWritingStyle(profile.voice.writingStyle)
    setGeminiApiKey(profile.geminiApiKey || '')
    setSecondBrain(profile.secondBrain || '')
    setInspirationsContext(profile.inspirationsContext || '')
    setAvoidList(profile.voice.avoidList)
    setExampleTweets(profile.voice.exampleTweets)
    setAdmiredExampleTweets(profile.voice.admiredExampleTweets || [])
    setAdmiredAccounts(profile.admiredAccounts || [])
  }

  async function handleAutoExtract() {
    if (!rawTextDump.trim()) return
    setIsExtracting(true)
    setExtractError(null)
    setExtractSuccess(false)
    try {
      const result = await geminiJSON<{
        name: string; twitterHandle: string; niche: string
        tone: string; writingStyle: string; avoidList: string[]
        exampleTweets: string[]; admiredExampleTweets?: string[]
      }>(VOICE_EXTRACTOR_PROMPT(rawTextDump))
      if (result.name) setName(result.name)
      if (result.twitterHandle) setTwitterHandle(result.twitterHandle)
      if (result.niche) setNiche(result.niche)
      if (result.tone) setTone(result.tone)
      if (result.writingStyle) setWritingStyle(result.writingStyle)
      if (result.avoidList) setAvoidList(result.avoidList)
      if (result.exampleTweets) setExampleTweets(result.exampleTweets)
      if (result.admiredExampleTweets) setAdmiredExampleTweets(result.admiredExampleTweets)
      setRawTextDump('')
      setExtractSuccess(true)
      setTimeout(() => setExtractSuccess(false), 4000)
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : 'AI extraction failed')
    } finally {
      setIsExtracting(false)
    }
  }

  function handleSave() {
    setSaving(true)
    const updated = {
      ...profile, name, twitterHandle, bio, niche, geminiApiKey, admiredAccounts, secondBrain, inspirationsContext,
      voice: { ...profile.voice, tone, writingStyle, avoidList, exampleTweets, admiredExampleTweets },
      updatedAt: new Date().toISOString(),
    }
    updateProfile(updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }



  return (
    <AppShell>
      <div className="min-h-full p-4 md:p-6 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Profile</h1>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Your permanent voice, identity, and AI settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            {saved ? <><Check className="w-4 h-4" /><span>Saved</span></> : saving ? <span>Saving…</span> : <span>Save</span>}
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                tab === t.id
                  ? 'bg-white/[0.08] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: IDENTITY ── */}
        {tab === 'identity' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Who you are</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Name</label>
                <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Karan" />
              </div>
              <div>
                <label className={lbl}>Handle</label>
                <input className={inp} value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} placeholder="@kwakhare5" />
              </div>
            </div>

            <div>
              <label className={lbl}>Bio</label>
              <textarea className={inp} rows={2} value={bio} onChange={e => setBio(e.target.value)} placeholder="Pune CS student. Building products in public." />
            </div>

            <div>
              <label className={lbl}>Niche</label>
              <textarea className={inp} rows={3} value={niche} onChange={e => setNiche(e.target.value)} placeholder="CS student, AI products, building in public" />
            </div>

            <div>
              <label className={lbl}>Admired Accounts</label>
              <TagInput
                value={newAdmiredAccount}
                onChange={setNewAdmiredAccount}
                onAdd={() => { if (newAdmiredAccount.trim()) { setAdmiredAccounts([...admiredAccounts, newAdmiredAccount.trim()]); setNewAdmiredAccount('') } }}
                onRemove={i => setAdmiredAccounts(admiredAccounts.filter((_, j) => j !== i))}
                tags={admiredAccounts}
                placeholder="@shydev69"
                color="accent"
              />
            </div>
          </div>
        )}

        {/* ── TAB: VOICE ── */}
        {tab === 'voice' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Mic className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">How you sound</span>
            </div>

            <div>
              <label className={lbl}>Tone</label>
              <textarea className={inp} rows={3} value={tone} onChange={e => setTone(e.target.value)} placeholder="Punchy, lower-case, direct, sarcastic at times, no hype" />
            </div>

            <div>
              <label className={lbl}>Writing Style Rules</label>
              <textarea className={inp} rows={3} value={writingStyle} onChange={e => setWritingStyle(e.target.value)} placeholder="Short sentences. No emojis. Never say 'excited to share'. Use numbers." />
            </div>

            <div>
              <label className={lbl}>Avoid List <span className="normal-case font-normal text-[var(--text-muted)]">— words/phrases that kill your voice</span></label>
              <TagInput
                value={newAvoidItem}
                onChange={setNewAvoidItem}
                onAdd={() => { if (newAvoidItem.trim()) { setAvoidList([...avoidList, newAvoidItem.trim()]); setNewAvoidItem('') } }}
                onRemove={i => setAvoidList(avoidList.filter((_, j) => j !== i))}
                tags={avoidList}
                placeholder="game-changer, excited to announce…"
                color="fail"
              />
            </div>
          </div>
        )}

        {/* ── TAB: EXAMPLES ── */}
        {tab === 'examples' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Your Tweets</span>
                <span className="text-[10px] text-[var(--text-muted)] ml-auto">{exampleTweets.length} added</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-3">Your best tweets. The AI learns your exact voice fingerprint from these.</p>
              <TweetInput
                value={newExampleItem}
                onChange={setNewExampleItem}
                onAdd={() => { if (newExampleItem.trim()) { setExampleTweets([...exampleTweets, newExampleItem.trim()]); setNewExampleItem('') } }}
                placeholder="paste one of your tweets here…"
              />
              <div className="mt-3">
                <TweetList tweets={exampleTweets} onRemove={i => setExampleTweets(exampleTweets.filter((_, j) => j !== i))} />
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Admired Style Examples</span>
                <span className="text-[10px] text-[var(--text-muted)] ml-auto">{admiredExampleTweets.length} added</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-3">Tweets from @shydev69, @adxtyahq, etc. The AI studies the style.</p>
              <TweetInput
                value={newAdmiredItem}
                onChange={setNewAdmiredItem}
                onAdd={() => { if (newAdmiredItem.trim()) { setAdmiredExampleTweets([...admiredExampleTweets, newAdmiredItem.trim()]); setNewAdmiredItem('') } }}
                placeholder="paste an admired tweet here…"
              />
              <div className="mt-3">
                <TweetList tweets={admiredExampleTweets} onRemove={i => setAdmiredExampleTweets(admiredExampleTweets.filter((_, j) => j !== i))} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SETTINGS ── */}
        {tab === 'settings' && (
          <div className="space-y-6">

            {/* API Key */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">API Key</span>
              </div>
              <label className={lbl}>Gemini API Key</label>
              <input
                type="text"
                className={`${inp} font-mono text-xs`}
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-2">
                Powers AI Composer, Second Brain, and Voice Extractor. Get one from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[var(--accent)] hover:underline">Google AI Studio</a>.
              </p>
            </div>

            <div className="border-t border-white/[0.05] pt-6">
              {/* AI Voice Extractor */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">AI Voice Extractor</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-3">
                Paste your bio, old tweets, or rough notes. The AI fills in Identity, Voice, and Avoid List automatically.
              </p>
              <textarea
                className={`${inp} font-mono text-xs`}
                rows={6}
                value={rawTextDump}
                onChange={e => setRawTextDump(e.target.value)}
                placeholder={"paste bio, tweets, or notes...\n\n\"just shipped v1 of tonal. building in public. cs student in pune.\ncan't stand words like 'excited to announce'\"\n\n– more tweets or anything"}
              />
              {extractError && <p className="text-[11px] text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 rounded-lg p-2.5 mt-2">{extractError}</p>}
              {extractSuccess && (
                <p className="text-[11px] text-green-400 bg-green-400/5 border border-green-400/20 rounded-lg p-2.5 mt-2 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" /> Auto-filled. Review tabs above then Save.
                </p>
              )}
              <button
                onClick={handleAutoExtract}
                disabled={isExtracting || !rawTextDump.trim()}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200"
              >
                <Wand2 className="w-4 h-4" />
                {isExtracting ? 'Analyzing…' : 'Analyze & Auto-Fill'}
              </button>
            </div>

            <div className="border-t border-white/[0.05] pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Second Brain (Live Context)</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-3">Permanent memory that gets injected into all prompts and drafts.</p>
              <textarea
                className={`${inp} font-sans text-xs h-32`}
                value={secondBrain}
                onChange={e => setSecondBrain(e.target.value)}
                placeholder="Log permanent facts, current projects, and context here..."
              />
            </div>

            <div className="border-t border-white/[0.05] pt-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Inspirations Context</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-3">Paste the Grok 'Creator DNA Blueprint' analysis here to automatically clone their voice.</p>
              <textarea
                className={`${inp} font-sans text-xs h-48`}
                value={inspirationsContext}
                onChange={e => setInspirationsContext(e.target.value)}
                placeholder="Paste Grok Blueprint JSON-like text here..."
              />
            </div>

            <div className="border-t border-white/[0.05] pt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Learning Notes</span>
                <span className="text-[10px] text-[var(--text-muted)] ml-auto">{(profile.voice.learningNotes || []).length} saved</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-3">Observations logged from past Grok sessions.</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(profile.voice.learningNotes || []).length === 0 && <p className="text-[11px] text-[var(--text-muted)] italic">No notes yet.</p>}
                {(profile.voice.learningNotes || []).map((n, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg text-xs text-[var(--text)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0 mt-0.5">#{i + 1}</span>
                    <p className="flex-1 leading-relaxed">{n}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </AppShell>
  )
}
