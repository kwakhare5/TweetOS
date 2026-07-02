# TweetOS Master Specification

> Status: **FINALIZED & APPROVED** — 2026-07-02
> All decisions locked via @GRILL session (12 questions). Ready for execution.
> Full architecture: see `ARCHITECTURE.md` in project root.

---

## 1. High-Level Objective

TweetOS provides a frictionless, 100% reliable content creation workflow using a **Tri-System Hybrid Architecture**:
- **Primary**: Fully automated web scraping (Apify) + AI generation (Gemini)
- **Fallback**: Upgraded manual "Grok Packet" system that is now voice-aware (System 4)
- **User control**: Explicit mode toggle — user always chooses Auto vs Manual. No silent fallbacks.

---

## 2. Core Systems

### System 1 — Voice Blueprint Extractor
**Status:** Backend built. Frontend needs structured JSON update.

- **Goal**: Reverse-engineer a creator's structural habits (not topics — MECHANICS).
- **Trigger**: User inputs @handle on Profile page.
- **Engine**: Apify (`tweet-scraper` / `61RPP7dywgiy0JPD0` with `searchTerms: ["from:{handle}"]`) → `VOICE_BLUEPRINT_PROMPT` → Gemini 2.5 Flash → `VoiceBlueprint` JSON.
- **Storage**: `profile.voiceBlueprint` (typed JSON) — separate from `profile.inspirationsContext` (user freeform).
- **Output**: `VoiceBlueprint` with `hookFormula`, `bodyStructure`, `toneVibe`, `secretSauce[]`, `writingRules[]`, `antiRules[]`, `sentencePatterns[]`, `topStructuralPattern`, `avgTweetLength`, `punctuationStyle`, `numberUsage`.

### System 2 — Topic Hunt (Viral Idea Generator)
**Status:** New — to be built.

- **Goal**: Find viral content angles from X and rewrite them in the user's exact voice.
- **Trigger**: "Topic Hunt" button on dashboard → `HuntModal`.
- **Mode Select**: User explicitly picks [⚡ Apify Auto] or [📋 Grok Manual].
- **Apify path**: Keyword confirm (pre-filled from niche + pillars, editable) → `/api/topic-hunt` → Apify actor `twitter-scraper-lite` (`nfp1fpt5gUlBwPcor`) using `searchTerms` → `TOPIC_HUNT_PROMPT` → Gemini → `TopicHuntAngle[]`.
- **Results UI**: `TopicHuntResults` panel renders BELOW composer card. 4-5 angle cards with "Load into Composer" button each.
- **Manual path**: `generateTrendingPacket(profile)` → clipboard.

### System 3 — Engagement Hunt (Replies & Quote Tweets)
**Status:** New — to be built.

- **Goal**: Find reply and quote-tweet opportunities. Show original tweet + AI-drafted replies side by side.
- **Trigger**: `/engagement` page (sidebar nav) or "Engage Hunt" dashboard button → `HuntModal`.
- **Mode Select**: User explicitly picks [⚡ Apify Auto] or [📋 Grok Manual].
- **Apify path**: Target accounts + keyword confirm (pre-filled from `admiredAccounts` + niche) → `/api/engagement-hunt` → Apify actor `twitter-scraper-lite` (`nfp1fpt5gUlBwPcor`) using `searchTerms` → `ENGAGEMENT_HUNT_PROMPT` → Gemini → `EngagementOpportunity[]`.
- **Results UI**: `/engagement` page — opportunity cards with original tweet + 3 reply options (A: casual, B: Second Brain insight, C: question). Copy button per reply.
- **Persistence**: Fully ephemeral. Local React state only. Re-run = fresh results.
- **Manual path**: `generateEngagementPacket(profile)` → clipboard. Always visible as fallback.

### System 4 — Grok Packet Injector (Upgraded Manual System)
**Status:** Existing — needs `grok-packager.ts` update.

- **Goal**: Manual fallback is no longer "blind" — injects full `VoiceBlueprint` when available.
- **Change**: Strip all hardcoded identity strings from `grok-packager.ts`. `buildIdentityBlock()` now follows priority chain: `voiceBlueprint` → `inspirationsContext` → `voice.tone` only.
- **Result**: When user chooses Manual mode, Grok receives exact structural rules, anti-rules, hook formula — same quality signal as the automated pipeline.

---

## 3. Architectural Decisions (from @GRILL session)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Explicit Apify/Manual toggle — no silent fallback | User consciously chooses to use API credits |
| 2 | Keyword confirm step before Apify fires | Bad auto-query = wasted real credits |
| 3 | Dedicated `/engagement` page for System 3 | Review queue too heavy for a dashboard drawer |
| 4 | Kill `REPLY_GENERATOR_PROMPT` + `IDEA_GENERATOR_PROMPT` | Dead duplicates of `UNIFIED_ROUTER_PROMPT` |
| 5 | Strip hardcoded identity from `grok-packager.ts` | Profile is the only source of truth |
| 6 | `voiceBlueprint` (JSON) + `inspirationsContext` (freeform) coexist | Structured AI precision vs manual override |
| 7 | Topic Hunt → results panel with per-angle Load buttons | Don't auto-dump AI output into textarea |
| 8 | Drop `geminiApiKey` from `UserProfile` | Single-user app — env vars only |
| 9 | Delete `/analytics` | Dead code, YAGNI |
| 10 | Engagement results fully ephemeral | Stale engagement data = actively harmful |
| 11 | HuntModal covers mode select + keyword confirm | One flow resolves two design decisions |
| 12 | `/engagement` added to sidebar nav | Direct navigation needed post-hunt |

---

## 4. Data Flow

```
Source of Truth: UserProfile in Zustand (synced to Supabase in background)
  │
  ├── System 1 writes → profile.voiceBlueprint
  ├── System 2 reads  → profile.niche, contentPillars, voice, secondBrain, voiceBlueprint
  ├── System 3 reads  → profile.admiredAccounts, niche, voice, secondBrain, voiceBlueprint
  └── System 4 reads  → entire profile via buildIdentityBlock()

API Keys (server-side .env only, never in client state unless NEXT_PUBLIC_):
  APIFY_API_TOKEN             → all Apify routes
  GEMINI_API_KEY              → all Gemini routes
  TWEETOS_API_KEY             → protects all API routes from unauthorized use
  NEXT_PUBLIC_TWEETOS_API_KEY → sent by client to authenticate with API routes
```

---

## 5. Stack

- **Frontend**: Next.js 15, Tailwind v4, Zustand
- **Backend**: Next.js Route Handlers (`src/app/api/...`)
- **Scraping**: Apify API (`tweet-scraper` and `twitter-scraper-lite`, both using identical `searchTerms` schema)
- **AI**: Gemini 2.5 Flash (`@google/genai`, server-side only)
- **DB**: Supabase PostgreSQL (background sync, not primary read path)
