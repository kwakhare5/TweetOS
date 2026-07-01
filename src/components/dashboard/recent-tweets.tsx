import { TweetActionFooter } from "@/components/ui/tweet-action-footer"
import { UserProfile } from "@/types"

interface RecentTweetsProps {
 profile: UserProfile
}

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

const MOCK_TWEETS = [
 {
 id: "1",
 content: "spent 4 hours debugging a typescript configuration only to realize i misspelled a package in tsconfig.json.\n\nreal software engineering is just suffering in typescript.",
 timestamp: "Mar 14",
 likes: 42,
 retweets: 8,
 replies: 3,
 views: "1.2K"
 },
 {
 id: "2",
 content: "everyone's talking about multi-agent systems and custom cognitive architectures while i'm just trying to make my docker container build in under 10 minutes.\n\nkeep it simple.",
 timestamp: "Mar 12",
 likes: 89,
 retweets: 14,
 replies: 5,
 views: "3.4K"
 },
 {
 id: "3",
 content: "vibe coding is fun until you have to push to production and you realize your local state isn't synced to anything.\n\nback to writing git commits manually.",
 timestamp: "Mar 11",
 likes: 124,
 retweets: 22,
 replies: 11,
 views: "5.1K"
 },
 {
 id: "4",
 content: "my second brain is just a folder of unorganized notes and half-baked hooks.\n\nif it works, it works.",
 timestamp: "Mar 8",
 likes: 56,
 retweets: 4,
 replies: 2,
 views: "980"
 }
]

export function RecentTweets({ profile }: RecentTweetsProps) {
 const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "K"

 return (
 <div className="mt-4 md:mt-6 space-y-6 max-w-7xl mx-auto w-full border-t border-slate-200/50 pt-4 md:pt-6 select-none">
 <div>
 <h2 className="text-xl font-bold tracking-tight text-slate-950">Recent X Posts</h2>
 <p className="text-sm text-slate-500">Your recent outputs published to the feed.</p>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-8">
 {MOCK_TWEETS.slice(0, 3).map((tweet) => (
 <div 
 key={tweet.id} 
 className="relative flex h-full w-full max-w-lg flex-col gap-4 overflow-hidden rounded-xl border p-5 bg-card text-card-foreground shadow-sm cursor-pointer "
 >
 <div className="flex-1 flex flex-col gap-4">
 {/* Tweet Header */}
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
 <span className="text-foreground font-bold text-[15px] truncate">
 {profile.name || "Karan"}
 </span>
 <VerifiedBadgeIcon className="inline size-4 text-[#1d9bf0] shrink-0" />
 </div>
 <span className="text-muted-foreground text-[15px] truncate">
 @{profile.twitterHandle || "kwakhare5"}
 </span>
 </div>
 </div>
 <div className="self-start mt-1">
 <XLogoIcon className="text-muted-foreground size-5" />
 </div>
 </div>

 {/* Tweet Content */}
 <div className="text-[15px] text-foreground leading-normal font-normal whitespace-pre-wrap">
 {tweet.content}
 </div>
 </div>

 {/* Tweet Stats Footer */}
 <TweetActionFooter 
 replies={tweet.replies}
 retweets={tweet.retweets}
 likes={tweet.likes}
 views={tweet.views}
 className="mt-0"
 />
 </div>
 ))}
 </div>
 </div>
 )
}
