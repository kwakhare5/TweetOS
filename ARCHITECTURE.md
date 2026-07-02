# TweetOS — Master Architecture & Implementation Blueprint

> Single source of truth. Merged from: spec.md · implementation_plan.md · prompts_library.md
> Last updated: 2026-07-02 | Status: **APPROVED — Ready for execution**

---

## 1. Product Philosophy

TweetOS is a **hyper-minimal local workspace** — not a cloud automation agent. It acts as a bridge between the user's raw thoughts and the stateless execution power of Grok on X.

**Core philosophy — Persona Fusion Mechanism:**
> Think like the inspiration creator. Speak in your own voice.

The local Gemini model adopts the exact psychological framing, structural habits, and hook formulas of a highly successful creator (via the Voice Blueprint), but outputs content strictly in the user's vocabulary, tone, and niche. It thinks like them, but speaks like you.

**Design Philosophy — Hybrid Automation:**
Always attempt zero-friction automated scraping first (Apify → Gemini pipeline). User explicitly chooses to fall back to manual Grok packets — never a silent fallback.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4, Neo-Skeuomorphic design system |
| State | Zustand (`use-profile-store.ts` — ONLY store) |
| Database | Supabase (PostgreSQL, background sync via `SupabaseProvider`) |
| AI | Gemini 2.5 Flash via `@google/genai` (server-side only) |
| Scraping | Apify API (`APIFY_API_TOKEN` env var) — actors `tweet-scraper` (`61RP...`) & `twitter-scraper-lite` (`nfp...`) |
| Icons | lucide-react only (no emojis in UI) |
| Fonts | Geist / DM Sans (body), Fira Code (mono), Playpen Sans (handwriting) |

**Environment Variables (server-side only, never in client state unless NEXT_PUBLIC_):**
```
APIFY_API_TOKEN=...
GEMINI_API_KEY=...
TWEETOS_API_KEY=...
NEXT_PUBLIC_TWEETOS_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 3. The Four Systems

### System 1 — Voice Blueprint Extractor (Backend Built)

**Goal:** Reverse-engineer a creator's structural habits from their actual tweets.

**Flow:**
```
User inputs @handle on Profile page
  → POST /api/analyze-profile { handle }
  → Apify actor (61RPP7dywgiy0JPD0 / tweet-scraper) (fallback nfp1fpt5gUlBwPcor)
  → Scrapes last 30 tweets using `searchTerms: ["from:{handle} -filter:retweets"]`
  → VOICE_BLUEPRINT_PROMPT → Gemini 2.5 Flash
  → Returns structured VoiceBlueprint JSON
  → Saved to profile.voiceBlueprint via Zustand → auto-synced to Supabase
```

**Output type — `VoiceBlueprint`:**
```ts
interface VoiceBlueprint {
  hookFormula: string        // How they open (exact technique, not vague description)
  bodyStructure: string      // Architecture from hook to closer
  toneVibe: string           // Emotional fingerprint (the feeling and WHY)
  secretSauce: string[]      // 3 unwritten rules (non-obvious, extracted from patterns)
  writingRules: string[]     // 5 specific structural formatting rules
  antiRules: string[]        // What they NEVER do (absence patterns)
  sentencePatterns: string[] // Recurring sentence constructions with real examples
  avgTweetLength: string     // one-liner | short | medium | long | mixed
  punctuationStyle: string   // Specific punctuation habits
  numberUsage: string        // How data/metrics appear
  topStructuralPattern: string // Most frequent tweet template
  extractedFrom: string      // @handle
  extractedAt: string        // ISO timestamp
}
```

**Key distinction:**
- `voiceBlueprint` = AI-generated structured JSON (System 1 output). Stored as typed object.
- `inspirationsContext` = User-editable freeform textarea (manual override). Stored as string.
- Both live in `UserProfile`. Prompts use both, preferring `voiceBlueprint` when available.

---

### System 2 — Topic Hunt (Viral Idea Generator)

**Goal:** Find viral content angles from X and rewrite them in the user's voice.

**Flow:**
```
User clicks "Topic Hunt" dropdown item on dashboard composer
  → HuntModal opens

  Step 1 — Mode Select:
    [⚡ Apify Auto]  OR  [📋 Grok Packet Manual]

  IF APIFY:
    Step 2 — Keyword Confirm:
      Pre-filled keywords from profile.niche + contentPillars
      User edits/confirms → [Run ⚡]
      → POST /api/topic-hunt { keywords[], mode: 'apify' }
      → Apify actor (nfp1fpt5gUlBwPcor / twitter-scraper-lite)
      → Keyword search using `searchTerms: [...keywords]` (top 20 tweets by engagement)
      → TOPIC_HUNT_PROMPT + profile → Gemini 2.5 Flash
      → Returns 4-5 TopicHuntAngle[]
      → TopicHuntResults panel renders BELOW the composer card
      → Each angle: viral insight + rewritten tweet + pillar badge + "Load into Composer"

  IF MANUAL:
    Step 2 — Instant clipboard:
      generateTrendingPacket(profile) → clipboard
      "Copied!" confirmation toast
```

**Output type — `TopicHuntAngle`:**
```ts
interface TopicHuntAngle {
  id: string
  originalViral: string      // Core insight/tension (NOT the tweet text)
  originalContext: string    // Which scraped tweet(s) inspired this
  pillarMatch: string        // Content Pillar name
  rewrittenAngle: string     // Fully rewritten tweet in user's voice (<280 chars)
  charCount: number
  secondBrainAnchor: string  // Which Second Brain detail was used, or 'none'
  technique: string          // Hook technique used
}
```

---

### System 3 — Engagement Hunt (Replies & Quote Tweets)

**Goal:** Find reply and quote-tweet opportunities. Display original tweet + AI-drafted replies side by side for review, copy, and post.

**Flow:**
```
User navigates to /engagement (sidebar nav) OR clicks "Engage Hunt" on dashboard
  → HuntModal opens

  Step 1 — Mode Select:
    [⚡ Apify Auto]  OR  [📋 Grok Packet Manual]

  IF APIFY:
    Step 2 — Confirm targets:
      Pre-filled: profile.admiredAccounts + profile.niche keywords
      User edits/confirms → [Run ⚡]
      → POST /api/engagement-hunt { targetAccounts[], keywords[], mode: 'apify' }
      → Apify actor (nfp1fpt5gUlBwPcor / twitter-scraper-lite)
      → Scrapes target handles + keyword tweets using `searchTerms`
      → ENGAGEMENT_HUNT_PROMPT + profile → Gemini 2.5 Flash
      → Returns 8-10 EngagementOpportunity[]
      → /engagement page renders opportunity cards

  IF MANUAL:
    generateEngagementPacket(profile) → clipboard
```

**Output type — `EngagementOpportunity`:**
```ts
interface EngagementOpportunity {
  id: string
  authorHandle: string
  originalTweet: string
  tweetUrl: string | null
  opportunityScore: number      // 1-10
  relevance: string             // Why this is a good opportunity for the user
  opportunityType: 'reply' | 'quote_tweet'
  replies: {
    option: 'A' | 'B' | 'C'
    tone: 'casual' | 'insightful' | 'question'
    content: string             // <280 chars
    charCount: number
  }[]
}
```

**Persistence:** Fully ephemeral — local React state only. No Zustand, no Supabase. Engagement opportunities are time-sensitive. Re-run = fresh results.

---

### System 4 — Grok Packet Injector (Upgraded Manual System)

**Goal:** The manual fallback is no longer "blind." `grok-packager.ts` pulls `voiceBlueprint` structured JSON when available, injecting exact structural rules and anti-rules extracted by System 1.

**`buildIdentityBlock(profile)` priority chain:**
1. If `profile.voiceBlueprint` → inject full structured blueprint (all fields)
2. Else if `profile.inspirationsContext` → inject freeform text
3. Else → use `voice.tone` + `voice.writingStyle` only

**Hardcoded strings removed:**
- "Indian student dev life, CS placements" (line 150, grok-packager.ts)
- All identity assumptions not derived from the profile object

---

## 4. Data Architecture

### Local-First Flow
```
UI Component
    ↓ write
Zustand Store (use-profile-store.ts)
    ↓ immediate localStorage persist (Zustand persist middleware)
    ↓ async background
Supabase (PostgreSQL)
```

**Rule:** Components NEVER call Supabase directly. Always read/write Zustand. `SupabaseProvider` handles all sync.

### `UserProfile` Schema

```ts
interface UserProfile {
  // Core Identity
  name: string
  twitterHandle: string
  niche: string
  bio: string

  // Content Strategy
  contentPillars: ContentPillar[]
  voice: VoiceConfig
  audience: AudienceConfig
  goals: string[]
  admiredAccounts: string[]
  postingFrequency: string

  // Live Context
  secondBrain?: string            // Daily note injected into ALL Gemini prompts

  // Voice Blueprint (two formats, both valid, different purposes)
  inspirationsContext?: string    // User-editable freeform (manual override)
  voiceBlueprint?: VoiceBlueprint // AI-generated structured JSON (System 1)

  // Meta
  avatarUrl?: string
  createdAt: string
  updatedAt: string

  // REMOVED: geminiApiKey — single-user app, use process.env.GEMINI_API_KEY
}
```

---

## 5. API Routes

| Route | Method | System | Request | Response |
|-------|--------|--------|---------|----------|
| `/api/analyze-profile` | POST | 1 | `{ handle: string }` | `{ blueprint: VoiceBlueprint }` |
| `/api/gemini` | POST | Dashboard | `{ prompt, profile, mode }` | `{ result }` |
| `/api/topic-hunt` | POST | 2 | `{ keywords: string[], mode: 'apify' }` | `{ angles: TopicHuntAngle[] }` |
| `/api/engagement-hunt` | POST | 3 | `{ targetAccounts: string[], keywords: string[], mode: 'apify' }` | `{ opportunities: EngagementOpportunity[] }` |

**Apify actor strategy & fallback (Centralized in `src/lib/apify-scraper.ts`):**
- Both actors use the exact same input schema: `{ searchTerms: string[], sort: "Latest" | "Top", maxItems: number }`.
- System 1 (Profile): Primary `61RPP7dywgiy0JPD0` (tweet-scraper). Fallback `nfp1fpt5gUlBwPcor`. Why: 50+ tweets needed.
- Systems 2 & 3 (Hunts): Primary `nfp1fpt5gUlBwPcor` (twitter-scraper-lite). Fallback `61RPP7dywgiy0JPD0`. Why: No minimum tweet requirement.

**API Route Hardening:**
- **Timeouts:** All API routes export `const maxDuration = 60;` to prevent Vercel 10s default serverless timeouts during long Apify/Gemini chains.
- **Protection:** All API routes enforce an `x-api-key` header check against `TWEETOS_API_KEY` to prevent unauthorized public credit drain.

---

## 6. File Map

```
src/
├── app/
│   ├── layout.tsx                      Root layout (fonts, providers, sidebar)
│   ├── page.tsx                        Dashboard — Command Center
│   ├── profile/page.tsx                Creator DNA config
│   ├── engagement/page.tsx             [NEW] System 3 results page
│   └── api/
│       ├── analyze-profile/route.ts    System 1 (update: structured JSON output)
│       ├── gemini/route.ts             Gemini proxy
│       ├── topic-hunt/route.ts         [NEW] System 2
│       └── engagement-hunt/route.ts    [NEW] System 3
│
├── components/
│   ├── app-sidebar.tsx                 Nav update: remove Analytics, add Engage
│   ├── dashboard/
│   │   ├── tweet-composer.tsx          Updated: buttons open HuntModal
│   │   ├── polished-draft-preview.tsx
│   │   ├── second-brain-note.tsx
│   │   ├── recent-tweets.tsx
│   │   └── topic-hunt-results.tsx      [NEW] System 2 results panel
│   ├── engagement/
│   │   └── opportunity-card.tsx        [NEW] System 3 card
│   ├── profile/
│   │   ├── core-identity-card.tsx
│   │   ├── extended-context-card.tsx
│   │   ├── voice-profile-card.tsx      Updated: display voiceBlueprint
│   │   └── avoid-words-card.tsx
│   └── ui/
│       └── hunt-modal.tsx              [NEW] Shared mode-select + keyword-confirm
│
├── hooks/
│   └── use-tweet-composer.ts
│
├── lib/
│   ├── apify-scraper.ts                [NEW] Centralized Apify fallback logic
│   ├── gemini.ts
│   ├── prompts.ts                      Updated: 3 new prompts, 2 deleted
│   ├── grok-packager.ts                Updated: no hardcoded identity
│   ├── supabase-sync.ts
│   └── utils.ts
│
├── store/
│   └── use-profile-store.ts
│
└── types/
    └── index.ts                        Updated: VoiceBlueprint, TopicHuntAngle,
                                        EngagementOpportunity, removed geminiApiKey

[DELETED] src/app/analytics/            Dead code
```

---

## 7. Prompt Specifications

### `VOICE_BLUEPRINT_PROMPT(handle, tweetsText)`

Forensic analyst approach. Studies tweets like a craftsman studying a master's technique.
Extracts invisible rules — hook formula, body architecture, emotional fingerprint, absence patterns.
Returns full `VoiceBlueprint` JSON. No markdown text blobs.

**Key instruction:** Study what they NEVER do (absence patterns) — usually the most useful signal.

### `TOPIC_HUNT_PROMPT(profile, scraped[], keywords[])`

Does NOT summarize viral topics. Extracts the **angle** (the invisible insight or tension that made the tweet viral) and rebuilds from scratch in the user's voice.

**Hard constraints in prompt:**
- 4-5 output angles, all <280 chars with charCount
- At least 2 must anchor to Second Brain details
- Each matched to a Content Pillar
- Zero words from the avoid list
- Zero phrases copied from the original tweet

### `ENGAGEMENT_HUNT_PROMPT(profile, scraped[])`

Scores each scraped tweet 1-10 for engagement opportunity value. Selects top 8-10.

**Reply rules hard-coded in prompt:**
- Option A: peer-texting energy, zero effort, casual
- Option B: real insight or experience from Second Brain (not generic)
- Option C: opens genuine conversation — specific question (not "what do you think?")
- NEVER: "Great point", "This!", generic openers, promotional CTA
- All replies <280 chars with charCount

Returns `strategyNote` for weekly account prioritization.

### `buildIdentityBlock(profile)` (System 4)

Pulls everything from `UserProfile`. Priority:
1. `voiceBlueprint` fields (structured) → injects hookFormula, writingRules, antiRules
2. `inspirationsContext` (freeform) → injects as-is
3. `voice.tone` + `voice.writingStyle` → baseline only

Zero hardcoded strings. Zero identity assumptions.

---

## 8. UI/UX Decisions

### Navigation
```
Workspace
├── Dashboard     /           LayoutDashboard icon
└── Engage        /engagement MessageCircle icon

Configuration
└── Profile       /profile    Settings icon
```

### HuntModal (shared component)
```
Step 1 — Mode Select
  Two large cards side by side:
  [⚡ Apify Auto]   [📋 Grok Manual]

Step 2a — Apify path:
  Keyword input (pre-filled, editable tags)
  [Cancel] [Run ⚡]

Step 2b — Manual path:
  Instant → generatePacket() → clipboard
  Shows "Copied!" state
```

### Topic Hunt Results Panel
- Renders below the composer card after Apify returns
- Dismissible (X clears state)
- Each card: `⚡ Apify · [keyword]` badge + pillar tag + rewritten tweet + char count + "Load into Composer"

### Engagement Page (`/engagement`)
- Always shows "Generate Grok Packet" fallback button
- Empty state → instructions
- Loading → skeleton cards
- Results → EngagementOpportunity cards with A/B/C reply options, each with copy button

---

## 9. Design Rules

- Neo-skeuomorphic. Physical desk feel. No AI Slop UI.
- Canvas: `#FAF8F5` off-white/beige. No dark mode.
- Cards tilted: `rotate-[-0.2deg]` / `rotate-[0.4deg]`
- Washi tape: `rgba(254, 240, 138, 0.4)` with diagonal stripes — card tops
- Paperclips: Custom 3D SVG — Second Brain and details cards
- Sticky: `#FEF9C3` bg, `#FEF08A` top bar, macOS dots (red/yellow/green)
- Typography: Geist/DM Sans (body), Fira Code (mono), Playpen Sans (handwriting)
- Buttons: `active:scale-[0.98]` micro-compression
- Primary: `bg-slate-950`
- FORBIDDEN: Gradient blobs · neon text · emojis in UI · new fonts

---

## 10. Execution Order

```
Step  File                                    Change
1.    types/index.ts                          + VoiceBlueprint, TopicHuntAngle, EngagementOpportunity
                                              - geminiApiKey from UserProfile
2.    lib/prompts.ts                          - REPLY_GENERATOR_PROMPT, IDEA_GENERATOR_PROMPT
                                              + VOICE_BLUEPRINT_PROMPT, TOPIC_HUNT_PROMPT, ENGAGEMENT_HUNT_PROMPT
3.    lib/grok-packager.ts                    Strip hardcoded strings, update buildIdentityBlock()
4.    api/analyze-profile/route.ts            Structured VoiceBlueprint JSON output
5.    api/topic-hunt/route.ts                 [NEW] System 2 API route
6.    api/engagement-hunt/route.ts            [NEW] System 3 API route
7.    ui/hunt-modal.tsx                       [NEW] Shared modal component
8.    dashboard/topic-hunt-results.tsx        [NEW] Results panel
9.    app/engagement/page.tsx                 [NEW] Engagement page
10.   app-sidebar.tsx                         Remove Analytics, add Engage
11.   tweet-composer.tsx                      Wire buttons to HuntModal
12.   app/page.tsx                            Wire HuntModal + results state
13.   app/profile/page.tsx                    Remove geminiApiKey card
14.   app/analytics/ (DELETE)                 Dead code
15.   npm run lint && npx tsc --noEmit        Zero errors
```

---

## 11. Architecture Decisions Log

| Date | Decision | Why |
|------|----------|-----|
| 2026-07-02 | Pivoted to automated Apify backend | Frictionless experience over manual copy-paste |
| 2026-07-02 | Tri-System Hybrid Architecture | Apify + Gemini (auto) with Grok packets as explicit manual fallback |
| 2026-07-02 | Explicit mode toggle (Apify vs Manual) | No silent fallbacks — user consciously chooses to use API credits |
| 2026-07-02 | Keyword confirm step before Apify fires | One bad auto-query wastes real credits |
| 2026-07-02 | Dedicated /engagement page for System 3 | 10-12 tweet review queue is too heavy for a dashboard drawer |
| 2026-07-02 | Kill REPLY_GENERATOR_PROMPT + IDEA_GENERATOR_PROMPT | Dead duplicates — UNIFIED_ROUTER_PROMPT handles both intents |
| 2026-07-02 | Strip all hardcoded identity from grok-packager.ts | Profile is the only source of truth |
| 2026-07-02 | voiceBlueprint (JSON) separate from inspirationsContext (freeform) | Structured AI precision vs manual user override — two different needs |
| 2026-07-02 | Topic Hunt results panel with Load-into-Composer buttons | Don't auto-dump AI output into textarea — user picks the best angle |
| 2026-07-02 | Drop geminiApiKey from UserProfile | Single-user app — env vars only, no key stored in DB/localStorage |
| 2026-07-02 | Delete /analytics | Dead code, YAGNI — Recent Posts grid is sufficient history |
| 2026-07-02 | Engagement results fully ephemeral | Stale engagement data is actively harmful — old tweets = wrong replies |
| 2026-07-02 | HuntModal for mode + keyword confirm | One unified flow covers both design decisions cleanly |
| 2026-07-02 | Add /engagement to sidebar nav | Direct navigation needed after running a hunt session |
