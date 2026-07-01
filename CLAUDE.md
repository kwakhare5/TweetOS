# Agent Instructions (TweetOS)

As an AI agent working on this repository, you must strictly adhere to the following rules, conventions, and architectural guidelines. Failure to follow these rules will break the application's unique visual identity and offline-first performance.

## 1. Design & UI Guardrails (CRITICAL)
TweetOS uses a highly custom **Neo-Skeuomorphic (SaaS & Scrapbook Fusion)** design system. It is meant to feel like a physical desk with premium digital components.

- **NO "AI Slop"**: You are strictly forbidden from adding glowing ambient background blur blobs, neon text, or over-animated gradient borders.
- **NO Purple/Generic SaaS Colors**: Do not use generic purple or indigo gradients. Stick to the defined physical color palette: off-white/beige canvas grids (`#FAF8F5`), charcoal/slate for high-contrast text (`#020617` / `text-slate-950`), and specific physical item colors like sticky-note yellow (`#FEF9C3`).
- **Use the Existing Skeuomorphic Elements**: When creating new cards or notes, leverage the existing UI motifs:
  - Slight physical rotations (e.g., `rotate-[-0.3deg]`).
  - Washi tape anchors (simulated frosted tape).
  - Tactile 3D metal paperclips (import from existing components).
- **Typography**: Strictly use `DM Sans` (or `Geist`) for body/headings and `Fira Code` for monospace/system labels. Do not import new Google fonts arbitrarily.
- **Minimalism**: Do not clutter the dashboard (`/`). If a feature adds friction to the core 2-step (Ideate -> Grok) workflow, it should be hidden in settings or discarded.

## 2. Architecture & State Management
TweetOS uses a **Local-First** hybrid architecture.

- **Zustand is the Source of Truth**: All UI components must read from and write to the local Zustand stores (e.g., `use-profile-store.ts`).
- **DO NOT Query Supabase Directly**: Never write `supabase.from('profiles').select('*')` directly inside a UI component to fetch active state. The `<SupabaseProvider>` handles background synchronization automatically. Your job is to update the Zustand store, and the provider will handle pushing it to the database in the background.
- **Grok Packets over Live APIs**: Do not attempt to integrate the Twitter/X API. TweetOS interacts with X exclusively by generating massive, structured system prompts ("Grok Packets") that the user copies to their clipboard and pastes into Grok manually.

## 3. Code Organization & Commands
- **Check Existing Components First**: Before building a new UI component, check `src/components/dashboard` and `src/components/profile` to see if a reusable skeuomorphic card or button already exists.
- **Next.js 15 App Router**: Ensure all new pages are added to `src/app/` following Next.js 15 server/client component conventions. Use `"use client"` only at the leaf nodes where interactivity (hooks, event listeners) is required.
- **Verification**: Always run `npm run lint` and `npx tsc --noEmit` after modifying React components or TypeScript types. Ensure zero errors before concluding your work.

## 4. Updates to Documentation
- If you add a new major feature or alter the state management flow, you must autonomously update `CONTEXT.md` and `ARCHITECTURE.md` to reflect the new state of the project.

## 5. AI COMMAND CHEAT SHEET

| Command     | Skill Path / Action                                                                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@SPEC`     | Interview mode � AI asks ONE question at a time, builds `spec.md` before any code. FORBIDDEN from coding until spec approved.                                                                                                                       |
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
- Always wrap `cmdk` subcomponents (`CommandInput`, `CommandList`, etc.) in the `<Command>` parent component (acting as the state provider) to prevent runtime `TypeError: Cannot read properties of undefined (reading 'subscribe')` crashes on page load.
- In Playwright E2E tests, ensure text assertions on headings use exact matching or `getByRole` to avoid duplicate element matches with hidden mobile header titles.
- When performing initial state updates in `useEffect` (e.g. initializing local form states from a store object), wrap the state setter calls in a `setTimeout` macrotask to prevent React 19 cascading render compilation errors.
- OS dark mode configurations can make browsers render a native white caret inside inputs/textareas, rendering them invisible on light card backgrounds. Force `:root, html { color-scheme: light !important; }` in CSS to override the browser default scheme, and explicitly override `caret-color` using custom CSS rules matching specific theme backgrounds (e.g. charcoal `#0f172a` for standard inputs, warm brown `#451a03` for yellow sticky notes, and emerald `#34d399` for dark terminal inputs).

## 7. CURRENT BUILD PHASE

Phase 18 ✅ DONE — Profile Page UI Refactoring
- Transformed Profile cards into beautiful Read-Only/Edit toggle modes for easy scanning.
- Consolidated "Second Brain" to exist strictly on the Dashboard Sticky Note to prevent state overwriting.
- Embedded Grok prompts directly inside their respective context cards.

Phase 17 ✅ DONE — Documentation Overhaul & Design Enforcement
- Completely rewrote `CONTEXT.md`, `ARCHITECTURE.md`, and `CLAUDE.md` to accurately reflect the 100% Neo-Skeuomorphic visual layer and the Zustand/Supabase Local-First hybrid state architecture.
