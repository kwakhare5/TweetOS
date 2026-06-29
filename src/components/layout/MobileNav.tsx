'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { PenTool, User } from 'lucide-react'

const TABS = [
  { href: '/', label: 'Workspace', Icon: PenTool },
  { href: '/profile', label: 'Profile', Icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-50 flex items-center justify-around font-sans">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] transition-colors relative ${
              active ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            )}
            <tab.Icon className={`w-4 h-4 transition-transform ${active ? 'text-primary scale-110' : 'text-muted-foreground'}`} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
      <div className="flex-1 flex justify-center py-2.5">
        <ThemeToggle />
      </div>
    </nav>
  )
}
