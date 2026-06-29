import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TweetDraft } from '@/types'

interface DraftStore {
  drafts: TweetDraft[]
  setDrafts: (drafts: TweetDraft[]) => void
  addDraft: (draft: TweetDraft) => void
  updateDraft: (id: string, partial: Partial<TweetDraft>) => void
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      drafts: [],
      setDrafts: (drafts) => set({ drafts }),
      addDraft: (draft) => set((state) => ({ drafts: [draft, ...state.drafts] })),
      updateDraft: (id, partial) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, ...partial, updatedAt: new Date().toISOString() } : d
          ),
        })),
    }),
    {
      name: 'tweetos-draft-storage',
    }
  )
)
