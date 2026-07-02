interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Optional right-side content (status badges, buttons, etc.) */
  actions?: React.ReactNode
}

/**
 * Shared page-level h1 + subtitle row.
 * Used by Dashboard and Profile pages.
 */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground block">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 text-sm">{actions}</div>
      )}
    </div>
  )
}
