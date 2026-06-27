import { UserProfile, TweetDraft, DraftPacketConfig, EngagementPacketConfig, TrendingPacketConfig, LibraryEntry } from '@/types'

const DUMP_MODE_LABEL: Record<string, string> = {
  dev: 'Dev / AI Content',
  personal: 'Personal Life',
  shitpost: 'Shit Post / Chaos'
}

/**
 * Formats top 5 recent posted tweets and their performance notes.
 */
function formatPastPerformance(entries: LibraryEntry[] | undefined): string {
  if (!entries || entries.length === 0) return '[Not enough data yet]'
  
  const targets = [...entries]
    .filter(e => e.postedAt && e.performanceNote && e.performanceNote.trim())
    .sort((a, b) => new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime())
    .slice(0, 5)

  if (targets.length === 0) return '[Not enough data yet]'

  return targets.map((e) => {
    const content = e.isThread && e.threadTweets ? e.threadTweets.map((t, n) => `${n + 1}/ ${t}`).join('\n') : e.tweet
    return `---
Tweet: "${content}"
Posted: ${new Date(e.postedAt!).toLocaleDateString()} | Performance: ${e.performanceNote}
Pillar: ${e.pillarId} | Type: ${e.isThread ? 'Thread' : 'Tweet'}
---`
  }).join('\n')
}

/**
 * Formats flops (drafts scored under 50 or archived).
 */
function formatFlopLog(_entries: LibraryEntry[] | undefined): string {
  // Simplistic flop log using items with low scores or bad performance notes
  // For now just returning placeholder if we don't have explicit flop tracking
  return '[Not enough data yet]'
}

export function generateDraftPacket(
  profile: UserProfile,
  drafts: TweetDraft[],
  config: DraftPacketConfig,
  libraryEntries?: LibraryEntry[]
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const modeLabel = DUMP_MODE_LABEL[config.dumpMode ?? 'dev']
  const performanceSection = formatPastPerformance(libraryEntries)
  const flopSection = formatFlopLog(libraryEntries)

  const activeLearningNotes = profile.voice.learningNotes || []
  const formattedLearningNotes = activeLearningNotes.length > 0
    ? activeLearningNotes.slice(0, 5).map((n, i) => `[Session #${activeLearningNotes.length - i}] — ${n}`).join('\n')
    : '[Start adding yours here →]'

  return `
═══════════════════════════════════════════════════
TWEETOS → GROK PACKET: DRAFT REVIEW
${dateStr} IST
═══════════════════════════════════════════════════

CONTEXT: I am ${profile.name} (@${profile.twitterHandle}). You are Grok with real-time X access.
This is a stateless session — everything you need is below.
Do not assume anything not stated here.

═══ WHO I AM ═══

Handle: @${profile.twitterHandle}
Niche: ${profile.niche}
Voice: ${profile.voice.tone}
Writing style: ${profile.voice.writingStyle}
Audience: ${profile.audience.targetAudience}
Goals: ${profile.goals.join(' | ')}
Current follower count: [FOLLOWER COUNT — update weekly]

Content Pillars:
${profile.contentPillars.map(p => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}

NEVER write:
${profile.voice.avoidList.map(a => `• ${a}`).join('\n')}

Example tweets in my exact voice (match this energy):
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

Example tweets from accounts I want to be like:
${(profile.voice.admiredExampleTweets || []).map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

Hard constraint: 280 chars MAX per tweet. Free X account. Non-negotiable.
Any rewrite you generate must include a character count.

═══ SELF-LEARNING: WHAT WORKS FOR ME ═══

TOP PERFORMING TWEETS (with notes):
${performanceSection}

WHAT FLOPPED (low score drafts I never posted or underperformed):
${flopSection}

TOPIC RESONANCE (which pillars get most engagement):
[Need more data to determine resonance]

ENGAGEMENT PATTERNS:
[Need more data to determine patterns]

RUNNING LEARNING NOTES (added by me after each Grok session):
${formattedLearningNotes}

═══ SESSION CONTEXT ═══

Today is: ${dateStr.split(',')[0]}
IST time right now: ${dateStr.split(',')[1]?.trim() || ''}
Session goal: ${config.customRequest ? config.customRequest : 'General Draft Review'}
Topics I've posted about in last 48hrs: [list — avoid repetition]
What I actually did/built/thought about today (raw):
${modeLabel} ${config.dumpMode === 'shitpost' ? '(Raw/Chaotic)' : ''}

═══ TODAY'S DRAFTS ═══

${drafts.length === 0 ? 'No drafts selected.' : drafts.map((d, i) => {
  const content = d.isThread
    ? (d.threadTweets ?? []).map((t, n) => `${n + 1}/ ${t}`).join('\n')
    : d.content
  const weaknesses = config.includeScores && d.algorithmScore.suggestions.length > 0
    ? `\nFlagged weaknesses: ${d.algorithmScore.suggestions.join(', ')}`
    : ''
  
  const hooks = d.hookVariations && d.hookVariations.length > 0
    ? d.hookVariations.map((h, idx) => `  ${String.fromCharCode(65 + idx)}) ${h}`).join('\n')
    : '  A) [None]'

  return `--- DRAFT ${i + 1} ---
Text: ${content}
Type: ${d.isThread ? 'Thread' : 'Tweet'}
Pillar: ${d.pillarId}
Local score: ${d.algorithmScore.overall}/100${weaknesses}
Hook variations considered:
${hooks}
`
}).join('\n')}

═══ WHAT I NEED FROM YOU ═══

${config.customRequest || '[No custom request provided]'}

ALWAYS DO ALL OF THESE:

SCORING & VALIDATION:
1. Score each draft 1-10 with specific reasoning. Format as a clean markdown block for each draft:
   ### Draft [N] Scorer:
   *   **Voice Match:** [Score]/10 [Reason]
   *   **Hook Strength:** [Score]/10 [Reason]
   *   **Engagement Potential:** [Score]/10 [Reason]
   *   **Originality:** [Score]/10 [Reason]
   *   **Overall Recommendation:** [Keep / Edit / Archive]
   Flag if any draft is too similar to what I posted in last 48hrs.

REAL-TIME DATA (use your X access):
2. Find 2–3 real tweets posted in last 48 hours on this topic that
   performed well. Give me direct links. What made them work?
3. Is there a trending topic or conversation on X right now that I can
   hook today's content onto? Relevance score 1–10 for my niche.

IMPROVEMENT:
4. Rewrite ALL submitted drafts. Keep my exact voice. Add character count.
   • For thread drafts, output the rewritten thread posts as a numbered list (1/, 2/) separated by blank lines for easy copying.
   • Ensure the core message and intent of my drafts is strictly preserved.
5. Give me 2 completely fresh angles on today's theme I haven't
   considered — one safe, one spicy.
6. For thread drafts: is this worth a thread or stronger as a single
   punchy tweet? Be honest.

STRATEGY:
7. Which draft do I post first and exactly why?
8. Best posting time today for Indian student audience (IST)?
   Factor in: day of week + current time + my follower activity window.
9. Should I add a link in the first reply? If yes, what specifically?

PART 5: TWO-WAY CLARIFYING QUESTIONS
10. If there are angles or drafts where you need more context (e.g., details about my specific project implementation, my stance, or context on a trend) to make the rewritten tweets 10x better and more authentic, ask me 1–3 direct, short questions. I will answer them in our next turn to refine the output.

LEARNING CAPTURE (fill this at end — I'll add it to my learning notes):
11. One-line observation about what's working or not in today's drafts
    that I should remember for next week.

FINAL TWEETS SUMMARY:
12. At the very end of your response, output a final section on a new line titled "📋 COPY-PASTE READY TWEETS". Under this title, compile all final rewritten drafts/threads, fresh angles, and shitposts. Format this as a clean bulleted list where each item is on its own new line:
• **Rewritten Draft [N] [Pillar: Name]:** [Tweet text] ([Character count])
• **Angle A (Safe) [Pillar: Name]:** [Tweet text] ([Character count])
• **Angle B (Spicy) [Pillar: Name]:** [Tweet text] ([Character count])
• **Shitpost Option 1 [Pillar: Name]:** [Tweet text] ([Character count])
• **Shitpost Option 2 [Pillar: Name]:** [Tweet text] ([Character count])

═══════════════════════════════════════════════════
`.trim()
}

export function generateEngagementPacket(
  profile: UserProfile,
  config: EngagementPacketConfig,
  _libraryEntries?: LibraryEntry[]
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  
  const activeLearningNotes = profile.voice.learningNotes || []
  const formattedLearningNotes = activeLearningNotes.length > 0
    ? activeLearningNotes.slice(0, 5).map((n, i) => `[Session #${activeLearningNotes.length - i}] — ${n}`).join('\n')
    : '[Start adding yours here →]'

  return `
═══════════════════════════════════════════════════
TWEETOS → GROK PACKET: ENGAGEMENT HUNT
${dateStr} IST
═══════════════════════════════════════════════════

CONTEXT: I am ${profile.name} (@${profile.twitterHandle}). You are Grok with real-time X access.
Stateless session — all context is below. Do not assume anything not
stated here.

═══ WHO I AM ═══

@${profile.twitterHandle} — ${profile.niche}

Voice: ${profile.voice.tone}

Projects I am building / have shipped:
(Refer to my Niche and Goals sections above for the list of active projects I build, such as Tonal, Git-for-Prompts, Swiggy/Instamart agents, iPod emulator, TweetOS, etc. Only reference these projects if highly relevant and natural. Never force them if it feels artificial).

My genuine value-add in replies (what I actually know):
• Real failures and fixes when building with Claude/Gemini as a solo dev
• Indian student context — Pune college life, tier-2 city constraints,
  Indian API integrations (Swiggy, JioSaavn, WhatsApp automation)
• Vibe coding workflows — how to ship fast with AI without breaking things
• What it actually takes to build a portfolio for Indian internships
• Swiggy Builders Club process (applied, know the drill)

Audience I'm targeting: ${profile.audience.targetAudience}

Current follower count: [update weekly]

Example tweets in my voice:
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

Example tweets from accounts I want to be like:
${(profile.voice.admiredExampleTweets || []).map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

═══ SELF-LEARNING: ENGAGEMENT HISTORY ═══

ACCOUNTS THAT HAVE REPLIED BACK TO ME (prioritize these — they're warm):
[From engagement log]

ACCOUNTS I REPLIED TO IN LAST 48 HOURS (avoid today — don't spam):
[From engagement log]

REPLY TYPES THAT GOT RESPONSES (what's actually working):
[From engagement log]

TOPICS WHERE MY REPLIES GOT TRACTION:
[From engagement log]

TOPICS WHERE MY REPLIES FLOPPED:
[From engagement log]

RUNNING LEARNING NOTES:
${formattedLearningNotes}

═══ TODAY'S RECENT ACTIVITY (CONTEXT) ═══

What I posted today / recently:
[Paste your last 1-2 tweets so Grok can find replies that connect]

Topics I want to engage around today:
All pillars / ${profile.contentPillars.map(p=>p.name).join(', ')}

Energy level today: [High / Medium / Low]

═══ FIND ME TWEETS TO REPLY TO ═══

CHECK RECENT TWEETS (last 24-48 hrs) FROM THESE ACCOUNTS:
Warm accounts first (they've replied to me before):
• [accounts from warm/hot list]
Cold accounts to start warming:
${config.targetAccounts.map(h => `• @${h.replace(/^@/, '')}`).join('\n')}

ALSO SEARCH THESE KEYWORDS (last 24-48 hrs on X):
${config.topicKeywords.map(k => `• ${k}`).join('\n')}

═══ WHAT I NEED ═══

PART 1: REPLY OPPORTUNITIES

Find me 10–12 tweets I can genuinely reply to.
Do NOT repeat accounts I replied to in the last 48hrs (listed above).
Prioritize accounts that have replied to me before (listed above).

For each tweet, output a clear, double-spaced block:
### Opportunity [N]: Tweet by @[handle]
*   **Original Tweet:** "[Tweet content]"
*   **Why for me:** [Why this is a good opportunity for ME specifically - what do I know that's directly relevant?]
*   **Risk Level:** [Low / Medium / High] (High = controversial, easily misread)
*   **Reply Options:**
    • **Option A (Casual):** [Reply draft under 280 chars. Relatable student energy. No generic agreement.] ([Character count])
    • **Option B (Insight):** [Reply draft under 280 chars. Reference a real experience from my builds. Grok must inject actual project names (Tonal, Git-for-Prompts, Swiggy/Instamart agents, iPod, MemoryPalace, TweetOS) directly based on context, but only if highly relevant and natural. Never force a project name reference if it feels artificial.] ([Character count])
    • **Option C (Question):** [Reply draft under 280 chars ending with a specific question to drive conversation. Only reference projects if highly relevant and organic to the context.] ([Character count])

All options must be under 280 characters, reference what they said, add genuine value, use a Pune CS student voice, and never start with generic openers like "Great point!" or "So true!". Ensure the core message of the target tweet is strictly preserved.

PART 2: QUOTE TWEET OPPORTUNITIES

Find me 3–4 tweets I can quote with my own take.
Target: tweets from accounts with 1K–50K followers on topics I have a real angle on. Not just agreeing — adding a new thought.

Format each quote tweet opportunity as a clear, double-spaced block:
### Quote Opportunity [N]: Tweet by @[handle]
*   **Original Tweet Link:** [Link]
*   **Why quote:** [Why it's a good quote tweet for me]
*   **Quote Options:**
    • **Option 1 (Agree + Expand):** [Quote text under 200 chars using actual project names only if natural and relevant] ([Character count])
    • **Option 2 (Nuanced / Pushback):** [Quote text under 200 chars] ([Character count])

PART 3: RELATIONSHIP BUILDING

After the tweet list:
1. Which 2–3 accounts should I double down on THIS WEEK based on
   what you see them posting and their reply patterns? Why?
2. Is there an active thread (not just a single tweet) I should jump
   into right now? High-engagement threads = more discovery.
3. Any account I'm not following yet that's clearly in my niche and
   posting great content this week? (New account to add to my list)
4. Any of my admired accounts posted something in last 24hrs that I
   should engage with IMMEDIATELY while the engagement window is open?

${config.customRequest ? `EXTRA: ${config.customRequest}` : '[No custom request]'}

PART 4: TWO-WAY CLARIFYING QUESTIONS
If there are accounts, reply options, or angles where you need more context (e.g. details about my projects, my experience, or target account relationships) to make the replies 10x better and more authentic, ask me 1–3 direct, short questions. I will answer them in our next turn to refine the output.

═══ LEARNING CAPTURE & FINAL SUMMARY ═══

After giving me the list, tell me:
• Which opportunity type (A/B/C) you'd bet on most for me today and why
• One thing you noticed about my niche's conversation this week that
  I should know

[I'll add this to my running learning notes after the session]

FINAL REPLIES SUMMARY:
At the very end of your response, output a final section on a new line titled "📋 COPY-PASTE READY TWEETS". Under this title, compile all final drafted replies and quote tweets. Format this as a clean bulleted list where each item is on its own new line:
• **Reply to @[handle] - Option A (Casual) [Pillar: Quick Connects]:** [Reply text] ([Character count])
• **Reply to @[handle] - Option B (Insight) [Pillar: Tool Reality Checks OR Project Fragments]:** [Reply text] ([Character count])
• **Reply to @[handle] - Option C (Question) [Pillar: Quick Connects]:** [Reply text] ([Character count])
• **Quote Tweet - @[handle] [Pillar: Sharp Takes OR Tool Reality Checks]:** [Quote text] ([Character count])

═══════════════════════════════════════════════════
`.trim()
}

export function generateTrendingPacket(
  profile: UserProfile,
  config: TrendingPacketConfig,
  _libraryEntries?: LibraryEntry[]
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  const activeLearningNotes = profile.voice.learningNotes || []
  const formattedLearningNotes = activeLearningNotes.length > 0
    ? activeLearningNotes.slice(0, 5).map((n, i) => `[Session #${activeLearningNotes.length - i}] — ${n}`).join('\n')
    : '[Start adding yours here →]'

  return `
═══════════════════════════════════════════════════
TWEETOS → GROK PACKET: TRENDING RADAR
${dateStr} IST
═══════════════════════════════════════════════════

CONTEXT: I am ${profile.name} (@${profile.twitterHandle}). You are Grok with real-time X access.
Stateless session — all context is below.
Your job: use your live X data to find what's moving RIGHT NOW. Focus heavily on AI technology, frontier models, AI developer tools, and AI startups/companies (OpenAI, Anthropic, Google, Antigravity IDE, etc.) and hot tech ecosystem news that I can create genuine original content about.
Do not surface anything older than 12 hours unless it's still actively
spreading.

═══ WHO I AM ═══

@${profile.twitterHandle} — ${profile.niche}

Voice: ${profile.voice.tone}

Audience: ${profile.audience.targetAudience}

Content pillars (what's on-brand for me):
${profile.contentPillars.map(p => `• ${p.name}`).join('\n')}

Projects I can reference (only if genuinely relevant):
(Refer to my Niche and Goals sections above for the active projects I build, such as Tonal, Git-for-Prompts, Swiggy/Instamart agents, iPod emulator, TweetOS, etc. Integrate these only if highly relevant and natural. Never force them if it feels artificial).

I WILL NOT tweet about:
• Politics (any kind — not my lane)
• Crypto/Web3
• Celebrity drama
• Anything where a wrong take could hurt my internship chances
• Topics where I have zero personal experience or knowledge

Current follower count: [update weekly]
Stage: Early growth (under 1K) — building credibility > chasing virality

Example tweets in my voice:
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

Example tweets from accounts I want to be like:
${(profile.voice.admiredExampleTweets || []).map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

═══ SELF-LEARNING: TREND PERFORMANCE HISTORY ═══

TRENDS I JUMPED ON THAT WORKED:
[From library]

TRENDS I JUMPED ON THAT FLOPPED:
[From library]

TOPICS MY AUDIENCE ENGAGES WITH MOST:
[From library]

RUNNING LEARNING NOTES:
${formattedLearningNotes}

═══ TODAY'S FOCUS AREAS ═══

${config.focusAreas.length > 0
  ? config.focusAreas.map(a => `☑ ${a}`).join('\n')
  : `☑ AI Technology & Developments (frontier models, Claude, Gemini, GPT, open source LLMs)
☑ AI Tech Companies & Organizations (OpenAI, Anthropic, Google, Microsoft, Meta, hot startups)
☑ AI Developer Ecosystem (Antigravity IDE, coding agents, API changes, latency/cost improvements)
☑ Student & Job Market (hiring trends in tech/AI, placements, developer salaries)`
}

═══ WHAT I NEED FROM YOU ═══

PART 1: TRENDING NOW (last 6–12 hours on X)

Find 6–8 topics or conversations trending in my focus areas.

For each topic, output a clear, double-spaced block:
### Topic [N]: [Topic Title]
*   **What happened:** [One clear sentence]
*   **Key voices:** [Handles and what they are saying]
*   **Why now:** [Why is this trending today specifically?]
*   **Sentiment:** [Positive / Negative / Mixed / Chaotic / Ironic]
*   **Risk Level:** [Low / Medium / High]
*   **Relevance:** [1-10]
*   **Honest Take:** [Your real, unhedged opinion]

PART 2: MY ANGLE (for each topic rated 6+ relevance)

Give me 2 tweet angles I could take. Separate them with clear markdown headers:
#### [Topic Name]
*   **Angle A (Personal):**
    • *Strategy:* [1-line strategy rationale explaining why this angle is strategic]
    • *Tweet:* [Tweet text under 280 chars] ([Character count])
*   **Angle B (Hot Take):**
    • *Strategy:* [1-line strategy rationale explaining why this angle is strategic]
    • *Tweet:* [Tweet text under 280 chars] ([Character count])

Ensure both angles use a Pune student voice (punchy, lowercase-heavy), are original, are not empty dunks, and cannot hurt my internship chances.

PART 3: QUICK CONTENT (low-effort, high-reach)

QUOTE TWEET TARGETS:
Find 2–3 high-engagement tweets on trending topics where my quote adds
something real. Under 200 chars. Not just agreeing.

SHITPOST WINDOW:
Is there something chaotic or absurd trending that I can be funny about?
My humor style: dry, self-aware, Indian student lens, never mean-spirited.
If yes, give me 2 shitpost options. If no, skip this — don't force it.
A bad shitpost is worse than no shitpost.

PART 4: RANKING & STRATEGY

1. TOP 2 topics I should tweet about TODAY — ranked. Why these two?
2. For each: post as standalone tweet or thread? Why?
3. Post immediately or wait for peak window (6–9PM IST)?
   Consider: Is this trend still rising or already peaking?
4. Any topic I should AVOID today even though it seems relevant?
   (Things that look good but have hidden risks for my account/stage)

${config.customRequest ? `EXTRA: ${config.customRequest}` : ''}

PART 5: TWO-WAY CLARIFYING QUESTIONS
If there are trends, angles, or shitpost options where you need more context (e.g. details about my projects, my actual stance on a tool, or college constraints) to make the tweets 10x better and more authentic, ask me 1–3 direct, short questions. I will answer them in our next turn to refine the output.

═══ LEARNING CAPTURE & FINAL SUMMARY ═══

After giving me everything:
• One-line summary of what's working in my niche right now that I
  should lean into this week
• One topic/format combination you'd bet on for my next 3 posts

[I'll add this to my running learning notes]

FINAL TWEETS SUMMARY:
At the very end of your response, output a final section on a new line titled "📋 COPY-PASTE READY TWEETS". Under this title, compile all generated tweet angles and shitposts. Format this as a clean bulleted list where each item is on its own new line:
• **[Topic Name] - Angle A (Personal) [Pillar: Name]:** [Tweet text] ([Character count])
• **[Topic Name] - Angle B (Hot Take) [Pillar: Name]:** [Tweet text] ([Character count])
• **Shitpost Option 1 [Pillar: Name]:** [Tweet text] ([Character count])
• **Shitpost Option 2 [Pillar: Name]:** [Tweet text] ([Character count])

═══════════════════════════════════════════════════
`.trim()
}
