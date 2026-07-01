import * as React from "react"
import { MessageCircle, Repeat2, Heart, BarChart3, Share } from "lucide-react"
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
  return (
    <div 
      className={cn("flex justify-between items-center pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500 select-none max-w-md", className)}
      {...props}
    >
      <button 
        type="button"
        onClick={onReply}
        aria-label="Reply"
        className="flex items-center gap-1.5 hover:text-blue-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors cursor-pointer bg-transparent border-0 p-0 rounded-sm"
      >
        <MessageCircle className="h-4 w-4" />
        {replies !== undefined && <span>{replies}</span>}
      </button>
      
      <button 
        type="button"
        onClick={onRetweet}
        aria-label="Retweet"
        className={cn(
          "flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 p-0 rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
          hasRetweeted ? "text-green-600 font-semibold" : "hover:text-green-600"
        )}
      >
        <Repeat2 className="h-4 w-4" />
        {retweets !== undefined && <span>{retweets}</span>}
      </button>
      
      <button 
        type="button"
        onClick={onLike}
        aria-label="Like"
        className={cn(
          "flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 p-0 rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
          hasLiked ? "text-red-500 font-semibold" : "hover:text-red-500"
        )}
      >
        <Heart className={cn("h-4 w-4", hasLiked ? "fill-red-500 text-red-500" : "")} />
        {likes !== undefined && <span>{likes}</span>}
      </button>
      
      <button 
        type="button"
        aria-label="View analytics"
        className="flex items-center gap-1.5 hover:text-blue-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors cursor-pointer bg-transparent border-0 p-0 rounded-sm"
      >
        <BarChart3 className="h-4 w-4" />
        {views !== undefined && <span>{views}</span>}
      </button>
      
      <button 
        type="button"
        onClick={onShare}
        aria-label="Share"
        className="flex items-center gap-1.5 hover:text-blue-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors cursor-pointer bg-transparent border-0 p-0 rounded-sm"
      >
        <Share className="h-4 w-4" />
      </button>
    </div>
  )
}
