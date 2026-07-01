"use client"

import { motion } from "motion/react"
import dynamic from 'next/dynamic'

const TweetMetaPreview = dynamic(() => import('@/components/dashboard/tweet-meta-preview').then(mod => mod.TweetMetaPreview), { ssr: false })

export default function InspirationPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Viral Inspiration</h1>
          <p className="text-muted-foreground">Analyze top performing hooks to craft your next masterpiece.</p>
        </div>
        
        <div className="relative w-full max-w-xl bg-card border rounded-xl p-5 shadow-sm rotate-[0.3deg]">
          {/* Translucent Washi Tape */}
          <div 
            className="absolute top-[-10px] left-[50%] translate-x-[-50%] w-24 h-5 border border-amber-200/20 shadow-xs rotate-[-2deg] opacity-75 z-10 select-none pointer-events-none"
            style={{
              backgroundColor: "rgba(254, 240, 138, 0.35)",
              backdropFilter: "blur(2px)"
            }}
          />
          <TweetMetaPreview />
        </div>
        
        <p className="text-sm text-muted-foreground mt-8 max-w-md">
          This viral tweet is embedded natively using the newly installed MagicUI Tweet Card component.
        </p>
      </div>
    </motion.div>
  )
}
