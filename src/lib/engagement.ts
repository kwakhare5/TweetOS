import { TargetAccount, EngagementLog, AccountTemperature } from '@/types'
import { SEED_PROFILE } from '@/data/seedProfile'

export function updateAccountTemperature(
  account: TargetAccount,
  log: EngagementLog[]
): AccountTemperature {
  const accountReplies = log.filter((l) => l.targetHandle === account.handle)
  const positiveOutcomes = accountReplies.filter(
    (l) => l.outcome?.includes('replied') || l.outcome?.includes('followed')
  )
  if (positiveOutcomes.length > 0) return 'hot'
  if (accountReplies.length >= 4) return 'hot'
  if (accountReplies.length >= 1) return 'warm'
  return 'cold'
}

const ACCOUNT_CONTEXT: Record<string, { name: string; why: string }> = {
  shydev69: { name: 'Shy Dev', why: 'Grind/humor posts — Indian dev audience, relatable content' },
  buildwithsid: { name: 'Sid', why: 'Builder content — ships fast, documents publicly' },
  adxtyahq: { name: 'Aditya', why: 'AI/dev takes, growing Indian tech voice' },
  dhruvtwt_: { name: 'Dhruv', why: 'CS student journey content, internship hunting' },
  bit2swaz: { name: 'Swaz', why: 'Vibe coder, AI tools, indie builder energy' },
  kalashvasaniya: { name: 'Kalash', why: 'Full-stack builder, ships AI projects' },
}

export function seedTargetAccounts(): TargetAccount[] {
  const now = new Date().toISOString()
  return SEED_PROFILE.admiredAccounts.map((handle) => ({
    id: `account_${handle}`,
    handle,
    name: ACCOUNT_CONTEXT[handle]?.name ?? handle,
    why: ACCOUNT_CONTEXT[handle]?.why ?? 'From admired accounts list',
    temperature: 'cold' as AccountTemperature,
    engagementCount: 0,
    addedAt: now,
  }))
}
