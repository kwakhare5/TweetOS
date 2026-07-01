import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Network } from "lucide-react"


export function GuardrailsCard() {
 return (
 <div className="flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm">
 <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
 <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
 <Network className="h-5 w-5" />
 </div>
 <div className="flex flex-col">
 <h3 className="text-base font-bold text-slate-900 leading-tight">System Guardrails</h3>
 <span className="text-xs text-slate-400">Configure automated checks running on local builds.</span>
 </div>
 </div>

 <div className="space-y-3">
 <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-slate-100 bg-muted/30">
 <div className="space-y-0.5">
 <Label className="cursor-pointer text-sm font-semibold text-slate-800">Auto-Score Drafts</Label>
 <p className="text-xs text-slate-400 leading-normal">Evaluate generated drafts automatically against your DNA profile.</p>
 </div>
 <Switch defaultChecked />
 </div>
 <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-slate-100 bg-muted/30">
 <div className="space-y-0.5">
 <Label className="cursor-pointer text-sm font-semibold text-slate-800">Strict Tone Guard</Label>
 <p className="text-xs text-slate-400 leading-normal">Reject any AI generation that breaches your Lexicon Filters.</p>
 </div>
 <Switch defaultChecked />
 </div>
 </div>
 </div>
 )
}

