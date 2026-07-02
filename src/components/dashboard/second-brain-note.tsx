import { useState, useEffect, useRef } from "react"
import { Paperclip } from "@/components/ui/paperclip"
import { RefreshCw, Check } from "lucide-react"
import { MacOsWindowDots } from "@/components/ui/mac-window-dots"
import { Textarea } from "@/components/ui/textarea"

interface SecondBrainNoteProps {
  initialText: string
  onSave: (text: string) => void
}

// Ruled-paper line texture — shared with voice-profile-card for consistency
const RULED_PAPER_STYLE: React.CSSProperties = {
  backgroundImage: "linear-gradient(to bottom, transparent 25px, rgba(202,138,4,0.14) 25px)",
  backgroundSize: "100% 26px",
}

export function SecondBrainNote({ initialText, onSave }: SecondBrainNoteProps) {
  const [text, setText] = useState(initialText)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const isSeeded = useRef(false)

  useEffect(() => {
    if (!isSeeded.current) {
      setText(initialText)
      isSeeded.current = true
    }
  }, [initialText])

  useEffect(() => {
    if (!isSeeded.current || text === initialText) return

    setSaveStatus("saving")
    const timer = setTimeout(() => {
      onSave(text)
      setSaveStatus("saved")
      const resetTimer = setTimeout(() => setSaveStatus("idle"), 1500)
      return () => clearTimeout(resetTimer)
    }, 800)

    return () => clearTimeout(timer)
  // onSave is intentionally excluded — stable store callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div className="relative flex flex-col h-full bg-sticky-100 rounded-xl border border-yellow-200 shadow-[var(--shadow-sticky-warm)] flex-1 sm:rotate-[0.5deg] rotate-0">
      <Paperclip className="absolute top-[-16px] left-[24%] z-20 select-none pointer-events-none rotate-[-10deg]" />

      {/* Top bar — matches voice-profile-card exactly */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-sticky-200/60 border-b border-yellow-200/60 rounded-t-xl select-none">
        <MacOsWindowDots />
        <span className="text-xs font-bold text-yellow-800/80 uppercase tracking-widest font-mono">
          Sticky Notes
        </span>
        {/* Sync status — right-aligned to match Voice Blueprint's Prompt button position */}
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest select-none min-w-[60px] justify-end">
          {saveStatus === "saving" && (
            <>
              <RefreshCw className="h-3 w-3 animate-spin text-yellow-700/70" />
              <span className="text-yellow-800/60">Syncing</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-700/80">Saved</span>
            </>
          )}
          {saveStatus === "idle" && (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-600/40" />
              <span className="text-yellow-800/60">Synced</span>
            </>
          )}
        </div>
      </div>

      {/* Writing area */}
      <div className="p-5 flex-1 flex flex-col">
        <Textarea
          id="second-brain"
          aria-label="Second Brain Sticky Note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Dump links, ideas, raw thoughts, things to remember…"
          className="w-full bg-transparent border-0 outline-hidden focus:outline-hidden focus:ring-0 focus-visible:ring-0 focus-visible:outline-hidden rounded px-1 py-0 resize-none flex-1 min-h-60 text-base font-normal text-yellow-950/95 placeholder:text-yellow-600/40 placeholder:font-handwriting leading-relaxed font-handwriting"
          style={RULED_PAPER_STYLE}
        />
      </div>
    </div>
  )
}
