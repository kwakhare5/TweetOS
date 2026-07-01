"use client"

import { useEffect, useRef } from "react"
import { useProfileStore } from "@/store/use-profile-store"
import { fetchProfileFromSupabase, saveProfileToSupabase } from "@/lib/supabase-sync"

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const profile = useProfileStore((state) => state.profile)
  const setProfile = useProfileStore((state) => state.setProfile)
  const isHydrated = useRef(false)

  useEffect(() => {
    if (isHydrated.current) return
    isHydrated.current = true

    async function initSync() {
      const remoteProfile = await fetchProfileFromSupabase()
      if (remoteProfile) {
        // Defer to avoid setState-during-render warning
        setTimeout(() => setProfile(remoteProfile), 0)
      } else if (profile) {
        // Seed remote DB with local profile on first run
        await saveProfileToSupabase(profile)
      }
    }

    initSync()
  // profile and setProfile intentionally excluded:
  // - isHydrated.current gates the effect to run only once
  // - setProfile is a stable Zustand ref
  // - including profile would re-run on every Supabase write (loop)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
