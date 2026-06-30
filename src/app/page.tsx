"use client"

import { motion } from "motion/react"
import dynamic from 'next/dynamic'

const OverviewMetrics = dynamic(() => import('@/components/dashboard/overview-metrics').then(mod => mod.OverviewMetrics), { ssr: false })
const RecentDrafts = dynamic(() => import('@/components/dashboard/recent-drafts').then(mod => mod.RecentDrafts), { ssr: false })
const ActiveTasks = dynamic(() => import('@/components/dashboard/active-tasks').then(mod => mod.ActiveTasks), { ssr: false })

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 p-4 md:p-6 w-full max-w-7xl mx-auto"
    >
      <div className="space-y-8 mt-0 border-0 p-0">
        <OverviewMetrics />
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          <RecentDrafts />
          <ActiveTasks />
        </div>
      </div>
    </motion.div>
  )
}
