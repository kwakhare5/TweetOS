'use client'

import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell({ children, scrollable = true }: { children: React.ReactNode; scrollable?: boolean }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content offset for desktop */}
      <main className={`flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen md:h-screen ${scrollable ? 'overflow-y-auto md:overflow-y-auto' : 'overflow-y-auto md:overflow-hidden'}`}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
