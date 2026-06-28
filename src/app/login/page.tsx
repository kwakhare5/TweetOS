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

  function handleBypassAuth() {
    document.cookie = "bypass-auth=true; path=/; max-age=31536000; SameSite=Lax"
    window.location.href = '/'
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
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

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[var(--text-muted)] text-[10px] uppercase tracking-wider font-mono">Or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-800 font-semibold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 border border-neutral-300 disabled:opacity-40"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleBypassAuth}
              className="w-full bg-[#1c1c1c] hover:bg-[#252525] border border-white/5 text-[var(--text-muted)] hover:text-white font-medium py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>⚡ Developer Offline Mode</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
