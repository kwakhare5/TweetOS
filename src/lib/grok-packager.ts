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

  return targets.map((e, i) => {
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
function formatFlopLog(entries: LibraryEntry[] | undefined): string {
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
1. Score each draft 1–10 with specific reasoning:
   • Voice match (does it sound like the examples above?)
   • Hook strength (first 5 words — would you stop scrolling?)
   • Engagement potential (will it get replies, not just likes?)
   • Originality (is this something my niche has heard 100 times?)
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

LEARNING CAPTURE (fill this at end — I'll add it to my learning notes):
10. One-line observation about what's working or not in today's drafts
    that I should remember for next week.

FINAL TWEETS SUMMARY:
11. At the very end of your response, output a final section titled "📋 COPY-PASTE READY TWEETS" compiling all final rewritten drafts/threads, fresh angles, and shitposts in a clean bulleted list structure for quick copying:
• **Rewritten Draft [N]:** [Tweet text] ([Character count])
• **Angle A (Safe):** [Tweet text] ([Character count])
• **Angle B (Spicy):** [Tweet text] ([Character count])
• **Shitpost Option 1:** [Tweet text] ([Character count])
• **Shitpost Option 2:** [Tweet text] ([Character count])

═══════════════════════════════════════════════════
`.trim()
}

export function generateEngagementPacket(
  profile: UserProfile,
  config: EngagementPacketConfig,
  libraryEntries?: LibraryEntry[]
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
(Refer to my Niche and Goals sections above for the list of active projects I build, such as Tonal, Git-for-Prompts, Swiggy/Instamart agents, iPod emulator, TweetOS, etc. Integrate these names dynamically in your replies).

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

For each tweet:
① Tweet text + author @handle
② Why this is a good opportunity for ME specifically
   (not generic — what do I know that's directly relevant?)
③ Risk level: Low / Medium / High
   High = controversial topic, easily misread, could backfire
④ 3 reply options:

   OPTION A [casual/relatable]:
   Sounds like texting a friend. Relatable student energy.
   Mention projects only if organic, never forced.

   OPTION B [adds specific insight]:
   Reference a real experience from my builds. Name the tool,
   error, fix, or project specifically. This is the strongest reply
   type — use it when I have a real angle.
   • Grok must inject actual project names (Tonal, Git-for-Prompts, iPod, MemoryPalace, TweetOS) directly into this reply based on context. No generic placeholders.

   OPTION C [genuine question]:
   Opens a real conversation. Makes them want to reply.
   Not "thoughts?" — specific to what they said.
   • Grok must inject actual project names dynamically if relevant.

   All options must be:
   ✅ Under 280 characters (verify count)
   ✅ Reference what they said — no generic replies
   ✅ Add genuine value — never empty agreement
   ✅ Pune CS student voice — not polished influencer
   ❌ Never start with "Great point!" / "So true!" / "Couldn't agree more!"
   ❌ No self-promotion as the main message
   ❌ No vague compliments
   • Ensure the core message and intent of the target tweet is strictly preserved.

PART 2: QUOTE TWEET OPPORTUNITIES

Find me 3–4 tweets I can quote with my own take.
Target: tweets from accounts with 1K–50K followers on topics I have a
real angle on. Not just agreeing — adding a new thought.

For each:
① Tweet link + author
② Why it's a good quote tweet for me
③ 2 quote options:
   - One agree + expand (add my experience/insight, using actual project names)
   - One nuanced take or honest pushback
   All under 200 chars (room for the quoted embed)

PART 3: RELATIONSHIP BUILDING

After the tweet list:
① Which 2–3 accounts should I double down on THIS WEEK based on
   what you see them posting and their reply patterns? Why?
② Is there an active thread (not just a single tweet) I should jump
   into right now? High-engagement threads = more discovery.
③ Any account I'm not following yet that's clearly in my niche and
   posting great content this week? (New account to add to my list)
④ Any of my admired accounts posted something in last 24hrs that I
   should engage with IMMEDIATELY while the engagement window is open?

${config.customRequest ? `EXTRA: ${config.customRequest}` : '[No custom request]'}

═══ LEARNING CAPTURE & FINAL SUMMARY ═══

After giving me the list, tell me:
• Which opportunity type (A/B/C) you'd bet on most for me today and why
• One thing you noticed about my niche's conversation this week that
  I should know

[I'll add this to my running learning notes after the session]

FINAL REPLIES SUMMARY:
At the very end of your response, output a final section titled "📋 COPY-PASTE READY TWEETS" compiling all final drafted replies and quote tweets in a clean bulleted list structure for quick copying:
• **Reply to @[handle] - Option A (Casual):** [Reply text] ([Character count])
• **Reply to @[handle] - Option B (Insight):** [Reply text] ([Character count])
• **Reply to @[handle] - Option C (Question):** [Reply text] ([Character count])
• **Quote Tweet - @[handle]:** [Quote text] ([Character count])

═══════════════════════════════════════════════════
`.trim()
}

export function generateTrendingPacket(
  profile: UserProfile,
  config: TrendingPacketConfig,
  libraryEntries?: LibraryEntry[]
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
Your job: use your live X data to find what's moving RIGHT NOW. Focus heavily on AI technology, frontier models, AI developer tools, and AI startups/companies (OpenAI, Anthropic, Google, Cursor, etc.) and hot tech ecosystem news that I can create genuine original content about.
Do not surface anything older than 12 hours unless it's still actively
spreading.

═══ WHO I AM ═══

@${profile.twitterHandle} — ${profile.niche}

Voice: ${profile.voice.tone}

Audience: ${profile.audience.targetAudience}

Content pillars (what's on-brand for me):
${profile.contentPillars.map(p => `• ${p.name}`).join('\n')}

Projects I can reference (only if genuinely relevant):
(Refer to my Niche and Goals sections above for the active projects I build, such as Tonal, Git-for-Prompts, Swiggy/Instamart agents, iPod emulator, TweetOS, etc. Integrate these dynamically).

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
☑ AI Developer Ecosystem (Cursor, coding agents, API changes, latency/cost improvements)
☑ Student & Job Market (hiring trends in tech/AI, placements, developer salaries)`
}

═══ WHAT I NEED FROM YOU ═══

PART 1: TRENDING NOW (last 6–12 hours on X)

Find 6–8 topics or conversations trending in my focus areas.

For each topic, give me:
① WHAT: What is the topic / what happened? One clear sentence.
② WHO: Key voices driving it (handles). What are they saying?
③ WHY NOW: Why is this trending today specifically?
④ SENTIMENT: What's the overall mood on X?
   [Positive / Negative / Mixed / Chaotic / Ironic]
⑤ RISK LEVEL for me to engage: Low / Medium / High
   High = politically charged, corporate drama, could be misread,
   controversial in ways that could hurt my internship reputation
⑥ RELEVANCE to my niche and audience: 1–10
⑦ YOUR HONEST TAKE: What's the most interesting angle here?
   Don't hedge — give me a real opinion.

PART 2: MY ANGLE (for each topic rated 6+ relevance)

Give me 2 tweet angles I could take:

ANGLE A [personal lens]:
How does this affect me as a Pune CS student specifically?
My experience, my projects, my situation. Not summarizing the trend —
adding something only I can add.

ANGLE B [hot take or honest pushback]:
A genuine opinion. Could be agreement with specific nuance, pushback,
or "here's what everyone's missing."
Spicy is fine. Embarrassing to my future employer is not.

Both angles must be:
• Include a brief 1-line strategy rationale bullet point above the tweet text for both Angle A and Angle B explaining why this angle is strategic.
✅ Under 280 chars (give character count)
✅ Original — not just summarizing the trend
✅ In my voice (Pune student, punchy, specific)
✅ Something I actually believe or have real experience with
❌ No empty dunks on companies or people
❌ Nothing that could hurt my internship chances

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

① TOP 2 topics I should tweet about TODAY — ranked. Why these two?
② For each: post as standalone tweet or thread? Why?
③ Post immediately or wait for peak window (6–9PM IST)?
   Consider: Is this trend still rising or already peaking?
④ Any topic I should AVOID today even though it seems relevant?
   (Things that look good but have hidden risks for my account/stage)

${config.customRequest ? `EXTRA: ${config.customRequest}` : ''}

═══ LEARNING CAPTURE & FINAL SUMMARY ═══

After giving me everything:
• One-line summary of what's working in my niche right now that I
  should lean into this week
• One topic/format combination you'd bet on for my next 3 posts

[I'll add this to my running learning notes]

FINAL TWEETS SUMMARY:
At the very end of your response, output a final section titled "📋 COPY-PASTE READY TWEETS" compiling all generated tweet angles and shitposts in a clean bulleted list structure for quick copying:
• **[Topic Name] - Angle A (Personal):** [Tweet text] ([Character count])
• **[Topic Name] - Angle B (Hot Take):** [Tweet text] ([Character count])
• **Shitpost Option 1:** [Tweet text] ([Character count])
• **Shitpost Option 2:** [Tweet text] ([Character count])

═══════════════════════════════════════════════════
`.trim()
}
