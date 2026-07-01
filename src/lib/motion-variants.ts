import type { Variants } from "motion/react"

/**
 * Shared Framer Motion variants for page-level stagger animations.
 * Used by Dashboard (page.tsx) and Profile (profile/page.tsx).
 *
 * Pages use `useReducedMotion()` from motion/react to pick between
 * these animated variants and the instant fallbacks below.
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

/** No-animation fallback — used when prefers-reduced-motion is set. */
export const reducedContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
}

export const reducedItemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}
