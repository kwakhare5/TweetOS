"use client"

import { usePathname } from "next/navigation"
import {
 Breadcrumb,
 BreadcrumbList,
 BreadcrumbItem,
 BreadcrumbPage,
 BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const ROUTE_MAP: Record<string, { group: string; title: string }> = {
 "/": { group: "Workspace", title: "Dashboard" },
 "/inspiration": { group: "Workspace", title: "Inspiration" },
 "/analytics": { group: "Workspace", title: "Analytics" },
 "/profile": { group: "Configuration", title: "Profile & DNA" },
}

export function Breadcrumbs() {
 const pathname = usePathname()
 const route = ROUTE_MAP[pathname] || { group: "Workspace", title: "Dashboard" }

 return (
 <Breadcrumb className="hidden md:flex">
 <BreadcrumbList>
 <BreadcrumbItem>
 <span className="text-muted-foreground/80 font-normal text-xs uppercase tracking-wider">
 {route.group}
 </span>
 </BreadcrumbItem>
 <BreadcrumbSeparator />
 <BreadcrumbItem>
 <BreadcrumbPage className="font-semibold text-foreground text-sm">
 {route.title}
 </BreadcrumbPage>
 </BreadcrumbItem>
 </BreadcrumbList>
 </Breadcrumb>
 )
}
