"use client"

import * as React from "react"
import {
 LayoutDashboard,
 Layers,
 Settings,
 BarChart2,
 Sparkles
} from "lucide-react"

import {
 Sidebar,
 SidebarContent,
 SidebarGroup,
 SidebarGroupContent,
 SidebarGroupLabel,
 SidebarHeader,
 SidebarMenu,
 SidebarMenuButton,
 SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
 navMain: [
 {
 title: "Workspace",
 items: [
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
 title: "Analytics",
 url: "/analytics",
 icon: BarChart2,
 },
 ],
 },
 {
 title: "Configuration",
 items: [
 {
 title: "Profile & DNA",
 url: "/profile",
 icon: Settings,
 },
 ],
 }
 ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 const pathname = usePathname()

 return (
 <Sidebar variant="inset" {...props}>
 <SidebarHeader className="pt-4 pb-2">
 {/* macOS Window Controls */}
 <div className="flex items-center space-x-1.5 px-3 pb-3 border-b border-slate-200/20 select-none">
 <div className="size-2.5 rounded-full bg-red-400/90 border border-red-500/10" />
 <div className="size-2.5 rounded-full bg-amber-400/90 border border-amber-500/10" />
 <div className="size-2.5 rounded-full bg-green-400/90 border border-green-500/10" />
 </div>
 <SidebarMenu>
 <SidebarMenuItem>
 <SidebarMenuButton size="lg" render={<Link href="/" />}>
 <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-200/60 border border-amber-300/30 text-amber-955 shadow-3xs font-bold rotate-[1.5deg]">
 <Layers className="size-4 text-amber-950" />
 </div>
 <div className="flex flex-col gap-0.5 leading-none">
 <span className="font-semibold">TweetOS</span>
 <span className="text-xs text-muted-foreground">Pro v2.0</span>
 </div>
 </SidebarMenuButton>
 </SidebarMenuItem>
 </SidebarMenu>
 </SidebarHeader>
 <SidebarContent className="px-2 pt-4">
 {data.navMain.map((group) => (
 <SidebarGroup key={group.title} className="py-2">
 <SidebarGroupLabel className="text-sm font-semibold text-foreground px-2 pb-2">{group.title}</SidebarGroupLabel>
 <SidebarGroupContent>
 <SidebarMenu className="gap-1">
 {group.items.map((item) => {
 const isActive = pathname === item.url

 return (
 <SidebarMenuItem key={item.title}>
 <SidebarMenuButton 
 isActive={isActive} 
 className={`h-9 px-3 rounded-t-lg font-medium text-[15px] select-none border-0
 ${isActive 
 ? "bg-slate-100/60 border border-slate-300/40 text-slate-800 shadow-3xs font-semibold rotate-[-1deg] translate-y-[-1px] scale-[1.01]" 
 : "text-slate-500 ] ]"
 }`}
 render={<Link href={item.url} />}
 >
 <item.icon className={isActive ? "text-slate-700" : "text-slate-400"} />
 <span>{item.title}</span>
 </SidebarMenuButton>
 </SidebarMenuItem>
 )
 })}
 </SidebarMenu>
 </SidebarGroupContent>
 </SidebarGroup>
 ))}
 </SidebarContent>
 </Sidebar>
 )
}

