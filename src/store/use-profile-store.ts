import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types'
import { SEED_PROFILE } from '@/data/seed-profile'

interface ProfileStore {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
  updateProfile: (partial: Partial<UserProfile>) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: SEED_PROFILE,
      setProfile: (profile) => set({ profile }),
      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial, updatedAt: new Date().toISOString() },
        })),
    }),
    {
      name: 'tweetos-profile-storage',
    }
  )
)
