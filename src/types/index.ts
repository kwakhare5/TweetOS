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

export type DumpMode = 'dev' | 'personal' | 'shitpost'

// ─── BRAIN DUMP ───────────────────────────────────────────────────────────────

export interface BrainDumpSession {
  id: string
  rawDump: string
  extractedMoments: ExtractedMoment[]
  generatedDrafts: TweetDraft[]
  createdAt: string
}

export interface ExtractedMoment {
  id: string
  insight: string
  type: MomentType
}

export type MomentType =
  | 'story'
  | 'lesson'
  | 'opinion'
  | 'progress'
  | 'question'
  | 'observation'

// ─── TWEET DRAFT ──────────────────────────────────────────────────────────────

export interface TweetDraft {
  id: string
  content: string
  isThread: boolean
  threadTweets?: string[]
  pillarId: string
  momentType: MomentType
  hookVariations: string[]
  algorithmScore: AlgorithmScore
  sessionId?: string
  status: DraftStatus
  createdAt: string
  updatedAt: string
}

export type DraftStatus = 'draft' | 'polished' | 'posted' | 'archived'

// ─── ALGORITHM SCORE ──────────────────────────────────────────────────────────

export interface AlgorithmScore {
  overall: number
  hookStrength: SignalScore
  replyBait: SignalScore
  specificity: SignalScore
  emotionalTrigger: SignalScore
  length: SignalScore
  noLinksInBody: SignalScore
  ctaQuality: SignalScore
  threadPotential: SignalScore
  suggestions: string[]
  calculatedAt: string
}

export interface SignalScore {
  score: number
  label: 'Strong' | 'Weak' | 'Fail'
  reason: string
}

// ─── LIBRARY ─────────────────────────────────────────────────────────────────

export interface LibraryEntry {
  id: string
  tweet: string
  isThread: boolean
  threadTweets?: string[]
  pillarId: string
  algorithmScore?: AlgorithmScore
  postedAt?: string
  performanceNote?: string
  grokRefinement?: string
  tags: string[]
  createdAt: string
}

// ─── ENGAGEMENT ───────────────────────────────────────────────────────────────

export interface TargetAccount {
  id: string
  handle: string
  name: string
  why: string
  temperature: AccountTemperature
  lastEngaged?: string
  engagementCount: number
  notes?: string
  addedAt: string
}

export type AccountTemperature =
  | 'cold'
  | 'warm'
  | 'hot'
  | 'connection'

export interface EngagementOpportunity {
  id: string
  tweetText: string
  tweetAuthorHandle: string
  tweetUrl?: string
  opportunityType: OpportunityType
  replies: GeneratedReply[]
  status: 'pending' | 'replied' | 'skipped'
  createdAt: string
  repliedAt?: string
}

export type OpportunityType =
  | 'add_value'
  | 'share_experience'
  | 'ask_question'
  | 'agree_expand'
  | 'respectful_push'

export interface GeneratedReply {
  id: string
  content: string
  replyType: OpportunityType
  tone: string
}

export interface EngagementLog {
  id: string
  targetHandle: string
  tweetSnippet: string
  replyUsed: string
  repliedAt: string
  outcome?: string
}

// ─── GROK PACKET ──────────────────────────────────────────────────────────────

export type GrokPacketMode = 'draft' | 'engagement' | 'trending'

export interface DraftPacketConfig {
  mode: 'draft'
  selectedDraftIds: string[]
  includeScores: boolean
  dumpMode?: DumpMode
  customRequest: string
}

export interface EngagementPacketConfig {
  mode: 'engagement'
  targetAccounts: string[]
  topicKeywords: string[]
  opportunityTypes: OpportunityType[]
  customRequest: string
}

export interface TrendingPacketConfig {
  mode: 'trending'
  focusAreas: string[]   // e.g. ['AI tools', 'indie hacking', 'CS students']
  customRequest: string
}

export type GrokPacketConfig = DraftPacketConfig | EngagementPacketConfig | TrendingPacketConfig

// ─── STATS ────────────────────────────────────────────────────────────────────

export interface UserStats {
  postStreak: number
  replyStreak: number
  totalPosted: number
  totalReplies: number
  lastPosted?: string
  lastReplied?: string
}
