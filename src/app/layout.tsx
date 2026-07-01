import type { Metadata } from 'next'
import { Geist, Fira_Code, Kalam } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CommandMenu } from "@/components/command-menu"
import { Breadcrumbs } from "@/components/breadcrumbs"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
})

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-handwriting",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: 'TweetOS — Twitter Growth System',
  description: 'Personal AI system for drafting, scoring, and optimizing tweets in your voice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${firaCode.variable} ${kalam.variable} font-sans antialiased bg-background text-foreground min-h-screen relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/50 px-6 md:px-8 lg:px-12 bg-[#FAF8F5]/70 backdrop-blur-md sticky top-0 z-50">
                  <SidebarTrigger className="-ml-1" />
                  <Breadcrumbs />
                  <div className="ml-auto hidden md:flex items-center gap-2 text-sm text-muted-foreground border rounded-md px-2 py-1 bg-muted/30">
                    <span className="text-xs">Press</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </header>
                <main 
                  className="flex-1 overflow-auto relative"
                  style={{
                    backgroundColor: "#FAF8F5",
                    backgroundImage: "radial-gradient(rgba(120, 90, 40, 0.08) 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                >
                  <div className="relative z-10">
                    {children}
                  </div>
                </main>
              </SidebarInset>
              <CommandMenu />
              <Toaster />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
