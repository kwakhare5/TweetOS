'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">TweetOS</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Twitter growth system for @kwakhare5</p>
        </div>

        {sent ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <div className="text-[var(--pass)] text-sm font-medium mb-2">✓ Magic link sent</div>
            <p className="text-[var(--text-muted)] text-sm">
              Check <strong className="text-[var(--text)]">{email}</strong> and click the link to sign in.
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-3">Link expires in 1 hour. Check spam if not in inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {error && (
              <p className="text-[var(--fail)] text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Sending...' : 'Send magic link →'}
            </button>

            <p className="text-[var(--text-muted)] text-xs text-center">
              No password. Click the link in your email.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
