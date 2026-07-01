import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface FieldLabelProps {
  htmlFor?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

/**
 * Shared uppercase field label: `text-xs font-bold text-muted-foreground uppercase tracking-wider`.
 * Drop-in replacement for the <Label> pattern repeated across all profile cards.
 */
export function FieldLabel({ htmlFor, icon: Icon, children, className }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider",
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {children}
    </label>
  )
}
