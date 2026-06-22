'use client'

import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen overflow-y-auto">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
