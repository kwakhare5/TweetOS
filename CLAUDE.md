# CLAUDE.md — Local Project Context

# Note: All AI behaviors, commands (@TDD, @GRILL), and context maintenance rules
# are now globally enforced via ~/.gemini/GEMINI.md. Do not duplicate them here.

---

## 1. PROJECT IDENTITY

**Name:** TweetOS
**Goal:** Personal Twitter growth system — drafts tweets in Karan's voice, scores them against X algorithm signals, helps him find engagement opportunities, and packages everything for Grok validation.

**AI POINTER:** If you need database schemas, business logic, prompt templates, or third-party API details, you MUST autonomously read `ARCHITECTURE.md`. Do not guess.

## 2. TECH STACK

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react
- **Backend:** Supabase (Postgres + Auth)
- **AI:** Google Gemini 2.5 Flash via `@google/genai`
- **State:** Zustand (with persist middleware)
- **Hosting:** Vercel

## 3. LOCAL ARCHITECTURE RULES

1. **All DB calls → `src/lib/storage.ts` ONLY.** Never query Supabase directly in components.
2. **All prompts → `src/lib/prompts.ts` ONLY.** Never inline AI prompts in components.
3. **All types → `src/types/index.ts`.** No local type definitions scattered across files.
4. **Auth required on every page except `/login`.** Middleware handles redirect automatically.
5. **280-char limit is a HARD FAIL in scorer, not a weak signal.** Enforce at UI level too (live counter everywhere).
6. **Mobile-first.** Bottom tab bar is primary nav. Sidebar = desktop only.
7. **Seed profile auto-loads on first login** (`src/data/seedProfile.ts`) — never show empty state on first run.
8. **UI Aesthetic:** Use Lucide icons (no emojis), glassmorphic panels, and consistent dark mode gradients.
9. **Inline Tutorials:** No separate tutorial pages; onboarding instructions are integrated directly into the UI.

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
- In TSX text nodes, raw `<` and `>` characters break Turbopack builds. Always use `&lt;` and `&gt;` or `{ '<' }` and `{ '>' }`.
- Do not add duplicate or excessive state management files for unused features. E.g., standalone `engagement` state has been pruned in favor of streamlined page-level and grok-based interactions.
- Avoid using emojis in the UI; use `lucide-react` icons for a cleaner, professional look.

## 6. CURRENT BUILD PHASE

Phase 9 ✅ DONE — Cleanup & UI Modernization
- Pruned unused files (TargetAccountsList, ReplyGenerator, EngagementLogList, etc.) to minimize codebase size.
- Migrated all UI components to use high-quality Lucide icons instead of emojis.
- Replaced standalone Tutorial tabs with inline onboarding flows across Drafts, Dump, and Workshop areas.
- Consolidated views to use glass-panel CSS for a professional, premium aesthetic.
