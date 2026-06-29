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
- **Backend:** None (100% local-first, runs entirely in browser Local Storage)
- **AI:** Google Gemini 2.5 Flash via `@google/genai`
- **State:** Zustand (with persist middleware)
- **Hosting:** Vercel

## 3. LOCAL ARCHITECTURE RULES

1. **All prompts → `src/lib/prompts.ts` ONLY.** Never inline AI prompts in components.
2. **All types → `src/types/index.ts`.** No local type definitions scattered across files.
3. **280-char limit is a HARD FAIL in scorer, not a weak signal.** Enforce at UI level too (live counter everywhere).
4. **Mobile-first.** Bottom tab bar is primary nav. Sidebar = desktop only.
5. **Seed profile auto-loads on mount** (`src/data/seedProfile.ts`) if no profile is found in local storage.
6. **UI Aesthetic:** Premium Vercel/Linear dark mode theme layout: full-screen split-pane layout on desktop (scrollable editor on left, responsive tools/outputs on right), glowing violet accents, glassmorphic panels, and Plus Jakarta Sans font. Native page scrolling is enabled on mobile viewports.
7. **Inline Tutorials:** No separate tutorial pages; onboarding instructions are integrated directly into the UI.

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
- In TSX text nodes, raw `<` and `>` characters break Turbopack builds. Always use `&lt;` and `&gt;` or `{ '<' }` and `{ '>' }`.
- Do not add duplicate or excessive state management files for unused features. E.g., standalone `engagement` state has been pruned in favor of streamlined page-level and grok-based interactions.
- Avoid using emojis in the UI; use `lucide-react` icons for a cleaner, professional look.
- Calling `setState` synchronously inside a `useEffect` (e.g., during store rehydration sync or component updates) triggers React cascading render warnings. Perform render-time synchronization checks using previous prop/state references instead.
- Google API keys require the 'AIzaSy' prefix. In `.env.local`, check for key truncation and verify parsing logic prepends it if missing.
- Always load mandatory skills (e.g. `ui-ux-pro-max`, `shadcn`) and format response starting with `[SKILLS ACTIVE: ...]` before performing UI design revisions.
- Next.js App Router locks page scroll if `h-screen overflow-hidden` is applied on layout wrappers (like `AppShell`). To allow scrolling on settings and details pages, pass `scrollable={true}` to `AppShell` or always default `overflow-y-auto` on mobile viewport viewports.
- Accessing custom properties on properties of type `Record<string, unknown>` triggers TypeScript compilation errors. Declare precise interfaces/types (e.g. for `algorithmScore` in `TweetDraft` type) instead of generic records or `any` to satisfy the strict type-checker and build pipeline.

## 6. CURRENT BUILD PHASE

Phase 12 ✅ DONE — Command Center & Vercel/Linear Dark Theme Overhaul

- Overhauled UI from Notion theme to Vercel/Linear premium dark theme with glowing violet accents.
- Rebuilt Workspace to use CSS Grid Split-Pane layout (left-pane editor, right-pane tools and output).
- Added `Ctrl+Enter` tailor shortcut and floating Command Palette (`Ctrl+K`).
- Refactored `AppShell` with dynamic `scrollable` layout toggles, fixing scrolling issues on mobile and the Profile settings page.
- Performed whole-repo code audit, removing unused `card.tsx` component and fixing outdated CSS variables in `loading.tsx` and `error.tsx` layouts.
- Updated documentation (`CONTEXT.md`, `CLAUDE.md`) to reflect the new premium visual setup.
