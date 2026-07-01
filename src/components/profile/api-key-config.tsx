import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Terminal } from "lucide-react"

interface ApiKeyConfigProps {
  geminiApiKey: string
  setGeminiApiKey: (v: string) => void
}

export function ApiKeyConfig({ geminiApiKey, setGeminiApiKey }: ApiKeyConfigProps) {
  return (
    <div className="relative flex flex-col bg-slate-950 border border-slate-900 text-slate-100 rounded-xl p-5 shadow-xl font-mono sm:rotate-[-0.2deg] rotate-0 ">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 select-none">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">gemini-api-console</span>
        <Terminal className="h-3.5 w-3.5 text-slate-600" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apikey" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <span className="text-emerald-500 font-bold">$</span> API Authorization
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-emerald-500/80 text-sm select-none font-bold">&gt;_</span>
            <Input 
              id="apikey" 
              type="password"
              value={geminiApiKey} 
              onChange={(e) => setGeminiApiKey(e.target.value)} 
              placeholder="AIzaSy…"
              className="pl-9 bg-slate-900 border-slate-800 text-emerald-400 font-mono text-sm placeholder:text-slate-700 focus-visible:border-slate-700 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-slate-800 hover:border-slate-800 h-9"
            />
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1 select-none flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Processed locally. State stored strictly in device storage.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

