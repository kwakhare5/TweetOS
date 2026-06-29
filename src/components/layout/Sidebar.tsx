'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { PenTool, User, ChevronsUpDown, Settings } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Workspace', Icon: PenTool },
  { href: '/profile', label: 'Profile & DNA', Icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-sidebar border-r border-sidebar-border py-4 px-3 z-40 justify-between font-sans">
      <div className="flex flex-col gap-6">
        {/* Workspace Switcher */}
        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors duration-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 text-primary font-bold text-sm select-none border border-primary/20">
              T
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-sm leading-tight text-sidebar-foreground truncate">TweetOS</span>
              <span className="text-[11px] text-muted-foreground font-mono leading-none truncate mt-0.5">@kwakhare5</span>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
                )}
                <item.Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col gap-3 pt-6 border-t border-sidebar-border/50">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 cursor-pointer transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm font-medium">
          <span className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Settings</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-3 mt-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
