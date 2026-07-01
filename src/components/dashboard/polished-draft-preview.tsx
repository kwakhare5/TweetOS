import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, Copy, Send } from "lucide-react"

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
 handleCopyGrok
}: PolishedDraftPreviewProps) {
 if (!polishedDraft) return null

 return (
 <div className="border border-border bg-card text-card-foreground shadow-sm rounded-xl p-5 space-y-4 relative pt-8">
 {/* macOS traffic light window dots */}
 <div className="absolute top-3.5 left-4 flex items-center space-x-1.5 select-none">
 <div className="size-2 rounded-full bg-red-400/90 border border-red-500/10" />
 <div className="size-2 rounded-full bg-amber-400/90 border border-amber-500/10" />
 <div className="size-2 rounded-full bg-green-400/90 border border-green-500/10" />
 </div>

 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
 <Sparkles className="h-4 w-4 text-amber-500" />
 Polished Draft
 </Label>
 <div className="flex items-center gap-3">
 {/* Inline Tone override tag pills */}
 <div className="flex items-center gap-1 bg-slate-100/80 px-1 py-0.5 rounded border border-slate-200/50 select-none">
 {(["auto", "dev", "shitpost", "personal"] as const).map((t) => (
 <button
 key={t}
 type="button"
 aria-label={`Select ${t} style`}
 onClick={() => handlePolish(t)}
 disabled={isPolishing}
 className={`text-xs font-bold px-2 py-0.5 rounded cursor-pointer border-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-800 ${
 activeStyle === t
 ? "bg-slate-950 text-white"
 : "text-slate-500 "
 }`}
 >
 {t === "auto" ? "Auto" : t.toUpperCase()}
 </button>
 ))}
 </div>
 <span className={`text-xs font-semibold ${polishedDraft.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
 {polishedDraft.length} / 280 chars
 </span>
 </div>
 </div>
 <div className="p-4 rounded-lg border border-border bg-slate-50/50 text-slate-900 font-normal leading-relaxed whitespace-pre-wrap select-all">
 {polishedDraft}
 </div>
 </div>

 {/* Fact-check Warning if present */}
 {factCheck && (
 <div className="p-3 rounded-md border border-orange-200 bg-orange-50/40 text-orange-800 text-xs font-normal">
 {factCheck}
 </div>
 )}

 {/* Hook variations if present */}
 {hooks.length > 0 && (
 <div className="relative bg-[#FCFAF2] border border-amber-200/40 rounded-lg p-4 shadow-3xs overflow-hidden select-text rotate-[-0.5deg]">
 {/* Red vertical margin line on the left */}
 <div className="absolute top-0 bottom-0 left-8 w-[1px] bg-red-200" />
 
 {/* Notebook header */}
 <div className="text-[10px] font-bold text-amber-800 uppercase tracking-widest pl-6 pb-2 border-b border-dashed border-slate-200/60 select-none">
 Alternative Hooks
 </div>
 
 {/* Lined content list */}
 <ul className="space-y-0.5 text-xs text-slate-800 pl-6 pt-2 font-handwriting">
 {hooks.map((h, idx) => (
 <li key={idx} className="py-1 border-b border-dashed border-slate-200/40 leading-relaxed list-none flex items-start gap-1.5">
 <span className="font-bold text-amber-700/80 text-[11px] select-none shrink-0">{String.fromCharCode(65 + idx)})</span>
 <span>{h}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Copy Actions styled in a subtle premium theme */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
 <Button 
 variant="outline" 
 onClick={handleCopyPolishedDraft}
 className="h-8 px-3 gap-1 flex-initial cursor-pointer font-semibold flex items-center justify-center select-none text-xs bg-slate-100/60 border border-slate-300/40 text-slate-800 shadow-3xs rotate-[-0.3deg] rounded-t-lg"
 >
 {copiedPolishedDraft ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2 text-slate-500" />}
 Copy Draft Only
 </Button>
 <Button 
 variant="outline" 
 onClick={handleCopyGrok}
 className="h-8 px-3 gap-1 flex-initial cursor-pointer font-semibold flex items-center justify-center select-none text-xs bg-amber-200/60 border border-amber-300/30 text-amber-950 shadow-3xs rotate-[0.3deg] rounded-t-lg"
 >
 {copiedGrok ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Send className="h-4 w-4 mr-2 text-amber-500" />}
 Copy Grok Packet
 </Button>
 </div>
 </div>
 )
}

