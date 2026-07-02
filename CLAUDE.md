# TweetOS — CLAUDE.md
# Global rules: C:\Users\kwakh\.gemini\config\AGENTS.md (read this first)
# Brain file:   D:\workflow-main\brain\Projects\TweetOS.md (full context — routes, schema, patterns)
# Architecture: D:\TweetOS\ARCHITECTURE.md (single source of truth — read before touching any code)

---

## PROJECT RULES

### State Management
- Zustand `use-profile-store.ts` is the ONLY store. Never create new stores.
- `SupabaseProvider` handles all DB sync. Components never call Supabase directly.
- Pattern: update Zustand store → `saveProfileToSupabase()` fires automatically via store action.

### AI Calls
- Client-side Gemini: `lib/gemini.ts` wrapper → called from `hooks/use-tweet-composer.ts`
- Server-side Gemini: `/api/gemini/route.ts` (cached `GoogleGenAI` instance)
- Apify scraping routes: `/api/analyze-profile`, `/api/topic-hunt`, `/api/engagement-hunt`
  - ALL routes use the identical input schema: `searchTerms` (Twitter advanced search query)
  - System 1 (profile): Primary `61RPP7dywgiy0JPD0` (50+ tweet minimum), fallback `nfp1fpt5gUlBwPcor`
  - Systems 2 & 3 (hunts): Primary `nfp1fpt5gUlBwPcor` (no minimum limit), fallback `61RPP7dywgiy0JPD0`
- NEVER store `GEMINI_API_KEY` or `APIFY_API_TOKEN` in client state, Zustand, or Supabase

### Prompts
- All prompts live in `lib/prompts.ts`. No prompt logic in components or hooks.
- Active prompts: `UNIFIED_ROUTER_PROMPT`, `VOICE_BLUEPRINT_PROMPT`, `TOPIC_HUNT_PROMPT`, `ENGAGEMENT_HUNT_PROMPT`, `BRAIN_UPDATER_PROMPT`, `DAILY_INSPIRATION_PROMPT`
- DELETED: `REPLY_GENERATOR_PROMPT`, `IDEA_GENERATOR_PROMPT` — do not recreate them
- All prompts return strict JSON only. No markdown fences. No preamble.

### Types
- `VoiceBlueprint` is a structured JSON type (System 1 output). Separate from `inspirationsContext` (user freeform string).
- `TopicHuntAngle[]` is the output shape for System 2.
- `EngagementOpportunity[]` is the output shape for System 3.
- `geminiApiKey` has been REMOVED from `UserProfile`. Use `process.env.GEMINI_API_KEY` only.

### Design Rules
- No emojis in UI — lucide-react icons only.
- Geist / DM Sans for body/headings. Fira Code for monospace. Playpen Sans for handwriting. No new fonts.
- Neo-skeuomorphic design. No AI Slop UI (no gradient blobs, no glowing neon, no generic SaaS vibes).
- Check `components/dashboard/` + `components/profile/` + `components/engagement/` before building anything new.

### Key Files Added (not yet in older ARCHITECTURE docs)
- `components/ui/hunt-modal.tsx` — Shared mode-select + keyword-confirm modal (Topic Hunt + Engage Hunt)
- `components/dashboard/topic-hunt-results.tsx` — System 2 results panel below composer
- `components/engagement/opportunity-card.tsx` — Single engagement opportunity card
- `app/engagement/page.tsx` — System 3 dedicated page

### Before Marking Done
- `npm run lint` + `npx tsc --noEmit` → zero errors. No exceptions.
- If feature adds friction to the Ideate→Polish core flow → hide in settings or discard.
