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
| Styling   | Tailwind CSS v4 + shadcn/ui | Fast, clean, dark theme, glassmorphic styling      |
| Icons     | lucide-react                | High quality icons (strictly no emojis)            |
| AI        | Google Gemini 2.5 Flash     | Free tier, generous limits                         |
| State     | Zustand                     | Simple global state, persisted locally             |
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
│   │   ├── page.tsx                      # Consolidated Workspace (Drafts, Dump, Workshop) & Inline Tutorials
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
│   │   │   ├── AppShell.tsx
│   │   │   └── MobileNav.tsx             # Bottom tab bar (primary on mobile)
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── PillarEditor.tsx
│   │   │   ├── ExampleTweetInput.tsx
│   │   │   ├── ProfileModal.tsx
│   │   │   └── ProfileCard.tsx
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
│   │   └── grok-packet/
│   │       ├── PacketPreview.tsx
│   │       ├── PacketModeToggle.tsx      # Draft vs Engagement mode
│   │       ├── PacketConfig.tsx
│   │       └── CopyButton.tsx
│   │
│   ├── lib/
│   │   ├── gemini.ts
│   │   ├── storage.ts
│   │   ├── prompts.ts
│   │   ├── scorer.ts
│   │   ├── grok-packager.ts              # Packets for stateless AI execution
│   │   └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── store/
│   │   ├── useProfileStore.ts
│   │   ├── useDraftStore.ts
│   │   └── useLibraryStore.ts
│   │
│   └── data/
│       └── seedProfile.ts                # Karan's actual profile as default
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
    // ... rest of seed profile ...
```

---

## UI / UX Aesthetics & Consistency

- **Icons over Emojis:** We enforce a strict NO EMOJI rule in the interface to maintain a professional standard. All visual indicators use `lucide-react` icons (e.g. `AlertTriangle`, `CheckCircle2`, `Target`).
- **Glassmorphism:** The overarching UI design uses custom `glass-panel` and `glass-button` CSS utility classes. The style prioritizes semi-transparent backgrounds with light borders over solid, flat blocks.
- **Inline Onboarding:** User education (tutorials) happens directly within the UI tabs (`Workspace`, `Engage`) using collapsible info-cards and inline step-by-steps rather than secluded documentation pages.

---

## Module 1: Profile Engine

**Page:** `/profile` (or via `ProfileModal`)
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

---

## Module 2: Brain Dump Processor & Workshop (Consolidated)

**Page:** `/` (Home / Workspace)

### Flow
We consolidate Drafts, Brain Dumps, and the Workshop into a single dashboard. 
Users input raw thoughts (dev notes, personal updates), which the system routes through Gemini via `src/lib/prompts.ts` to extract tweets aligned to the user's selected Content Pillars.

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
// ...
RULES:
• HARD LIMIT: 280 characters max per tweet (free account limit — never exceed this)
• No links in tweet body (links go in first reply only)
• No generic advice — specific always beats vague
• Natural CTA or question where it fits
• If it's a build update: name the project + what broke or worked
• Light emojis where natural — don't force them
// ...
`;
```

---

## Module 3: Algorithm Scorer

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
```

- HARD FAIL: over 280 chars = violates free account limit. Handled at UI level.

---

## Module 4: Engagement Hub & Grok Validation

**Page:** `/engage`
**Stateless execution:** Engagement intelligence largely runs via Grok validations using `grok-packager.ts`. Instead of storing hundreds of target accounts in our DB, we package the context and prompt, send it to Grok, and Grok identifies opportunities directly from the live feed.

```typescript
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
```

The system generates a payload the user copies and pastes into Grok, offloading the real-time social graph processing.
