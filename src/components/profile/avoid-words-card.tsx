import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tag } from "lucide-react"


interface AvoidWordsCardProps {
 avoidListString: string
 setAvoidListString: (v: string) => void
}

export function AvoidWordsCard({ avoidListString, setAvoidListString }: AvoidWordsCardProps) {
 return (
 <div className="flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm">

 <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
 <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
 <Tag className="h-5 w-5" />
 </div>
 <div className="flex flex-col">
 <h3 className="text-base font-bold text-slate-900 leading-tight">Avoid Words List</h3>
 <span className="text-xs text-slate-400">Words to eliminate generic AI copywriting jargon.</span>
 </div>
 </div>

 <div className="space-y-4">
 <div className="space-y-1.5">
 <Label htmlFor="avoid" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avoid Words (comma-separated)</Label>
 <Textarea 
 id="avoid" 
 value={avoidListString} 
 onChange={(e) => setAvoidListString(e.target.value)} 
 placeholder="e.g. delve, supercharge, unlock, testament, paradigm shift, revolutionary"
 className="bg-background/50 min-h-[70px] text-sm resize-none"
 />
 </div>

 {/* Tactile Avoid Tags */}
 <div className="flex flex-wrap gap-1.5 pt-1">
 {avoidListString.split(",")
 .map(word => word.trim())
 .filter(word => word.length > 0)
 .map((word, idx) => (
 <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 border border-slate-200 text-slate-700 select-none shadow-3xs ">
 <span>{word}</span>
 <button 
 type="button"
 aria-label={`Remove word ${word}`}
 onClick={() => {
 const words = avoidListString.split(",").map(w => w.trim());
 const filtered = words.filter((_, i) => i !== idx);
 setAvoidListString(filtered.join(", "));
 }}
 className=" text-slate-400 font-bold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer size-4 inline-flex items-center justify-center rounded-full "
 >
 ×
 </button>
 </span>
 ))
 }
 </div>
 </div>
 </div>
 )
}

