interface MacOsWindowDotsProps {
  size?: "sm" | "md"
}

/**
 * macOS-style traffic light window control dots (red/yellow/green).
 * Used across sticky notes, sidebar, and draft preview panels.
 */
export function MacOsWindowDots({ size = "md" }: MacOsWindowDotsProps) {
  const dot = size === "sm" ? "size-2" : "size-2.5"
  return (
    <div className="flex items-center gap-1.5">
      <div className={`${dot} rounded-full bg-red-400 border border-red-500/20 shadow-sm`} />
      <div className={`${dot} rounded-full bg-amber-400 border border-amber-500/20 shadow-sm`} />
      <div className={`${dot} rounded-full bg-green-400 border border-green-500/20 shadow-sm`} />
    </div>
  )
}
