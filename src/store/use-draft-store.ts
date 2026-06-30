import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TweetDraft, DraftStatus } from '@/types'

interface DraftStore {
  drafts: TweetDraft[]
  setDrafts: (drafts: TweetDraft[]) => void
  addDraft: (draft: TweetDraft) => void
  updateDraft: (id: string, partial: Partial<TweetDraft>) => void
  deleteDraft: (id: string) => void
  moveDraft: (id: string, status: DraftStatus) => void
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      drafts: [],
      setDrafts: (drafts) => set({ drafts }),
      addDraft: (draft) => set((state) => {
        if (state.drafts.some(d => d.id === draft.id)) return {}
        return { drafts: [draft, ...state.drafts] }
      }),
      updateDraft: (id, partial) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, ...partial, updatedAt: new Date().toISOString() } : d
          ),
        })),
      deleteDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id),
        })),
      moveDraft: (id, status) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
          ),
        })),
    }),
    {
      name: 'tweetos-draft-storage',
    }
  )
)
