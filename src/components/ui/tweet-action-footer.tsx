import * as React from "react"
import { cn } from "@/lib/utils"

export interface TweetActionFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  replies?: number | string
  retweets?: number | string
  likes?: number | string
  views?: number | string
  hasLiked?: boolean
  hasRetweeted?: boolean
  onReply?: () => void
  onRetweet?: () => void
  onLike?: () => void
  onShare?: () => void
}

// All SVGs are purely decorative — buttons carry the accessible label via aria-label.
const ActionIcon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={cn("w-[18.75px] h-[18.75px] fill-current", className)}
  >
    <g><path d={d} /></g>
  </svg>
)

export function TweetActionFooter({
  replies = 0,
  retweets = 0,
  likes = 0,
  views = 0,
  hasLiked = false,
  hasRetweeted = false,
  onReply,
  onRetweet,
  onLike,
  onShare,
  className,
  ...props
}: TweetActionFooterProps) {
  const base = "group flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 focus-visible:outline-hidden transition-colors"

  return (
    <div
      className={cn("flex justify-between items-center text-sm text-muted-foreground select-none w-full max-w-full", className)}
      {...props}
    >
      <div className="flex justify-between items-center w-full max-w-[85%] pr-2">

        {/* Reply */}
        <button type="button" onClick={onReply} aria-label="Reply" className={base}>
          <div className="p-2 -m-2 rounded-full group-hover:bg-sky-500/10 group-hover:text-sky-500 transition-colors">
            <ActionIcon d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.73 6.1 6.1 6.1h1.366v3.02l6.216-3.44c1.883-1.04 3.056-3.02 3.056-5.18 0-3.38-2.75-6.13-6.129-6.13H9.756z" />
          </div>
          {replies !== undefined && <span className="px-1">{replies}</span>}
        </button>

        {/* Retweet */}
        <button
          type="button"
          onClick={onRetweet}
          aria-label={hasRetweeted ? "Undo retweet" : "Retweet"}
          className={cn(base, hasRetweeted ? "text-twitter-green" : "")}
        >
          <div className="p-2 -m-2 rounded-full group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
            <ActionIcon d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
          </div>
          {retweets !== undefined && <span className="px-1">{retweets}</span>}
        </button>

        {/* Like */}
        <button
          type="button"
          onClick={onLike}
          aria-label={hasLiked ? "Unlike" : "Like"}
          className={cn(base, hasLiked ? "text-twitter-pink" : "")}
        >
          <div className="p-2 -m-2 rounded-full group-hover:bg-pink-500/10 group-hover:text-pink-500 transition-colors">
            <ActionIcon d={hasLiked
              ? "M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
              : "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"}
            />
          </div>
          {likes !== undefined && <span className="px-1">{likes}</span>}
        </button>

        {/* Views */}
        <button
          type="button"
          aria-label="View analytics"
          className={base}
        >
          <div className="p-2 -m-2 rounded-full group-hover:bg-sky-500/10 group-hover:text-sky-500 transition-colors">
            <ActionIcon d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
          </div>
          {views !== undefined && <span className="px-1">{views}</span>}
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Bookmark */}
        <button type="button" aria-label="Bookmark" className={base}>
          <div className="p-2 -m-2 rounded-full group-hover:bg-sky-500/10 group-hover:text-sky-500 transition-colors">
            <ActionIcon d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
          </div>
        </button>

        {/* Share */}
        <button type="button" onClick={onShare} aria-label="Share" className={base}>
          <div className="p-2 -m-2 rounded-full group-hover:bg-sky-500/10 group-hover:text-sky-500 transition-colors">
            <ActionIcon d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
          </div>
        </button>
      </div>
    </div>
  )
}
