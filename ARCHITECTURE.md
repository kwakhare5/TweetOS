# TweetOS: Technical Architecture & Implementation Blueprint

## Overview
TweetOS is built as a fast, offline-first Next.js web application. It combines rapid local state management with a background synchronization layer to ensure data persistence without compromising UI speed.

## Detailed Feature Breakdown

### 1. The Persona Fusion Engine
- **Inspiration Blueprinting**: Users use Grok to extract the exact structural habits (Hook, Body, Vibe, Rules) of a successful creator, and store this in the Voice Profile.
- **Voice & Tone Enforcer**: Local Gemini models assume the *structure* of the Inspiration Blueprint, but enforce the *vocabulary and tone* of the user's Core Identity.
- **Lexicon Filter (Avoid Words)**: A strict blocklist that intercepts standard AI-isms ("delve", "supercharge") before they are generated.
- **Self-Audit**: A built-in Grok prompt allowing users to reverse-engineer their own active Twitter accounts into actionable JSON-like configuration for TweetOS.

### 2. The Command Center (`/`)
- **Brain Dump Composer**: A raw, unformatted textarea for daily thoughts, rants, and observations.
- **Idea Generator**: Feeds the brain dump + the user's Content Pillars to Gemini to ideate novel angles.
- **Draft Polisher**: Feeds a raw idea + the Inspiration Blueprint + Voice Rules into Gemini to format a strict 280-character post.
- **Stateless Grok Packets**: "Topic Hunt" and "Engage Hunt" buttons compile the user's target audience, niche, and goals into massive clipboard prompts for execution on x.com/grok.
- **Second Brain Sticky Note**: A persistent, draggable dashboard widget for live context (e.g., "debugging zustand"). This context is silently injected into all Gemini requests to anchor generated tweets to reality.
- **Recent Posts Grid**: A 3-column feed of finalized, published outputs acting as a historical reference.

### 3. Profile Page (`/profile`)
- **Read-Only / Edit Modes**: All arrays (Goals, Pillars, Avoid Words, Audience) are parsed from raw newline-separated text into distinct, beautiful UI elements (lists, badges, and bolded sections) for readability, with a 1-click toggle to edit them raw.
- **Core Identity**: Name, handle, and hyper-specific niche definitions.
- **Extended Context**: Tracks Bio, Goals, Target Audience, and Admired Accounts.
- **Voice Profile**: The command center for the Inspiration Blueprint and Voice configurations.

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
- **`profile/`**: Contains the configuration cards for the Creator DNA (`voice-profile-card.tsx`, `extended-context-card.tsx`, `avoid-words-card.tsx`).
- **`ui/`**: Low-level, reusable design system components (buttons, dropdowns, specialized skeuomorphic SVGs like `<Paperclip>`).

### `/src/lib/` & `/src/hooks/`
- **`lib/gemini.ts`**: Wrapper for the `@google/generative-ai` SDK.
- **`lib/prompts.ts`**: The central repository for all Gemini system prompts and router logic.
- **`lib/grok-packager.ts`**: Utility functions for assembling the clipboard-ready Grok packets.
- **`hooks/use-tweet-composer.ts`**: The monolithic React hook managing the state, loading indicators, and API calls for the Tweet Composer component.
