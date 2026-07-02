import { TweetActionFooter } from "@/components/ui/tweet-action-footer"
import { XLogoIcon } from "@/components/icons"
import { TweetAuthor } from "@/components/ui/tweet-author"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Compass,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  Check
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfile } from "@/types"
import { useState } from "react"

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
  copiedTrending: boolean
  copiedEngagement: boolean
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
  handlePolish,
  copiedTrending,
  copiedEngagement
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


  return (
    <div className="relative flex h-full w-full flex-col gap-4 rounded-xl border border-border p-5 bg-card text-card-foreground shadow-sm">

      <div className="flex-1 flex flex-col gap-4">
        {/* Tweet author header */}
        <div className="flex flex-row items-center justify-between">
          <TweetAuthor
            name={profile.name}
            handle={profile.twitterHandle}
            avatarUrl={profile.avatarUrl}
            interactive
          />
          <div className="self-start mt-1">
            <XLogoIcon className="text-brand-black size-5" />
          </div>
        </div>

        {/* Draft textarea + action bar */}
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            id="raw-tweet"
            aria-label="Raw Tweet Draft"
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder="What's happening? Dump raw thoughts or rough drafts…"
            className="w-full bg-transparent border-0 outline-hidden rounded px-0 py-1 resize-none text-sm text-foreground placeholder:text-muted-foreground leading-normal flex-1 font-normal min-h-36"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/40 pt-2 mb-1">
            {/* Character counter */}
            <span className={`text-xs tracking-wide select-none ${brainDump.length > 280 ? "text-twitter-red" : "text-foreground/60"}`}>
              {brainDump.length} / 280
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-2 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button
                    variant="outline"
                    disabled={isGeneratingIdea || isPolishing}
                    size="sm"
                    className="font-semibold"
                  >
                    {isGeneratingIdea && activeBrainstormAction === "idea" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    ) : activeBrainstormAction === "idea" ? (
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : activeBrainstormAction === "trending" ? (
                      <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span>
                      {activeBrainstormAction === "idea" ? "Generate Idea" :
                      activeBrainstormAction === "trending" ? "Topic Hunt" :
                      "Engage Hunt"}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                  </Button>
                } />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveBrainstormAction("idea")
                      handleGenerateIdea()
                    }}
                    disabled={isGeneratingIdea || isPolishing}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate Idea
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => { if (copiedTrending) e.preventDefault() }}
                    onClick={(e) => {
                      if (copiedTrending) { e.preventDefault(); return }
                      setActiveBrainstormAction("trending")
                      handleCopyTrending()
                    }}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    {copiedTrending
                      ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                      : <Compass className="h-3.5 w-3.5" />}
                    {copiedTrending ? "Copied!" : "Topic Hunt"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => { if (copiedEngagement) e.preventDefault() }}
                    onClick={(e) => {
                      if (copiedEngagement) { e.preventDefault(); return }
                      setActiveBrainstormAction("engagement")
                      handleCopyEngagement()
                    }}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    {copiedEngagement
                      ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                      : <MessageSquare className="h-3.5 w-3.5" />}
                    {copiedEngagement ? "Copied!" : "Engage Hunt"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => handlePolish("auto")}
                disabled={isPolishing || isGeneratingIdea}
                size="sm"
                className="font-semibold"
              >
                {isPolishing ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Polish
                  </>
                )}
              </Button>
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
      />
    </div>
  )
}
