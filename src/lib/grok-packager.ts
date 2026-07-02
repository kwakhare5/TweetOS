import { UserProfile, TweetDraft, DraftPacketConfig, EngagementPacketConfig, TrendingPacketConfig } from '@/types'

const DUMP_MODE_LABEL: Record<string, string> = {
  dev: 'Dev / AI Content',
  personal: 'Personal Life',
  shitpost: 'Shit Post / Chaos'
}

export function buildIdentityBlock(profile: UserProfile): string {
  const blueprintSection = profile.voiceBlueprint
    ? `
VOICE BLUEPRINT (AI-Extracted Creator DNA — structural rules to follow):
Hook Formula: ${profile.voiceBlueprint.hookFormula}
Body Structure: ${profile.voiceBlueprint.bodyStructure}
Tone Vibe: ${profile.voiceBlueprint.toneVibe}
Secret Sauce:
${profile.voiceBlueprint.secretSauce.map(r => `  - ${r}`).join('\n')}
Writing Rules:
${profile.voiceBlueprint.writingRules.map(r => `  - ${r}`).join('\n')}
Anti-Rules (NEVER do these):
${profile.voiceBlueprint.antiRules.map(r => `  - ${r}`).join('\n')}
Blueprint extracted from: ${profile.voiceBlueprint.extractedFrom}
`.trim()
    : profile.inspirationsContext
    ? `INSPIRATIONS CONTEXT (Creator DNA — merge structural style with my voice):\n${profile.inspirationsContext}`
    : '[No Voice Blueprint set — use Voice & Tone section only]'

  return `
# IDENTITY BLOCK

NAME: ${profile.name}
HANDLE: @${profile.twitterHandle}
BIO: ${profile.bio || 'Not set'}
NICHE: ${profile.niche}

VOICE & TONE:
${profile.voice.tone}

WRITING STYLE RULES:
${profile.voice.writingStyle || 'Follow inspiration context tone.'}

SECOND BRAIN (LIVE CONTEXT — what is happening RIGHT NOW in my life):
This is not a bio. Every output must feel anchored to this specific moment.
${profile.secondBrain || '[Second Brain empty]'}

${blueprintSection}

CONTENT PILLARS:
${profile.contentPillars.map(p => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}

TARGET AUDIENCE:
${profile.audience?.targetAudience || 'Developers and builders'}

AVOID LIST (NEVER use these words/phrases):
${(profile.voice.avoidList || []).map(a => `- ${a}`).join('\n')}

EXAMPLE TWEETS (calibrate voice to this exact energy):
${(profile.voice.exampleTweets || []).map((t, i) => `${i + 1}. "${t}"`).join('\n\n')}

CONSTRAINTS:
- Do not assume anything not stated in this packet.
- All outputs must be under 280 characters.
- Match voice exactly — never default to generic AI tone.
`.trim()
}

export function generateDraftPacket(
  profile: UserProfile,
  drafts: TweetDraft[],
  config: DraftPacketConfig
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const modeLabel = DUMP_MODE_LABEL[config.dumpMode ?? 'dev']

  return `
---
PACKET: DRAFT REVIEW
DATE: ${dateStr} IST
---

SYSTEM: You are Grok with real-time X access. Stateless session.
Read the IDENTITY BLOCK and SECOND BRAIN before generating output.

${buildIdentityBlock(profile)}

# SESSION
Date/Time: ${dateStr} IST
Mode: ${modeLabel}
Session Goal: ${config.customRequest || 'General Draft Review'}

# DRAFTS
${drafts.length === 0 ? 'No drafts submitted.' : drafts.map((d, i) => {
    const content = d.isThread
      ? (d.threadTweets ?? []).map((t, n) => `${n + 1}/ ${t}`).join('\n')
      : d.content
    const weaknesses = config.includeScores && d.algorithmScore.suggestions.length > 0
      ? `\nWeaknesses: ${d.algorithmScore.suggestions.join(', ')}`
      : ''
    const hooks = d.hookVariations && d.hookVariations.length > 0
      ? d.hookVariations.map((h, idx) => `  ${String.fromCharCode(65 + idx)}) ${h}`).join('\n')
      : '  A) [None generated]'
    return `Draft ${i + 1}
Text: ${content}
Type: ${d.isThread ? 'Thread' : 'Tweet'}
Score: ${d.algorithmScore.overall}/100${weaknesses}
Hooks:
${hooks}`
  }).join('\n\n')}

# REQUIRED OUTPUT

${config.customRequest ? `PRIMARY REQUEST: ${config.customRequest}\n` : ''}

1. SCORE EACH DRAFT:
- Voice Match: [X]/10 - [reason]
- Hook Strength: [X]/10 - [reason]
- Specificity: [X]/10 - [reason]
- Recommendation: [Keep / Rewrite / Archive]

2. REAL-TIME DATA:
- Find 2-3 high-performing tweets from the last 48 hours on this topic. Provide links and analysis.

3. REWRITE DRAFTS (DNA OVERRIDE):
- Rewrite drafts using exact tone, framing, and vocabulary from INSPIRATIONS CONTEXT.
- Inject Second Brain context for specificity.
- Keep under 280 characters. Format threads logically.

4. FRESH ANGLES:
- Angle A (Safe): Styled like Inspiration DNA.
- Angle B (Spicy): Bolder, authentic, styled like Inspiration DNA.

5. STRATEGY:
- Which draft to post first and why.
- Best post time today.

6. FINAL OUTPUT:
Generate a copy-paste ready section at the end. Format:
- Rewritten Draft [N]: [text] ([chars])
- Angle A: [text] ([chars])
- Angle B: [text] ([chars])

FACT-CHECK: Verify all technical claims using live X search. Prefix unverified claims with [UNVERIFIED].
---
`.trim()
}

export function generateEngagementPacket(
  profile: UserProfile,
  config: EngagementPacketConfig
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return `
---
PACKET: ENGAGEMENT HUNT
DATE: ${dateStr} IST
---

SYSTEM: You are Grok with real-time X access. Stateless session.
Find real reply and quote tweet opportunities allowing me to show up authentically. Use the IDENTITY BLOCK.

${buildIdentityBlock(profile)}

# TARGET ACCOUNTS
Cold accounts to warm:
${config.targetAccounts.map(h => `- @${h.replace(/^@/, '')}`).join('\n')}

Admired accounts:
${(profile.admiredAccounts || []).map(a => `- @${a}`).join('\n')}

# SEARCH KEYWORDS
${config.topicKeywords.map(k => `- "${k}"`).join('\n')}
${(profile.contentPillars || []).map(p => `- "${p.name}" niche content`).join('\n')}

# REQUIRED OUTPUT

1. REPLY OPPORTUNITIES (Find 10-12):
For each opportunity:
Account: @[handle]
Original Tweet: "[content]" | [link]
Relevance: [Why for me based on Second Brain]
- Option A (Casual): [reply] ([chars])
- Option B (Insight): [reply based on actual builds/experience] ([chars])
- Option C (Question): [reply opening conversation] ([chars])

Rules for replies:
- Max 280 characters.
- Clone INSPIRATIONS CONTEXT vocabulary and tone.
- Do not use generic openers ("Great point", "This!").
- Do not add promotional energy.

2. QUOTE TWEET OPPORTUNITIES (Find 3-4):
From accounts with 1K-50K followers.
Account: @[handle]
Link: [link]
- Option 1 (Agree + Expand): [text] ([chars])
- Option 2 (Nuanced Pushback): [text] ([chars])

3. STRATEGY:
- Recommend 2-3 accounts to prioritize this week.

4. FINAL OUTPUT:
Generate a copy-paste ready section at the end. Format:
- Reply @[handle] Option [A/B/C]: [text] ([chars])
- Quote @[handle]: [text] ([chars])

FACT-CHECK: Verify all technical claims using live X search. Prefix unverified claims with [UNVERIFIED].
---
`.trim()
}

export function generateTrendingPacket(
  profile: UserProfile,
  config: TrendingPacketConfig
): string {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return `
---
PACKET: TRENDING RADAR
DATE: ${dateStr} IST
---

SYSTEM: You are Grok with real-time X access. Stateless session.
Identify trends in the last 6-12 hours and generate angles based on the IDENTITY BLOCK.

${buildIdentityBlock(profile)}

# CONTENT FILTER
Will not tweet about: Politics, Crypto, Celebrity drama.

# FOCUS AREAS
${config.focusAreas.length > 0
    ? config.focusAreas.map(a => `- ${a}`).join('\n')
    : (profile.contentPillars || []).map(p => `- ${p.name}`).join('\n') || '- Tech and Development'
  }

# REQUIRED OUTPUT

1. TRENDING TOPICS (Last 6-12 hours):
Find 6-8 topics. For each:
Topic: [Title]
Details: [One sentence summary]
Key Voices: [@handle - context]
Sentiment: [Positive/Negative/Mixed]
Relevance to niche: [1-10]

2. MY ANGLES (For relevance 6+):
Generate tweets adopting INSPIRATIONS CONTEXT tone and vocabulary.
- Angle A (Personal): Anchored to Second Brain context. ([text] - [chars])
- Angle B (Sharp Take): High resonance, bold. ([text] - [chars])

3. QUICK CONTENT:
- Quote Tweet Targets: 2-3 high-engagement tweets to quote.
- Shitpost: 2 dry, developer-lens joke options (if applicable).

4. STRATEGY:
- Top 2 topics to prioritize today.

5. FINAL OUTPUT:
Generate a copy-paste ready section at the end. Format:
- [Topic] Angle A: [text] ([chars])
- [Topic] Angle B: [text] ([chars])

FACT-CHECK: Verify all technical claims using live X search. Prefix unverified claims with [UNVERIFIED].
---
`.trim()
}
