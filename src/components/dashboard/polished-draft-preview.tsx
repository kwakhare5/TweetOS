import { Sparkles, Send } from "lucide-react"
import { MacOsWindowDots } from "@/components/ui/mac-window-dots"
import { CopyButton } from "@/components/ui/copy-button"
import { FieldLabel } from "@/components/ui/field-label"
import { Button } from "@/components/ui/button"

interface PolishedDraftPreviewProps {
  polishedDraft: string
  hooks: string[]
  factCheck: string
  activeStyle: "dev" | "personal" | "shitpost" | "auto"
  isPolishing: boolean
  copiedPolishedDraft: boolean
  copiedGrok: boolean
  handlePolish: (style: "dev" | "personal" | "shitpost" | "auto") => void
  handleCopyPolishedDraft: () => void
  handleCopyGrok: () => void
}

export function PolishedDraftPreview({
  polishedDraft,
  hooks,
  factCheck,
  activeStyle,
  isPolishing,
  copiedPolishedDraft,
  copiedGrok,
  handlePolish,
  handleCopyPolishedDraft,
  handleCopyGrok,
}: PolishedDraftPreviewProps) {
  if (!polishedDraft) return null

  return (
    <div className="relative border border-border bg-card text-card-foreground shadow-sm rounded-xl p-5 pt-8 space-y-4">
      {/* macOS traffic light dots */}
      <div className="absolute top-3.5 left-4">
        <MacOsWindowDots size="sm" />
      </div>

      {/* Header: label + tone pills + char count */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <FieldLabel icon={Sparkles}>Polished Draft</FieldLabel>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tone style pill selector */}
            <div className="flex items-center gap-1 bg-muted/80 px-1 py-0.5 rounded border border-border/50 select-none">
              {(["auto", "dev", "shitpost", "personal"] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={activeStyle === t ? "outline" : "ghost"}
                  size="sm"
                  aria-label={`Select ${t} style`}
                  onClick={() => handlePolish(t)}
                  disabled={isPolishing}
                  className={`h-6 px-2 text-xs font-bold transition-all ${
                    activeStyle === t
                      ? "bg-sticky-200 text-yellow-950 border-yellow-300/40 shadow-sm hover:bg-sticky-200 hover:text-yellow-950"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {t === "auto" ? "Auto" : t.toUpperCase()}
                </Button>
              ))}
            </div>

            <span className={`text-xs font-semibold tabular-nums ${polishedDraft.length > 280 ? "text-twitter-red" : "text-muted-foreground"}`}>
              {polishedDraft.length} / 280
            </span>
          </div>
        </div>

        {/* Draft body — select-all on click */}
        <div
          className="p-4 rounded-lg border border-border bg-muted/30 text-foreground font-normal text-sm leading-relaxed whitespace-pre-wrap select-all cursor-text"
          title="Click to select all"
          role="textbox"
          aria-label="Polished draft — click to select all"
          aria-readonly="true"
        >
          {polishedDraft}
        </div>
      </div>

      {/* Fact-check warning */}
      {factCheck && (
        <div className="p-3 rounded-md border border-amber-200 bg-amber-50/40 text-amber-900 text-xs">
          {factCheck}
        </div>
      )}

      {/* Hook alternatives — notebook style */}
      {hooks.length > 0 && (
        <div className="relative bg-sticky-draft border border-amber-200/40 rounded-lg p-4 shadow-sm overflow-hidden rotate-[-0.5deg]">
          {/* Red vertical margin line */}
          <div className="absolute top-0 bottom-0 left-8 w-px bg-red-200" />

          <div className="text-xs font-bold text-amber-800 uppercase tracking-widest pl-6 pb-2 border-b border-dashed border-border/40 select-none">
            Alternative Hooks
          </div>

          <ul className="space-y-0.5 text-xs text-foreground pl-6 pt-2 font-handwriting">
            {hooks.map((h, idx) => (
              <li key={idx} className="py-1 border-b border-dashed border-border/40 leading-relaxed list-none flex items-start gap-1.5">
                <span className="font-bold text-amber-700/80 text-xs select-none shrink-0">{String.fromCharCode(65 + idx)})</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copy action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <CopyButton
          copied={copiedPolishedDraft}
          onClick={handleCopyPolishedDraft}
          size="sm"
          className="bg-stone-100/60 hover:bg-stone-200/60 rotate-[-0.3deg] rounded-t-lg"
        >
          Copy Draft
        </CopyButton>

        <CopyButton
          copied={copiedGrok}
          onClick={handleCopyGrok}
          size="sm"
          icon={<Send className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
          className="bg-amber-100/60 border-amber-300/30 text-amber-950 hover:bg-amber-200/60 rotate-[0.3deg] rounded-t-lg"
        >
          Copy Grok Packet
        </CopyButton>
      </div>
    </div>
  )
}
