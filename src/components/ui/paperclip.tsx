import * as React from "react"
import { cn } from "@/lib/utils"

export function Paperclip({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn(className)}
      width="40"
      height="40"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* Drop shadow layer */}
      <path
        d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="translate-x-[1px] translate-y-[2px]"
      />
      {/* Main body */}
      <path
        d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlight layer */}
      <path
        d="M12 30 L28 14 A4.5 4.5 0 0 0 21.5 7.5 L7 22 A7 7 0 0 0 17 34 L31 20 A9.5 9.5 0 0 0 17.5 6.5 L9.5 14.5"
        stroke="#F1F5F9"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
