'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getProfile, saveProfile } from '@/lib/storage'
import { useProfileStore } from '@/store/useProfileStore'
import { geminiJSON } from '@/lib/gemini'
import { VOICE_EXTRACTOR_PROMPT } from '@/lib/prompts'
import AppShell from '@/components/layout/AppShell'
import { Sparkles, Wand2, Plus, X, Check, Brain, Key, User, Mic, Target, BookOpen } from 'lucide-react'

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state mirroring profile
  const [name, setName] = useState(profile.name)
  const [twitterHandle, setTwitterHandle] = useState(profile.twitterHandle)
  const [bio, setBio] = useState(profile.bio || '')
  const [niche, setNiche] = useState(profile.niche)
  const [tone, setTone] = useState(profile.voice.tone)
  const [writingStyle, setWritingStyle] = useState(profile.voice.writingStyle)
  const [secondBrain, setSecondBrain] = useState(profile.secondBrain || '')
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '')
  const [avoidList, setAvoidList] = useState<string[]>(profile.voice.avoidList)
  const [newAvoidItem, setNewAvoidItem] = useState('')
  const [exampleTweets, setExampleTweets] = useState<string[]>(profile.voice.exampleTweets)
  const [newExampleItem, setNewExampleItem] = useState('')
  const [admiredExampleTweets, setAdmiredExampleTweets] = useState<string[]>(profile.voice.admiredExampleTweets || [])
  const [newAdmiredItem, setNewAdmiredItem] = useState('')
  const [admiredAccounts, setAdmiredAccounts] = useState<string[]>(profile.admiredAccounts || [])
  const [newAdmiredAccount, setNewAdmiredAccount] = useState('')

  // AI Extractor
  const [rawTextDump, setRawTextDump] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [extractSuccess, setExtractSuccess] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      const id = user?.id ?? null
      if (!id) return
      setUserId(id)
      const p = await getProfile(id)
      if (p) {
        updateProfile(p)
        setName(p.name)
        setTwitterHandle(p.twitterHandle)
        setBio(p.bio || '')
        setNiche(p.niche)
        setTone(p.voice.tone)
        setWritingStyle(p.voice.writingStyle)
        setSecondBrain(p.secondBrain || '')
        setGeminiApiKey(p.geminiApiKey || '')
        setAvoidList(p.voice.avoidList)
        setExampleTweets(p.voice.exampleTweets)
        setAdmiredExampleTweets(p.voice.admiredExampleTweets || [])
        setAdmiredAccounts(p.admiredAccounts || [])
      }
    })
  }, [updateProfile])

  async function handleAutoExtract() {
    if (!rawTextDump.trim()) return
    setIsExtracting(true)
    setExtractError(null)
    setExtractSuccess(false)
    try {
      const result = await geminiJSON<{
        name: string
        twitterHandle: string
        niche: string
        tone: string
        writingStyle: string
        avoidList: string[]
        exampleTweets: string[]
        admiredExampleTweets?: string[]
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

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    const updated = {
      ...profile,
      name,
      twitterHandle,
      bio,
      niche,
      secondBrain,
      geminiApiKey,
      admiredAccounts,
      voice: {
        ...profile.voice,
        tone,
        writingStyle,
        avoidList,
        exampleTweets,
        admiredExampleTweets,
      },
      updatedAt: new Date().toISOString(),
    }
    updateProfile(updated)
    await saveProfile(userId, updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputCls = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:bg-white/[0.05] transition-all duration-150 resize-none'

  return (
    <AppShell>
      <div className="min-h-full p-4 md:p-6 lg:p-8 max-w-6xl">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Configure your AI voice, identity, and Second Brain context
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !userId}
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-[var(--accent)]/20"
          >
            {saved ? (
              <><Check className="w-4 h-4" /><span>Saved</span></>
            ) : saving ? (
              <span>Saving…</span>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Card: Identity */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">Identity & Niche</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Name</label>
                  <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Karan" />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Twitter Handle</label>
                  <input className={inputCls} value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} placeholder="@kwakhare5" />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Bio (1–2 sentences)</label>
                <textarea className={inputCls} rows={2} value={bio} onChange={e => setBio(e.target.value)} placeholder="Pune CS student. Building products in public." />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Niche / Target Topics</label>
                <textarea className={inputCls} rows={2} value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. CS student, AI products, building in public" />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Admired Accounts</label>
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    value={newAdmiredAccount}
                    onChange={e => setNewAdmiredAccount(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newAdmiredAccount.trim()) { setAdmiredAccounts([...admiredAccounts, newAdmiredAccount.trim()]); setNewAdmiredAccount('') } }}
                    placeholder="@shydev69"
                  />
                  <button
                    onClick={() => { if (newAdmiredAccount.trim()) { setAdmiredAccounts([...admiredAccounts, newAdmiredAccount.trim()]); setNewAdmiredAccount('') } }}
                    className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {admiredAccounts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {admiredAccounts.map((a, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-[11px] text-[var(--accent)]">
                        {a}
                        <button onClick={() => setAdmiredAccounts(admiredAccounts.filter((_, j) => j !== i))} className="hover:text-[var(--fail)] transition-colors"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Card: Second Brain */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">Second Brain — Active Context</h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Dump your active projects, daily events, and background facts here. The AI reads this for every tweet so it stays hyper-specific to your life — <span className="text-white/60">e.g. &ldquo;Swiggy didn&apos;t reply to mail&rdquo;, &ldquo;new project: Instamart agent&rdquo;</span>.
              </p>
              <textarea
                className={inputCls}
                rows={8}
                value={secondBrain}
                onChange={e => setSecondBrain(e.target.value)}
                placeholder={"– Pune CS student, 3rd year, SIT\n– Applied to Swiggy internship, awaiting reply\n– Currently building: Instamart delivery agent (Next.js + Supabase)\n– Shipped: Tonal (music app), Git-for-Prompts\n– Uses Antigravity IDE for everything\n– Daily: studying DSA, building in public, shipping fast"}
              />
            </section>

            {/* Card: API Config */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">API Configuration</h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Gemini API key is used by the <span className="text-white/60">AI Composer, AI Extractor, and Trending Radar</span>. Get yours from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[var(--accent)] hover:underline">Google AI Studio</a>.
              </p>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Gemini API Key</label>
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
              </div>
            </section>

            {/* Card: AI Extractor */}
            <section className="bg-[var(--accent)]/[0.04] border border-[var(--accent)]/20 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">AI Voice Extractor</h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Paste your tweets, bio, or rough notes. The AI auto-fills Identity, Voice, and Avoid List below.
              </p>
              <textarea
                className={`${inputCls} font-mono text-xs`}
                rows={5}
                value={rawTextDump}
                onChange={e => setRawTextDump(e.target.value)}
                placeholder={"Paste bio, old tweets, or raw notes...\n\n\"just shipped v1 of tonal. building everything in public. cs student in pune.\ncan't stand words like 'excited to announce' or 'game-changer'\"\n\n– more tweets, notes, anything"}
              />
              {extractError && (
                <p className="text-[11px] text-[var(--fail)] bg-[var(--fail)]/5 border border-[var(--fail)]/20 rounded-lg p-2.5 font-sans">{extractError}</p>
              )}
              {extractSuccess && (
                <p className="text-[11px] text-green-400 bg-green-400/5 border border-green-400/20 rounded-lg p-2.5 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" /> Profile auto-filled successfully. Review and save.
                </p>
              )}
              <button
                onClick={handleAutoExtract}
                disabled={isExtracting || !rawTextDump.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200"
              >
                <Wand2 className="w-4 h-4" />
                {isExtracting ? 'Analyzing…' : 'Analyze & Auto-Fill Profile'}
              </button>
            </section>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-5">

            {/* Card: Voice & Tone */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">Voice & Tone</h2>
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Tone Profile</label>
                <textarea className={inputCls} rows={3} value={tone} onChange={e => setTone(e.target.value)} placeholder="Punchy, lower-case, direct, sarcastic at times, no hype" />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Writing Style Rules</label>
                <textarea className={inputCls} rows={3} value={writingStyle} onChange={e => setWritingStyle(e.target.value)} placeholder="Short sentences. No emojis. Never say 'excited to share'. Use numbers." />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Avoid List</label>
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    value={newAvoidItem}
                    onChange={e => setNewAvoidItem(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newAvoidItem.trim()) { setAvoidList([...avoidList, newAvoidItem.trim()]); setNewAvoidItem('') } }}
                    placeholder="game-changer, excited to announce…"
                  />
                  <button
                    onClick={() => { if (newAvoidItem.trim()) { setAvoidList([...avoidList, newAvoidItem.trim()]); setNewAvoidItem('') } }}
                    className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {avoidList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {avoidList.map((w, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--fail)]/10 border border-[var(--fail)]/20 rounded-full text-[11px] text-[var(--fail)]">
                        {w}
                        <button onClick={() => setAvoidList(avoidList.filter((_, j) => j !== i))} className="hover:opacity-70 transition-opacity"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Card: Your Example Tweets */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">Your Example Tweets</h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Paste your best tweets to teach the AI your exact voice fingerprint.</p>
              <div className="flex gap-2">
                <textarea
                  className={`${inputCls} font-mono text-xs`}
                  rows={3}
                  value={newExampleItem}
                  onChange={e => setNewExampleItem(e.target.value)}
                  placeholder="paste one of your tweets here…"
                />
                <button
                  onClick={() => { if (newExampleItem.trim()) { setExampleTweets([...exampleTweets, newExampleItem.trim()]); setNewExampleItem('') } }}
                  className="px-3 py-2 self-end bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {exampleTweets.length === 0 && <p className="text-[11px] text-[var(--text-muted)] italic">No example tweets added yet.</p>}
                {exampleTweets.map((tweet, i) => (
                  <div key={i} className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg flex items-start gap-2 group">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5 shrink-0">#{i + 1}</span>
                    <p className="flex-1 text-xs font-mono text-[var(--text)] whitespace-pre-wrap leading-relaxed">{tweet}</p>
                    <button onClick={() => setExampleTweets(exampleTweets.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--fail)] shrink-0"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </section>

            {/* Card: Admired Tweets */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-orange-400" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">Admired Example Tweets</h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Paste tweets from @shydev69, @adxtyahq, or others you admire. The AI learns the style.</p>
              <div className="flex gap-2">
                <textarea
                  className={`${inputCls} font-mono text-xs`}
                  rows={3}
                  value={newAdmiredItem}
                  onChange={e => setNewAdmiredItem(e.target.value)}
                  placeholder="paste an admired tweet here…"
                />
                <button
                  onClick={() => { if (newAdmiredItem.trim()) { setAdmiredExampleTweets([...admiredExampleTweets, newAdmiredItem.trim()]); setNewAdmiredItem('') } }}
                  className="px-3 py-2 self-end bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {admiredExampleTweets.length === 0 && <p className="text-[11px] text-[var(--text-muted)] italic">No admired tweets added yet.</p>}
                {admiredExampleTweets.map((tweet, i) => (
                  <div key={i} className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg flex items-start gap-2 group">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5 shrink-0">#{i + 1}</span>
                    <p className="flex-1 text-xs font-mono text-[var(--text)] whitespace-pre-wrap leading-relaxed">{tweet}</p>
                    <button onClick={() => setAdmiredExampleTweets(admiredExampleTweets.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--fail)] shrink-0"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppShell>
  )
}
