import { UserProfile, TweetDraft, DraftPacketConfig, EngagementPacketConfig, TrendingPacketConfig, LibraryEntry } from '@/types'

const DUMP_MODE_LABEL: Record<string, string> = {
  dev: 'Dev / AI Content',
  personal: 'Personal Life',
  shitpost: 'Shit Post / Chaos'
}

function formatPastPerformance(entries: LibraryEntry[] | undefined): string {
  if (!entries || entries.length === 0) return '[Not enough data yet]'
  const targets = [...entries]
    .filter(e => e.postedAt && e.performanceNote && e.performanceNote.trim())
    .sort((a, b) => new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime())
    .slice(0, 5)
  if (targets.length === 0) return '[Not enough data yet]'
  return targets.map((e) => {
    const content = e.isThread && e.threadTweets ? e.threadTweets.map((t, n) => `${n + 1}/ ${t}`).join('\n') : e.tweet
    return `---\nTweet: "${content}"\nPosted: ${new Date(e.postedAt!).toLocaleDateString()} | Performance: ${e.performanceNote}\nPillar: ${e.pillarId} | Type: ${e.isThread ? 'Thread' : 'Tweet'}\n---`
  }).join('\n')
}

function buildIdentityBlock(profile: UserProfile): string {
  return `
═══ WHO I AM — THE FULL PICTURE ═══

NAME: ${profile.name}
HANDLE: @${profile.twitterHandle}
BIO: ${profile.bio || 'Not set'}
NICHE: ${profile.niche}

VOICE & TONE:
${profile.voice.tone}

WRITING STYLE RULES:
${profile.voice.writingStyle}

PROJECTS & SHIPPED WORK (from profile):
${(profile.goals || []).filter(g => g.toLowerCase().includes('project') || g.toLowerCase().includes('tonal') || g.toLowerCase().includes('git') || g.toLowerCase().includes('instamart') || g.toLowerCase().includes('ipod') || g.toLowerCase().includes('tweetos')).join('\n') || profile.niche}

MY GOALS:
${(profile.goals || []).map(g => `• ${g}`).join('\n')}

SECOND BRAIN — WHAT CHANGED TODAY (read this carefully):
This is NOT bio or projects — those are above. This is the live, daily version of who I am right now: what I built, broke, shipped, failed at, waited on, thought about, and felt today. Every output you generate must be anchored to this current context, not a generic version of me.

${profile.secondBrain || '[Second Brain empty — user has not updated today\'s context yet. Use profile identity fields above only.]'}

CONTENT PILLARS (weight and description):
${profile.contentPillars.map(p => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}

MY AUDIENCE:
Current: ${profile.audience?.currentAudience || 'Early stage Indian dev community'}
Target: ${profile.audience?.targetAudience || 'Indian indie devs and builders'}
Their problems: ${(profile.audience?.audienceProblems || []).join(' | ')}
Their goals: ${(profile.audience?.audienceGoals || []).join(' | ')}

MY GOALS:
${(profile.goals || []).map(g => `• ${g}`).join('\n')}

ADMIRED ACCOUNTS (study their style, not their content):
${(profile.admiredAccounts || []).map(a => `@${a}`).join(', ')}

POSTING RHYTHM: ${profile.postingFrequency || '3-5 tweets/day, peak IST 6-9PM'}

WORDS/PHRASES I NEVER USE:
${profile.voice.avoidList.map(a => `• ${a}`).join('\n')}

MY VOICE IN ACTION — EXAMPLE TWEETS (match this exact energy):
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

TWEETS FROM ACCOUNTS I WANT TO SOUND LIKE:
${(profile.voice.admiredExampleTweets || []).map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

RUNNING LEARNING NOTES (from past sessions):
${(profile.voice.learningNotes || []).length > 0
    ? profile.voice.learningNotes!.slice(0, 7).map((n, i) => `[Note #${i + 1}] ${n}`).join('\n')
    : '[No learning notes yet]'}

HARD CONSTRAINTS:
• 280 chars MAX per tweet — non-negotiable (free account)
• Always include character count in any tweet you write
• Never sound like a growth hacker, influencer, or tech bro
• Only reference my projects when they are 100% organic to context — never force it
• Do not assume anything not stated in this packet
`.trim()
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

  return `
═══════════════════════════════════════════════════
TWEETOS → GROK PACKET: DRAFT REVIEW
${dateStr} IST
═══════════════════════════════════════════════════

SYSTEM: You are Grok with real-time X access. This is a stateless session.
Everything you need to know about this person is in this packet.
Do not assume or invent anything not stated here.
Before generating output, internalize the SECOND BRAIN section — that is the live version of who this person is right now.

${buildIdentityBlock(profile)}

═══ TOP PERFORMING TWEETS (self-learning) ═══

${performanceSection}

═══ SESSION ═══

Date/Time (IST): ${dateStr}
Mode: ${modeLabel} ${config.dumpMode === 'shitpost' ? '(raw/chaotic ok)' : ''}
Session Goal: ${config.customRequest || 'General Draft Review'}

═══ TODAY'S DRAFTS ═══

${drafts.length === 0 ? 'No drafts submitted.' : drafts.map((d, i) => {
    const content = d.isThread
      ? (d.threadTweets ?? []).map((t, n) => `${n + 1}/ ${t}`).join('\n')
      : d.content
    const weaknesses = config.includeScores && d.algorithmScore.suggestions.length > 0
      ? `\nFlagged weaknesses: ${d.algorithmScore.suggestions.join(', ')}`
      : ''
    const hooks = d.hookVariations && d.hookVariations.length > 0
      ? d.hookVariations.map((h, idx) => `  ${String.fromCharCode(65 + idx)}) ${h}`).join('\n')
      : '  A) [None generated yet]'
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

${config.customRequest ? `PRIMARY REQUEST: ${config.customRequest}\n` : ''}

STEP 1 — INTERNALIZE (do not output this):
Before writing anything, read the SECOND BRAIN section above. Understand what I'm actually dealing with right now. What am I building? What's frustrating me? What's going well? What's my current emotional state? This context must bleed into everything you write.

STEP 2 — SCORE EACH DRAFT:
### Draft [N] Score:
• Voice Match: [X]/10 — [specific reason referencing my actual tone, not generic]
• Hook Strength: [X]/10 — [does it land in first 5 words?]
• Specificity: [X]/10 — [is it anchored to a real moment or too generic?]
• Engagement Potential: [X]/10 — [would MY audience actually care?]
• Recommendation: [Keep as-is / Needs rewrite / Archive / Post immediately]
Flag any draft that's too generic, too vague, or sounds like someone else wrote it.

STEP 3 — REAL-TIME X DATA (use live access):
• Find 2-3 real tweets from last 48 hours on today's topic that performed well. Give me links + what made them work
• Any active conversation or trending topic I can hook onto RIGHT NOW? Score 1-10 for my niche

STEP 4 — REWRITE ALL DRAFTS:
Keep my exact voice from the examples above. Add character count to every version.
• For threads: output each tweet as numbered list (1/, 2/, etc.) separated by blank lines
• Preserve the core intent — don't sanitize the frustration or sarcasm
• Inject Second Brain context where it makes the tweet MORE specific, not longer

STEP 5 — FRESH ANGLES:
Give me 2 completely new angles on today's theme I haven't tried:
• Angle A (Safe): lower risk, still sharp
• Angle B (Spicy): higher risk, more authentic, bolder

STEP 6 — STRATEGY:
• Which draft do I post first and exactly why?
• Is this a single tweet or thread moment? Be honest — don't default to thread just because topic is rich
• Best post time today? Factor: day of week + IST timezone + my 6-9PM peak window + whether trend is rising/peaking
• Reply setup: should I add anything in the first reply? What exactly?

STEP 7 — CLARIFYING QUESTIONS:
If any draft has a gap where knowing more about my second brain context (projects, current mood, recent events) would make your rewrite 10x more authentic — ask me 1-3 specific questions. I'll answer next turn.

STEP 8 — LEARNING CAPTURE:
One observation about what's working or not in today's session that I should log for next week.

STEP 9 — COPY-PASTE READY:
At the very end, output a section titled "📋 COPY-PASTE READY TWEETS".
Format as clean bullet list:
• **Rewritten Draft [N] [Pillar]:** [tweet text] ([char count])
• **Angle A (Safe) [Pillar]:** [tweet text] ([char count])
• **Angle B (Spicy) [Pillar]:** [tweet text] ([char count])

FACT-CHECK: For any technical claim, price, benchmark, or model spec you write — run a live X search. If unverified, prefix with "⚠️ [UNVERIFIED: reason]"

═══════════════════════════════════════════════════
`.trim()
}

export function generateEngagementPacket(
  profile: UserProfile,
  config: EngagementPacketConfig,
  _libraryEntries?: LibraryEntry[]
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return `
═══════════════════════════════════════════════════
TWEETOS → GROK PACKET: ENGAGEMENT HUNT
${dateStr} IST
═══════════════════════════════════════════════════

SYSTEM: You are Grok with real-time X access. Stateless session.
Your job: find me real reply and quote tweet opportunities that let me show up as myself — not a polished version, the actual person in the Second Brain below.
Do not assume anything not stated here.

${buildIdentityBlock(profile)}

═══ GENUINE VALUE I CAN ADD IN REPLIES ═══

Use the Second Brain above to determine this dynamically. But here is the framework:
• Any time someone complains about an AI tool or model — I have real receipts from building with Claude/Gemini/Groq
• Any time someone talks about Indian dev/internship life — I live this daily (Swiggy Builders, tier-2 college, waitlists)
• Any time someone talks about shipping fast — I have the exact workflow and the failures to prove it
• Any time someone talks about prompt engineering — I literally built Git-for-Prompts for this
• Any time someone posts a dry take or list — I can extend it or subvert it with my own angle

WHAT I DO NOT WANT TO REPLY TO:
• Things I have zero genuine opinion on
• Accounts I replied to in last 48 hours (don't spam)
• Controversial political/crypto tweets
• Anything where my reply would sound forced or performative

═══ TARGET ACCOUNTS ═══

Warm accounts (have replied to me before — prioritize these):
[Auto-populated from your engagement log — add manually if tracking]

Cold accounts to warm:
${config.targetAccounts.map(h => `• @${h.replace(/^@/, '')}`).join('\n')}

Admired accounts to engage NOW while window is open:
${(profile.admiredAccounts || []).map(a => `• @${a}`).join('\n')}

═══ KEYWORDS TO SEARCH (last 24-48h on X) ═══

${config.topicKeywords.map(k => `• "${k}"`).join('\n')}
${profile.contentPillars.map(p => `• "${p.name}" niche content`).join('\n')}
• LLM API cost drops, model releases, benchmark announcements
• Indian student dev life, tier-2 college, CS placements, internships
• Vibe coding, solo dev frustrations, shipping, side projects
• Sarcastic developer complaints (useState, useEffect, hallucinations)

═══ WHAT I NEED ═══

STEP 1 — INTERNALIZE MY SECOND BRAIN:
Before finding opportunities, understand who I am right now from the Second Brain section. My current frustrations, wins, active projects. A reply from me should feel like it comes from that exact person today, not a generic dev.

PART 1 — REPLY OPPORTUNITIES (find 10-12):

For each:
### Reply Opportunity [N]: @[handle]
• **Original Tweet:** "[content]" | [link]
• **Why for me specifically:** [anchor to something real in my second brain/experience]
• **Risk:** [Low / Medium / High]
• **Option A (Casual):** [reply — conversational, peer energy] ([chars])
• **Option B (Receipt/Insight):** [reply — drop something real from my builds or experience, only if genuinely organic] ([chars])
• **Option C (Question):** [reply — opens a real conversation, ends with a specific question] ([chars])

RULES FOR ALL REPLIES:
✅ Under 280 chars always (check count)
✅ Reference what they actually said — not generic
✅ Sound like me (see voice examples above) — lowercase, dry, direct
✅ Only mention my projects if 100% organic to the conversation
❌ Never open with "Great point!" / "So true!" / "This!" / "Love this!"
❌ No promotional energy
❌ No vague validation

GOLDEN STYLE PATTERNS:
• TECH INSIGHT: lowercase, specific model names + real metrics. e.g. "finally, a chinese lab distilled claude fable 5 traces into deepseek v4 flash. 277× cheaper: $50/M -> $0.18/M output tokens."
• FRUSTRATED DEV: lowercase, raw, sarcastic code references. e.g. "if I can just write a useState and a 250ms setTimeout inside a useEffect, why tf am I prompting Opus just for it to hallucinate and add 100 lines for a 4-line fix"
• DRY LIST/TAKE: like @shydev69. Short. 1-3 items. Dry. No explanation needed.

PART 2 — QUOTE TWEET OPPORTUNITIES (find 3-4):

Find tweets from accounts with 1K–50K followers where I can add a real new thought — not just agree.
### Quote Opportunity [N]: @[handle]
• **Tweet link:** [link]
• **Why quote:** [what real angle do I have on this based on my second brain?]
• **Option 1 (Agree + Expand):** [under 200 chars] ([chars])
• **Option 2 (Nuanced / Pushback):** [under 200 chars] ([chars])

PART 3 — RELATIONSHIP STRATEGY:
1. Which 2-3 accounts should I go deeper on THIS WEEK? Why specifically based on what they're posting?
2. Any high-engagement thread I can jump into RIGHT NOW while the window is hot?
3. Any account I should add to my list that's clearly in my niche and active this week?
4. Did any of my admired accounts post in last 24h that I should engage immediately?

${config.customRequest ? `EXTRA REQUEST: ${config.customRequest}` : ''}

PART 4 — CLARIFYING QUESTIONS:
If knowing more about my current context (from Second Brain) would make any reply 10x better — ask me 1-3 direct questions. I'll answer next turn.

LEARNING CAPTURE:
• Which reply option type (A/B/C) you'd bet on most for me today and why
• One thing you noticed about my niche's conversation this week I should know

FACT-CHECK: Verify any technical claim in draft replies using live X search. If unverified, prefix: "⚠️ [UNVERIFIED: reason]"

📋 COPY-PASTE READY REPLIES at the very end:
• **Reply to @[handle] - Option [A/B/C] [Pillar]:** [text] ([chars])
• **Quote Tweet @[handle] [Pillar]:** [text] ([chars])

═══════════════════════════════════════════════════
`.trim()
}

export function generateTrendingPacket(
  profile: UserProfile,
  config: TrendingPacketConfig,
  _libraryEntries?: LibraryEntry[]
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return `
═══════════════════════════════════════════════════
TWEETOS → GROK PACKET: TRENDING RADAR
${dateStr} IST
═══════════════════════════════════════════════════

SYSTEM: You are Grok with real-time X access. Stateless session.
Your job: find what's moving in the last 6-12 hours and generate angles I can use TODAY.
Do not surface anything older than 12 hours unless it is still actively spreading.
Do not assume anything not in this packet.

${buildIdentityBlock(profile)}

═══ MY CONTENT FILTER — WHAT I WILL AND WILL NOT TWEET ABOUT ═══

I WILL tweet about:
${profile.contentPillars.map(p => `• ${p.name}: ${p.description}`).join('\n')}

I WILL NOT tweet about:
• Politics (any kind — not my lane)
• Crypto / Web3
• Celebrity drama
• Anything that could hurt internship chances
• Topics where I have zero genuine experience or knowledge
• Things I can't anchor to something real in my second brain

═══ TODAY'S FOCUS AREAS ═══

${config.focusAreas.length > 0
    ? config.focusAreas.map(a => `☑ ${a}`).join('\n')
    : `☑ AI frontier models (Claude, Gemini, GPT, open source LLMs — releases, benchmarks, cost drops)
☑ AI developer tools (Antigravity IDE, Cursor, Copilot, coding agents, API changes)
☑ AI companies and ecosystem (OpenAI, Anthropic, Google, Meta, hot startups, funding rounds)
☑ Developer culture (solo dev life, shipping, side projects, burnout, vibe coding)
☑ Indian student/dev market (hiring, internships, placement reality, tier-2 college life)`
  }

═══ WHAT I NEED ═══

STEP 1 — INTERNALIZE MY SECOND BRAIN:
Before surfacing any trend, understand my current context from the Second Brain above. What am I building right now? What's frustrating me? What are my live opinions? A trend angle from me must feel like it comes from that exact headspace, not a generic "dev" persona.

PART 1 — TRENDING NOW (last 6-12 hours):

Find 6-8 topics or conversations. For each:
### Topic [N]: [Title]
• **What happened:** [one clear sentence — specifics only, no vague hype]
• **Key voices on X:** [@handle — what they said]
• **Why it's trending NOW:** [specific reason]
• **Sentiment:** [Positive / Negative / Mixed / Chaotic / Ironic]
• **Risk level for me:** [Low / Medium / High + brief reason]
• **Relevance to my niche:** [1-10 + why]
• **My honest take:** [your actual unhedged opinion — does this matter or is it noise?]

PART 2 — MY ANGLES (for every topic rated 6+ relevance):

#### [Topic Name]
• **Angle A (From My Second Brain — Personal):**
  - Strategy: [why this angle is authentic to who I am right now]
  - Tweet: [under 280 chars] ([char count])
• **Angle B (Sharp Take / Hot Take):**
  - Strategy: [why this angle cuts through, who it resonates with]
  - Tweet: [under 280 chars] ([char count])

IMPORTANT: Angle A must be anchored to something real in my Second Brain — a current frustration, active project, daily experience, or live opinion. Do not write a generic "student dev" angle. Write MY angle.

GOLDEN STYLE PATTERNS:
• TECH INFO: lowercase, specific name-drops + real metrics. e.g. "finally, a chinese lab distilled claude fable 5 traces into deepseek v4 flash. 277× cheaper: $50/M -> $0.18/M output tokens."
• FRUSTRATED DEV: lowercase, raw sarcasm with code symbols. e.g. "if I can just write a useState and a 250ms setTimeout inside a useEffect, why tf am I prompting Opus just for it to hallucinate and add 100 lines for a 4-line fix"
• DRY LIST: like @shydev69 / @adxtyahq. Short. Dry. 1-3 lines. Self-evident. No explanation.

PART 3 — QUICK CONTENT:

QUOTE TWEET TARGETS:
Find 2-3 high-engagement tweets I can quote with a real new thought (under 200 chars, not just agreement):
• @[handle] — [tweet snippet] — my angle: [what I'd say and why it's real to me]

SHITPOST WINDOW:
Is there something absurd or chaotic trending that fits my dry humor?
My shitpost style: lowercase, developer lens, Indian student reality, never mean-spirited, dry not cringe.
If yes: give me 2 options. If no: skip — do not force it. A bad shitpost is worse than no shitpost.

PART 4 — STRATEGY & RANKING:
1. TOP 2 topics I should tweet about TODAY — ranked. Why these two specifically for my account and stage?
2. For each: single tweet or thread? Be honest about which is actually stronger — don't default to thread
3. Post now or wait for 6-9PM IST peak window? Is this trend still rising or already peaking?
4. Any topic I should AVOID today even though it looks relevant? (Hidden risks for my stage/reputation)

${config.customRequest ? `EXTRA REQUEST: ${config.customRequest}` : ''}

PART 5 — CLARIFYING QUESTIONS:
If knowing more about my current second brain context (projects, mood, experience) would make any angle 10x more authentic — ask me 1-3 direct questions. I'll answer next turn.

LEARNING CAPTURE:
• What's working in my niche's conversation this week — lean into this
• The one topic + format combination you'd bet on for my next 3 posts

FACT-CHECK: For every technical claim, price, benchmark, or model spec — run a live X verification. If unverified, prefix: "⚠️ [UNVERIFIED: reason]"

📋 COPY-PASTE READY TWEETS at the very end:
• **[Topic] - Angle A [Pillar]:** [tweet text] ([char count])
• **[Topic] - Angle B [Pillar]:** [tweet text] ([char count])
• **Shitpost 1 [Pillar]:** [tweet text] ([char count])

═══════════════════════════════════════════════════
`.trim()
}
