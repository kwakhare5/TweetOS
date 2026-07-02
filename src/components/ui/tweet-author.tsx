import { VerifiedBadgeIcon } from "@/components/icons"

interface TweetAuthorProps {
  name: string
  handle: string
  avatarUrl?: string
  /** If true, name and handle get cursor-pointer (interactive composer). Default false. */
  interactive?: boolean
}

/**
 * Shared tweet author row: avatar + display name + verified badge + @handle.
 * Used by TweetComposer and RecentTweets.
 */
export function TweetAuthor({ name, handle, avatarUrl, interactive = false }: TweetAuthorProps) {
  const avatarLetter = name ? name.charAt(0).toUpperCase() : "K"
  const cursor = interactive ? "cursor-pointer" : ""

  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 h-12 w-12 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center font-bold text-stone-500 text-sm select-none">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={`${name} avatar`} width={48} height={48} className="h-full w-full object-cover" />
        ) : (
          avatarLetter
        )}
      </div>
      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-x-1 leading-tight">
          <span className={`text-foreground font-bold text-[15px] truncate ${cursor}`}>
            {name || "Karan"}
          </span>
          <VerifiedBadgeIcon className="inline size-4 text-blue-500 shrink-0" />
        </div>
        <span className={`text-muted-foreground text-sm font-sans truncate ${cursor}`}>
          @{handle || "kwakhare5"}
        </span>
      </div>
    </div>
  )
}
