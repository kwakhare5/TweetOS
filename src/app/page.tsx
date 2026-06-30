"use client"

import { motion } from "motion/react"
import { OverviewMetrics } from "@/components/dashboard/overview-metrics"
import { RecentDrafts } from "@/components/dashboard/recent-drafts"
import { ActiveTasks } from "@/components/dashboard/active-tasks"

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 p-4 md:p-6"
    >
      <OverviewMetrics />

      <div className="grid gap-8 md:grid-cols-2 items-stretch">
        <RecentDrafts />
        <ActiveTasks />
      </div>
    </motion.div>
  )
}
