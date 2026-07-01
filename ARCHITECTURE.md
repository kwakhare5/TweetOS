# TweetOS: Technical Architecture & Implementation Blueprint

## Overview
TweetOS is built as a fast, offline-first Next.js web application. It combines rapid local state management with a background synchronization layer to ensure data persistence without compromising UI speed.

## Core Technology Stack
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4, utilizing a highly customized Neo-Skeuomorphic design system (see `CONTEXT.md` for visual details).
- **Icons & Graphics**: Lucide React for standard iconography, custom inline SVGs for skeuomorphic elements (e.g., paperclips).
- **State Management**: Zustand (Client-side global state).
- **Database & Sync**: Supabase (PostgreSQL) for remote background sync.
- **AI Integration**: `@google/generative-ai` (Gemini API) for local text generation and ideation.

## Data & State Architecture

### 1. Hybrid Sync Client (Zustand + Supabase)
TweetOS prioritizes zero-latency interactions by using a "Local-First" architecture.

- **Zustand Local Stores**: All application state (Creator DNA, active brain dumps, saved drafts) is managed via Zustand stores (`use-profile-store.ts`, `use-drafts-store.ts`).
- **Local Storage Persistence**: The stores use Zustand's `persist` middleware. This means every state change is immediately written to the browser's Local Storage, providing instant offline caching and lightning-fast page loads.
- **Supabase Background Synchronization**: 
  - The application is wrapped in a `<SupabaseProvider>` (`src/components/supabase-provider.tsx`).
  - On startup, this provider fetches the remote PostgreSQL tables (`profiles` and `drafts`).
  - It handles two-way synchronization: If the remote database is empty, it uploads the local backups. During normal usage, store actions instantly update the local Zustand state while triggering asynchronous background `upsert` or `delete` requests to Supabase.
  - *Rule*: Components must **never** query Supabase directly. They must always read from and write to the Zustand stores.

### 2. The AI Pipeline (Gemini & Grok Packaging)
TweetOS splits AI execution into two distinct phases:

**Phase A: Local Generation (Gemini)**
- Handled primarily by `src/hooks/use-tweet-composer.ts` and `src/lib/gemini.ts`.
- When the user clicks "Polish Draft" or "Generate Idea", a prompt is constructed using the `UNIFIED_ROUTER_PROMPT` or `IDEA_GENERATOR_PROMPT`.
- The prompt injects the user's Creator DNA (Voice, Guardrails, Avoid Words) and current context (Second Brain notes).
- The Gemini API executes this request locally, returning a polished JSON payload or text, which is parsed and set in the local state for display.

**Phase B: Stateless Execution (Grok Packets)**
- TweetOS deliberately avoids connecting to the X/Twitter API or scraping live data.
- Instead, it generates **"Grok Packets"** via `src/lib/grok-packager.ts`.
- When the user clicks "Topic Hunt", "Engage Hunt", or "Copy for Grok", the app constructs a massive, highly detailed system prompt containing the user's profile context, target accounts, and the specific task (e.g., "Find trending topics for this niche").
- This packet is copied to the user's clipboard to be pasted manually into Grok on X, bypassing the need for complex API integrations while leveraging Grok's live access to the X firehose.

## File Structure & Routing

### `/src/app/` (Next.js App Router)
- `layout.tsx`: Root layout defining fonts, rendering the `<SupabaseProvider>`, the `<LayoutHeader>`, and the mobile bottom navigation.
- `page.tsx` (Command Center): The primary dashboard assembling the Tweet Composer, Polished Draft Preview, Second Brain Note, and Recent Tweets grid.
- `profile/page.tsx` (Creator DNA): The settings interface assembling the Voice Profile, Core Identity, Guardrails, Avoid Words, and API Key configuration cards.
- `inspiration/page.tsx`: The inspiration feed for viewing architectural tweet blueprints.

### `/src/components/`
- **`dashboard/`**: Contains the core mechanics for the main page (`tweet-composer.tsx`, `polished-draft-preview.tsx`, `recent-tweets.tsx`, `second-brain-note.tsx`).
- **`profile/`**: Contains the configuration cards for the Creator DNA (`voice-profile-card.tsx`, `guardrails-card.tsx`, `avoid-words-card.tsx`, `api-key-config.tsx`).
- **`ui/`**: Low-level, reusable design system components (buttons, dropdowns, specialized skeuomorphic SVGs like `<Paperclip>`).

### `/src/lib/` & `/src/hooks/`
- **`lib/gemini.ts`**: Wrapper for the `@google/generative-ai` SDK.
- **`lib/prompts.ts`**: The central repository for all Gemini system prompts and router logic.
- **`lib/grok-packager.ts`**: Utility functions for assembling the clipboard-ready Grok packets.
- **`hooks/use-tweet-composer.ts`**: The monolithic React hook managing the state, loading indicators, and API calls for the Tweet Composer component.
