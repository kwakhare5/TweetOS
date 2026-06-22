# CLAUDE.md — Local Project Context

# Note: All AI behaviors, commands (@TDD, @GRILL), and context maintenance rules
# are now globally enforced via ~/.gemini/GEMINI.md. Do not duplicate them here.

---

## 1. PROJECT IDENTITY

**Name:** TweetOS
**Goal:** Personal Twitter growth system — drafts tweets in Karan's voice, scores them against X algorithm signals, generates smart replies, and packages everything for Grok validation.

**AI POINTER:** If you need database schemas, business logic, prompt templates, or third-party API details, you MUST autonomously read `ARCHITECTURE.md`. Do not guess.

## 2. TECH STACK

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Postgres + Auth)
- **AI:** Google Gemini 2.5 Flash via `@google/genai`
- **State:** Zustand
- **Hosting:** Vercel

## 3. LOCAL ARCHITECTURE RULES

1. **All DB calls → `src/lib/storage.ts` ONLY.** Never query Supabase directly in components.
2. **All prompts → `src/lib/prompts.ts` ONLY.** Never inline AI prompts in components.
3. **All types → `src/types/index.ts`.** No local type definitions scattered across files.
4. **Auth required on every page except `/login`.** Middleware handles redirect automatically.
5. **280-char limit is a HARD FAIL in scorer, not a weak signal.** Enforce at UI level too (live counter everywhere).
6. **Mobile-first.** Bottom tab bar is primary nav. Sidebar = desktop only.
7. **Seed profile auto-loads on first login** (`src/data/seedProfile.ts`) — never show empty state on first run.

## 4. AI COMMAND CHEAT SHEET

| Command     | Skill Path / Action                                                                                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@PLAN`     | Standard agent planning mode. Create `implementation_plan.md` first.                                                                                                                                             |
| `@TDD`      | [mp-tdd/SKILL.md](file:///C:/Users/kwakh/.gemini/antigravity/skills/mp-tdd/SKILL.md) — Test-driven development with a red-green-refactor loop. Write a failing test first, make it pass, and then refactor.      |
| `@GRILL`    | [mp-grill-me/SKILL.md](file:///C:/Users/kwakh/.gemini/antigravity/skills/mp-grill-me/SKILL.md) — Relentlessly interview user about design/decisions one question at a time before writing any code.              |
| `@DIAGNOSE` | [mp-diagnose/SKILL.md](file:///C:/Users/kwakh/.gemini/antigravity/skills/mp-diagnose/SKILL.md) — Systematic bug hunt loop: Build reproducer feedback loop first -> Generate 3–5 hypotheses -> Instrument -> Fix. |
| `@ZOOM`     | [mp-zoom-out/SKILL.md](file:///C:/Users/kwakh/.gemini/antigravity/skills/mp-zoom-out/SKILL.md) — Zoom out to map codebase architecture, components, and module dependencies before making edits.                 |
| `@AUDIT`    | [ponytail-audit/SKILL.md](file:///C:/Users/kwakh/.gemini/antigravity/skills/ponytail-audit/SKILL.md) — Scan codebase for over-engineering, useless abstractions, dead flags, and candidate lines to delete.      |

## 5. MISTAKES TO AVOID

_Autonomously updated by the AI whenever it encounters a project-specific error, compilation issue, or pattern mistake. Never repeat these._

- `create-next-app` fails if directory name has capital letters (e.g. `TweetOS`). Always scaffold in lowercase temp dir, then move files.
- `getSession()` is insecure — always use `getUser()` for auth checks in server context.
- Never use browser Supabase client in server components — use `createClient` from `@/lib/supabase/server`.
- Next.js 16: `middleware.ts` is deprecated — renamed to `proxy.ts`, function name must be `proxy` not `middleware`.
- Supabase `createBrowserClient` validates URL immediately at instantiation — guard with placeholder URL when env vars are missing or invalid (e.g. starting with placeholder text like `your_supabase_project_url`) at build/SSR/runtime.
- `storage.ts` must lazy-init Supabase client inside functions (not module-level `const db = createClient()`) to avoid prerender failures.
- Engagement data (target accounts, log) uses local Zustand state only until auth is wired — same pattern as brain-dump page (userId === null guard).
- `src/lib/engagement.ts` owns temperature logic and seed fn. Never inline in components.
- In TSX text nodes, raw `<` and `>` characters break Turbopack builds. Always use `&lt;` and `&gt;` or `{ '<' }` and `{ '>' }`.

## 6. CURRENT BUILD PHASE

Phase 8 ✅ DONE — UI Consolidation & Polish (Localhost)
- All loading.tsx / error.tsx files added per Next.js App Router convention
- Browser notification permission requested on dashboard mount
- IST posting window notifications fire when status goes green (no repeat per window)
- Local .env.local set with: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
- Consolidated 8 routes into 3 unified glassmorphic views: Workspace (`/`), Engage Hub (`/engage`), and Analytics & Archive (`/analytics`)
- Added Settings profile modal toggled from sidebar
- Implemented closed-loop feedback learning from posted library entries
- Deleted Vercel configuration files, targeted localhost execution only


