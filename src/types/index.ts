// ─── PROFILE ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string
  twitterHandle: string
  niche: string
  bio: string
  contentPillars: ContentPillar[]
  voice: VoiceConfig
  audience: AudienceConfig
  goals: string[]
  admiredAccounts: string[]
  postingFrequency: string
  secondBrain?: string
  inspirationsContext?: string
  geminiApiKey?: string
  createdAt: string
  updatedAt: string
}

export interface ContentPillar {
  id: string
  name: string
  description: string
  percentage: number
}

export interface VoiceConfig {
  tone: string
  avoidList: string[]
  exampleTweets: string[]
  admiredExampleTweets: string[]
  writingStyle: string
  learningNotes: string[]
}

export interface AudienceConfig {
  currentAudience: string
  targetAudience: string
  audienceProblems: string[]
  audienceGoals: string[]
}

// ─── DUMP MODE ───────────────────────────────────────────────────────────────

export type DumpMode = 'dev' | 'personal' | 'shitpost' | 'auto'

// ─── TWEET DRAFT ──────────────────────────────────────────────────────────────

export interface TweetDraft {
  id: string
  content: string
  isThread: boolean
  threadTweets?: string[]
  pillarId: string
  momentType: string
  hookVariations: string[]
  algorithmScore: {
    overall: number
    suggestions: string[]
    calculatedAt: string
    [key: string]: unknown
  } // Maintained for store compatibility but unused locally
  sessionId?: string
  factCheckNote?: string
  status: DraftStatus
  createdAt: string
  updatedAt: string
}

export type DraftStatus = 'draft' | 'polished' | 'posted' | 'archived'

// ─── GROK PACKET ──────────────────────────────────────────────────────────────

export type GrokPacketMode = 'draft' | 'engagement' | 'trending'

export interface DraftPacketConfig {
  mode: 'draft'
  selectedDraftIds: string[]
  dumpMode?: DumpMode
  customRequest?: string
  includeScores?: boolean
}

export interface TrendingPacketConfig {
  mode: 'trending'
  focusAreas: string[]
  customRequest?: string
}

export interface EngagementPacketConfig {
  mode: 'engagement'
  targetAccounts: string[]
  topicKeywords: string[]
  opportunityTypes: string[]
  customRequest?: string
}
