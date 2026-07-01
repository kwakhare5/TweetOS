# Context: TweetOS Domain Context & Status

## Domain Paradigm: The Tailoring Node
TweetOS is a hyper-minimal local workspace that acts as a bridge between the user's brain and Grok. It is strictly a 2-step system:
1. **Local Tailoring**: The user dumps raw thoughts. TweetOS uses Gemini (locally) combined with the user's permanent Voice and Inspiration DNA to format and polish the dump into a 280-character draft.
2. **Stateless Grok Execution**: The user clicks a button to generate a "Packet" (a massive, context-rich prompt). They paste this packet into Grok to have Grok find trending topics, score/rewrite drafts, or find engagement opportunities on live X.

## Core Mechanics

### 1. The Command Center (`/`)
The entire workspace has been aggressively stripped down to a single minimal interface:
- **Brain Dump Box**: A massive text area for raw input.
- **Tailor Draft Button**: Merges the dump with the user's Voice and Inspiration DNA.
- **Topic Hunt Packet Button**: Generates a Grok prompt commanding it to scour X for trending topics and craft ideas perfectly matching the user's Inspiration DNA.
- **Engage Packet Button**: Generates a Grok prompt commanding it to find reply and quote-tweet opportunities that match the user's niche.
- **Copy to Grok Button**: After tailoring a draft, this copies a Review Packet for Grok to score and finalize the tweet.

### 2. The Inspiration Engine & Creator DNA
- **Inspirations Context**: A new setting in `/profile` where the user pastes a "Creator DNA Blueprint" (extracted by Grok).
- **DNA Override**: All local tailoring and Grok packets forcefully instruct the AI to clone the psychological framing, formatting habits, and vocabulary from this Inspiration DNA.

### 3. Second Brain (Live Context)
- Managed in the Profile Settings.
- A permanent memory bank containing Karan's background, active projects, frustrations, and daily context.
- Automatically injected into all Gemini tailoring prompts and Grok packets so outputs are anchored to real life, not generic takes.

## Architectural Notes

- **Aggressive Minimalism**: The Scorecard, Engage Hub (`/engage`), Workshop utility buttons, and Learning Notes have been completely deleted or hidden from the main dashboard to remove friction.
- **Premium Command Center Visuals**: The UI is styled with a premium light-mode theme inspired by the Zite website: a floating top capsule navbar, soft off-white/beige canvas grids, borderless cards, and custom `DM Sans` (body & headings) paired with `Fira Code` (monospace) typography. It supports lock-to-screen on desktop for speed, and full scroll responsiveness on mobile viewports.
- **Power Features**: Keyboard shortcuts like `Ctrl+Enter` to tailor drafts instantly, and a floating Command Palette (`Ctrl+K` dialog modal) for quick navigation.
- **Pure Client Logic & Zustand**: All stores persist their state to browser Local Storage using Zustand's `persist` middleware, guaranteeing 100% offline functionality.

## Design System & Theme Guidelines (SaaS & Scrapbook Fusion)
TweetOS uses a highly custom, tactile **SaaS & Scrapbook Fusion (Neo-Skeuomorphic)** theme. The visual model balances high-performance SaaS components with a physical collage/desk environment.

* **No Purple Color & No AI Slop**: Absolutely no purple gradients, ambient glowing background blur blobs, or hyper-animated gradient text. The design uses clean, flat, physical colors.
* **Canvas & Page Background (Warm Sepia Dot Grid)**: A global sepia background (#FAF8F5) with a sepia dot-matrix grid (`rgba(120, 90, 40, 0.08)`) spaced at 20px intervals.
* **Overlapping Card Tilts (Physical Realism)**: Cards and notes are tilted slightly (e.g. `rotate-[-0.2deg]`, `rotate-[0.4deg]`, `rotate-[-0.3deg]`) to simulate physical sheets of paper scattered naturally on a desk.
* **Translucent Washi Tape Anchors**:
  * Simulated frosted washi tape (`rgba(254, 240, 138, 0.4)`) with a subtle diagonal sepia-amber stripes pattern holds up the Core Identity, Subroutines, and Tweet Editor cards.
  * Sits absolutely at the top center of cards and is rotated slightly (`rotate-[-2deg]` or `rotate-[2deg]`).
* **Tactile Metal Paperclips**:
  * Custom 3D SVG silver paperclips (featuring realistic metal drop shadows and shiny highlights) are used on notes and details cards (e.g. Second Brain note, Neural Context card).
  * Placed absolutely at the top-left edge of the card, rotated slightly (`rotate-[-10deg]`).
* **macOS Yellow Sticky Note (Second Brain)**:
  * Styled with a warm sticky yellow (#FEF9C3) background and an top window bar (#FEF08A) with simulated close, minimize, and zoom dots (red, yellow, green).
  * Feature horizontal rules/lines (linear gradient lines spaced at 28px) aligned with the textarea font line height (`leading-[28px]`) so text characters sit precisely on the lines.
  * No inner labels or sync badges; action controls are integrated directly in the top window bar.
* **Subtle Premium Controls (Buttons)**:
  * Primary actions (e.g., Tailor Draft, Synchronize DNA) use bold, clean charcoal fills (`bg-slate-950 text-white hover:bg-slate-900`) and rounded-lg outlines, with subtle lift effects on hover.
  * Secondary actions use white backgrounds, thin borders (`border-border`), and clean hover transitions.
  * All buttons feature micro-compression scales on click (`active:scale-[0.98]`) for soft, premium tactile feedback.
* **Typography**:
  * **Sans-Serif (Default)**: `Geist` (clean geometric sans-serif) for general copy, headings, and labels.
  * **Monospace (Secondary)**: `Fira Code` for developer items, system logs, labels, and API input blocks.
  * **Text Colors**: Dark charcoal/slate (`text-slate-950` / `oklch(0.145 0.008 240)`) for high-contrast primary content; slate-gray (`text-slate-500` / `oklch(0.55 0.01 240)`) for secondary descriptions and labels.

## Target Sub-Niche & Profile
- **Niche**: Lowercase, sarcastic Pune comp-eng student vibe-coding real AI projects and dropping blunt, dry, frustrated takes on tools, shipping, and dev life.
- **Content Pillars**: Tool Reality Checks, Project Fragments, Journey Notes, Sharp Takes, Quick Connects.
- **Voice**: Lowercase-heavy, direct, sarcastic/frustrated when deserved, dry wit, short dense sentences.

