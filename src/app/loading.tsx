export default function Loading() {
  return (
    <div 
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background"
      style={{
        backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="flex flex-col items-center gap-3 bg-card border border-border p-8 rounded-xl shadow-sm rotate-[0.5deg]">
        <span className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">loading…</span>
      </div>
    </div>
  )
}
