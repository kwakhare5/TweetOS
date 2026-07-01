import { useState, useEffect } from "react"
import { Paperclip } from "@/components/ui/paperclip"
import { RefreshCw, Check } from "lucide-react"

interface SecondBrainNoteProps {
  initialText: string
  onSave: (text: string) => void
}

export function SecondBrainNote({ initialText, onSave }: SecondBrainNoteProps) {
  const [secondBrainText, setSecondBrainText] = useState(initialText)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecondBrainText(initialText)
  }, [initialText])

  useEffect(() => {
    if (secondBrainText === initialText) return

    const timer = setTimeout(() => {
      onSave(secondBrainText)
      setSaveStatus("saved")
      
      const resetTimer = setTimeout(() => {
        setSaveStatus("idle")
      }, 1500)
      return () => clearTimeout(resetTimer)
    }, 800)

    return () => clearTimeout(timer)
  }, [secondBrainText, initialText, onSave])

  return (
    <div className="relative flex-1 flex flex-col bg-[#FEF9C3] rounded-xl border border-yellow-200 shadow-[0_8px_30px_rgba(234,179,8,0.12)]">
      {/* Paperclip overlay */}
      <Paperclip className="absolute top-[-16px] left-[10%] z-20 select-none pointer-events-none rotate-[-10deg]" />
      
      {/* macOS Sticky top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FEF08A]/60 border-b border-yellow-200/60 select-none rounded-t-xl">
        {/* macOS window dots */}
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-red-400 border border-red-500/20 shadow-sm hover:bg-red-500 transition-colors" />
          <div className="size-2.5 rounded-full bg-yellow-400 border border-yellow-500/20 shadow-sm hover:bg-yellow-500 transition-colors" />
          <div className="size-2.5 rounded-full bg-green-400 border border-green-500/20 shadow-sm hover:bg-green-500 transition-colors" />
        </div>
        <span className="text-xs font-bold text-yellow-800/80 uppercase tracking-wider font-mono">
          Sticky Notes
        </span>
        
        {/* Sync Status Badge */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-800/60 uppercase tracking-wider select-none">
          {saveStatus === "saving" && (
            <>
              <RefreshCw className="h-3 w-3 animate-spin text-yellow-700/70" />
              <span>Syncing…</span>
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
              <span>Synced</span>
            </>
          )}
        </div>
      </div>

      {/* Note writing area with yellow rule lining texture */}
      <div className="p-5 flex-1 flex flex-col">
        <textarea
          id="second-brain"
          aria-label="Second Brain Sticky Note"
          value={secondBrainText}
          onChange={(e) => { 
            setSecondBrainText(e.target.value)
            setSaveStatus("saving") 
          }}
          placeholder=""
          className="w-full bg-transparent border-0 outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 rounded px-2 py-1 resize-none flex-1 min-h-[240px] text-[17px] font-normal text-yellow-950/95 placeholder:text-yellow-600/50 leading-[28px] font-handwriting"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent 27px, rgba(202,138,4,0.15) 27px)",
            backgroundSize: "100% 28px"
          }}
        />
      </div>
    </div>
  )
}
