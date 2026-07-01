"use client"

import { useEffect, useRef } from 'react'
import { useProfileStore } from '@/store/use-profile-store'
import { 
 fetchProfileFromSupabase, 
 saveProfileToSupabase
} from '@/lib/supabase-sync'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
 const profile = useProfileStore((state) => state.profile)
 const setProfile = useProfileStore((state) => state.setProfile)
 const isHydrated = useRef(false)

 useEffect(() => {
 if (isHydrated.current) return
 isHydrated.current = true

 async function initSync() {
 // 1. Sync Profile
 const remoteProfile = await fetchProfileFromSupabase()
 if (remoteProfile) {
 setTimeout(() => setProfile(remoteProfile), 0)
 } else if (profile) {
 // Seed remote database with local profile
 await saveProfileToSupabase(profile)
 }
 }

 initSync()
 }, [profile, setProfile])

 return <>{children}</>
}
