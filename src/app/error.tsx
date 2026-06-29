'use client'

import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-sm w-full p-6 bg-card border border-destructive/30 rounded-xl flex flex-col gap-4 text-center items-center">
        <AlertTriangle className="w-10 h-10 text-destructive shrink-0 animate-pulse" />
        <div>
          <h2 className="text-sm font-bold text-destructive">Something went wrong</h2>
          <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{error.message}</p>
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] font-semibold cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
