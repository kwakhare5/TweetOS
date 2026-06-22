export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[var(--text-muted)] font-mono">loading…</span>
      </div>
    </div>
  )
}
