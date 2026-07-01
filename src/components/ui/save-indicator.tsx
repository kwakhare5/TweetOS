import { RefreshCw, Check } from "lucide-react"

type SaveStatusValue = "idle" | "saving" | "saved"

interface SaveIndicatorProps {
  status: SaveStatusValue
}

/**
 * Inline saving/saved status indicator.
 * Used in the Profile page header. Renders nothing when status is "idle".
 */
export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === "saving") {
    return (
      <span className="flex items-center text-amber-600">
        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
        Syncing...
      </span>
    )
  }
  if (status === "saved") {
    return (
      <span className="flex items-center text-emerald-600 transition-opacity">
        <Check className="h-3.5 w-3.5 mr-1.5" />
        Saved
      </span>
    )
  }
  return null
}
