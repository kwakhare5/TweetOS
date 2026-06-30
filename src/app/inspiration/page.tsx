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
        
        <div className="w-full max-w-xl">
          <TweetMetaPreview />
        </div>
        
        <p className="text-sm text-muted-foreground mt-8 max-w-md">
          This viral tweet is embedded natively using the newly installed MagicUI Tweet Card component.
        </p>
      </div>
    </motion.div>
  )
}
