import { create } from 'zustand'
import { TweetDraft, BrainDumpSession } from '@/types'

interface DraftStore {
  drafts: TweetDraft[]
  sessions: BrainDumpSession[]
  setDrafts: (drafts: TweetDraft[]) => void
  addDraft: (draft: TweetDraft) => void
  updateDraft: (id: string, partial: Partial<TweetDraft>) => void
  addSession: (session: BrainDumpSession) => void
}

export const useDraftStore = create<DraftStore>((set) => ({
  drafts: [],
  sessions: [],
  setDrafts: (drafts) => set({ drafts }),
  addDraft: (draft) => set((state) => ({ drafts: [draft, ...state.drafts] })),
  updateDraft: (id, partial) =>
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.id === id ? { ...d, ...partial, updatedAt: new Date().toISOString() } : d
      ),
    })),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
}))
