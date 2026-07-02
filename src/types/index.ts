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
  voiceBlueprint?: VoiceBlueprint
  avatarUrl?: string
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

export type TweetMomentType = 'draft' | 'idea' | 'trending' | 'engagement' | 'thread'

export interface TweetDraft {
  id: string
  content: string
  isThread: boolean
  threadTweets?: string[]
  pillarId: string
  momentType: TweetMomentType
  hookVariations: string[]
  algorithmScore: {
    overall: number
    suggestions: string[]
    calculatedAt: string
    [key: string]: unknown
  }
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

// ─── HUNT SYSTEMS (NEW) ───────────────────────────────────────────────────────

export interface VoiceBlueprint {
  hookFormula: string
  bodyStructure: string
  toneVibe: string
  secretSauce: string[]
  writingRules: string[]
  antiRules: string[]
  sentencePatterns: string[]
  avgTweetLength: string
  punctuationStyle: string
  numberUsage: string
  topStructuralPattern: string
  extractedFrom: string
  extractedAt: string
}

export interface TopicHuntAngle {
  id: string
  originalViral: string
  originalContext: string
  pillarMatch: string
  rewrittenAngle: string
  charCount: number
  secondBrainAnchor: string
  technique: string
}

export interface EngagementOpportunity {
  id: string
  authorHandle: string
  originalTweet: string
  tweetUrl: string | null
  opportunityScore: number
  relevance: string
  opportunityType: 'reply' | 'quote_tweet'
  replies: {
    option: 'A' | 'B' | 'C'
    tone: 'casual' | 'insightful' | 'question'
    content: string
    charCount: number
  }[]
}
