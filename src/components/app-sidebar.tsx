"use client"

import * as React from "react"
import {
  LayoutDashboard,
  StickyNote,
  Kanban,
  Layers,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Dashboards",
      items: [
        {
          title: "Overview",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Notes",
          url: "/#notes",
          icon: StickyNote,
        },
        {
          title: "Kanban",
          url: "/#pipeline",
          icon: Kanban,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "General",
          url: "#",
          icon: Settings,
        },
        {
          title: "Integrations",
          url: "#",
          icon: Layers,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [activeHash, setActiveHash] = React.useState("")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Initial load
    setActiveHash(window.location.hash)

    // Listen for hash changes
    const onHashChange = () => setActiveHash(window.location.hash)
    window.addEventListener("hashchange", onHashChange)
    
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Layers className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">TweetOS</span>
                <span className="text-xs text-muted-foreground">Pro v2.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = mounted ? (
                    (activeHash === item.url.replace("/", "")) ||
                    (item.url === "/" && !activeHash)
                  ) : item.url === "/"

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        isActive={isActive} 
                        render={<Link href={item.url} onClick={() => setActiveHash(item.url.replace("/", ""))} />}
                      >
                        <item.icon />
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
      <SidebarFooter>
        <div className="p-4">
          <Card className="shadow-none">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm">Upgrade to Pro</CardTitle>
              <CardDescription className="text-xs">
                Unlock all features and get unlimited access to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Button size="sm" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
