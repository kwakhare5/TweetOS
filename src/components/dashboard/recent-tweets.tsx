import { TweetActionFooter } from "@/components/ui/tweet-action-footer"
import { XLogoIcon } from "@/components/icons"
import { TweetAuthor } from "@/components/ui/tweet-author"
import { UserProfile } from "@/types"

interface RecentTweetsProps {
  profile: UserProfile
}

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
]

export function RecentTweets({ profile }: RecentTweetsProps) {
  return (
    <div className="mt-4 md:mt-6 space-y-6 max-w-7xl mx-auto w-full border-t border-border/40 pt-4 md:pt-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Recent X Posts</h2>
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 border border-dashed border-border/60 rounded select-none">
          Sample
        </span>
      </div>
      <p className="text-sm text-muted-foreground">Your recent outputs published to the feed.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-8">
        {MOCK_TWEETS.map((tweet) => (
          <div
            key={tweet.id}
            className="relative flex h-full w-full max-w-lg flex-col gap-4 rounded-xl border border-border p-5 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex-1 flex flex-col gap-4">
              {/* Tweet header */}
              <div className="flex flex-row items-center justify-between">
                <TweetAuthor
                  name={profile.name}
                  handle={profile.twitterHandle}
                  avatarUrl={profile.avatarUrl}
                />
                <div className="self-start mt-1">
                  <XLogoIcon className="text-muted-foreground size-5" />
                </div>
              </div>

              {/* Tweet body */}
              <p className="text-[15px] text-foreground leading-normal font-normal whitespace-pre-wrap">
                {tweet.content}
              </p>
            </div>

            <TweetActionFooter
              replies={tweet.replies}
              retweets={tweet.retweets}
              likes={tweet.likes}
              views={tweet.views}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
