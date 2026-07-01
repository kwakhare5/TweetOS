import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Layout
        "flex field-sizing-content min-h-16 w-full rounded-lg",
        // Colors — all tokens, no dark: classes (app is light-only)
        "border border-input bg-transparent",
        // Typography
        "px-2.5 py-2 text-base md:text-sm",
        // Interaction
        "duration-300 outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        // Disabled
        "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        // Invalid
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
