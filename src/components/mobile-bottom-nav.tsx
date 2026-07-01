"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
 LayoutDashboard,
 Sparkles,
 Settings,
 Layers,
} from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
 {
 title: "Dashboard",
 url: "/",
 icon: LayoutDashboard,
 },
 {
 title: "Inspiration",
 url: "/inspiration",
 icon: Sparkles,
 },
 {
 title: "Profile",
 url: "/profile",
 icon: Settings,
 },
]

export function MobileBottomNav() {
 const pathname = usePathname()
 const { toggleSidebar } = useSidebar()

 return (
 <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-lg border-t border-slate-200/40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] h-16 pb-safe">
 <div className="grid grid-cols-4 h-full max-w-lg mx-auto px-2">
 {NAV_ITEMS.map((item) => {
 const isActive = pathname === item.url
 return (
 <Link
 key={item.title}
 href={item.url}
 className={cn(
 "flex flex-col items-center justify-center gap-1 text-[10px] font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-800 rounded-sm",
 isActive
 ? "text-slate-950 font-bold"
 : "text-slate-400 "
 )}
 >
 <item.icon className={cn("size-5", isActive && "scale-110")} />
 <span>{item.title}</span>
 </Link>
 )
 })}

 <button
 onClick={toggleSidebar}
 type="button"
 className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 cursor-pointer bg-transparent border-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-800 rounded-sm"
 >
 <Layers className="size-5" />
 <span>More</span>
 </button>
 </div>
 </nav>
 )
}

