import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Paperclip } from "@/components/ui/paperclip"
import { MacOsWindowDots } from "@/components/ui/mac-window-dots"
import { Textarea } from "@/components/ui/textarea"

// Ruled-paper line texture — matches second-brain-note exactly
const RULED_PAPER_STYLE: React.CSSProperties = {
  backgroundImage: "linear-gradient(to bottom, transparent 25px, rgba(202,138,4,0.12) 25px)",
  backgroundSize: "100% 26px",
}

interface VoiceProfileCardProps {
  inspirationsContext: string
  setInspirationsContext: (v: string) => void
}

export function VoiceProfileCard({ inspirationsContext, setInspirationsContext }: VoiceProfileCardProps) {
  const copyPrompt = () => {
    navigator.clipboard.writeText(`Analyze [CREATOR_HANDLE_HERE]'s Twitter account. I need you to extract their "Creator DNA Blueprint".\n\nDo NOT just describe what they talk about. I need their structural habits, psychological framing, and formatting habits. Extract the exact framework of how they think and structure a tweet so I can apply it to my own content.\n\nProvide the blueprint in this exact format:\n- The Hook Formula (How they grab attention)\n- The Body Structure (How they build the argument or story)\n- The Tone/Vibe (The emotional resonance)\n- The Secret Sauce (The 3 unwritten rules they follow to make their content hit)\n\nFormat the output cleanly so I can copy/paste it directly into my system as my "Inspirations Context".`)
    toast.success("Extraction prompt copied!")
  }

  return (
    <div className="relative flex flex-col border border-yellow-200 rounded-xl bg-sticky-100 text-yellow-950 shadow-[var(--shadow-sticky-warm)]">
      <Paperclip className="absolute top-[-16px] left-[24%] z-20 select-none pointer-events-none rotate-[-8deg]" />

      {/* Top bar — matches second-brain-note exactly */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-sticky-200/60 border-b border-yellow-200/60 rounded-t-xl select-none">
        <MacOsWindowDots />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">
          Voice Blueprint
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={copyPrompt}
          className="h-6 px-2 text-xs border-border bg-sticky-100/80 hover:bg-sticky-200 text-foreground font-semibold"
        >
          <Copy className="h-2.5 w-2.5 mr-1" />
          Prompt
        </Button>
      </div>

      {/* Writing area */}
      <div className="p-5 flex-1 flex flex-col">
        <Textarea
          id="inspiration"
          aria-label="Inspiration Context"
          value={inspirationsContext}
          onChange={(e) => setInspirationsContext(e.target.value)}
          placeholder="Paste tweet structures, copywriting hooks, formatting styles or blueprints from creators you admire to define your voice blueprint…"
          className="w-full bg-transparent border-0 outline-hidden focus:outline-hidden focus:ring-0 focus-visible:ring-0 focus-visible:outline-hidden resize-none flex-1 min-h-56 text-base font-normal text-foreground placeholder:text-muted-foreground placeholder:font-handwriting leading-relaxed font-handwriting px-1 py-0"
          style={RULED_PAPER_STYLE}
        />
      </div>
    </div>
  )
}
