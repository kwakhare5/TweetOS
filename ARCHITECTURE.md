# TweetOS — Personal Twitter Growth System

## Architecture & Build Document v2.0

> **What this is:** A personal AI system that deeply knows Karan, drafts tweets in his voice, scores them against X algorithm signals, helps him find engagement opportunities, generates smart replies, and packages everything for Grok validation.
>
> **Two-system philosophy:** This app handles personalization, drafting, scoring, and engagement. Grok handles real-time Twitter data, validation, tweet discovery, and refinement. Neither replaces the other.
>
> **Growth model:** Posting alone doesn't grow Twitter. Engagement does. This system covers both — original content AND reply strategy.
>
> **Daily targets (confirmed from X algorithm research):**
>
> - Original posts: 2–4/day (1 anchor + 1–2 quick updates + 1 thread/week on Saturday)
> - Replies: 10–15/day total (5–8 morning + 5–7 evening)
> - Quote tweets: 2–4/day with your own take added
> - Total time: 30–45 min/day split into two sessions
>
> **Hard character limit: 280 chars for all tweets (free account). Every prompt in this system enforces this strictly.**
>
> **Algorithm insight (from X open source + Grok analysis):** Early engagement in first 30–60 minutes is the biggest ranking signal. Post at peak IST windows: 10AM–12PM and 6PM–9PM. Replies and quote posts outweigh passive likes. Media (screenshots, code snippets) boost reach. Replies on bigger accounts in your niche get you into their audience's For You feed — this is the #1 growth lever when under 5K followers.

---

## Tech Stack

| Layer     | Tool                        | Why                                                |
| --------- | --------------------------- | -------------------------------------------------- |
| Framework | Next.js 15 (App Router)     | File-based routing, Vercel-native                  |
| Language  | TypeScript                  | Type safety on all data models                     |
| Styling   | Tailwind CSS v4 + shadcn/ui | Fast, clean, dark theme                            |
| AI        | Google Gemini 2.5 Flash     | Free tier, generous limits                         |
| State     | Zustand                     | Simple global state                                |
| Storage   | Supabase (Postgres)         | Free, cross-device sync — PC + mobile via same URL |
| Auth      | Supabase Auth (magic link)  | No password, email only, fully free                |
| Hosting   | Vercel                      | Free, auto-deploy from GitHub                      |

**Gemini Model:** `gemini-2.5-flash` via `@google/genai`
**API key:** https://aistudio.google.com/app/apikey (free)
**Supabase:** https://supabase.com (free tier — 500MB DB, unlimited auth)

---

## Full File Structure

```
tweetOS/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # Consolidated Workspace (Drafts, Dump, Workshop)
│   │   ├── profile/page.tsx              # Profile & Seed Data
│   │   ├── engage/page.tsx               # Engagement Hub
│   │   ├── analytics/page.tsx            # Analytics & Library
│   │   ├── login/page.tsx                # Magic Link Login
│   │   ├── auth/callback/route.ts        # Auth Callback
│   │   ├── globals.css                   # Tailwind and UI utilities
│   │   ├── error.tsx
│   │   └── loading.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── MobileNav.tsx             # Bottom tab bar (primary on mobile)
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── PillarEditor.tsx
│   │   │   ├── ExampleTweetInput.tsx
│   │   │   └── ProfileCard.tsx
│   │   ├── brain-dump/
│   │   │   ├── DumpTextArea.tsx
│   │   │   ├── DraftCard.tsx
│   │   │   ├── DraftList.tsx
│   │   │   └── SessionHistory.tsx
│   │   ├── workshop/
│   │   │   ├── TweetEditor.tsx
│   │   │   ├── HookGenerator.tsx
│   │   │   ├── ThreadBuilder.tsx
│   │   │   ├── VariationGenerator.tsx
│   │   │   └── LengthOptimizer.tsx
│   │   ├── scorer/
│   │   │   ├── ScoreInput.tsx
│   │   │   ├── ScoreCard.tsx
│   │   │   ├── SignalBreakdown.tsx
│   │   │   └── ImprovementTips.tsx
│   │   ├── library/
│   │   │   ├── LibraryCard.tsx
│   │   │   ├── LibraryFilters.tsx
│   │   │   ├── PerformanceNote.tsx
│   │   │   └── LibraryStats.tsx
│   │   ├── engagement/                   # NEW
│   │   │   ├── TargetAccountsList.tsx
│   │   │   ├── ReplyGenerator.tsx
│   │   │   ├── EngagementLog.tsx
│   │   │   └── RelationshipMap.tsx
│   │   └── grok-packet/
│   │       ├── PacketPreview.tsx
│   │       ├── PacketModeToggle.tsx      # UPDATED: Draft vs Engagement mode
│   │       ├── PacketConfig.tsx
│   │       └── CopyButton.tsx
│   │
│   ├── lib/
│   │   ├── gemini.ts
│   │   ├── storage.ts
│   │   ├── prompts.ts
│   │   ├── scorer.ts
│   │   ├── grok-packager.ts              # UPDATED: two packet types
│   │   ├── engagement.ts                 # NEW
│   │   └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── store/
│   │   ├── useProfileStore.ts
│   │   ├── useDraftStore.ts
│   │   ├── useLibraryStore.ts
│   │   └── useEngagementStore.ts         # NEW
│   │
│   └── data/
│       └── seedProfile.ts                # NEW: Karan's actual profile as default
│
├── .env.local
├── .env.example
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Seed Profile — Pre-loaded Default Data

**File:** `src/data/seedProfile.ts`

This is Karan's actual profile from Grok analysis. Load this as the default when no profile exists in localStorage. User can update it anytime via the Profile page.

```typescript
import { UserProfile } from "@/types";

export const SEED_PROFILE: UserProfile = {
  name: "Karan",
  twitterHandle: "kwakhare5",
  niche:
    "3rd/4th-year Pune Comp Eng student vibe-coding full-stack AI projects and sharing the raw internship chase.",
  bio: "thanos was right the whole time",

  contentPillars: [
    {
      id: "pillar_1",
      name: "Vibe Coding Logs",
      description:
        "Raw day-in-the-life of building with Claude/Gemini: prompts that worked, failures, quick wins. Short updates + screenshots/code snippets.",
      percentage: 30,
    },
    {
      id: "pillar_2",
      name: "Project Spotlights",
      description:
        "Deep dives or launch threads on GitHub projects (Git-for-Prompts, MemoryPalace, Tonal). Screenshots, tech decisions, lessons. Builds internship credibility.",
      percentage: 25,
    },
    {
      id: "pillar_3",
      name: "AI Tool Reality Checks",
      description:
        "Honest takes on Gemini/Claude (frustrations + hacks), comparisons, student-friendly alternatives. Original insight, not just quote tweets.",
      percentage: 20,
    },
    {
      id: "pillar_4",
      name: "Student Builder Journey",
      description:
        "Internship applications, Pune college life + building, refreshing emails, rejections/wins. Relatable emotional arc.",
      percentage: 15,
    },
    {
      id: "pillar_5",
      name: "Quick Wins & Resources",
      description:
        "Prompt templates, small hacks, GitHub tips tailored for Indian CS students.",
      percentage: 10,
    },
  ],

  voice: {
    tone: "Casual, relatable Pune student with dry humor and frustrated optimism. Punchy sentences, light emojis, first-person storytelling about real builds. Authentic without trying too hard.",
    avoidList: [
      "Pure reactions without original value",
      "Generic 'just use AI bro' advice",
      "Walls of text without visuals or context",
      "Boastful flexing",
      "Corporate jargon",
      "Overused 'Day X of building' without unique angle",
      "Quote tweeting without adding insight",
    ],
    exampleTweets: [
      "submitted my Instamart-Intelligence project to Swiggy Builders last week and I've been refreshing Gmail like it's gonna pay my fees 😭 day 5 still nothing. @Swiggy if you're seeing this, the WhatsApp restock agent actually works lmao. built it all with Claude in ~3 weekends",
      "vibe coding Git-for-Prompts today: Claude generated 80% of the Monaco editor integration perfectly. then it hallucinated the Drizzle schema twice 💀 pro tip: explicit 'no assumptions on relationships' in the prompt fixed it. repo link in bio if you version control prompts too",
      "Pune college + building full-stack: lectures till 4, then vibe code till 2am because Claude doesn't judge your sleep schedule. shipped the prompt VCS today. if you're a 3rd year feeling behind, you're not — just start documenting the mess. it compounds.",
      "just shipped a small feature to my pantry AI that predicts inventory from past Swiggy orders. took 2 hours with Gemini for the prediction logic + WhatsApp integration. feels illegal how fast this stuff moves now. what's one AI hack that's saved you hours?",
    ],
    writingStyle:
      "Start with strong personal hook or specific observation. Use casual Indian student slang lightly (vro, fr, lmao) but pair with clear value. End with CTA or question when natural. First-person storytelling. Punchy, not padded.",
  },

  audience: {
    currentAudience:
      "Small group of similar students reacting to AI gripes and tool frustrations",
    targetAudience:
      "2nd-4th year CS/Comp Eng students in India (Tier 2/3 cities), aspiring full-stack/AI builders targeting MAANG/unicorns, indie hackers starting out",
    audienceProblems: [
      "Don't know what to build",
      "Struggling with AI prompt engineering for real apps",
      "Can't deploy projects confidently",
      "Don't know how to stand out on GitHub for internships",
      "Feel behind compared to peers",
    ],
    audienceGoals: [
      "Ship fast with AI tools",
      "Land good internship offers",
      "Build a visible GitHub portfolio",
      "Find repeatable AI workflows without senior mentorship",
    ],
  },

  goals: [
    "Grow Twitter following",
    "Get visibility for projects (Tonal, Git-for-Prompts, MemoryPalace)",
    "Land internships at top companies (Swiggy, MAANG)",
    "Build AI-native builder personal brand",
    "Connect with Indian dev community",
  ],

  admiredAccounts: [
    "shydev69",
    "buildwithsid",
    "adxtyahq",
    "dhruvtwt_",
    "bit2swaz",
    "kalashvasaniya",
  ],

  postingFrequency: "1 original tweet/day + 5-10 replies/day",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

---

## TypeScript Data Models

**File:** `src/types/index.ts`

```typescript
// ─── PROFILE ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  twitterHandle: string;
  niche: string;
  bio: string;
  contentPillars: ContentPillar[];
  voice: VoiceConfig;
  audience: AudienceConfig;
  goals: string[];
  admiredAccounts: string[];
  postingFrequency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  percentage: number; // All pillars must add to 100
}

export interface VoiceConfig {
  tone: string;
  avoidList: string[];
  exampleTweets: string[];
  writingStyle: string;
}

export interface AudienceConfig {
  currentAudience: string;
  targetAudience: string;
  audienceProblems: string[];
  audienceGoals: string[];
}

// ─── BRAIN DUMP ───────────────────────────────────────────────────────────────

export interface BrainDumpSession {
  id: string;
  rawDump: string;
  extractedMoments: ExtractedMoment[];
  generatedDrafts: TweetDraft[];
  createdAt: string;
}

export interface ExtractedMoment {
  id: string;
  insight: string;
  type: MomentType;
}

export type MomentType =
  | "story"
  | "lesson"
  | "opinion"
  | "progress"
  | "question"
  | "observation";

// ─── TWEET DRAFT ──────────────────────────────────────────────────────────────

export interface TweetDraft {
  id: string;
  content: string;
  isThread: boolean;
  threadTweets?: string[];
  pillarId: string;
  momentType: MomentType;
  hookVariations: string[];
  algorithmScore: AlgorithmScore;
  sessionId?: string;
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
}

export type DraftStatus = "draft" | "polished" | "posted" | "archived";

// ─── ALGORITHM SCORE ──────────────────────────────────────────────────────────

export interface AlgorithmScore {
  overall: number; // 0-100
  hookStrength: SignalScore;
  replyBait: SignalScore;
  specificity: SignalScore;
  emotionalTrigger: SignalScore;
  length: SignalScore;
  noLinksInBody: SignalScore;
  ctaQuality: SignalScore;
  threadPotential: SignalScore;
  suggestions: string[];
  calculatedAt: string;
}

export interface SignalScore {
  score: number; // 0-10
  label: "Strong" | "Weak" | "Fail";
  reason: string;
}

// ─── LIBRARY ─────────────────────────────────────────────────────────────────

export interface LibraryEntry {
  id: string;
  tweet: string;
  isThread: boolean;
  threadTweets?: string[];
  pillarId: string;
  algorithmScore?: AlgorithmScore;
  postedAt?: string;
  performanceNote?: string;
  grokRefinement?: string;
  tags: string[];
  createdAt: string;
}

// ─── ENGAGEMENT ───────────────────────────────────────────────────────────────

export interface TargetAccount {
  id: string;
  handle: string; // without @
  name: string;
  why: string;
  temperature: AccountTemperature;
  lastEngaged?: string;
  engagementCount: number;
  notes?: string;
  addedAt: string;
}

export type AccountTemperature =
  | "cold" // Never interacted
  | "warm" // Replied 1-3 times
  | "hot" // Regular interaction, they reply back
  | "connection"; // DMed or had a real conversation

export interface EngagementOpportunity {
  id: string;
  tweetText: string;
  tweetAuthorHandle: string;
  tweetUrl?: string;
  opportunityType: OpportunityType;
  replies: GeneratedReply[];
  status: "pending" | "replied" | "skipped";
  createdAt: string;
  repliedAt?: string;
}

export type OpportunityType =
  | "add_value"
  | "share_experience"
  | "ask_question"
  | "agree_expand"
  | "respectful_push";

export interface GeneratedReply {
  id: string;
  content: string;
  replyType: OpportunityType;
  tone: string;
}

export interface EngagementLog {
  id: string;
  targetHandle: string;
  tweetSnippet: string; // First 60 chars of tweet replied to
  replyUsed: string;
  repliedAt: string;
  outcome?: string; // "they replied back", "got 3 likes", etc.
}

// ─── GROK PACKET ──────────────────────────────────────────────────────────────

export type GrokPacketMode = "draft" | "engagement";

export interface DraftPacketConfig {
  mode: "draft";
  selectedDraftIds: string[];
  includeScores: boolean;
  customRequest: string;
}

export interface EngagementPacketConfig {
  mode: "engagement";
  targetAccounts: string[];
  topicKeywords: string[];
  opportunityTypes: OpportunityType[];
  customRequest: string;
}

export type GrokPacketConfig = DraftPacketConfig | EngagementPacketConfig;
```

---

## Module 1: Profile Engine

**Page:** `/profile`  
**Storage:** Supabase `profiles` table → `UserProfile`

### Seed Data Behavior

```typescript
// src/lib/storage.ts
export async function getProfile(userId: string): Promise<UserProfile> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data ?? SEED_PROFILE; // Falls back to real seed data on first load
}
```

### UI

```
┌─────────────────────────────────────────┐
│  PROFILE  ·  Last updated: 2 days ago  │
├─────────────────────────────────────────┤
│  Basic Info                             │
│  Name | Handle | Bio | Niche           │
├─────────────────────────────────────────┤
│  Content Pillars                        │
│  Each pillar: name + description + %   │
│  [Warning if % doesn't add to 100]     │
├─────────────────────────────────────────┤
│  Your Voice                             │
│  Tone | Writing style                  │
│  Never write: [tag chips]              │
├─────────────────────────────────────────┤
│  Example Tweets (5-10)                 │
│  [one per textarea box]                │
├─────────────────────────────────────────┤
│  Audience                               │
│  Current | Target | Pains | Goals      │
├─────────────────────────────────────────┤
│  Admired Accounts [@handle chip input] │
├─────────────────────────────────────────┤
│  [SAVE] [EXPORT JSON] [IMPORT JSON]    │
└─────────────────────────────────────────┘
```

---

## Module 2: Brain Dump Processor

**Page:** `/brain-dump`

### Gemini Prompt — tuned for Karan's voice

```typescript
// src/lib/prompts.ts

export const BRAIN_DUMP_PROMPT = (
  dump: string,
  profile: UserProfile,
  topPerformers: string,
) => `
You are a Twitter content strategist for ${profile.name} (@${profile.twitterHandle}).

EXACT NICHE: ${profile.niche}

CONTENT PILLARS:
${profile.contentPillars.map((p) => `• ${p.name} (${p.percentage}%): ${p.description}`).join("\n")}

VOICE: ${profile.voice.tone}
WRITING STYLE: ${profile.voice.writingStyle}

NEVER WRITE:
${profile.voice.avoidList.map((a) => `• ${a}`).join("\n")}

EXAMPLE TWEETS (match this energy exactly):
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}

${topPerformers ? `BEST PERFORMING TWEETS SO FAR:\n${topPerformers}` : ""}

RAW BRAIN DUMP:
---
${dump}
---

TASK: Extract 4-6 tweet-worthy moments. For each:
- Write one tweet in their EXACT voice (casual, punchy, first-person, specific)
- Sound like a Pune CS student — NOT a tech influencer
- Name the tool, project, error, or result specifically
- 2 alternative hook variations (different first line only)
- Suggest content pillar
- Identify moment type

RULES:
• HARD LIMIT: 280 characters max per tweet (free account limit — never exceed this)
• No links in tweet body (links go in first reply only)
• No generic advice — specific always beats vague
• Natural CTA or question where it fits
• If it's a build update: name the project + what broke or worked
• Light emojis where natural — don't force them
• Target: 3 strong drafts. Do not pad with weak moments — 3 great > 6 mediocre

RESPOND ONLY IN THIS JSON (no preamble, no markdown fences):
{
  "moments": [
    {
      "id": "m1",
      "insight": "core insight in one sentence",
      "type": "progress",
      "pillarName": "Vibe Coding Logs",
      "tweet": "full tweet text here",
      "hookVariations": ["alt hook 1", "alt hook 2"],
      "isThread": false,
      "threadTweets": []
    }
  ]
}
`;
```

### UI Flow

```
Step 1 — Dump
┌─────────────────────────────────────────┐
│  WHAT HAPPENED TODAY?                  │
│                                         │
│  [Big textarea — write like you talk]  │
│                                         │
│  Prompts: What did you build? What     │
│  broke? What did you learn? Any take?  │
│  How's the internship hunt going?      │
│                                         │
│  [EXTRACT TWEETS →]                    │
└─────────────────────────────────────────┘

Step 2 — Review Moments
┌─────────────────────────────────────────┐
│  FOUND 5 TWEET-WORTHY MOMENTS          │
│  [progress] Fixed Drizzle schema bug   │
│  [lesson] Prompt clarity saves hours   │
│  [story] Refreshing Swiggy email...    │
│  [opinion] Gemini context drift        │
│  [progress] Shipped library filter     │
│                                         │
│  [GENERATE ALL TWEETS]                 │
└─────────────────────────────────────────┘

Step 3 — Drafts
┌─────────────────────────────────────────┐
│  5 DRAFTS READY                        │
│  [DraftCard x5]                        │
│  Each: tweet text | score badge        │
│        pillar tag | hook dropdown      │
│        [Save] [Workshop] [Grok Packet] │
└─────────────────────────────────────────┘
```

---

## Module 3: Tweet Workshop

**Page:** `/workshop`

### Hook Generator Prompt

```typescript
export const HOOK_GENERATOR_PROMPT = (tweet: string, profile: UserProfile) => `
Twitter hook specialist for ${profile.name} — ${profile.niche}

VOICE: ${profile.voice.tone}
EXAMPLE TWEETS: ${profile.voice.exampleTweets.slice(0, 3).join(" || ")}

TWEET TO REWORK:
${tweet}

Generate 5 different hook variations. Each uses a different technique:
1. Specific frustration or failure opener (relatable Karan energy)
2. Specific number or result ("built X in Y hours")
3. Personal story opener ("last week I..." / "been doing X for days now...")
4. Curiosity gap (make them need to read the rest)
5. Blunt take that will get replies

RULES:
- Sound like a Pune CS student — not a tech influencer
- Each hook under 100 chars (it's just the first line)
- Full tweet with the hook must stay under 280 chars total (free account hard limit)
- Specific, never vague

RESPOND ONLY IN JSON:
{
  "hooks": [
    { "technique": "frustration opener", "text": "hook text here" }
  ]
}
`;
```

### Thread Builder Prompt

```typescript
export const THREAD_BUILDER_PROMPT = (idea: string, profile: UserProfile) => `
Twitter thread writer for ${profile.name} (@${profile.twitterHandle}).

NICHE: ${profile.niche}
VOICE: ${profile.voice.tone}
AUDIENCE: ${profile.audience.targetAudience}

IDEA: ${idea}

Build a 5-7 tweet thread.

STRUCTURE:
Tweet 1: Hook — specific, personal, stops scroll. Must work standalone.
Tweets 2-5: One clear point each. Real specifics. No padding.
Tweet 6 (optional): Unexpected twist or honest reflection
Last tweet: Strong CTA — a question or insight, NOT "follow me"

RULES:
• Each tweet STRICTLY under 280 chars (free account hard limit — verify character count)
• No links in any tweet body
• Name tools, project names, real errors — not vague concepts
• Sound like Karan, not a growth hacker
• Number format: 1/ 2/ 3/
• 1 thread per week maximum — this is Saturday content

RESPOND ONLY IN JSON:
{
  "thread": [
    { "number": 1, "content": "tweet text" }
  ]
}
`;
```

### Tightener

Paste a tweet over 280 chars or that feels padded → get a tighter version. Shows live character count. Removes filler, makes every word earn its place.

### Quote Tweet Generator (NEW — 2-4/day target)

**Why:** 2-4 quote tweets/day = low-effort visibility. When you quote a tweet from a bigger account, their followers see your take. It's free reach.

```typescript
export const QUOTE_TWEET_PROMPT = (
  originalTweet: string,
  authorHandle: string,
  profile: UserProfile,
) => `
Generate quote tweet takes for ${profile.name} (@${profile.twitterHandle}).

NICHE: ${profile.niche}
VOICE: ${profile.voice.tone}

TWEET BY @${authorHandle}:
"${originalTweet}"

Generate 3 quote tweet options — the text Karan writes ABOVE the quoted tweet.

Option A: Agree + add his own related experience or project insight
Option B: Nuanced take or honest pushback (respectful, not aggressive)
Option C: Question that opens conversation with original poster's audience

RULES:
✅ Under 200 characters (room for the quoted tweet embed)
✅ Adds genuine value — not just "this 🔥"
✅ Sounds like a Pune CS student — authentic, not polished
✅ Makes people want to read the original AND check Karan's profile
❌ Never just agree with nothing added
❌ No "As a student..." opener (overused)
❌ No promotional energy

RESPOND ONLY IN JSON:
{
  "quotes": [
    { "option": "A", "type": "agree_expand", "text": "quote text" },
    { "option": "B", "type": "nuanced_take", "text": "quote text" },
    { "option": "C", "type": "question", "text": "quote text" }
  ]
}
`;
```

**UI:** Paste tweet → select type → 3 options → copy best → log it.

---

## Module 4: Algorithm Scorer

**Page:** `/scorer`  
**No AI — pure logic in `src/lib/scorer.ts`**

```typescript
export function scoreTweet(tweet: string, isThread: boolean): AlgorithmScore {
  return {
    overall: calculateOverall(tweet, isThread),
    hookStrength: scoreHook(tweet),
    replyBait: scoreReplyBait(tweet),
    specificity: scoreSpecificity(tweet),
    emotionalTrigger: scoreEmotionalTrigger(tweet),
    length: scoreLength(tweet, isThread),
    noLinksInBody: scoreLinks(tweet),
    ctaQuality: scoreCTA(tweet),
    threadPotential: scoreThreadPotential(tweet, isThread),
    suggestions: generateSuggestions(tweet, isThread),
    calculatedAt: new Date().toISOString(),
  };
}

function scoreHook(tweet: string): SignalScore {
  const firstWords = tweet.split(" ").slice(0, 8).join(" ").toLowerCase();
  // Strong signals: number in first 3 words, "I", specific tool name,
  //                frustration word, strong verb, question mark
  // Weak signals: "So I", "Just", "Hey", "Thread:", vague opener
}

function scoreReplyBait(tweet: string): SignalScore {
  // Replies > Retweets in X algorithm weighting
  // Strong: ends with genuine question, controversial take,
  //         "change my mind", relatable frustration, fill-in-blank
  // Weak: "thoughts?", vague CTA
  // Fail: retweet ask
}

function scoreSpecificity(tweet: string): SignalScore {
  // Count specifics: tool names, project names, numbers, timeframes,
  //                  error types, percentages, named people
  // Each specific = +1.5 points (max 10)
}

function scoreEmotionalTrigger(tweet: string): SignalScore {
  // Detect: curiosity gap, relatability, aspiration, frustration,
  //         hope, humor, FOMO
  // At least one trigger = 7+, Two = 9+, None = 3
}

function scoreLength(tweet: string, isThread: boolean): SignalScore {
  const chars = tweet.length;
  // HARD FAIL: over 280 chars = violates free account limit
  // Single tweet sweet spots: < 100 chars (punchy) OR 220-270 chars (contextual)
  // Awkward zone: 100-200 chars (neither punchy nor contextual)
  // Thread first tweet: under 200 chars is ideal
  // Show live character count in UI (280 - chars remaining)
}

function scoreLinks(tweet: string): SignalScore {
  // http:// or https:// in body = reach suppression
  // Score: no links = 10/10, link present = 2/10
  // Tip shown: "Add link in first reply instead"
}

function scoreCTA(tweet: string): SignalScore {
  // High (8-10): specific question ("what's one AI hack that saved you hours?")
  // Medium (5-7): "thoughts?", "let me know"
  // Low (2-4): "RT if you agree", "follow for more"
  // None (neutral, 5): pure story tweet — no CTA needed
}
```

### Score Display

```
┌─────────────────────────────────────────┐
│  OVERALL: 74/100                       │
│  ████████████░░░░  Good                │
├─────────────────────────────────────────┤
│  Hook Strength      8/10   Strong ✅   │
│  Reply Bait         5/10   Weak ⚠️     │
│  Specificity        9/10   Strong ✅   │
│  Emotional Trigger  7/10   Strong ✅   │
│  Length             6/10   Weak ⚠️     │
│  No Links           10/10  Pass ✅     │
│  CTA Quality        4/10   Weak ⚠️     │
│  Thread Potential   8/10   Strong ✅   │
├─────────────────────────────────────────┤
│  FIX THESE                             │
│  • End with a specific question        │
│  • Tweet is 210 chars — cut to <100   │
│    or expand to 240+                   │
└─────────────────────────────────────────┘
```

---

## Module 5: Tweet Library

**Page:** `/library`  
**Storage:** `tweetOS_library` → `LibraryEntry[]`

### Features

- Filter: status / pillar / score range / date
- Full text search
- Add performance note after posting ("47 likes, 5 new followers, 2 DMs")
- Mark as posted with date
- Send any tweet to Workshop
- Export as JSON or CSV

### Grows-With-You

```typescript
export function getTopPerformers(library: LibraryEntry[]): string {
  return library
    .filter((e) => e.performanceNote && e.postedAt)
    .slice(0, 5)
    .map((e) => e.tweet)
    .join("\n---\n");
}
// Injected into Brain Dump prompt — Gemini learns what works for Karan over time
```

---

## Module 6: Grok Packet Generator — TWO MODES

**Page:** `/grok-packet`

### Mode 1: Draft Packet

```typescript
// src/lib/grok-packager.ts

export function generateDraftPacket(
  profile: UserProfile,
  drafts: TweetDraft[],
  config: DraftPacketConfig,
): string {
  return `
═══════════════════════════════════════
TWEETOS — DRAFT PACKET
${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
═══════════════════════════════════════

═══ WHO I AM ═══
@${profile.twitterHandle} — ${profile.niche}
Voice: ${profile.voice.tone}
Audience: ${profile.audience.targetAudience}
Goals: ${profile.goals.join(" | ")}

Content Pillars:
${profile.contentPillars.map((p) => `• ${p.name} (${p.percentage}%)`).join("\n")}

Accounts I want to be like: ${profile.admiredAccounts.map((a) => "@" + a).join(", ")}

═══ TODAY'S DRAFTS ═══
${drafts
  .map(
    (d, i) => `
DRAFT ${i + 1} [local score: ${d.algorithmScore.overall}/100]:
${
  d.isThread
    ? d.threadTweets?.map((t, n) => `${n + 1}/ ${t}`).join("\n")
    : d.content
}

Flagged weaknesses: ${d.algorithmScore.suggestions.join(", ")}
Pillar: ${d.pillarId}
`,
  )
  .join("\n")}

═══ WHAT I NEED ═══
${config.customRequest}

ALWAYS DO THESE:
1. Score each draft 1-10 with specific reasoning
2. Find 2-3 real tweets from last 48hrs on similar topics that performed well — show me links
3. Rewrite the strongest draft to maximize engagement
4. Give 2 angles on today's theme I haven't considered
5. Which draft to post first and exactly why
6. Any trending topic I can hook my content onto right now?
7. Best posting time today for Indian audience (IST)?

═══════════════════════════════════════
  `.trim();
}
```

### Mode 2: Engagement Packet (NEW)

```typescript
export function generateEngagementPacket(
  profile: UserProfile,
  config: EngagementPacketConfig,
): string {
  return `
═══════════════════════════════════════
TWEETOS — ENGAGEMENT PACKET
${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
═══════════════════════════════════════

═══ WHO I AM ═══
@${profile.twitterHandle} — ${profile.niche}
Voice: ${profile.voice.tone}
Projects I've shipped: Tonal (Chrome extension for tone translation), Git-for-Prompts (prompt version control), MemoryPalace (RAG second brain)
My value-add in replies: Real student build experience, specific AI tool failures and fixes, Indian builder context, vibe coding workflows

═══ FIND ME TWEETS TO REPLY TO ═══

Check recent tweets (last 24-48 hours) from these accounts:
${config.targetAccounts.map((h) => `• @${h}`).join("\n")}

Also search for recent tweets about:
${config.topicKeywords.map((k) => `• ${k}`).join("\n")}

═══ WHAT I NEED ═══

Find me 10-12 tweets I can genuinely reply to.

For each tweet, give me:
1. The tweet text and author handle
2. Why it's a good opportunity for me specifically
3. What value I can add (not generic praise — what do I know that's relevant?)
4. 3 reply options in my voice:
   - Option A: casual/relatable
   - Option B: adds specific insight or experience
   - Option C: asks a genuine question that starts a conversation

TWEET SELECTION CRITERIA (prioritize these):
• Tweets where I have direct project experience to reference
• Questions about Claude/Gemini where I have real answers from building
• Student or internship struggles I've actually lived
• Indian dev community discussions
• Tweets from my admired accounts with < 20 replies (discovery window still open)
• Tweets about vibe coding, building with AI, shipping fast

ALSO FIND ME 3-4 QUOTE TWEET OPPORTUNITIES:
Look for tweets I can quote with my own take (2-4 quote tweets/day is ideal visibility with low effort).
For each, give me:
- The tweet URL/handle
- A short take I could add (under 200 chars, in my voice)

REPLY RULES (all options must follow these):
✅ Under 280 characters (hard limit — free account)
✅ Specific — reference what they said exactly
✅ Add real value (tip, honest take, or genuine question)
✅ Sound like a Pune CS student, not a tech influencer
❌ Never start with "Great point!" or "Couldn't agree more!"
❌ No self-promotion as the main message
❌ No vague compliments

═══ RELATIONSHIP BUILDING ═══
After the tweet list, also tell me:
- Which 2-3 accounts from my admired list are worth doubling down on this week?
- Is there an active thread I should jump into (not just a single reply)?
- Any new account posting great content I should add to my engage list?

${config.customRequest ? `EXTRA: ${config.customRequest}` : ""}

═══════════════════════════════════════
  `.trim();
}
```

### UI — Mode Toggle

```
┌─────────────────────────────────────────┐
│  GROK PACKET                           │
│                                         │
│  [DRAFT MODE ●] [ENGAGEMENT MODE]      │
├─────────────────────────────────────────┤
│  — DRAFT MODE —                        │
│  Select drafts to include:             │
│  ☑ Draft 1 (74/100)                   │
│  ☑ Draft 2 (81/100)                   │
│  ☐ Draft 3 (52/100)                   │
│                                         │
│  Custom request for Grok:             │
│  [textarea]                            │
│                                         │
│  [GENERATE DRAFT PACKET]              │
├─────────────────────────────────────────┤
│  — ENGAGEMENT MODE —                  │
│  Target accounts (from Engagement):   │
│  ☑ @shydev69  ☑ @buildwithsid  ...   │
│                                         │
│  Topic keywords (from your pillars):  │
│  vibe coding, gemini, claude,          │
│  student builder, Indian dev...        │
│  [edit keywords]                       │
│                                         │
│  [GENERATE ENGAGEMENT PACKET]         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ PACKET PREVIEW                  │   │
│  │ [full formatted packet]         │   │
│  └─────────────────────────────────┘   │
│  [COPY FULL PACKET ←]                  │
│                                         │
│  → Open fresh Grok chat               │
│  → Paste this packet                  │
│  → Get tweets/refinements from Grok   │
│  → Bring replies back to Reply Gen    │
└─────────────────────────────────────────┘
```

---

## Module 7: Engagement Engine (NEW)

**Page:** `/engagement`  
**Purpose:** Find tweets to reply to, generate smart on-brand replies, track relationships, build real connections over time.

### Why This Module Exists

Replies are how you get discovered. When you reply to an account with 5K followers, their followers see your reply. Consistent, valuable replies to the same accounts build relationships that eventually lead to shoutouts, collabs, and follows. This module makes that systematic without being robotic.

---

### Sub-module 7A: Target Accounts

**Storage:** `tweetOS_target_accounts` → `TargetAccount[]`  
**Pre-seeded from Karan's admired accounts list.**

**Temperature system:**

- Cold (never interacted) → default for all seed accounts
- Warm (replied 1-3 times) → auto-updated from engagement log
- Hot (4+ replies or they replied back) → manually mark or auto-detect from log
- Connection (DM or real conversation) → manually mark

**UI:**

```
┌─────────────────────────────────────────┐
│  TARGET ACCOUNTS  [+ ADD]              │
├─────────────────────────────────────────┤
│  🔥 HOT                                │
│  [none yet — keep engaging]            │
├─────────────────────────────────────────┤
│  🌡️ WARM                               │
│  [accounts as you warm them]           │
├─────────────────────────────────────────┤
│  ❄️ COLD (6)                           │
│  @shydev69 · 0 replies · Grind/humor  │
│  [Reply Gen] [Include in Packet]      │
│                                         │
│  @buildwithsid · 0 replies · Builder  │
│  [Reply Gen] [Include in Packet]      │
│  [... rest of accounts]               │
└─────────────────────────────────────────┘
```

---

### Sub-module 7B: Reply Generator

**Most-used feature. The daily loop.**

**Full workflow:**

1. Grok engagement packet returns 8-10 tweet opportunities
2. Copy each tweet text from Grok
3. Come to Reply Generator → paste tweet
4. Select opportunity type
5. Gemini generates 3 replies in Karan's voice
6. Pick one, refine, copy, go reply on X
7. Tap "Log Reply" — done

**Reply Generator Prompt:**

```typescript
export const REPLY_GENERATOR_PROMPT = (
  originalTweet: string,
  authorHandle: string,
  opportunityType: OpportunityType,
  profile: UserProfile,
) => `
Generate Twitter replies for ${profile.name} (@${profile.twitterHandle}).

THEIR IDENTITY: ${profile.niche}
THEIR VOICE: ${profile.voice.tone}
THEIR PROJECTS: Tonal (Chrome extension for tone translation in Gmail/Slack/WhatsApp), Git-for-Prompts (GitHub-style version control for AI prompts, built with Next.js + Supabase + Monaco Editor), MemoryPalace (second brain RAG app with pgvector)
THEIR EXPERTISE: Building full-stack AI apps with Claude/Gemini as a solo CS student in Pune

TWEET THEY'RE REPLYING TO (by @${authorHandle}):
"${originalTweet}"

OPPORTUNITY TYPE: ${opportunityType}

Generate 3 reply options:
Option A: casual and relatable (sounds like texting a friend)
Option B: adds specific insight or real experience from their projects
Option C: asks a genuine question that opens a real conversation

RULES FOR ALL OPTIONS:
✅ HARD LIMIT: Under 280 characters (free account — verify count)
✅ Reference what @${authorHandle} said specifically — not a generic reply
✅ Sound exactly like a Pune CS student, not a polished influencer
✅ Only mention projects if genuinely relevant and organic
❌ Never start with "Great point!" / "So true!" / "100%!"
❌ No promotional energy
❌ No vague compliments

RESPOND ONLY IN JSON:
{
  "context": "one sentence on why this is a good opportunity for Karan",
  "replies": [
    {
      "option": "A",
      "tone": "casual",
      "content": "reply text"
    },
    {
      "option": "B",
      "tone": "insightful",
      "content": "reply text"
    },
    {
      "option": "C",
      "tone": "question",
      "content": "reply text"
    }
  ]
}
`;
```

**UI:**

```
┌─────────────────────────────────────────┐
│  REPLY GENERATOR                       │
├─────────────────────────────────────────┤
│  TWEET TO REPLY TO                     │
│  [paste tweet text here]               │
│                                         │
│  Author: @[handle]                     │
│                                         │
│  I want to:                            │
│  ○ Add value or insight               │
│  ○ Share related experience            │
│  ○ Ask a genuine question              │
│  ○ Agree and expand                    │
│  ○ Push back respectfully              │
│                                         │
│  [GENERATE REPLIES]                    │
├─────────────────────────────────────────┤
│  Context: [why this is a good opp]     │
├─────────────────────────────────────────┤
│  OPTION A  [casual]                    │
│  [reply text — 140 chars]              │
│  [COPY]                               │
│                                         │
│  OPTION B  [insightful]               │
│  [reply text — 180 chars]              │
│  [COPY]                               │
│                                         │
│  OPTION C  [question]                 │
│  [reply text — 120 chars]              │
│  [COPY]                               │
├─────────────────────────────────────────┤
│  After replying:                       │
│  [LOG REPLY] — takes 5 seconds        │
└─────────────────────────────────────────┘
```

---

### Sub-module 7C: Engagement Log

**Storage:** `tweetOS_engagement_log` → `EngagementLog[]`

Simple, fast. One tap after replying to log it.

Fields:

- Who you replied to (@handle)
- Tweet snippet (first 60 chars — auto-filled from generator)
- Reply you used (auto-filled from generator)
- Time (auto)
- Outcome (optional, fill later): "they replied", "got 3 likes", "they followed me"

**Why log it:** After 4 weeks, you can see which accounts are responsive, which topics in replies get traction, and who's worth prioritizing.

---

### Sub-module 7D: Relationship Temperature Auto-Update

```typescript
// src/lib/engagement.ts

export function updateAccountTemperature(
  account: TargetAccount,
  log: EngagementLog[],
): AccountTemperature {
  const accountReplies = log.filter((l) => l.targetHandle === account.handle);
  const positiveOutcomes = accountReplies.filter(
    (l) => l.outcome?.includes("replied") || l.outcome?.includes("followed"),
  );

  if (positiveOutcomes.length > 0) return "hot";
  if (accountReplies.length >= 4) return "hot";
  if (accountReplies.length >= 1) return "warm";
  return "cold";
}
```

---

### The Daily Workflow (30-45 min total)

```
MORNING — 10AM-12PM IST (10-15 min)
[Green zone — Indian student/dev audience is active]

1. Grok Packet page → Engagement Mode
2. Generate packet (30 sec — pre-filled from target accounts + pillar keywords)
3. Copy → fresh Grok chat → paste
4. Grok returns 10-12 tweet opportunities + 3-4 quote tweet opportunities
5. Back to TweetOS → Reply Generator
6. Pick 5-8 tweets → generate replies → copy → go reply on X
7. Add 2-4 quote tweets with your take
8. Log replies (tap "Log Reply" — 5 sec each)

Target: 5-8 replies + 2-3 quote tweets done before 12PM
────────────────────────────────────────────
EVENING — 6PM-9PM IST (15-20 min)
[Green zone — peak engagement, post here for early snowball effect]

9. Reply to anyone who engaged your posts today (boosts algorithm massively)
10. Brain Dump → dump what happened during coding session
11. Review 3 moments → generate 3 drafts
12. Scorer auto-scores — pick the strongest one
13. Grok Packet → Draft Mode → add best 1-2 drafts
14. Copy → fresh Grok chat → validate + refine
15. POST the anchor tweet (post at 6-9PM IST for max early engagement)
16. 5 more replies on niche tweets
17. Mark tweet as posted in Library

Target: 1 anchor post + 1-2 quick updates + 5 replies
────────────────────────────────────────────
OPTIONAL — Before bed (5 min)
18. Quick scroll — reply to any late engagement
19. Like/boost relevant content

WEEKLY RHYTHM:
Mon-Fri: 2-3 posts/day + 10-15 replies/day (standard)
Saturday: 3-4 posts + 1 thread (deeper project breakdown)
Sunday: 1-2 lighter posts + catch-up engagement (lighter day)
Weekly total: ~15-20 original posts (very achievable, no burnout)

TOTAL DAILY: ~35-45 min — sustainable even during exams
```

---

## Dashboard

**Page:** `/`

```
┌─────────────────────────────────────────┐
│  hey karan 👋                          │
│  Monday · Pune, IST                    │
├─────────────────────────────────────────┤
│  POSTING WINDOW                        │
│  🟢 6PM–9PM  ← you are here           │
│  Best time to post now                 │
│  [Morning 10AM-12PM] [Evening 6PM-9PM] │
├─────────────────────────────────────────┤
│  TODAY'S TARGETS                       │
│  Replies:   [████████░░] 8/10 ✅       │
│  Posts:     [████░░░░░░] 1/3           │
│  → Post anchor tweet  [BRAIN DUMP]    │
│  Quotes:    [██░░░░░░░░] 2/4           │
│  → Grok packet ready  [OPEN]          │
├─────────────────────────────────────────┤
│  THIS WEEK                             │
│  Posts 8  Replies 47  Streak 4d 🔥    │
├─────────────────────────────────────────┤
│  RELATIONSHIP STATUS                   │
│  🔥 Hot 0  🌡️ Warm 2  ❄️ Cold 4       │
│  Keep warming @shydev69, @buildwithsid │
├─────────────────────────────────────────┤
│  LAST POST                             │
│  "vibe coding Git-for-Prompts..."     │
│  2 days ago · [Add performance note]  │
│  ⚠️ Post something today — streak!    │
└─────────────────────────────────────────┘
```

### Posting Window Logic

```typescript
// src/lib/utils.ts
export function getPostingWindowStatus(): {
  status: "green" | "yellow" | "off";
  label: string;
  suggestion: string;
} {
  const now = new Date();
  const istHour = (now.getUTCHours() + 5.5) % 24; // Convert to IST

  if (istHour >= 10 && istHour < 12) {
    return {
      status: "green",
      label: "🟢 Morning window (10AM-12PM)",
      suggestion: "Great time for replies and quote tweets",
    };
  }
  if (istHour >= 18 && istHour < 21) {
    return {
      status: "green",
      label: "🟢 Evening window (6PM-9PM)",
      suggestion: "Best time to post anchor tweet — max early engagement",
    };
  }
  if ((istHour >= 12 && istHour < 18) || (istHour >= 21 && istHour < 23)) {
    return {
      status: "yellow",
      label: "🟡 Okay window",
      suggestion: "Can engage, but save anchor post for evening",
    };
  }
  return {
    status: "off",
    label: "🔴 Low activity time",
    suggestion: "Save energy — post during 10AM-12PM or 6PM-9PM",
  };
}
```

---

## Supabase Database Schema

> **Why Supabase:** You deploy to Vercel and open the same URL on phone + PC. Both devices hit the same DB. Zero data loss, zero export/import dance.

```sql
-- Run this in Supabase SQL editor once

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  data jsonb not null,  -- Full UserProfile as JSON
  updated_at timestamptz default now()
);

create table brain_dump_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  data jsonb not null,  -- BrainDumpSession as JSON
  created_at timestamptz default now()
);

create table drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  data jsonb not null,  -- TweetDraft as JSON
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  data jsonb not null,  -- LibraryEntry as JSON
  created_at timestamptz default now()
);

create table target_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  data jsonb not null,  -- TargetAccount as JSON
  created_at timestamptz default now()
);

create table engagement_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  data jsonb not null,  -- EngagementLog as JSON
  replied_at timestamptz default now()
);

create table stats (
  user_id uuid primary key references auth.users,
  post_streak int default 0,
  reply_streak int default 0,
  total_posted int default 0,
  total_replies int default 0,
  last_posted timestamptz,
  last_replied timestamptz
);

-- Row Level Security — each user sees only their own data
alter table profiles enable row level security;
alter table brain_dump_sessions enable row level security;
alter table drafts enable row level security;
alter table library enable row level security;
alter table target_accounts enable row level security;
alter table engagement_log enable row level security;
alter table stats enable row level security;

create policy "own data" on profiles for all using (auth.uid() = user_id);
create policy "own data" on brain_dump_sessions for all using (auth.uid() = user_id);
create policy "own data" on drafts for all using (auth.uid() = user_id);
create policy "own data" on library for all using (auth.uid() = user_id);
create policy "own data" on target_accounts for all using (auth.uid() = user_id);
create policy "own data" on engagement_log for all using (auth.uid() = user_id);
create policy "own data" on stats for all using (auth.uid() = user_id);
```

### Auth Flow (Magic Link — no password)

```typescript
// src/lib/auth.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// One-tap login — sends magic link to email
export async function signIn(email: string) {
  return supabase.auth.signInWithOtp({ email });
}
```

User opens app → enters email once → clicks magic link in email → logged in on that device. Works the same on phone and PC. No password to remember.

---

## Environment Setup

**`.env.local`** (never commit):

```
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`.env.example`** (commit this):

```
NEXT_PUBLIC_GEMINI_API_KEY=get_free_key_at_aistudio.google.com
NEXT_PUBLIC_SUPABASE_URL=get_from_supabase_project_settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=get_from_supabase_project_settings
```

**Supabase setup (one-time, 5 min):**

1. Go to https://supabase.com → new project (free)
2. Run SQL schema above in SQL editor
3. Copy Project URL + anon key → paste in `.env.local`
4. Add same 3 env vars to Vercel dashboard → redeploy

---

## UI Design Direction

- **Theme:** Dark. Terminal-meets-notes-app.
- **Background:** `#0A0A0A`
- **Surface:** `#111111` (cards, inputs)
- **Text:** `#F0F0F0`
- **Accent:** `#3B82F6` (electric blue — primary actions)
- **Warn:** `#F59E0B` (amber — weak scores)
- **Pass:** `#10B981` (green — strong scores)
- **Fail:** `#EF4444` (red — fail scores)
- **Temperature:** Cold `#60A5FA` | Warm `#FBBF24` | Hot `#F97316` | Connection `#A78BFA`
- **Font:** Geist Mono for tweet text / Geist for UI
- **Mobile:** Bottom tab bar (Home | Dump | Engage | Library | Grok) — 5 tabs, always visible
- **No decorative elements.** Every element earns its place.

---

## Build Phases

### Phase 1 — Foundation (Days 1-2) ✅ DONE

**Model: Claude Sonnet 4.6** — Best for scaffolding, file structure, boilerplate.

- [x] Init Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- [x] File structure
- [x] Sidebar (desktop) + Bottom tab bar (mobile) — 5 tabs: Home | Dump | Engage | Library | Grok
- [x] Supabase client setup (`src/lib/supabase/`) + Zustand stores
- [x] Auth page — magic link login (email only, no password)
- [x] Profile page — seed profile loads on first login, fully editable
- [x] CLAUDE.md at root

### Phase 2 — Core AI Loop (Days 3-4) ✅ DONE

**Model: Claude Sonnet 4.6** — Best for wiring AI integrations and complex component logic.

- [x] Gemini integration (`src/lib/gemini.ts`) — `geminiJSON<T>()` wrapper, lazy client init, strips markdown fences
- [x] Brain Dump page — textarea → Gemini extract → DraftCards (3-step flow)
- [x] DraftCard component with live char count (280 limit), hook variation picker, save/post actions
- [x] `src/lib/prompts.ts` — BRAIN_DUMP_PROMPT, HOOK_GENERATOR_PROMPT, THREAD_BUILDER_PROMPT, QUOTE_TWEET_PROMPT
- [x] Save to Supabase `drafts` table (wires in when real Supabase keys added)

### Phase 3 — Scoring (Day 5) ✅ DONE

**Model: Gemini 3.5 Flash (Medium)** — Pure logic/math, no complex architecture. Fast and cheap.

- [x] All 8 scorer signals in `src/lib/scorer.ts`
- [x] 280-char hard limit check (separate from other signals — this is a FAIL not a weak)
- [x] Live character counter on all tweet inputs across the app
- [x] ScoreCard UI with improvement tips

### Phase 4 — Engagement Engine (Days 6-7) ✅ DONE

**Model: Claude Sonnet 4.6** — Most complex module, needs best reasoning for prompt design.

- [x] Target Accounts list (pre-seeded from profile — 6 accounts from admiredAccounts, cold/warm/hot/connection)
- [x] Reply Generator — full flow with Gemini (280 char enforced, 3 options A/B/C, copy + log)
- [x] Quote Tweet Generator — `QUOTE_TWEET_PROMPT` in `prompts.ts` (UI in Phase 5 Workshop)
- [x] Engagement Log — one-tap logging, outcome tagging, relative time display
- [x] Temperature auto-update logic (`src/lib/engagement.ts` — pure fn, auto-computes from log)
- [x] Engagement Grok Packet — deferred to Phase 6 (belongs with grok-packet page)

### Phase 5 — Workshop (Days 8-9) ✅ DONE

**Model: Gemini 3.5 Flash (Medium)** — Straightforward UI components, no deep logic.

- [x] Hook Generator
- [x] Thread Builder (1 per week, Saturday content)
- [x] Variation Generator
- [x] Tightener (with live 280-char counter)

### Phase 6 — Grok Packet (Day 10) ✅ DONE

**Model: Gemini 3.5 Flash (Medium)** — Simple template/string generation logic.

- [x] Draft packet generator
- [x] Engagement packet generator (pre-filled, one click)
- [x] Mode toggle UI

### Phase 7 — Library + Dashboard (Day 11) ✅ DONE

**Model: Gemini 3.5 Flash (Medium)** — UI-heavy, data display, filters. No complex logic.

- [x] Library with filters + performance notes + export
- [x] Dashboard with IST posting window indicator (🟢🟡🔴)
- [x] Daily target progress bars (replies, posts, quotes)
- [x] Relationship status summary

### Phase 8 — Polish (Localhost) (Days 12-13) ✅ DONE

- [x] All error / loading / empty states
- [x] Mobile layout QA on actual phone
- [x] Posting window notification logic
- [x] Local env setup for localhost testing
- [x] Full daily workflow test end-to-end (one full day in the system)

---

## CLAUDE.md

Create at project root before starting Phase 1:

```markdown
# TweetOS — Claude Context

## What This Is

Personal Twitter growth system for @kwakhare5.
Two-part workflow:

1. TweetOS (this app) — personalization, drafting, scoring, engagement
2. Grok — real-time Twitter data, validation, tweet discovery

## Owner

Karan — CS student, Pune. Vibe coder. Builds with Claude/Gemini.
Projects: Tonal (Chrome extension), Git-for-Prompts (prompt VCS), MemoryPalace (RAG second brain)
Niche: Indian student builder documenting the AI-native build + internship journey

## Stack

Next.js 15 App Router | TypeScript | Tailwind v4 | shadcn/ui | Gemini 2.5 Flash | Zustand | Supabase (Postgres)

## Absolute Rules

- ALL data stored in Supabase — same URL works on phone and PC.
- Auth: magic link via Supabase Auth. No password.
- Gemini API key: NEXT_PUBLIC_GEMINI_API_KEY in .env.local
- Supabase: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
- All prompts → src/lib/prompts.ts ONLY. Never inline in components.
- All DB calls → src/lib/storage.ts ONLY.
- All types → src/types/index.ts
- Seed profile → src/data/seedProfile.ts (Karan's real profile, auto-loads on first login)
- Mobile-first. Bottom tab bar = primary nav on mobile.

## 7 Modules

1. Profile — setup + seed data
2. Brain Dump — daily dump → Gemini → drafts
3. Workshop — hook gen, thread builder, variations
4. Scorer — algorithm signals, no AI needed
5. Library — all tweets, performance notes, grows-with-you
6. Grok Packet — DRAFT mode + ENGAGEMENT mode + TRENDING packet
7. Engagement Engine — target accounts, reply generator, engagement log, temperature tracking

## Current Build Phase

[Update this line as you complete phases]
Phase 1 started: [date]
```

---

## Model Selection Guide

You have these models. Use the right one per task:

| Model                         | Best For                                                                                       | Cost    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ------- |
| **Claude Sonnet 4.6**         | Complex architecture, wiring AI, debugging, Supabase schema, any phase where things feel stuck | Medium  |
| **Claude Opus 4.6**           | Only when Sonnet fails or for hardest architectural decisions — expensive, use sparingly       | High    |
| **Gemini 3.5 Flash (Medium)** | Default workhorse — UI components, scorer logic, simple integrations, most day-to-day tasks    | Low     |
| **Gemini 3.5 Flash (High)**   | When Medium gives weak output — better reasoning, still fast                                   | Low-Med |
| **Gemini 3.5 Flash (Low)**    | Ultra simple tasks only — copy changes, minor tweaks, formatting                               | Lowest  |
| **Gemini 3.1 Pro (High)**     | Long context tasks — reading all of ARCHITECTURE.md + generating full files                    | Med     |
| **Gemini 3.1 Pro (Low)**      | Same as above, budget version                                                                  | Low-Med |

### Quick Rule:

- **Building/debugging something complex** → Claude Sonnet 4.6
- **Standard UI/component work** → Gemini 3.5 Flash (Medium)
- **Something is broken and Sonnet can't fix it** → Claude Opus 4.6
- **Reading large docs + generating boilerplate** → Gemini 3.1 Pro

---

_TweetOS Architecture v3.0 — Supabase DB for cross-device sync, model selection guide added_
