/**
 * All Supabase DB calls live here. Never query Supabase directly in components.
 */
import { createClient } from '@/lib/supabase/client'
import { UserProfile, TweetDraft, BrainDumpSession, LibraryEntry, TargetAccount, EngagementLog, UserStats } from '@/types'
import { SEED_PROFILE } from '@/data/seedProfile'

// Lazy init — avoids module-level instantiation that fails at build time
function db() {
  return createClient()
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile> {
  const { data } = await db().from('profiles').select('data').eq('user_id', userId).single()
  return (data?.data as UserProfile) ?? SEED_PROFILE
}

export async function saveProfile(userId: string, profile: UserProfile): Promise<void> {
  await db().from('profiles').upsert({ user_id: userId, data: profile, updated_at: new Date().toISOString() })
}

// ─── BRAIN DUMP SESSIONS ──────────────────────────────────────────────────────

export async function getSessions(userId: string): Promise<BrainDumpSession[]> {
  const { data } = await db().from('brain_dump_sessions').select('data').eq('user_id', userId).order('created_at', { ascending: false })
  return (data ?? []).map((r) => r.data as BrainDumpSession)
}

export async function saveSession(userId: string, session: BrainDumpSession): Promise<void> {
  await db().from('brain_dump_sessions').insert({ user_id: userId, data: session })
}

// ─── DRAFTS ──────────────────────────────────────────────────────────────────

export async function getDrafts(userId: string): Promise<TweetDraft[]> {
  const { data } = await db().from('drafts').select('data').eq('user_id', userId).order('created_at', { ascending: false })
  return (data ?? []).map((r) => r.data as TweetDraft)
}

export async function saveDraft(userId: string, draft: TweetDraft): Promise<void> {
  await db().from('drafts').upsert({ user_id: userId, data: draft, status: draft.status, updated_at: new Date().toISOString() })
}

export async function deleteDraft(userId: string, draftId: string): Promise<void> {
  await db().from('drafts').delete().eq('user_id', userId).eq('data->>id', draftId)
}

// ─── LIBRARY ─────────────────────────────────────────────────────────────────

export async function getLibrary(userId: string): Promise<LibraryEntry[]> {
  const { data } = await db().from('library').select('data').eq('user_id', userId).order('created_at', { ascending: false })
  return (data ?? []).map((r) => r.data as LibraryEntry)
}

export async function saveLibraryEntry(userId: string, entry: LibraryEntry): Promise<void> {
  await db().from('library').upsert({ user_id: userId, data: entry })
}

// ─── TARGET ACCOUNTS ─────────────────────────────────────────────────────────

export async function getTargetAccounts(userId: string): Promise<TargetAccount[]> {
  const { data } = await db().from('target_accounts').select('data').eq('user_id', userId).order('created_at', { ascending: false })
  return (data ?? []).map((r) => r.data as TargetAccount)
}

export async function saveTargetAccount(userId: string, account: TargetAccount): Promise<void> {
  await db().from('target_accounts').upsert({ user_id: userId, data: account })
}

// ─── ENGAGEMENT LOG ───────────────────────────────────────────────────────────

export async function getEngagementLog(userId: string): Promise<EngagementLog[]> {
  const { data } = await db().from('engagement_log').select('data').eq('user_id', userId).order('replied_at', { ascending: false })
  return (data ?? []).map((r) => r.data as EngagementLog)
}

export async function saveEngagementLog(userId: string, log: EngagementLog): Promise<void> {
  await db().from('engagement_log').insert({ user_id: userId, data: log })
}

// ─── STATS ────────────────────────────────────────────────────────────────────

export async function getStats(userId: string): Promise<UserStats> {
  const { data } = await db().from('stats').select('*').eq('user_id', userId).single()
  return data ?? { postStreak: 0, replyStreak: 0, totalPosted: 0, totalReplies: 0 }
}

export async function updateStats(userId: string, stats: Partial<UserStats>): Promise<void> {
  await db().from('stats').upsert({ user_id: userId, ...stats })
}
