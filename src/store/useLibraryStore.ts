import { create } from 'zustand'
import { LibraryEntry } from '@/types'

interface LibraryStore {
  entries: LibraryEntry[]
  setEntries: (entries: LibraryEntry[]) => void
  addEntry: (entry: LibraryEntry) => void
  updateEntry: (id: string, partial: Partial<LibraryEntry>) => void
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  updateEntry: (id, partial) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    })),
}))
