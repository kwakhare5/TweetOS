import { UserProfile, TweetDraft, DraftPacketConfig, EngagementPacketConfig, TrendingPacketConfig } from '@/types'

const DUMP_MODE_LABEL: Record<string, string> = {
  dev: 'Dev / AI Content',
  personal: 'Personal Life',
  shitpost: 'Shit Post / Chaos'
}

/**
 * Formats user profile + drafts into a fully self-contained Grok packet.
 * Grok is stateless — this packet must carry ALL context every single time.
 */
export function generateDraftPacket(
  profile: UserProfile,
  drafts: TweetDraft[],
  config: DraftPacketConfig
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const modeLabel = DUMP_MODE_LABEL[config.dumpMode ?? 'dev']

  return `
═══════════════════════════════════════
TWEETOS → GROK PACKET: DRAFT REVIEW
${dateStr} IST
Mode: ${modeLabel}
═══════════════════════════════════════

CONTEXT: I am Karan (@${profile.twitterHandle}), a ${profile.niche}.
You are Grok. You have no memory of past sessions. This packet contains everything you need.

═══ WHO I AM ═══
Twitter handle: @${profile.twitterHandle}
Niche: ${profile.niche}
Voice: ${profile.voice.tone}
Writing style: ${profile.voice.writingStyle}
Audience: ${profile.audience.targetAudience}
Goals: ${profile.goals.join(' | ')}

Content Pillars (what I tweet about):
${profile.contentPillars.map(p => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}

Accounts I admire / want to be like: ${profile.admiredAccounts.map(a => '@' + a).join(', ')}

What I NEVER write:
${profile.voice.avoidList.map(a => `• ${a}`).join('\n')}

Example tweets in my exact voice:
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

Hard constraint: 280 chars max per tweet (free X account).

═══ CONTENT TYPE THIS SESSION ═══
${modeLabel}
${config.dumpMode === 'shitpost' ? '→ These are meant to be raw, chaotic, or funny. Not polished. Do not over-optimize.' : ''}
${config.dumpMode === 'personal' ? '→ These are personal/life tweets — not dev content. Judge them on relatability and voice, not technical specificity.' : ''}

═══ TODAY\'S DRAFTS ═══
${drafts.length === 0 ? 'No drafts selected.' : drafts.map((d, i) => {
  const scoreText = config.includeScores
    ? ` [TweetOS local score: ${d.algorithmScore.overall}/100]`
    : ''
  const content = d.isThread
    ? (d.threadTweets ?? []).map((t, n) => `${n + 1}/ ${t}`).join('\n')
    : d.content
  const weaknesses = config.includeScores && d.algorithmScore.suggestions.length > 0
    ? `\nLocal flags: ${d.algorithmScore.suggestions.join(', ')}`
    : ''

  return `DRAFT ${i + 1}${scoreText}:
"${content}"${weaknesses}
Pillar: ${d.pillarId}
`
}).join('\n')}

═══ WHAT I NEED FROM YOU ═══
${config.customRequest || 'Standard validation and improvement.'}

ALWAYS DO:
1. Score each draft 1-10 with specific reasoning (voice match, hook, engagement potential)
2. Find 2-3 real tweets from last 48hrs on this topic that performed well — give me links
3. Rewrite the strongest draft to maximize engagement (keep my voice)
4. Give 2 fresh angles on today's theme I haven't considered
5. Tell me which to post first and exactly why
6. Any trending X topic I can hook my content onto right now?
7. Best posting time today for Indian audience (IST)?

═══════════════════════════════════════
`.trim()
}

/**
 * Engagement packet — finds tweet opportunities for Karan to reply/QT.
 */
export function generateEngagementPacket(
  profile: UserProfile,
  config: EngagementPacketConfig
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  
  return `
═══════════════════════════════════════
TWEETOS → GROK PACKET: ENGAGEMENT HUNT
${dateStr} IST
═══════════════════════════════════════

CONTEXT: I am Karan (@${profile.twitterHandle}). You are Grok. Stateless session — all context is below.

═══ WHO I AM ═══
@${profile.twitterHandle} — ${profile.niche}
Voice: ${profile.voice.tone}
Projects I've shipped: Tonal (Chrome extension for tone translation), Git-for-Prompts (prompt version control), MemoryPalace (RAG second brain)
My value-add in replies: Real student build experience, specific AI tool failures and fixes, Indian builder context, vibe coding workflows
Audience I'm targeting: ${profile.audience.targetAudience}

═══ FIND ME TWEETS TO REPLY TO ═══

Check recent tweets (last 24-48 hours) from these accounts:
${config.targetAccounts.map(h => `• @${h.replace(/^@/, '')}`).join('\n')}

Also search for recent tweets about:
${config.topicKeywords.map(k => `• ${k}`).join('\n')}

═══ WHAT I NEED ═══

Find me 10-12 tweets I can genuinely reply to.

For each tweet, give me:
1. The tweet text and author handle
2. Why it's a good opportunity for me specifically
3. What value I can add (not generic praise — what do I know that's relevant?)
4. 3 reply options in my voice:
   - Option A: casual/relatable
   - Option B: adds specific insight or experience
   - Option C: asks a genuine question that starts a conversation

TWEET SELECTION CRITERIA (prioritize these):
• Tweets where I have direct project experience to reference
• Questions about Claude/Gemini where I have real answers from building
• Student or internship struggles I've actually lived
• Indian dev community discussions
• Tweets from my admired accounts with < 20 replies (discovery window still open)
• Tweets about vibe coding, building with AI, shipping fast

ALSO FIND ME 3-4 QUOTE TWEET OPPORTUNITIES:
Look for tweets I can quote with my own take (2-4 quote tweets/day is ideal visibility with low effort).
For each, give me:
- The tweet URL/handle
- A short take I could add (under 200 chars, in my voice)

REPLY RULES (all options must follow these):
✅ Under 280 characters (hard limit — free account)
✅ Specific — reference what they said exactly
✅ Add real value (tip, honest take, or genuine question)
✅ Sound like a Pune CS student, not a tech influencer
❌ Never start with "Great point!" or "Couldn't agree more!"
❌ No self-promotion as the main message
❌ No vague compliments

═══ RELATIONSHIP BUILDING ═══
After the tweet list, also tell me:
- Which 2-3 accounts from my admired list are worth doubling down on this week?
- Is there an active thread I should jump into (not just a single reply)?
- Any new account posting great content I should add to my engage list?

${config.customRequest ? `EXTRA: ${config.customRequest}` : ''}

═══════════════════════════════════════
`.trim()
}

/**
 * Trending packet — asks Grok to surface trending X topics and give opinions.
 * Karan pastes this into Grok, gets topics back, then uses TweetOS to form his take.
 */
export function generateTrendingPacket(
  profile: UserProfile,
  config: TrendingPacketConfig
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return `
═══════════════════════════════════════
TWEETOS → GROK PACKET: TRENDING RADAR
${dateStr} IST
═══════════════════════════════════════

CONTEXT: I am Karan (@${profile.twitterHandle}). You are Grok. Stateless session — full context below.
Your job: use your real-time X access to find what's trending right now that I can tweet about.

═══ WHO I AM ═══
@${profile.twitterHandle} — ${profile.niche}
Voice: ${profile.voice.tone}
Audience: ${profile.audience.targetAudience}
Content pillars: ${profile.contentPillars.map(p => p.name).join(', ')}
Projects: Tonal, Git-for-Prompts, MemoryPalace

I tweet from the lens of: Pune CS student building with AI, chasing internships, sharing raw build logs and honest takes.

═══ FOCUS AREAS FOR TODAY ═══
${config.focusAreas.length > 0
  ? config.focusAreas.map(a => `• ${a}`).join('\n')
  : `• AI tools and LLMs (Claude, Gemini, GPT, Grok)\n• Indie hacking / building in public\n• Indian tech / startup scene\n• CS student life / placements / internships\n• Vibe coding, AI workflows, shipping fast`
}

═══ WHAT I NEED ═══

1. TRENDING TOPICS RIGHT NOW (last 6-12 hours on X):
   Find 5-8 trending topics or conversations in my focus areas.
   For each:
   - What is the topic / what happened?
   - Who are the key voices and what are they saying?
   - Why is it trending?
   - Your honest take / opinion on it (be direct — don't hedge)
   - How relevant is this to me and my audience (1-10)?

2. MY ANGLE (for each relevant topic):
   - Give me 1-2 tweet angles I could take as a Pune CS student
   - The angle should be ORIGINAL — not just summarizing the trend
   - Can be agreement, pushback, personal story hook, or "here's what this means for students like me"

3. SHITPOST OPPORTUNITIES:
   - Any trending chaos or absurd news I can make a joke about?
   - Keep it light, dark humor welcome, Indian student lens

4. RANKING:
   - Which 2 topics should I tweet about TODAY and why?
   - Best posting time for maximum reach (IST)?

${config.customRequest ? `EXTRA REQUEST: ${config.customRequest}` : ''}

RULES:
• All suggested tweet angles must be under 280 chars
• My voice is casual Pune student — not polished creator
• Real opinions > safe takes
• If something is boring, skip it — I don't tweet filler

═══════════════════════════════════════
`.trim()
}

