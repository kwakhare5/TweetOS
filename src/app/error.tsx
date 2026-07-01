'use client'

import { AlertOctagon, RotateCw, Home } from "lucide-react"
import { Paperclip } from "@/components/ui/paperclip"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div 
      className="flex min-h-screen items-center justify-center p-6 font-sans antialiased bg-background"
      style={{
        backgroundImage: "radial-gradient(rgba(120, 90, 40, 0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="relative max-w-md w-full sm:rotate-[-0.5deg] rotate-0 mt-8">
        {/* Paperclip overlay */}
        <Paperclip className="absolute top-[-16px] left-[8%] z-20 select-none pointer-events-none rotate-[-10deg]" />

        {/* Washi Tape Accent */}
        <div 
          className="absolute top-[-12px] right-[10%] z-20 px-6 py-1 text-[10px] font-bold tracking-widest text-red-950 uppercase select-none shadow-3xs rotate-[2.5deg]"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px dashed rgba(239, 68, 68, 0.25)",
            fontFamily: "var(--font-mono)"
          }}
        >
          SYSTEM FAULT
        </div>

        {/* Skeuomorphic Folder Tab Header */}
        <div className="flex select-none">
          <div className="bg-card border border-border border-b-0 px-4 py-1.5 rounded-t-lg text-[10px] font-bold text-red-600 uppercase tracking-wider translate-y-[1px] z-10 flex items-center gap-1.5 shadow-3xs">
            <AlertOctagon className="size-3.5" />
            <span>Process Error</span>
          </div>
        </div>

        {/* Main Folder Body Card */}
        <div className="bg-card text-card-foreground border border-border rounded-b-xl rounded-tr-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 relative flex flex-col font-sans z-0">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                An unexpected interruption occurred.
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                The active subroutine encountered an unhandled stack error.
              </p>
            </div>

            {/* Error Message Panel */}
            <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-lg font-mono text-[11px] text-red-700/90 whitespace-pre-wrap break-all leading-normal select-all">
              {error.message || "Unknown execution exception."}
            </div>

            {/* Action buttons styled as tight washi tapes */}
            <div className="flex items-center gap-2.5 pt-2 select-none">
              <button
                onClick={reset}
                className="h-8 px-3 gap-1.5 flex-initial cursor-pointer font-bold transition-all flex items-center justify-center select-none text-xs border-0 bg-amber-200/60 hover:bg-amber-200/80 border-amber-300/30 text-amber-950 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 shadow-3xs active:scale-[0.98] rotate-[0.3deg] rounded-md"
              >
                <RotateCw className="size-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={() => window.location.href = "/"}
                className="h-8 px-3 gap-1.5 flex-initial cursor-pointer font-bold transition-all flex items-center justify-center select-none text-xs border-0 bg-slate-100/60 hover:bg-slate-200/60 border-slate-300/40 text-slate-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-500 shadow-3xs active:scale-[0.98] rotate-[-0.3deg] rounded-md"
              >
                <Home className="size-3.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
