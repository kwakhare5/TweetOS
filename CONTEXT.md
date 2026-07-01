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

## Design System & Theme Guidelines (Strict Light Mode)
TweetOS is designed with a premium, clean, minimalist **Light Mode Only** tech dashboard aesthetic. Dark mode is completely disabled and removed. The Dashboard is the gold standard for all layouts.

* **No Purple Color & No AI Slop**: Absolutely no purple colors, gradient outlines, background glowing ambient blur blobs, or hyper-animated gradient text. The design is kept flat, modern, and clean.
* **Canvas & Page Background**: Soft slate off-white canvas (`bg-background` / `oklch(0.985 0.002 240)` / `#FAFAFA`) to provide a light, clean, and spacious context.
* **Component Cards**: Pure white cards (`bg-white` or `bg-card`) with thin, light borders (`border-border` / `oklch(0.93 0.004 240)`) and soft, diffuse shadows (`shadow-sm`) to stand out from the canvas. No neon border stripes.
* **Typography**:
  * **Sans-Serif (Default)**: `Geist` (clean geometric sans-serif) for general copy, headings, and labels.
  * **Monospace (Secondary)**: `Fira Code` for developer items, system logs, labels, and API input blocks.
  * **Text Colors**: Dark charcoal/slate (`text-slate-900` / `oklch(0.145 0.008 240)`) for high-contrast primary content; slate-gray (`text-slate-500` / `oklch(0.55 0.01 240)`) for secondary descriptions and labels.
* **Accent Colors & State**:
  * Hover: Subtle border and background color transitions (`duration-200` or `duration-300`).
  * Selected/Active states: Uses soft background colored fills (e.g. `bg-blue-50`, `bg-orange-50/50`) paired with clean text (`text-blue-600`, `text-orange-600`) and simple icons. No purple accents.

## Target Sub-Niche & Profile
- **Niche**: Lowercase, sarcastic Pune comp-eng student vibe-coding real AI projects and dropping blunt, dry, frustrated takes on tools, shipping, and dev life.
- **Content Pillars**: Tool Reality Checks, Project Fragments, Journey Notes, Sharp Takes, Quick Connects.
- **Voice**: Lowercase-heavy, direct, sarcastic/frustrated when deserved, dry wit, short dense sentences.

