# TweetOS: Product Vision & Core Features

## The Paradigm: The Local Tailoring Node
TweetOS is not an automated AI social media agent that runs in the cloud. It is a **hyper-minimal local workspace** that acts as a bridge between the user's unstructured thoughts and the stateless execution power of Grok. 

The core philosophy is a **Persona Fusion Mechanism**: The local Gemini model adopts the exact psychological framing, structural habits, and thinking process of a highly successful creator (via the Inspiration Blueprint), but outputs content strictly in the user's authentic Voice, Tone, and Vocabulary. It thinks like them, but speaks like you.

The application operates on a strictly controlled 2-step system:
1. **Local Tailoring (Gemini)**: The user dumps raw thoughts into the workspace. TweetOS uses Gemini (acting as the structural brain of the inspiration creator) combined with the user's permanent "Creator DNA" (Voice, Guardrails, Avoid Words) to format, polish, and ideate 280-character drafts.
2. **Stateless Execution (Grok Packets)**: The user clicks a button to generate a "Grok Packet" (a massive, context-rich prompt copied to the clipboard). They paste this packet into Grok on X to have Grok find trending topics, score/rewrite drafts, or find high-value engagement opportunities on live X.

---

## Core Features & Mechanics

### 1. The Command Center (`/`)
The main dashboard is aggressively stripped down to focus purely on creation.
- **Tweet Composer (Brain Dump Box)**: A massive textarea for raw input. Users dump their unfiltered thoughts, ideas, or frustrations here.
- **Generate Idea**: Uses local Gemini to generate a complete, authentic tweet idea matching the user's persona and appends it to the dump box.
- **Polish Draft**: Refines the raw brain dump into a highly styled, perfectly formatted 280-character post draft, strictly enforcing the user's Voice and Guardrails.
- **Topic Hunt**: Generates a Grok prompt commanding Grok to scour X for trending topics and craft ideas perfectly matching the user's specific sub-niche.
- **Engage Hunt**: Generates a Grok prompt commanding it to find reply and quote-tweet opportunities across the user's admired accounts.
- **Polished Draft Preview**: Displays the final output after Gemini finishes polishing. Includes a "Copy for Grok" button that generates a Review Packet for Grok to score and finalize the tweet against real-time X data.
- **Second Brain Note**: A macOS sticky-note widget for dumping random, unstructured context, background info, and daily life updates. It automatically syncs in the background and is injected into Gemini prompts to anchor outputs to real life.
- **Recent X Posts**: A dedicated 3-column layout grid that cleanly displays the final, published outputs as a historical feed.

### 2. Profile Configuration (`/profile`)
This is the central nervous system of TweetOS. The data configured here strictly controls how Gemini behaves. The UI features a Read-Only/Edit toggle system for beautiful readability.
- **Core Identity Card**: Defines the user's name, X handle, and primary sub-niche (e.g., "sarcastic Pune comp-eng student vibe-coding real AI projects").
- **Extended Context Card**: Houses the user's Bio, Content Pillars, Target Audience, Goals, and Admired Accounts. Includes a one-click prompt to auto-generate these via a Grok self-audit.
- **Voice Profile Card**: A permanent memory bank capturing the user's tone via an Inspiration Style Blueprint extracted from admired creators.
- **Avoid Words Card**: A strict blocklist (Lexicon Filter) of words the AI is forbidden from using, entered one per line (e.g., "delve", "testament", "crucial").

---

## Neo-Skeuomorphic Design System (SaaS & Scrapbook Fusion)

TweetOS uses a highly custom, tactile theme. The visual model balances high-performance SaaS components with a physical collage/desk environment.

- **Aggressive Minimalism**: Utility hubs, complex scorecards, and learning notes are hidden or deleted to remove friction.
- **Premium Canvas**: A floating top capsule navbar, soft off-white/beige canvas grids (#FAF8F5), and borderless cards.
- **Physical Realism (Overlapping Card Tilts)**: Cards and notes are tilted slightly (e.g., `rotate-[-0.2deg]`, `rotate-[0.4deg]`) to simulate physical sheets of paper scattered naturally on a desk.
- **Translucent Washi Tape Anchors**: Simulated frosted washi tape (`rgba(254, 240, 138, 0.4)`) with a subtle diagonal stripes pattern holds up the Core Identity, System Guardrails, and Tweet Composer cards. They sit absolutely at the top center of cards and are rotated slightly.
- **Tactile Metal Paperclips**: Custom 3D SVG silver paperclips featuring realistic metal drop shadows and shiny highlights used on notes and details cards (e.g., Second Brain note).
- **macOS Yellow Sticky Note (Second Brain)**: Styled with a warm sticky yellow (#FEF9C3) background and a top window bar (#FEF08A) with simulated close, minimize, and zoom dots (red, yellow, green). Features horizontal linear gradient lines aligned precisely with the text line-height.
- **Typography**: 
  - `DM Sans` / `Geist` (clean geometric sans-serif) for body and headings.
  - `Fira Code` (monospace) for developer items, logs, and system labels.
- **Subtle Premium Controls**: Buttons feature micro-compression scales on click (`active:scale-[0.98]`) for soft, premium tactile feedback. Primary actions use bold charcoal fills (`bg-slate-950`).

*(Note: Generic SaaS aesthetics like glowing purple gradient background blobs, neon text, and "AI slop" are strictly prohibited in this design system.)*
