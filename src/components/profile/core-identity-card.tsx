import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UserCircle } from "lucide-react"


interface CoreIdentityCardProps {
 name: string
 setName: (v: string) => void
 twitterHandle: string
 setTwitterHandle: (v: string) => void
 niche: string
 setNiche: (v: string) => void
}

export function CoreIdentityCard({
 name, setName,
 twitterHandle, setTwitterHandle,
 niche, setNiche
}: CoreIdentityCardProps) {
 return (
 <div className="flex flex-col border border-slate-200/60 rounded-xl p-5 bg-card text-card-foreground shadow-sm">
 
 <div className="flex flex-row items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
 <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
 <UserCircle className="h-5 w-5" />
 </div>
 <div className="flex flex-col">
 <h3 className="text-base font-bold text-slate-900 leading-tight">Core Identity</h3>
 <span className="text-xs text-slate-400">Foundational elements of your digital persona.</span>
 </div>
 </div>

 <div className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</Label>
 <Input 
 id="name" 
 value={name} 
 onChange={(e) => setName(e.target.value)} 
 placeholder="e.g. Karan"
 className="bg-background/50 h-9"
 />
 </div>
 <div className="space-y-1.5">
 <Label htmlFor="handle" className="text-xs font-bold text-slate-500 uppercase tracking-wider">X Handle</Label>
 <div className="relative">
 <span className="absolute left-3 top-2 text-slate-400 text-sm select-none font-semibold">@</span>
 <Input 
 id="handle" 
 value={twitterHandle} 
 onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))} 
 placeholder="kwakhare5"
 className="pl-8 bg-background/50 h-9"
 />
 </div>
 </div>
 </div>
 <div className="space-y-1.5">
 <Label htmlFor="niche" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Niche & Focus Areas</Label>
 <Input 
 id="niche" 
 value={niche} 
 onChange={(e) => setNiche(e.target.value)} 
 placeholder="e.g. low-level systems, code aesthetics, sarcastic student takes"
 className="bg-background/50 h-9"
 />
 </div>
 </div>
 </div>
 )
}

