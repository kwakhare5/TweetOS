import { type LucideIcon } from "lucide-react"

interface CardHeaderRowProps {
  icon: LucideIcon
  title: string
  subtitle: string
  /** Optional action buttons rendered on the right side */
  actions?: React.ReactNode
}

/**
 * Shared card header: icon box + title + subtitle + optional right-side actions.
 * Used by CoreIdentityCard, ExtendedContextCard, AvoidWordsCard.
 */
export function CardHeaderRow({ icon: Icon, title, subtitle, actions }: CardHeaderRowProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 border-b border-border/40 pb-4 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-base font-bold text-foreground leading-tight">{title}</h3>
          <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}
