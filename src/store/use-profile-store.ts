import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types'
import { SEED_PROFILE } from '@/data/seed-profile'
import { saveProfileToSupabase } from '@/lib/supabase-sync'

interface ProfileStore {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
  updateProfile: (partial: Partial<UserProfile>) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: SEED_PROFILE,
      setProfile: (profile) => {
        set({ profile })
        saveProfileToSupabase(profile)
      },
      updateProfile: (partial) =>
        set((state) => {
          const updated = { ...state.profile, ...partial, updatedAt: new Date().toISOString() }
          saveProfileToSupabase(updated)
          return { profile: updated }
        }),
    }),
    {
      name: 'tweetos-profile-storage',
    }
  )
)
