"use client"

import { AlertOctagon, RotateCw, Home } from "lucide-react"
import { Paperclip } from "@/components/ui/paperclip"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 font-sans antialiased paper-texture">
      <div className="relative max-w-md w-full sm:rotate-[-0.5deg] rotate-0 mt-8">
        <Paperclip className="absolute top-[-16px] left-[35%] z-20 select-none pointer-events-none rotate-[-10deg]" />

        {/* Fault badge */}
        <div
          className="absolute top-[-12px] right-[10%] z-20 px-6 py-1 text-[10px] font-bold tracking-widest text-red-950 uppercase select-none rotate-[2.5deg] rounded-sm border border-dashed border-red-300/25"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", fontFamily: "var(--font-mono)" }}
        >
          SYSTEM FAULT
        </div>

        {/* Folder tab */}
        <div className="flex select-none">
          <div className="bg-card border border-border border-b-0 px-4 py-1.5 rounded-t-lg text-[10px] font-bold text-red-600 uppercase tracking-wider translate-y-[1px] z-10 flex items-center gap-1.5 shadow-sm">
            <AlertOctagon className="size-3.5" />
            <span>Process Error</span>
          </div>
        </div>

        {/* Card body */}
        <div className="bg-card text-card-foreground border border-border rounded-b-xl rounded-tr-xl shadow-sm p-6 relative flex flex-col z-0 space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground leading-tight">
              An unexpected interruption occurred.
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              The active subroutine encountered an unhandled stack error.
            </p>
          </div>

          {/* Error message */}
          <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-lg font-mono text-[11px] text-red-700/90 whitespace-pre-wrap break-all leading-normal select-all">
            {error.message || "Unknown execution exception."}
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={reset}
              className="btn-edit-active rotate-[0.3deg]"
            >
              <RotateCw className="size-3.5" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => { window.location.href = "/" }}
              className="rotate-[-0.3deg]"
            >
              <Home className="size-3.5" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
