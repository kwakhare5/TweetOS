"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/breadcrumbs"

const ROUTE_MAP: Record<string, string> = {
  "/": "Creator Workbench",
  "/analytics": "Analytics",
  "/profile": "Profile",
}

export function LayoutHeader() {
  const pathname = usePathname()
  const title = ROUTE_MAP[pathname] ?? "TweetOS"

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 md:px-8 bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <SidebarTrigger className="-ml-1" />

      {/* Breadcrumbs for desktop */}
      <Breadcrumbs />

      {/* Mobile page title */}
      <span className="md:hidden font-bold text-foreground text-[15px] tracking-tight ml-1">
        {title}
      </span>
    </header>
  )
}
