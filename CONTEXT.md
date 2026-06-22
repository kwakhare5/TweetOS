# Context: TweetOS Domain Context & Status

## Domain Terms & Core Mechanics

### 1. Algorithm Scorer
The scoring module grades tweet drafts (0-100 overall score) against 8 signals representing X organic reach parameters:
- **Hook Strength**: Evaluates the first 8 words for strong hooks vs weak openers.
- **Reply Bait**: Checks for conversation-starters or controversial angles.
- **Specificity**: Measures inclusion of real-world details (tools, numbers, metrics, names).
- **Emotional Trigger**: Detects presence of curiosity, frustration, aspiration, FOMO, humor, or relatability.
- **Length**: Evaluates sweet spots (<100 chars or 220-270 chars). Exceeding 280 chars triggers a hard **Fail** and forces overall score to `0`.
- **No Links in Body**: Reach is suppressed if links are present (tips suggest putting them in the first reply).
- **CTA Quality**: Rewards direct specific questions over generic "thoughts?" or follower begging.
- **Thread Potential**: Analyzes numbered lists or step-by-step formats for expansion potential.

### 2. Brain Dump & Dump Modes
A raw, unfiltered text interface where Karan can brain-dump ideas. The AI extracts discrete moments and formats hook variations for drafting.
It supports **3 Dump Modes**:
- **Dev**: Extracts tool/project/error moments focused on building in public.
- **Personal**: Extracts casual life tweets, relatable, first-person observations without dev framing.
- **Shit Post**: Short, chaotic, absurd meme energy takes, often with an Indian student lens.

### 3. Drafts, Workshop, & Library
- **Drafts Tab**: Review and edit drafted tweets in the main workspace.
- **Workshop Tab**: Provides tools like Hook Generator, Variation Generator, Tightener, and Thread Builder.
- **Library**: Pre-polished tweets or threads that have been logged.
- **Closed-Loop Feedback**: Performance notes logged in the library are injected into Gemini context for new draft generation.

### 4. Grok Packets & Trending
Grok is stateless, so "Grok Packets" are full text bundles carrying all context (profile, voice, avoid list, drafts).
- **Draft Review Packet**: Sends drafts to Grok for feedback based on the selected dump mode. Now includes a feedback loop containing the top 5 recently posted tweets and performance notes from the library.
- **Trending Radar Packet**: A one-click packet generation to ask Grok for the latest X trends to hook content onto. Now carries the top 5 posted tweet learnings for context.
- **Engagement Packet**: Helps find tweets for Karan to reply/QT based on target accounts and topic keywords, carrying the top 5 posted tweet learnings for context.

## Architectural Notes

- **Three Consolidated Dashboards**: Restructured into 3 unified and simplified screens: Workspace (`/`) for creation & scoring, Engage Hub (`/engage`) for 3-step reply generation, and Library (`/analytics`) for chronological history of posted tweets.
- **AI Voice Profile Extractor**: A single text area at the top of the Voice Settings modal where users can paste raw bios, description notes, or example tweets. The AI extracts and maps these into structured fields (`name`, `twitterHandle`, `niche`, `tone`, `writingStyle`, `avoidList`, `exampleTweets`) in the settings UI.
- **Pure Client Logic**: All algorithm scorer computations in `src/lib/scorer.ts` are pure TypeScript functions. No network latency, database storage, or LLM tokens are wasted during scoring.
- **Next.js 15 App Router**: Uses standard `page.tsx` layouts and client/server components.
- **Supabase Lazy Init**: `src/lib/storage.ts` lazily initiates the Supabase client inside functions rather than at the module-top to avoid prerender validation failures.
- **Local Env Loading**: Next.js requires restarting the dev server (`npm run dev`) if `.env.local` is modified while running.
- **Glassmorphism CSS Utility Design**: Premium visual layout styled via custom CSS utility classes.
- **Integrated Step-by-Step Tutorials**: Eliminated the separate "Tutorial" tab. The Drafts, Brain Dump, and Workshop panels now feature interactive, step-by-step inline onboarding guides built directly into their layout, matching the Engage Hub workflow.
- **Lucide SVG Icons Visual System**: Replaced all emoji indicators across the interface with high-quality, professional Lucide SVG icons (`FileText`, `Zap`, `PenTool`, `Terminal`, `User`, `Sparkles`, `TrendingUp`, `Clipboard`, `Check`, `Info`, `FileEdit`, `AlertTriangle`).
- **Stateless AI Hand-off**: Integrated quick-actions to copy structured critique/trending prompts for Grok validation, making Grok effectively part of the AI loop despite having no direct API integration.
- **Audited & Pruned Codebase**: Conducted a repository-wide ponytail/vibe-code audit. Cleaned up and deleted 6 completely unused components and stores (`DraftCard`, `TargetAccountsList`, `ReplyGenerator`, `EngagementLogList`, `useEngagementStore`, `engagement.ts`) to reduce maintenance overhead by ~735 lines while maintaining 100% compilation and lint compliance.
