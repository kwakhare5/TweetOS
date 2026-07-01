import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — amber/foreground fill
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] cursor-pointer",
        // Bordered — uses design tokens, not hardcoded slate
        outline:
          "border border-border bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-[0.98] cursor-pointer",
        // Muted fill
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer",
        // No fill
        ghost:
          "hover:bg-accent hover:text-accent-foreground cursor-pointer",
        // Destructive
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-500/90 active:scale-[0.98] cursor-pointer",
        // Text link
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // h-8 is the app standard action button height
        default: "h-8 px-3 text-sm",
        // Compact — card action buttons, header accessories
        sm:      "h-7 px-2.5 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        // Large — primary CTA
        lg:      "h-9 px-4 text-sm",
        // Fixed-square icon buttons
        icon:    "size-8",
        "icon-sm": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
