# TweetOS — CLAUDE.md
# Global rules: C:\Users\kwakh\.gemini\config\AGENTS.md (read this first)
# Brain file: D:\workflow-main\brain\Projects\TweetOS.md (full context — routes, schema, patterns)

---

## PROJECT RULES (not in the brain or global AGENTS.md)

### State Management
- Zustand `use-profile-store.ts` is the ONLY store. Never create new stores without removing this one or extending it.
- `SupabaseProvider` handles all DB sync in the background. Components never call Supabase directly.
- Pattern: update Zustand → `saveProfileToSupabase()` fires automatically via store action.

### AI Calls
- Client-side Gemini: use `lib/gemini.ts` wrapper → called from `hooks/use-tweet-composer.ts`
- Server-side Gemini: use `/api/gemini/route.ts` (cached `GoogleGenAI` instance per API key)
- Apify scraping: `/api/analyze-profile/route.ts` — tries actor `61RPP7dywgiy0JPD0` first, `nfp1fpt5gUlBwPcor` fallback

### Design Rules
- No emojis in UI — lucide-react icons only
- DM Sans / Geist for body/headings. Fira Code for monospace. No new fonts.
- Neo-skeuomorphic design. No AI Slop UI (no gradient blobs, no glowing neon).
- Check `components/dashboard/` + `components/profile/` before building any new component.

### Before Marking Done
- `npm run lint` + `npx tsc --noEmit` → zero errors. No exceptions.
- If feature adds friction to the Ideate→Polish core flow → hide in settings or discard.
