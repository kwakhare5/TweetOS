import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Key } from "lucide-react"

interface ApiKeyConfigProps {
  geminiApiKey: string
  setGeminiApiKey: (v: string) => void
}

export function ApiKeyConfig({ geminiApiKey, setGeminiApiKey }: ApiKeyConfigProps) {
  return (
    <div className="flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm">
      <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Key className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-900 leading-tight">API Configuration</h3>
          <span className="text-xs text-slate-400">Configure your local API key credentials.</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="apikey" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gemini API Key</Label>
          <Input 
            id="apikey" 
            type="password"
            value={geminiApiKey} 
            onChange={(e) => setGeminiApiKey(e.target.value)} 
            placeholder="AIzaSy…"
            className="bg-background/50 h-9"
          />
          <p className="text-[11px] text-slate-400 leading-normal mt-1 select-none">
            Processed locally. State stored strictly in device storage.
          </p>
        </div>
      </div>
    </div>
  )
}
