# TweetOS — Personal Twitter Growth System

TweetOS is a personal content studio and Twitter growth system tailored for developer builders. It helps draft tweets in your unique voice, scores them against organic X algorithm ranking signals, packages stateless prompts for Grok validation, and logs posted metrics over time to close the loop.

## Core Features

1. **Creator Workspace**: Dynamic draft management, a zero-prompt **Daily Inspiration** generator, and real-time scorecard metrics.
2. **Auto-Fix Wands**: Surgical AI rewrites next to weak scorecard metrics to instantly optimize openers, specificity, CTAs, and length.
3. **Dump Mode Selectors**: Steer raw thoughts into custom tones (**Dev | Personal | Shitpost**).
4. **Engage Hub**: Pre-loaded cold/warm target account feeds and reply suggestion flows.
5. **Grok Packet Packagers**: Creates optimized, stateless prompt payloads (Master packets, Draft reviews, Trending radars) to validate content using Grok.
6. **Local-First Architecture**: 100% serverless and offline-first, running on Zustand state persistent storage (`localStorage`).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui layouts, glassmorphic panels
- **AI Model**: Google Gemini 2.5 Flash via `@google/genai`
- **State & Storage**: Zustand (with browser persist middleware)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Keys**:
   Create a `.env.local` file at the project root and add your Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey)):
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the workspace.

## Documentation
- [CLAUDE.md](file:///d:/TweetOS/CLAUDE.md) - Local project guidelines & mistakes tracker.
- [CONTEXT.md](file:///d:/TweetOS/CONTEXT.md) - Core domain terminology and status.
- [ARCHITECTURE.md](file:///d:/TweetOS/ARCHITECTURE.md) - Detailed modules, local schemas, and development guidelines.
- [GROK_TEMPLATES.md](file:///d:/TweetOS/GROK_TEMPLATES.md) - Prompt playbooks and data payloads for Grok.
- [AGENTS.md](file:///d:/TweetOS/AGENTS.md) - Local rules for coding models.
