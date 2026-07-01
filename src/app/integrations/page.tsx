"use client"

import { motion } from "motion/react"
import { Plug } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-8 lg:px-12 py-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Integrations</h1>
          <p className="text-muted-foreground">Connect external services, databases, or content channels.</p>
        </div>
        
        <div className="relative w-full max-w-md bg-card border rounded-xl p-8 shadow-sm rotate-[0.3deg] flex flex-col items-center gap-4">
          {/* Translucent Washi Tape with diagonal stripes pattern */}
          <div 
            className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs rotate-[-2deg] opacity-75 z-10 select-none pointer-events-none"
            style={{
              backgroundColor: "rgba(254, 240, 138, 0.4)",
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
              backdropFilter: "blur(1.5px)"
            }}
          />
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Plug className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            The Integrations interface is currently being set up. Soon you will be able to link Notion, Slack, and other extensions here.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
