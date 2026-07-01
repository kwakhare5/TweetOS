"use client"


import dynamic from 'next/dynamic'
import { WashiTape } from "@/components/ui/washi-tape"

const TweetMetaPreview = dynamic(() => import('@/components/dashboard/tweet-meta-preview').then(mod => mod.TweetMetaPreview), { ssr: false })

export default function InspirationPage() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-8 lg:px-12 py-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Viral Inspiration</h1>
          <p className="text-muted-foreground">Analyze top performing hooks to craft your next masterpiece.</p>
        </div>
        
        <div className="relative w-full max-w-xl bg-card border rounded-xl p-5 shadow-sm rotate-[0.3deg] ">
          {/* Translucent Washi Tape with diagonal stripes pattern */}
          <WashiTape className="rotate-[-2deg]" />
          <TweetMetaPreview />
        </div>
        
        <p className="text-sm text-muted-foreground mt-8 max-w-md">
          This viral tweet is embedded natively using the newly installed MagicUI Tweet Card component.
        </p>
      </div>
    </div>
  )
}

