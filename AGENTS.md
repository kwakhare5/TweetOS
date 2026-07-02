# AGENTS.md - TweetOS Project Rules
# Global rules: C:\Users\kwakh\.gemini\config\AGENTS.md
# Brain file:   D:\workflow-main\brain\Projects\TweetOS.md

---

## PROJECT RULES

### State Management
- Zustand use-profile-store.ts is the ONLY store. Never create new stores.
- SupabaseProvider handles all DB sync. Components never call Supabase directly.
- Pattern: update Zustand store -> saveProfileToSupabase() fires automatically.

### AI Calls
- Client-side Gemini: lib/gemini.ts wrapper, called from hooks/use-tweet-composer.ts
- Server-side Gemini: /api/gemini/route.ts (cached GoogleGenAI instance per API key)
- Apify scraping: /api/analyze-profile/route.ts
  - Tries actor 61RPP7dywgiy0JPD0 first, nfp1fpt5gUlBwPcor as fallback
  - Max 30 tweets per handle, sorted Latest

### Design Rules
- No emojis in UI. lucide-react icons only.
- DM Sans / Geist for body/headings. Fira Code for monospace. No new fonts.
- Neo-skeuomorphic design. No gradient blobs, no glowing neon, no AI Slop UI.
- Check components/dashboard/ + components/profile/ before building anything new.

### Before Marking Done
- npm run lint + npx tsc --noEmit -> zero errors. No exceptions.
- If feature adds friction to the Ideate->Polish core flow -> hide in settings or discard.
