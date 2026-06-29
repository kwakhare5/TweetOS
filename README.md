# TweetOS — Personal Twitter Growth System

TweetOS is a personal content studio and Twitter growth system tailored for developer builders. It helps draft tweets in your unique voice, scores them against organic X algorithm ranking signals, packages stateless prompts for Grok validation, and logs posted metrics over time to close the loop.

## Core Features

1. **Hyper-Minimal Command Center**: A single distraction-free dashboard that acts as the node between your brain dumps and Grok.
2. **Inspiration Engine**: Extract "Creator DNA" from X using Grok, and TweetOS will seamlessly format all drafts and packet instructions using that precise psychological tone and vocabulary.
3. **Draft Tailoring (Local)**: Paste a raw dump; local Gemini instantly formats it into a 280-char draft using your Voice and Inspiration DNA.
4. **Grok Hunt Packets (Cloud)**: 1-click generators that create massive, context-rich prompts for Grok to execute (Topic Hunting, Engagement Hunting, Draft Reviewing).
5. **Local-First Architecture**: 100% serverless and offline-first, running on Zustand state persistent storage (`localStorage`).

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
- [AGENTS.md](file:///d:/TweetOS/AGENTS.md) - Local rules for coding models.
