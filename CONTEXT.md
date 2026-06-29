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

### 5. Second Brain & Fact Checking
- **Second Brain Memory Bank**: A permanent knowledge base stored in profile settings containing Karan's background, antg-IDE, and full project specs. This context is automatically injected into Gemini prompts and Grok packets to maintain a deep, persistent memory of who they are and what they build.
- **Automated Fact Checking**: An automated validation layer in the AI Composer and Grok packagers that checks technical statements (prices, model sizes, releases) against search knowledge. If claims are speculative or unverified, the system flags them with an alert banner on the workspace.

### 6. Grok Packets & Trending
Grok is stateless, so "Grok Packets" are full text bundles carrying all context (profile, voice, avoid list, drafts).
- **Draft Review Packet**: Sends drafts to Grok for feedback based on the selected dump mode. Now includes a feedback loop containing the top 5 recently posted tweets and performance notes from the library.
- **Trending Radar Packet**: A one-click packet generation to ask Grok for the latest X trends to hook content onto. Now carries the top 5 posted tweet learnings for context.
- **Engagement Packet**: Helps find tweets for Karan to reply/QT based on target accounts and topic keywords, carrying the top 5 posted tweet learnings for context.

## Architectural Notes

- **Single-Column ChatGPT-Style Workspace**: Restructured the workspace (`/`) into a simplified single-column layout. A single ChatGPT-style text area routes natural language inputs to Gemini to automatically detect intent (`draft`, `hooks`, `thread`, `tighten`, or `replies`), dynamically updates the workspace state, and displays the dynamic ScoreCard at the very bottom.
- **Single Unified Editor State**: Eliminated the `activeDraft === null` state. The composer is always editing the selected active draft. If the drafts list is empty, a default blank draft is auto-created on load. The "+ Write Draft" button in the header is the single standard action to start a fresh empty draft. Removed all deselect actions and made utilities/scorecard always visible.
- **Grok Analytics Sync Loop**: Implemented a zero-cost organic reach analytics integration inside the Library page (`/analytics`). Users copy a profile-aware search prompt, paste it into Grok to scan their actual X profile for views/likes/retweets/replies/bookmarks metrics, and paste the resulting JSON output back into TweetOS to sync performance data. Sync performance statistics render as a grid on each posted tweet card.
- **Second Brain Integration**: Added editable memory block UI in settings, and configured Gemini and Grok prompt packagers to load background profiles and project context dynamically.
- **Automated Fact Checking Integration**: Embedded verification checks into routing engine draft schemas and Grok generation scripts, displaying real-time warning boxes on the dashboard if speculative claims are flagged.
- **Three Consolidated Dashboards**: Restructured into 3 unified screens: Workspace (`/`) for creation & scoring, Engage Hub (`/engage`) for 3-step reply generation, and Library (`/analytics`) for chronological history of posted tweets.
- **AI Voice Profile Extractor**: A single text area at the top of the Voice Settings modal where users can paste raw bios, description notes, or example tweets. The AI extracts and maps these into structured fields (`name`, `twitterHandle`, `niche`, `tone`, `writingStyle`, `avoidList`, `exampleTweets`) in the settings UI.
- **Pure Client Logic**: All algorithm scorer computations in `src/lib/scorer.ts` are pure TypeScript functions. No network latency, database storage, or LLM tokens are wasted during scoring.
- **Next.js 15 App Router**: Uses standard `page.tsx` layouts and client/server components.
- **Zustand Local Storage Persistence**: All stores (profile, drafts, library) persist their state to browser Local Storage using Zustand's `persist` middleware, guaranteeing 100% offline functionality.
- **Local Env Loading**: Next.js requires restarting the dev server (`npm run dev`) if `.env.local` is modified while running.
- **Glassmorphism CSS Utility Design**: Premium visual layout styled via custom CSS utility classes.
- **Integrated Step-by-Step Tutorials**: Eliminated the separate "Tutorial" tab. The Drafts, Brain Dump, and Workshop panels now feature interactive, step-by-step inline onboarding guides built directly into their layout, matching the Engage Hub workflow.
- **Lucide SVG Icons Visual System**: Replaced all emoji indicators across the interface with high-quality, professional Lucide SVG icons (`FileText`, `Zap`, `PenTool`, `Terminal`, `User`, `Sparkles`, `TrendingUp`, `Clipboard`, `Check`, `Info`, `FileEdit`, `AlertTriangle`).
- **Stateless AI Hand-off**: Integrated quick-actions to copy structured critique/trending prompts for Grok validation, making Grok effectively part of the AI loop despite having no direct API integration.
- **Audited & Pruned Codebase**: Cleaned up the codebase by removing all Supabase and authentication routes/dependencies. The project is completely local-first and compiles cleanly with zero lint warnings.

## Target Sub-Niche & Profile Updates
- **Niche**: Lowercase, sarcastic Pune comp-eng student vibe-coding real AI projects and dropping blunt, dry, frustrated takes on tools, shipping, and dev life — exactly like the `@shydev69` / `@adxtyahq` / `@buildwithsid` / `@kalashvasaniya` circle.
- **Content Pillars**: Tool Reality Checks (30%), Project Fragments (25%), Journey Notes (20%), Sharp Takes (15%), Quick Connects (10%).
- **Voice**: Lowercase-heavy, direct, sarcastic/frustrated when deserved, dry wit, short dense sentences.
