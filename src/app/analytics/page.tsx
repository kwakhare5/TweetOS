"use client"

import { motion } from "motion/react"
import { BarChart2 } from "lucide-react"
import { WashiTape } from "@/components/ui/washi-tape"

export default function AnalyticsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-8 lg:px-12 py-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Performance Analytics</h1>
          <p className="text-muted-foreground">Monitor engagement, reach, and performance stats of your posts.</p>
        </div>
        
        <div className="relative w-full max-w-md bg-card border rounded-xl p-8 shadow-sm rotate-[-0.3deg] flex flex-col items-center gap-4">
          {/* Translucent Washi Tape with diagonal stripes pattern */}
          <WashiTape className="rotate-[2deg]" />
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <BarChart2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            The Analytics engine is currently in development. Real-time post stats sync will be available here soon.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
