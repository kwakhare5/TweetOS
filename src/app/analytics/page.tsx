import { BarChart2 } from "lucide-react"
import { WashiTape } from "@/components/ui/washi-tape"
import { PageHeader } from "@/components/ui/page-header"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Performance Analytics"
        subtitle="Monitor engagement, reach, and performance stats of your posts."
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="relative w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm rotate-[-0.3deg] flex flex-col items-center gap-4">
          <WashiTape className="rotate-[2deg]" />
          <div className="size-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <BarChart2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Module Under Construction</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed text-center">
            The Analytics engine is currently in development. Real-time post stats sync will be available here soon.
          </p>
        </div>
      </div>
    </div>
  )
}
