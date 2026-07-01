import { useState } from "react"
import { toast } from "sonner"

/**
 * Returns a [copied, copy] tuple.
 * `copied` resets to false after `resetMs` (default 2000ms).
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string, errorMsg = "Failed to copy.") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
    } catch {
      toast.error(errorMsg)
    }
  }

  return [copied, copy] as const
}
