# TweetOS: Product Vision & Core Features

## The Paradigm: The Local Tailoring Node

TweetOS is not an automated AI social media agent that runs in the cloud. It is a **hyper-minimal local workspace** that acts as a bridge between the user's unstructured thoughts and the stateless execution power of Grok. It uses a **Tri-System Hybrid Architecture** that prioritizes zero-friction automation while maintaining a robust manual fallback.

The core philosophy is a **Persona Fusion Mechanism**: The local Gemini model adopts the exact psychological framing, structural habits, and hook formulas of a highly successful creator (via the Voice Blueprint), but outputs content strictly in the user's authentic Voice, Tone, and Vocabulary. It thinks like them, but speaks like you.

The system operates on two core modes:
1. **Automated Pipeline (Apify → Gemini)**: User triggers a hunt, picks a mode, confirms keywords, and the system scrapes X → processes with Gemini → delivers results directly in the UI.
2. **Manual Fallback (Grok Packets)**: When the user prefers manual control or wants to bypass the API, a context-rich prompt is generated for Grok on X. This fallback is now voice-aware — it injects the full Voice Blueprint so Grok is handcuffed to exact structural rules.

---

## Core Features & Mechanics

### 1. The Command Center (`/`)
The main dashboard is stripped down to focus purely on creation.

- **Tweet Composer (Brain Dump Box)**: A massive textarea for raw input. Users dump unfiltered thoughts, ideas, or frustrations here.
- **Generate Idea**: Uses Gemini (via `UNIFIED_ROUTER_PROMPT`) to generate a complete, authentic tweet idea matching the user's persona. Appends to the dump box.
- **Polish Draft**: Refines the raw brain dump into a highly styled, perfectly formatted <280-character post. Enforces Voice Blueprint rules and Avoid List.
- **Topic Hunt Button**: Opens the `HuntModal`. User picks Apify (auto) or Grok packet (manual). If Apify: confirms keywords pre-filled from profile, fires `/api/topic-hunt`, results appear in `TopicHuntResults` panel below the composer.
- **Engage Hunt Button**: Opens the `HuntModal`. Navigates to `/engagement` after Apify run, OR generates Grok packet to clipboard.
- **TopicHuntResults Panel**: Appears below composer after a Topic Hunt Apify run. Shows 4-5 rewritten angles with pillar badges, original viral context, and "Load into Composer" button per angle.
- **Polished Draft Preview**: Displays final output after Gemini polishes. Includes "Copy for Grok" which generates a Review Packet for Grok to score/finalize the tweet against real-time X data.
- **Second Brain Note**: macOS sticky-note widget for live context (what you're building, thinking, going through). Automatically syncs and is injected into ALL Gemini prompts to anchor outputs to real life.
- **Recent X Posts**: 3-column layout showing final published outputs as historical feed.

### 2. Engage Hunt (`/engagement`)
A dedicated page for finding and responding to engagement opportunities.

- **Run Button**: Opens `HuntModal` → picks Apify or Manual → confirms target accounts + keywords (pre-filled from `admiredAccounts` and niche).
- **Opportunity Cards**: Each card shows the original tweet (author + text), a relevance note, and 3 reply options (A: casual, B: insightful/Second Brain anchored, C: question that opens conversation). Each reply has a copy button.
- **Grok Fallback**: "Generate Grok Packet" always visible as permanent fallback.
- **Persistence**: Fully ephemeral. No persistence. Re-run = fresh results.

### 3. Profile Configuration (`/profile`)
Central nervous system. Data here controls how ALL Gemini prompts behave.

- **Core Identity Card**: Name, X handle, primary sub-niche.
- **Extended Context Card**: Bio, Content Pillars, Target Audience, Goals, Admired Accounts.
- **Voice Profile Card**: 
  - `inspirationsContext` (user-editable freeform textarea) — manual override
  - `voiceBlueprint` (AI-generated structured JSON from System 1) — displayed as read-only structured view after extraction
  - Voice Blueprint Extractor: enter @handle → scrapes + analyzes → saves structured blueprint
- **Avoid Words Card**: Strict Lexicon Filter — one word per line, enforced in all Gemini outputs.
- **Read-Only / Edit toggle**: All array fields parsed into beautiful read-only UI, 1-click toggle to edit raw.

### 4. HuntModal (Shared Component)
Reusable modal used by both Topic Hunt and Engage Hunt buttons.

**Step 1 — Mode Select:**
Two large cards: `[⚡ Apify Auto]` and `[📋 Grok Manual]`

**Step 2a — Apify: Keyword/Target Confirm:**
- Topic Hunt: pre-fills keywords from `profile.niche + contentPillars`. Editable tag input.
- Engage Hunt: pre-fills `profile.admiredAccounts + niche keywords`. Editable.
- [Run ⚡] button fires respective API route.

**Step 2b — Manual: Immediate copy:**
- Builds Grok packet via `generateTrendingPacket()` or `generateEngagementPacket()`
- Copies to clipboard → shows "Copied!" confirmation

---

## System Architecture Summary

| System | Name | Trigger | Pipeline | Output Location |
|--------|------|---------|----------|-----------------|
| 1 | Voice Blueprint Extractor | @handle input on profile | Apify → Gemini | `profile.voiceBlueprint` (Zustand) |
| 2 | Topic Hunt | Dashboard button → HuntModal | Apify keyword search → Gemini | `TopicHuntResults` panel on dashboard |
| 3 | Engagement Hunt | `/engagement` or dashboard → HuntModal | Apify target scrape → Gemini | `/engagement` page cards |
| 4 | Grok Packet Injector | Manual mode in HuntModal | `grok-packager.ts` → clipboard | X.com/Grok (pasted manually) |

---

## Neo-Skeuomorphic Design System (SaaS & Scrapbook Fusion)

TweetOS uses a highly custom, tactile theme. The visual model balances high-performance SaaS components with a physical collage/desk environment.

- **Aggressive Minimalism**: Utility hubs, complex scorecards, and learning notes are hidden or deleted to remove friction.
- **Premium Canvas**: Soft off-white/beige canvas (`#FAF8F5`), borderless cards.
- **Physical Realism (Overlapping Card Tilts)**: Cards tilted slightly (`rotate-[-0.2deg]`, `rotate-[0.4deg]`) to simulate physical sheets of paper.
- **Translucent Washi Tape Anchors**: Simulated frosted washi tape (`rgba(254, 240, 138, 0.4)`) with subtle diagonal stripes at card tops.
- **Tactile Metal Paperclips**: Custom 3D SVG silver paperclips with realistic metal drop shadows on notes and detail cards.
- **macOS Yellow Sticky Note (Second Brain)**: `#FEF9C3` background, `#FEF08A` top bar, macOS dots (red, yellow, green). Horizontal gradient lines aligned to text line-height.
- **Typography**: Geist/DM Sans (body + headings), Fira Code (mono/developer labels), Playpen Sans (handwriting notes).
- **Subtle Premium Controls**: `active:scale-[0.98]` micro-compression on click. Primary actions use `bg-slate-950`.

*(Generic SaaS aesthetics — glowing gradient blobs, neon text, AI Slop UI — strictly prohibited.)*
