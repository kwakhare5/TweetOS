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
- **Premium Command Center Visuals**: The UI has been overhauled to a dark-mode Vercel/Linear-inspired visual layout. Features a CSS Grid Split-Pane (editor on left, output/packets on right), glowing violet accents, glassmorphic panels, and smooth micro-animations. It supports lock-to-screen on desktop for speed, and full scroll responsiveness on mobile viewports.
- **Power Features**: Keyboard shortcuts like `Ctrl+Enter` to tailor drafts instantly, and a floating Command Palette (`Ctrl+K` dialog modal) for quick navigation.
- **Pure Client Logic & Zustand**: All stores persist their state to browser Local Storage using Zustand's `persist` middleware, guaranteeing 100% offline functionality.

## Target Sub-Niche & Profile
- **Niche**: Lowercase, sarcastic Pune comp-eng student vibe-coding real AI projects and dropping blunt, dry, frustrated takes on tools, shipping, and dev life.
- **Content Pillars**: Tool Reality Checks, Project Fragments, Journey Notes, Sharp Takes, Quick Connects.
- **Voice**: Lowercase-heavy, direct, sarcastic/frustrated when deserved, dry wit, short dense sentences.
