export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center paper-texture">
      <div className="flex flex-col items-center gap-3 bg-card border border-border p-8 rounded-xl shadow-sm rotate-[0.5deg]">
        <span className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">loading…</span>
      </div>
    </div>
  )
}
