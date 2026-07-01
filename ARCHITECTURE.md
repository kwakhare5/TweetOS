# TweetOS — Minimalist Tailoring Node
## Architecture & Build Document v3.0

> **What this is:** A hyper-minimalist local interface designed to bridge raw, unedited thoughts with Grok's cloud intelligence. It uses the user's Creator DNA to format ideas, and relies entirely on Grok for validation, trend hunting, and engagement strategies.

---

## Tech Stack

| Layer     | Tool                        | Why                                                |
| --------- | --------------------------- | -------------------------------------------------- |
| Framework | Next.js 15 (App Router)     | File-based routing, Vercel-native                  |
| Language  | TypeScript                  | Type safety on all data models                     |
| Styling   | Tailwind CSS v4             | Fast, clean, dark theme, glassmorphic panels       |
| Icons     | lucide-react                | Professional icons                                 || AI        | Google Gemini 2.5 Pro       | Local text formatting via `@google/genai`          |
| State     | Zustand                     | Fully local-first, zero latency, runs in browser   |

---

## Core Paradigm: The 2-Step Flow

The old architecture was bloated with local scoring algorithms, libraries, and engagement dashboards. All of that has been aggressively deleted. 

**TweetOS is now a pure passthrough node:**
1. **Local Generation & Tailoring**: 
   - **Generate Idea**: Clicking "Generate Idea" calls Gemini (locally) using the target Inspiration DNA blueprint and your Second Brain daily context to generate a complete dev-focused draft.
   - **Tailor Draft**: Paste a raw thought/dump into the card, and Gemini formats it into a highly polished 280-char draft using your Voice rules and Inspiration blueprint.
2. **Cloud Validation (Grok Packets)**: 1-click generators create massive, context-rich prompts. Paste these into Grok to execute the heavy lifting (scoring, trend discovery, reply generation).

---

## File Structure

```
tweetOS/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # Command Center (Minimal Dashboard)
│   │   ├── profile/page.tsx              # Profile, Second Brain, Inspiration Context
│   │   ├── inspiration/page.tsx          # Inspiration references page
│   │   ├── analytics/page.tsx            # Analytics statistics page
│   │   ├── globals.css                   
│   │   ├── error.tsx
│   │   └── loading.tsx
│   │
│   ├── components/
│   │   ├── app-sidebar.tsx               # App Sidebar config
│   │   ├── mobile-bottom-nav.tsx         # Mobile floating bottom bar
│   │   ├── layout-header.tsx             # Shared header layout component
│   │   ├── breadcrumbs.tsx               # Header breadcrumbs navigation
│   │   ├── command-menu.tsx              # Command Search Dialog trigger (Ctrl+K)
│   │   ├── theme-provider.tsx            # Theme provider context wrapper
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── command.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input-group.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── sidebar.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   │
│   ├── lib/
│   │   ├── gemini.ts                     # Google GenAI integration
│   │   ├── prompts.ts                    # Routing & Tailoring prompts
│   │   ├── grok-packager.ts              # 3 packet types: Draft, Trending, Engagement
│   │   └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── store/
│   │   ├── use-draft-store.ts            # Local draft archive store
│   │   └── use-profile-store.ts          # Profile + Second Brain + Inspiration DNA
│   │
│   └── data/
│       └── seed-profile.ts               # Default profile
│
│── e2e/
│   └── dashboard.spec.ts                 # Playwright E2E tests
├── .env.local
├── CLAUDE.md                             # Rules & Mistake Tracker
├── CONTEXT.md                            # Domain definitions
├── README.md                             # Project overview
└── next.config.ts
```

---

## TypeScript Data Models

**File:** `src/types/index.ts`

```typescript
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
  } // Kept for type stability, unused locally
  sessionId?: string
  factCheckNote?: string
  status: 'draft' | 'polished' | 'posted' | 'archived'
  createdAt: string
  updatedAt: string
}

// ─── GROK PACKET ──────────────────────────────────────────────────────────────

export type GrokPacketMode = 'draft' | 'engagement' | 'trending'

export interface DraftPacketConfig {
  mode: 'draft'
  selectedDraftIds: string[]
  dumpMode?: 'dev' | 'personal' | 'shitpost' | 'auto'
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
```

---

## The Grok Packagers (`src/lib/grok-packager.ts`)

Since Grok is stateless, we generate massive text prompts ("Packets") containing the full user context to paste into Grok.

1. **Draft Review Packet (`generateDraftPacket`)**:
   Injects the `UserProfile` + `InspirationsContext` + `SecondBrain` + the raw Draft. Commands Grok to score the draft and rewrite it explicitly cloning the Inspiration DNA.

2. **Topic Hunt Packet (`generateTrendingPacket`)**:
   Injects the `UserProfile` + `InspirationsContext` + `SecondBrain`. Commands Grok to scour X for live trends and generate 3 ideas perfectly matched to the user's Creator DNA.

3. **Engagement Hunt Packet (`generateEngagementPacket`)**:
   Injects the `UserProfile` + `InspirationsContext`. Commands Grok to find reply and quote-tweet opportunities for the target audience and draft responses using the Inspiration DNA.
