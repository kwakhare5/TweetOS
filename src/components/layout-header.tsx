"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/breadcrumbs"

const ROUTE_MAP: Record<string, string> = {
  "/": "Creator Workbench",
  "/inspiration": "Viral Inspiration",
  "/analytics": "Analytics",
  "/profile": "Creator DNA",
}

export function LayoutHeader() {
  const pathname = usePathname()
  const title = ROUTE_MAP[pathname] || "TweetOS"

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("toggle-command-menu"))
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/50 px-4 md:px-8 lg:px-12 bg-[#FAF8F5]/70 backdrop-blur-md sticky top-0 z-50">
      <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
      
      {/* Breadcrumbs for desktop */}
      <Breadcrumbs />

      {/* Mobile Page Title */}
      <span className="md:hidden font-bold text-slate-950 text-[15px] tracking-tight ml-1">
        {title}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={triggerSearch}
          type="button"
          aria-label="Search"
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-3xs transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2"
        >
          <Search className="size-4" />
        </button>

        {/* Desktop Command Hint */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground border rounded-md px-2 py-1 bg-muted/30">
          <span className="text-xs">Press</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    </header>
  )
}
