import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit } from "lucide-react"
import { Paperclip } from "@/components/ui/paperclip"

interface NeuralContextCardProps {
  secondBrain: string
  setSecondBrain: (v: string) => void
  inspirationsContext: string
  setInspirationsContext: (v: string) => void
}

export function NeuralContextCard({
  secondBrain, setSecondBrain,
  inspirationsContext, setInspirationsContext
}: NeuralContextCardProps) {
  return (
    <div className="relative flex flex-col bg-[#FEF9C3] rounded-xl border border-yellow-200 shadow-[0_8px_30px_rgba(234,179,8,0.12)] sm:rotate-[0.3deg] rotate-0 transition-transform hover:rotate-0">
      {/* Paperclip overlay */}
      <Paperclip className="absolute top-[-16px] left-[85%] z-20 select-none pointer-events-none rotate-[10deg]" />

      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FEF08A]/60 border-b border-yellow-200/60 select-none rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400 border border-red-500/20 shadow-xs" />
          <div className="h-3 w-3 rounded-full bg-yellow-400 border border-yellow-500/20 shadow-xs" />
          <div className="h-3 w-3 rounded-full bg-green-400 border border-green-500/20 shadow-xs" />
        </div>
        <span className="text-[11px] font-bold text-yellow-800/80 uppercase tracking-wider font-mono">
          Neural Context
        </span>
        <BrainCircuit className="h-3.5 w-3.5 text-yellow-700/60" />
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="brain" className="text-xs font-bold text-yellow-800/80 uppercase tracking-wider flex items-center justify-between select-none">
            <span>Second Brain</span>
            <span className="text-[9px] font-semibold bg-yellow-400/30 px-1.5 py-0.5 rounded border border-yellow-400/20 text-yellow-900">Live Context</span>
          </Label>
          <Textarea 
            id="brain"
            aria-label="Second Brain"
            value={secondBrain} 
            onChange={(e) => setSecondBrain(e.target.value)} 
            placeholder="Daily context dump… e.g. shipping local compilers, Pune weather sucks, debugging zustand hydration issues"
            className="bg-transparent border-0 outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 rounded px-2 py-1 resize-none min-h-[110px] text-yellow-950/95 placeholder:text-yellow-600/50 leading-[28px] font-handwriting text-base"
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 27px, rgba(202,138,4,0.15) 27px)",
              backgroundSize: "100% 28px"
            }}
          />
        </div>

        <div className="space-y-1.5 border-t border-yellow-200/50 pt-4">
          <Label htmlFor="inspiration" className="text-xs font-bold text-yellow-800/80 uppercase tracking-wider flex items-center justify-between select-none">
            <span>Inspiration DNA Vectors</span>
            <span className="text-[9px] font-semibold bg-yellow-400/30 px-1.5 py-0.5 rounded border border-yellow-400/20 text-yellow-900">Reference Style</span>
          </Label>
          <Textarea 
            id="inspiration"
            aria-label="Inspiration Context"
            value={inspirationsContext} 
            onChange={(e) => setInspirationsContext(e.target.value)} 
            placeholder="Paste tweet structures, copywriting hooks, formatting styles or blueprints from creators you admire…"
            className="bg-transparent border-0 outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 rounded px-2 py-1 resize-none min-h-[110px] text-yellow-950/95 placeholder:text-yellow-600/50 leading-[28px] font-handwriting text-base"
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 27px, rgba(202,138,4,0.15) 27px)",
              backgroundSize: "100% 28px"
            }}
          />
        </div>
      </div>
    </div>
  )
}
