'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
      <div className="max-w-sm w-full p-6 bg-[var(--surface)] border border-[var(--fail)]/30 rounded-xl flex flex-col gap-4 text-center">
        <span className="text-3xl">💀</span>
        <div>
          <h2 className="text-sm font-bold text-[var(--fail)]">Something went wrong</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono break-all">{error.message}</p>
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
