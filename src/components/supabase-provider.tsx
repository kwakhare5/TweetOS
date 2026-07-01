"use client"

import { useEffect, useRef } from 'react'
import { useProfileStore } from '@/store/use-profile-store'
import { useDraftStore } from '@/store/use-draft-store'
import { 
 fetchProfileFromSupabase, 
 saveProfileToSupabase, 
 fetchDraftsFromSupabase, 
 saveDraftToSupabase 
} from '@/lib/supabase-sync'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
 const profile = useProfileStore((state) => state.profile)
 const setProfile = useProfileStore((state) => state.setProfile)
 const drafts = useDraftStore((state) => state.drafts)
 const setDrafts = useDraftStore((state) => state.setDrafts)
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

 // 2. Sync Drafts
 const remoteDrafts = await fetchDraftsFromSupabase()
 if (remoteDrafts && remoteDrafts.length > 0) {
 setTimeout(() => setDrafts(remoteDrafts), 0)
 } else if (drafts && drafts.length > 0) {
 // Seed remote database with local drafts
 for (const draft of drafts) {
 await saveDraftToSupabase(draft)
 }
 }
 }

 initSync()
 }, [profile, setProfile, drafts, setDrafts])

 return <>{children}</>
}
