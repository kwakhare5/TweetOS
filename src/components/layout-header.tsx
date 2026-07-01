"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

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
 </div>
 </header>
 )
}

