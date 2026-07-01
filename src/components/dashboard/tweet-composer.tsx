import { TweetActionFooter } from "@/components/ui/tweet-action-footer"
import { Button } from "@/components/ui/button"
import { 
 Sparkles, 
 Compass,
 MessageSquare,
 ChevronDown,
 RefreshCw
} from "lucide-react"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfile } from "@/types"
import { useState } from "react"

const XLogoIcon = ({ className }: { className?: string }) => (
 <svg viewBox="0 0 24 24" className={className} width="1em" height="1em" fill="currentColor" aria-hidden="true">
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
 </svg>
)

const VerifiedBadgeIcon = ({ className }: { className?: string }) => (
 <svg aria-label="Verified Account" viewBox="0 0 24 24" className={className}>
 <g fill="currentColor">
 <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
 </g>
 </svg>
)

interface TweetComposerProps {
 profile: UserProfile
 brainDump: string
 setBrainDump: (v: string) => void
 isPolishing: boolean
 isGeneratingIdea: boolean
 activeBrainstormAction: "idea" | "trending" | "engagement"
 setActiveBrainstormAction: (v: "idea" | "trending" | "engagement") => void
 handleGenerateIdea: () => void
 handleCopyTrending: () => void
 handleCopyEngagement: () => void
 handlePolish: (style: "auto") => void
}

export function TweetComposer({
 profile,
 brainDump,
 setBrainDump,
 isPolishing,
 isGeneratingIdea,
 activeBrainstormAction,
 setActiveBrainstormAction,
 handleGenerateIdea,
 handleCopyTrending,
 handleCopyEngagement,
 handlePolish
}: TweetComposerProps) {
 const [likes, setLikes] = useState(12)
 const [retweets, setRetweets] = useState(3)
 const [hasLiked, setHasLiked] = useState(false)
 const [hasRetweeted, setHasRetweeted] = useState(false)

 const toggleLike = () => {
 if (hasLiked) {
 setLikes(likes - 1)
 setHasLiked(false)
 } else {
 setLikes(likes + 1)
 setHasLiked(true)
 }
 }

 const toggleRetweet = () => {
 if (hasRetweeted) {
 setRetweets(retweets - 1)
 setHasRetweeted(false)
 } else {
 setRetweets(retweets + 1)
 setHasRetweeted(true)
 }
 }

 const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "K"

 return (
 <div className="relative flex h-full w-full flex-col gap-4 rounded-xl border p-5 bg-card text-card-foreground shadow-sm ">
 
 <div className="flex-1 flex flex-col gap-4">
 <div className="flex flex-row items-center justify-between tracking-normal">
 <div className="flex items-center space-x-3">
 <div className="shrink-0 h-12 w-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-500 text-sm select-none">
 {profile.avatarUrl ? (
 // eslint-disable-next-line @next/next/no-img-element
 <img src={profile.avatarUrl} alt="Avatar" width={48} height={48} className="h-full w-full object-cover" />
 ) : (
 avatarLetter
 )}
 </div>
 <div className="flex flex-col min-w-0 justify-center">
 <div className="flex items-center gap-x-1 leading-tight">
 <span className="text-foreground font-bold text-[15px] truncate cursor-pointer">
 {profile.name || "Karan"}
 </span>
 <VerifiedBadgeIcon className="inline size-4 text-[#1d9bf0] shrink-0" />
 </div>
 <span className="text-muted-foreground text-[15px] truncate cursor-pointer">
 @{profile.twitterHandle || "kwakhare5"}
 </span>
 </div>
 </div>
 <div className="self-start mt-1">
 <XLogoIcon className="text-muted-foreground size-5" />
 </div>
 </div>

 <div className="flex-1 flex flex-col gap-2">
 <textarea 
 id="raw-tweet"
 aria-label="Raw Tweet Draft"
 value={brainDump}
 onChange={(e) => setBrainDump(e.target.value)}
 placeholder="What's happening? Dump raw thoughts or rough drafts…"
 className="w-full bg-transparent border-0 outline-hidden rounded px-0 py-1 resize-none text-[15px] text-foreground placeholder:text-muted-foreground leading-normal flex-1 font-normal min-h-[140px]"
 />
 
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/50 pt-2 mb-1">
 <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
 <span className={`text-[13px] ${brainDump.length > 280 ? "text-[#f4212e]" : "text-[#1d9bf0]"} tracking-wide select-none`}>
 {brainDump.length} / 280
 </span>
 </div>
 <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
 <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
 <DropdownMenu>
 <DropdownMenuTrigger render={
 <Button 
 disabled={isGeneratingIdea || isPolishing}
 size="sm"
 className="h-8 px-3 gap-1 flex-initial cursor-pointer font-bold flex items-center justify-center select-none text-xs outline-hidden border border-slate-200 rounded-lg bg-white text-slate-700 shadow-sm"
 >
 {isGeneratingIdea && activeBrainstormAction === "idea" ? (
 <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin text-slate-500" />
 ) : activeBrainstormAction === "idea" ? (
 <Sparkles className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
 ) : activeBrainstormAction === "trending" ? (
 <Compass className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
 ) : (
 <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
 )}
 <span>
 {activeBrainstormAction === "idea" ? "Generate Idea" :
 activeBrainstormAction === "trending" ? "Topic Hunt" :
 "Engage Hunt"}
 </span>
 <ChevronDown className="h-3 w-3 text-slate-400 ml-1.5" />
 </Button>
 } />
 <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 rounded-lg shadow-md p-1 font-sans z-50">
 <DropdownMenuItem 
 onClick={() => {
 setActiveBrainstormAction("idea")
 handleGenerateIdea()
 }}
 disabled={isGeneratingIdea || isPolishing}
 className="text-xs font-semibold px-2.5 py-2 cursor-pointer flex items-center gap-2 rounded-md text-slate-700 "
 >
 <Sparkles className="h-3.5 w-3.5 text-slate-500" />
 Generate Idea
 </DropdownMenuItem>
 <DropdownMenuItem 
 onClick={() => {
 setActiveBrainstormAction("trending")
 handleCopyTrending()
 }}
 className="text-xs font-semibold px-2.5 py-2 cursor-pointer flex items-center gap-2 rounded-md text-slate-700 "
 >
 <Compass className="h-3.5 w-3.5 text-slate-500" />
 Topic Hunt
 </DropdownMenuItem>
 <DropdownMenuItem 
 onClick={() => {
 setActiveBrainstormAction("engagement")
 handleCopyEngagement()
 }}
 className="text-xs font-semibold px-2.5 py-2 cursor-pointer flex items-center gap-2 rounded-md text-slate-700 "
 >
 <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
 Engage Hunt
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 <Button 
 onClick={() => handlePolish("auto")} 
 disabled={isPolishing || isGeneratingIdea}
 size="sm"
 className="h-8 flex-initial px-4 gap-1 cursor-pointer font-bold flex items-center justify-center select-none text-[14px] border-0 rounded-lg bg-[#1d9bf0] ] text-white shadow-none"
 >
 {isPolishing ? (
 <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
 ) : (
 <>
 <Sparkles className="h-3.5 w-3.5 mr-1 text-white" />
 Polish
 </>
 )}
 </Button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <TweetActionFooter 
 replies={0}
 retweets={retweets}
 likes={likes}
 views="1.4K"
 hasLiked={hasLiked}
 hasRetweeted={hasRetweeted}
 onLike={toggleLike}
 onRetweet={toggleRetweet}
 className="mt-0"
 />
 </div>
 )
}
