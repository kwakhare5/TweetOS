import { create } from 'zustand'
import { TargetAccount, EngagementLog } from '@/types'

interface EngagementStore {
  targetAccounts: TargetAccount[]
  engagementLog: EngagementLog[]
  setTargetAccounts: (accounts: TargetAccount[]) => void
  addTargetAccount: (account: TargetAccount) => void
  updateTargetAccount: (id: string, partial: Partial<TargetAccount>) => void
  addEngagementLog: (log: EngagementLog) => void
  setEngagementLog: (log: EngagementLog[]) => void
}

export const useEngagementStore = create<EngagementStore>((set) => ({
  targetAccounts: [],
  engagementLog: [],
  setTargetAccounts: (targetAccounts) => set({ targetAccounts }),
  addTargetAccount: (account) =>
    set((state) => ({ targetAccounts: [...state.targetAccounts, account] })),
  updateTargetAccount: (id, partial) =>
    set((state) => ({
      targetAccounts: state.targetAccounts.map((a) =>
        a.id === id ? { ...a, ...partial } : a
      ),
    })),
  addEngagementLog: (log) =>
    set((state) => ({ engagementLog: [log, ...state.engagementLog] })),
  setEngagementLog: (engagementLog) => set({ engagementLog }),
}))
