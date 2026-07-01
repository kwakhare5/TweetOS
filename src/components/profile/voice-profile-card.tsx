import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit } from "lucide-react"

interface VoiceProfileCardProps {
  secondBrain: string
  setSecondBrain: (v: string) => void
  inspirationsContext: string
  setInspirationsContext: (v: string) => void
}

export function VoiceProfileCard({
  secondBrain, setSecondBrain,
  inspirationsContext, setInspirationsContext
}: VoiceProfileCardProps) {
  return (
    <div className="flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm">
      <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-900 leading-tight">Voice Profile</h3>
          <span className="text-xs text-slate-400">Define your persona, second brain context, and inspiration references.</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="brain" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Second Brain</span>
            <span className="text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">Live Context</span>
          </Label>
          <Textarea 
            id="brain"
            aria-label="Second Brain"
            value={secondBrain} 
            onChange={(e) => setSecondBrain(e.target.value)} 
            placeholder="Daily context dump… e.g. shipping local compilers, Pune weather sucks, debugging zustand hydration issues"
            className="bg-background/50 min-h-[90px] text-sm resize-none"
          />
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-4">
          <Label htmlFor="inspiration" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Inspiration Style Blueprint</span>
            <span className="text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">Reference Style</span>
          </Label>
          <Textarea 
            id="inspiration"
            aria-label="Inspiration Context"
            value={inspirationsContext} 
            onChange={(e) => setInspirationsContext(e.target.value)} 
            placeholder="Paste tweet structures, copywriting hooks, formatting styles or blueprints from creators you admire…"
            className="bg-background/50 min-h-[90px] text-sm resize-none"
          />
        </div>
      </div>
    </div>
  )
}
