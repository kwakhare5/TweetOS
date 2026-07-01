import type { Metadata } from "next"
import { Geist, Fira_Code, Kalam } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LayoutHeader } from "@/components/layout-header"
import { SupabaseProvider } from "@/components/supabase-provider"
import { CustomCursor } from "@/components/ui/custom-cursor"

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
  title: "TweetOS — Twitter Growth System",
  description: "Personal AI system for drafting, scoring, and optimizing tweets in your voice.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${firaCode.variable} ${kalam.variable} font-sans antialiased bg-background text-foreground min-h-screen relative paper-texture`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <TooltipProvider>
            <SupabaseProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <LayoutHeader />
                  <main className="flex-1 overflow-auto relative flex justify-center w-full">
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
                      {children}
                    </div>
                  </main>
                </SidebarInset>
                <Toaster />
                <CustomCursor />
              </SidebarProvider>
            </SupabaseProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
