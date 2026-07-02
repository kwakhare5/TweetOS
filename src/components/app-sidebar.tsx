"use client"

import * as React from "react"
import { LayoutDashboard, Layers, Settings, MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
import { MacOsWindowDots } from "@/components/ui/mac-window-dots"

const NAV_GROUPS = [
  {
    title: "Workspace",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Engage", url: "/engagement", icon: MessageCircle },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Profile", url: "/profile", icon: Settings },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pt-4 pb-2">
        <MacOsWindowDots />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-200/60 border border-amber-300/30 text-amber-950 shadow-sm font-bold rotate-[1.5deg]">
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
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.title} className="py-2">
            <SidebarGroupLabel className="text-sm font-semibold text-foreground px-2 pb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title} className="relative py-0.5">
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`h-9 px-3 rounded-md font-medium text-sm select-none border-0 transition-all ${
                          isActive
                            ? "nav-item-active border border-green-300/40 text-green-900 shadow-sm font-semibold rotate-[-1.5deg] translate-y-[-1px] scale-[1.02]"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                        render={<Link href={item.url} />}
                      >
                        <item.icon className={isActive ? "text-green-800" : "text-muted-foreground"} />
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
