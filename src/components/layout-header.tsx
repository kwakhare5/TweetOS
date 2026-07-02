"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/breadcrumbs"
export function LayoutHeader() {

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 md:px-8 bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <SidebarTrigger className="-ml-1" />

      {/* Breadcrumbs for desktop */}
      <Breadcrumbs />

    </header>
  )
}
