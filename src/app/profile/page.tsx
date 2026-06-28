'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getProfile, saveProfile } from '@/lib/storage'
import { useProfileStore } from '@/store/useProfileStore'
import AppShell from '@/components/layout/AppShell'
import { UserProfile } from '@/types'

export default function ProfilePage() {
  const { profile, setProfile } = useProfileStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      const p = await getProfile(user.id)
      setProfile(p)
    })
  }, [setProfile])

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    await saveProfile(userId, { ...profile, updatedAt: new Date().toISOString() })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function update(field: keyof UserProfile, value: unknown) {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Profile</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="space-y-5">
          {/* Basic Info */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Basic Info</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" value={profile.name} onChange={(v) => update('name', v)} />
              <Field label="Twitter Handle" value={profile.twitterHandle} onChange={(v) => update('twitterHandle', v)} placeholder="without @" />
            </div>
            <Field label="Bio" value={profile.bio} onChange={(v) => update('bio', v)} />
            <Field label="Niche" value={profile.niche} onChange={(v) => update('niche', v)} multiline />
          </section>

          {/* Voice */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Your Voice</h2>
            <Field label="Tone" value={profile.voice.tone} onChange={(v) => setProfile({ ...profile, voice: { ...profile.voice, tone: v } })} multiline />
            <Field label="Writing Style" value={profile.voice.writingStyle} onChange={(v) => setProfile({ ...profile, voice: { ...profile.voice, writingStyle: v } })} multiline />
          </section>

          {/* Second Brain Context */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="text-xs text-[var(--text-muted)] uppercase tracking-wider">🧠 Second Brain Context (Knowledge Base)</h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Dump details about your background, active projects, tech stacks, and daily life context here. The AI uses this permanent memory to craft highly specific, relevant tweets.
            </p>
            <Field 
              label="Second Brain Context" 
              value={profile.secondBrain || ''} 
              onChange={(v) => update('secondBrain', v)} 
              multiline 
            />
          </section>

          {/* Goals */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Goals</h2>
            <Field label="Posting Frequency" value={profile.postingFrequency} onChange={(v) => update('postingFrequency', v)} />
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Admired Accounts (comma-separated)</label>
              <input
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                value={profile.admiredAccounts.join(', ')}
                onChange={(e) => update('admiredAccounts', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function Field({ label, value, onChange, multiline, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  const cls = "w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
  return (
    <div>
      <label className="text-xs text-[var(--text-muted)] block mb-1">{label}</label>
      {multiline ? (
        <textarea className={cls} rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}
