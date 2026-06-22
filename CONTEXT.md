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

### 2. Brain Dump
A raw, unfiltered text interface where Karan can brain-dump ideas. The AI extracts discrete moments and formats hook variations for drafting.

### 3. Drafts & Library
- **Drafts & Library**: Pre-polished tweets or threads.
- **Closed-Loop Feedback**: Performance notes logged in the library (views, comments, critiques from Grok/X) are automatically formatted and injected into the Gemini context for new draft generation, creating a self-improving voice engine.

## Architectural Notes

- **Three Consolidated Dashboards**: Restructured from 8 views into 3 unified screens: Workspace (`/`) for creation & scoring, Engage Hub (`/engage`) for target interactions & logs, and Analytics (`/analytics`) for stats and Library history.
- **Pure Client Logic**: All algorithm scorer computations in `src/lib/scorer.ts` are pure TypeScript functions. No network latency, database storage, or LLM tokens are wasted during scoring.
- **Next.js 16 Proxy Router**: Uses `proxy.ts` with `proxy` handler instead of `middleware.ts`.
- **Supabase Lazy Init**: `src/lib/storage.ts` lazily initiates the Supabase client inside functions rather than at the module-top to avoid prerender validation failures.
- **Local Env Loading**: Next.js requires restarting the dev server (`npm run dev`) if `.env.local` is modified while running, otherwise client-side calls will fail with `Failed to fetch` due to placeholder values.
- **Glassmorphism CSS Utility Design**: Premium visual layout styled via custom CSS utility classes (`.glass-panel`, `.glass-input`, `.glass-button`) with subtle ambient glowing borders for scoring signal cards.
- **Dual-System Copy Mechanics**: Integrated quick-actions to copy either raw clean tweets for X posting, or structured critique prompts for Grok validation.
