import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  copied: boolean
  onClick: () => void
  children: React.ReactNode
  /** Icon shown when NOT copied. Defaults to <Copy />. */
  icon?: React.ReactNode
  className?: string
  size?: "sm" | "default" | "lg"
}

/**
 * Button that shows a Copy icon (or custom icon) until clicked,
 * then transitions to a Check icon. Used across polished-draft-preview
 * and voice-profile-card.
 */
export function CopyButton({
  copied,
  onClick,
  children,
  icon,
  className,
  size = "sm",
}: CopyButtonProps) {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      className={cn("font-semibold", className)}
    >
      {copied
        ? <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        : (icon ?? <Copy className="h-3.5 w-3.5 shrink-0" />)
      }
      {children}
    </Button>
  )
}

