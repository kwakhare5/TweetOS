import { cn } from "@/lib/utils"

// Inline style extracted as constant to prevent re-creation on every render
const WASHI_TAPE_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(254, 240, 138, 0.4)",
  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
  backdropFilter: "blur(1.5px)",
  clipPath: "polygon(3px 12%, 8px 0%, calc(100% - 8px) 0%, calc(100% - 2px) 15%, calc(100% - 5px) 45%, 100% 60%, calc(100% - 4px) 85%, calc(100% - 8px) 100%, 8px 100%, 3px 80%, 6px 45%, 0% 20%)",
}

export function WashiTape({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs opacity-75 z-10 select-none pointer-events-none",
        className
      )}
      style={{ ...WASHI_TAPE_STYLE, ...style }}
      {...props}
    />
  )
}
