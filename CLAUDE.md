# CLAUDE.md — Local Project Context

# Note: All AI behaviors, commands (@TDD, @GRILL), and context maintenance rules

# are now globally enforced via ~/.gemini/config/AGENTS.md. Do not duplicate them here.

---

## 1. PROJECT IDENTITY

**Name:** TweetOS
**Goal:** Personal Twitter growth system — replicates inspiration creator DNA combined with user's live second brain context, drafts/tailors tweets locally with Gemini, and packages stateless packets for Grok scoring and trend hunting.

**AI POINTER:** If you need database schemas, business logic, prompt templates, or third-party API details, you MUST autonomously read `ARCHITECTURE.md`. Do not guess.

## 2. TECH STACK

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react
- **Backend:** None (100% local-first, runs entirely in browser Local Storage)
- **AI:** Google Gemini 2.5 Flash via `@google/genai`
- **State:** Zustand (with persist middleware)
- **Hosting:** Vercel

## 3. EXECUTION & VERIFICATION

- **Run Dev Server:** `npm run dev`
- **Run Linting:** `npm run lint`
- **Run Build:** `npm run build`

## 4. LOCAL ARCHITECTURE RULES

1. **All prompts → `src/lib/prompts.ts` ONLY.** Never inline AI prompts in components.
2. **All types → `src/types/index.ts`.** No local type definitions scattered across files.
3. **280-char limit is a HARD FAIL in scorer, not a weak signal.** Enforce at UI level too (live counter everywhere).
4. **Mobile-first.** Bottom tab bar is primary nav. Sidebar = desktop only.
5. **Seed profile auto-loads on mount** (`src/data/seedProfile.ts`) if no profile is found in local storage.
6. **UI Aesthetic**: Zite-inspired premium light-mode dashboard styling using a soft grayish-white background (`#f9f9fb`), white canvas cards with fine borders, a floating capsule top navigation bar, and custom **DM Sans** (body & headings) paired with **Fira Code** (monospace) typography.
7. **Inline Tutorials**: No separate tutorial pages; onboarding instructions are integrated directly into the UI.

## 5. AI COMMAND CHEAT SHEET

| Command     | Skill Path / Action                                                                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@PLAN`     | Standard agent planning mode. Create `implementation_plan.md` first.                                                                                                                                                                                |
| `@TDD`      | [mp-tdd/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-tdd/SKILL.md) — **Red-Green-Refactor.** Write failing tests first. Do not write implementation code until tests fail.                                                             |
| `@GRILL`    | [mp-grill-me/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-grill-me/SKILL.md) — **Relentless Interrogation.** Ask ONE question at a time to clarify architecture. Push back on bad ideas. DO NOT write code until alignment is reached. |
| `@DIAGNOSE` | [mp-diagnose/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-diagnose/SKILL.md) — **Scientific Method Bug Hunt.** 1. Build reproducer. 2. Form 3-5 hypotheses. 3. Instrument logging. 4. Fix only when proven.                            |
| `@ZOOM`     | [mp-zoom-out/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-zoom-out/SKILL.md) — **Architectural Mapping.** Stop coding. Map the codebase dependencies, data flow, and components before making sweeping changes.                        |

## 6. MISTAKES TO AVOID

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
- When writing source code files (non-artifact files) using the `write_to_file` tool, never provide `ArtifactMetadata` as it causes invalid path errors. `ArtifactMetadata` is strictly for files saved in the artifacts directory.
- Nested git clone directories (e.g. `cloner`) in the workspace trigger root compilation errors during build time. Exclude these directories in both root `tsconfig.json` and root `eslint.config.mjs` config files.

## 6. CURRENT BUILD PHASE

Phase 15 ✅ DONE — Trueform Dashboard Aesthetics & Design Realignment

- Overhauled app shell, page structures, and colors to inherit the clean light-mode dashboard visuals from screenshots.
- Rebuilt Sidebar with the `TO` brand block dropdown, search panel, and original favorites and locations categories (Notes, Discover, System Settings, TweetOS Node, Trash).
- Redesigned Workspace `/` as the **Notes** page: Voice Editor card, checklist of algorithm score cards, and clean list feed of recent notes.
- Transformed Discover `/discover` into a clean template card grid grouped by content pillars (**Reality Checks**, **Tech Rants**, **Pune Dev Life**, **Growth Lessons**) with attributes and remix options.
- Styled System Settings `/profile` into clean card configurations.
- Verified compilation builds correctly with Next.js Turbopack.
- Removed dead codebase file (`useDraftStore.ts`) to keep repository clean.
