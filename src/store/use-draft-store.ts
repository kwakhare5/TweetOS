import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TweetDraft, DraftStatus } from '@/types'
import { saveDraftToSupabase, deleteDraftFromSupabase } from '@/lib/supabase-sync'

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
        saveDraftToSupabase(draft)
        return { drafts: [draft, ...state.drafts] }
      }),
      updateDraft: (id, partial) =>
        set((state) => {
          const updatedDrafts = state.drafts.map((d) => {
            if (d.id === id) {
              const updated = { ...d, ...partial, updatedAt: new Date().toISOString() }
              saveDraftToSupabase(updated)
              return updated
            }
            return d
          })
          return { drafts: updatedDrafts }
        }),
      deleteDraft: (id) =>
        set((state) => {
          deleteDraftFromSupabase(id)
          return { drafts: state.drafts.filter((d) => d.id !== id) }
        }),
      moveDraft: (id, status) =>
        set((state) => {
          const updatedDrafts = state.drafts.map((d) => {
            if (d.id === id) {
              const updated = { ...d, status, updatedAt: new Date().toISOString() }
              saveDraftToSupabase(updated)
              return updated
            }
            return d
          })
          return { drafts: updatedDrafts }
        }),
    }),
    {
      name: 'tweetos-draft-storage',
    }
  )
)
