import { UserProfile } from '@/types'

// ─── SECOND BRAIN UPDATER ─────────────────────────────────────────────────────

export const BRAIN_UPDATER_PROMPT = (currentBrain: string, userMessage: string) => `You are an intelligent context manager for a developer's personal Second Brain document.

Your job: read the user's current Second Brain document and their new message, then return a perfectly updated version of the document.

RULES:
1. The Second Brain is a living daily-context document — it tracks what's actively happening in the user's life RIGHT NOW.
2. If the new message updates existing info (e.g. "swiggy replied" → find the Swiggy entry and update it), edit that entry in place. Do NOT keep the old contradicted info.
3. If the new message adds new info (new project, new event, new feeling), add it naturally.
4. If the new message removes something ("I dropped the Instamart project"), remove or archive that entry.
5. Keep the document clean, concise, and scannable — bullet points, short lines. No headers unless the user had them.
6. Preserve all still-valid entries from the current document that the new message doesn't contradict.
7. Do NOT add fluff, commentary, timestamps, or labels like "UPDATED:". Just return the clean updated document text.
8. Match the existing writing style of the document — lowercase, casual, developer tone.

CURRENT SECOND BRAIN:
"""
${currentBrain || '[Empty — this is the first entry]'}
"""

USER MESSAGE:
"${userMessage}"

Return ONLY the updated Second Brain document text. No preamble, no explanation, no markdown fences. Just the raw updated document.`

// ─── HUNT SYSTEMS PROMPTS ───────────────────────────────────────────────────────

export const VOICE_BLUEPRINT_PROMPT = (handle: string, tweetsText: string) => `
You are a forensic Twitter voice analyst. Your job is not to summarize what someone tweets about.
Your job is to reverse-engineer HOW they think, structure, and deliver a tweet — extracting the exact psychological and structural DNA of their content.

You are analyzing @${handle}'s last 30 tweets.

━━━ YOUR TASK ━━━

Study these tweets like a craftsman studying a master's technique. Extract the invisible rules that make their content work. Ignore topics — focus entirely on mechanics.

Ask yourself:
- What does the FIRST LINE always do? (Shock? Question? Contradiction? Specific claim?)
- How long is the average tweet? (One liner? 3-5 sentences? Thread?)
- What punctuation patterns repeat? (Ellipsis? Line breaks? No punctuation at all?)
- What's the emotional register? (Dry? Urgent? Deadpan? Curious? Confrontational?)
- Do they use numbers/data? How? (Specific vs vague?)
- What do they NEVER do? (No emojis? No hashtags? No inspirational outro?)
- What recurring structural pattern appears in 3+ tweets?
- What makes you stop scrolling when you see their tweet?

━━━ TWEETS TO ANALYZE ━━━

${tweetsText}

━━━ OUTPUT FORMAT ━━━

Respond ONLY in valid JSON. No preamble. No explanation. Start with { and end with }.

{
  "extractedFrom": "@${handle}",
  "extractedAt": "[ISO timestamp]",
  "hookFormula": "A precise, actionable description of how they open every tweet. Include the exact technique (e.g. 'Opens with a specific number or benchmark, then immediately contrasts it with a common assumption. Never a question. Never a greeting.')",
  "bodyStructure": "How they build from the hook. Describe the exact architecture — line breaks, sentence length progression, use of lists vs prose, how they pivot from setup to payload.",
  "toneVibe": "The emotional fingerprint. Not adjectives — describe the specific feeling the reader gets and WHY. (e.g. 'Reads like a senior dev texting a junior. Zero patience for fluff. Assumes reader is smart. Treats obviousness as an insult.')",
  "secretSauce": [
    "Unwritten rule 1 — something they consistently do that most creators don't (must be specific and non-obvious)",
    "Unwritten rule 2",
    "Unwritten rule 3"
  ],
  "writingRules": [
    "Specific formatting or structural rule extracted directly from tweet patterns (e.g. 'Always breaks after the hook line with a blank line')",
    "Rule 2",
    "Rule 3",
    "Rule 4",
    "Rule 5"
  ],
  "antiRules": [
    "Something they NEVER do — extracted from the absence patterns in the tweets (e.g. 'Never uses rhetorical questions to open', 'Never ends with a call to action')",
    "Anti-rule 2",
    "Anti-rule 3"
  ],
  "sentencePatterns": [
    "Example of their most recurring sentence construction pattern (pull a real example from tweets, anonymized)",
    "Pattern 2"
  ],
  "avgTweetLength": "one-liner | short (2-3 lines) | medium (4-6 lines) | long (7+ lines) | mixed",
  "punctuationStyle": "Describe punctuation habits specifically — do they use periods? Em dashes? No punctuation? Line breaks as punctuation?",
  "numberUsage": "How they use numbers/data — specific metrics, vague approximations, or none at all",
  "topStructuralPattern": "The single most frequently occurring tweet structure across all analyzed tweets. Describe it as a template (e.g. '[Specific claim with number] → [Implication] → [Dry one-line closer]')"
}
`

export const TOPIC_HUNT_PROMPT = (
  profile: UserProfile,
  scraped: { text: string; likes?: number; retweets?: number; author?: string }[],
  keywords: string[]
) => `
You are the Topic Hunt engine for TweetOS. Your job: find the best viral content angles from the scraped tweets and rewrite them in ${profile.name}'s exact voice. You do NOT copy or paraphrase. You extract the ANGLE and rebuild it from scratch.

━━━ WHO ${profile.name} IS ━━━

Handle: @${profile.twitterHandle}
Niche: ${profile.niche}

THEIR LIVE CONTEXT (Second Brain — what's happening in their life RIGHT NOW):
${profile.secondBrain || '[Second Brain empty — generate from niche and voice profile]'}

VOICE & TONE:
${profile.voice.tone}

WRITING STYLE RULES:
${profile.voice.writingStyle}

CREATOR DNA BLUEPRINT (Structural inspiration — THINK like this creator, SPEAK like ${profile.name}):
${profile.inspirationsContext || '[No blueprint set — use voice and writing style rules only]'}

${profile.voiceBlueprint ? `
STRUCTURED VOICE BLUEPRINT:
- Hook Formula: ${profile.voiceBlueprint.hookFormula}
- Body Structure: ${profile.voiceBlueprint.bodyStructure}
- Tone Vibe: ${profile.voiceBlueprint.toneVibe}
- Writing Rules: ${profile.voiceBlueprint.writingRules.join(' | ')}
- Anti-Rules (NEVER do): ${profile.voiceBlueprint.antiRules.join(' | ')}
` : ''}

CONTENT PILLARS (match output to these):
${profile.contentPillars.map(p => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\\n')}

WORDS/PHRASES TO NEVER USE:
${profile.voice.avoidList.join(', ')}

AUDIENCE:
${profile.audience?.targetAudience || 'developers and builders'}
Their problems: ${(profile.audience?.audienceProblems || []).join(' | ')}

━━━ SEARCH KEYWORDS USED ━━━
${keywords.map(k => `• "${k}"`).join('\\n')}

━━━ SCRAPED VIRAL TWEETS (source material) ━━━

${scraped.map((t, i) => `[${i + 1}] ${t.author ? `@${t.author}` : 'Unknown'} | ❤️ ${t.likes ?? '?'} | 🔁 ${t.retweets ?? '?'}
"${t.text}"
`).join('\\n')}

━━━ YOUR TASK ━━━

1. Identify the 4-5 MOST VIRAL ANGLES from the scraped tweets. An "angle" is the core insight, tension, or framing — not the topic itself.
2. For each angle: rewrite it completely as a new tweet in ${profile.name}'s voice. Do NOT paraphrase the original. Rebuild from scratch using their structure, tone, and live context.
3. Anchor each rewrite to a Content Pillar and, where possible, to a specific detail from the Second Brain.
4. Apply the Creator DNA Blueprint for structure — but use ${profile.name}'s own vocabulary, niche, and examples.

HARD CONSTRAINTS:
- Every output tweet: strictly under 280 characters
- Match voice exactly: ${profile.voice.tone}
- DO NOT use any word from the avoid list
- DO NOT copy phrases from the original tweet
- DO NOT start with generic openers
- If Second Brain is available, at least 2 rewrites must reference specific details from it

━━━ OUTPUT FORMAT ━━━

Respond ONLY in valid JSON. No preamble. No markdown fences. Start with { and end with }.

{
  "keywords": ["keyword1", "keyword2"],
  "angles": [
    {
      "id": "angle_1",
      "originalViral": "The core viral angle extracted from source (not the tweet text — the INSIGHT or TENSION that made it work)",
      "originalContext": "Brief: which scraped tweet(s) inspired this, why it was viral",
      "pillarMatch": "Name of the matching Content Pillar",
      "rewrittenAngle": "The fully rewritten tweet in ${profile.name}'s voice. Under 280 characters. Raw. No quotes.",
      "charCount": 0,
      "secondBrainAnchor": "Which specific detail from Second Brain was used, or 'none' if not applicable",
      "technique": "The hook technique used (e.g. 'Specific benchmark + contrast', 'Relatable pain + dry closer', 'Contrarian take + personal proof')"
    }
  ]
}
`

export const ENGAGEMENT_HUNT_PROMPT = (
  profile: UserProfile,
  scraped: { text: string; author: string; tweetUrl?: string; likes?: number }[]
) => `
You are the Engagement Hunt engine for TweetOS. Your job: analyze scraped tweets from target accounts and keywords, identify the best reply and quote-tweet opportunities for ${profile.name}, and generate 3 reply options per opportunity.

━━━ WHO ${profile.name} IS ━━━

Handle: @${profile.twitterHandle}
Niche: ${profile.niche}

LIVE CONTEXT (Second Brain — what they're building, thinking about, going through RIGHT NOW):
${profile.secondBrain || '[Second Brain empty]'}

VOICE & TONE:
${profile.voice.tone}

WRITING STYLE RULES:
${profile.voice.writingStyle}

${profile.voiceBlueprint ? `
VOICE BLUEPRINT:
- Hook Formula: ${profile.voiceBlueprint.hookFormula}
- Tone Vibe: ${profile.voiceBlueprint.toneVibe}
- Anti-Rules (NEVER in replies): ${profile.voiceBlueprint.antiRules.join(' | ')}
` : ''}

THEIR EXPERTISE & PROJECTS (inject naturally when relevant — ONLY if organic):
${profile.bio || 'See niche above'}

ADMIRED ACCOUNTS (warm relationships to nurture):
${(profile.admiredAccounts || []).map(a => `@${a}`).join(', ')}

WORDS/PHRASES TO NEVER USE:
${profile.voice.avoidList.join(', ')}

━━━ SCRAPED TWEETS ━━━

${scraped.map((t, i) => `[${i + 1}] @${t.author} | ❤️ ${t.likes ?? '?'}${t.tweetUrl ? ` | ${t.tweetUrl}` : ''}
"${t.text}"
`).join('\\n')}

━━━ YOUR TASK ━━━

1. Score every scraped tweet for ENGAGEMENT OPPORTUNITY VALUE (1-10) based on:
   - Relevance to ${profile.name}'s niche and Second Brain
   - Reply potential (is there something genuine to add?)
   - Audience alignment (do @${profile.twitterHandle}'s followers care about this?)
   - Virality of the original (higher engagement = higher visibility for reply)

2. Select the TOP 8-10 opportunities (score 6+).

3. For each: generate 3 distinct reply options.

REPLY RULES — NON-NEGOTIABLE:
- Max 280 characters per reply (free X account)
- Reference what @author said SPECIFICALLY — never a generic reply
- Sound exactly like ${profile.name}'s niche/voice — not a polished influencer
- Only mention projects/expertise if genuinely relevant and organic
- NEVER start with: "Great point", "This!", "So true", "100%", "Absolutely", "Love this"
- NEVER end with promotional energy or CTA
- NEVER use vague compliments
- Option A must feel like texting a peer — casual, zero effort energy
- Option B must add a real insight, pushback, or specific experience from Second Brain
- Option C must open a genuine conversation with a specific question (not "what do you think?")

━━━ OUTPUT FORMAT ━━━

Respond ONLY in valid JSON. No preamble. No markdown fences. Start with { and end with }.

{
  "opportunities": [
    {
      "id": "opp_1",
      "authorHandle": "author_handle_without_@",
      "originalTweet": "The exact tweet text",
      "tweetUrl": "url if available or null",
      "opportunityScore": 8,
      "relevance": "One sentence: why this is a good opportunity for @${profile.twitterHandle} specifically — tied to Second Brain or niche",
      "opportunityType": "reply | quote_tweet",
      "replies": [
        {
          "option": "A",
          "tone": "casual",
          "content": "Reply text under 280 chars",
          "charCount": 0
        },
        {
          "option": "B",
          "tone": "insightful",
          "content": "Reply text under 280 chars — with real insight or experience",
          "charCount": 0
        },
        {
          "option": "C",
          "tone": "question",
          "content": "Reply text ending with a specific question to open real conversation, under 280 chars",
          "charCount": 0
        }
      ]
    }
  ],
  "topPriority": ["opp_1", "opp_3"],
  "strategyNote": "2-sentence recommendation on which accounts/threads to prioritize this week and why"
}
`
// ─── VOICE PROFILE EXTRACTOR ──────────────────────────────────────────────────

export const VOICE_EXTRACTOR_PROMPT = (rawInput: string) => `You are a Twitter voice and profile analyst.
Your job is to read the raw input text below (which might contain the user's bio, list of draft tweets, descriptions of writing style, or general background info) and extract structured voice profile settings.

RAW INPUT TEXT:
"""
${rawInput}
"""

Please parse and structure this info into a clean JSON object matching the schema below.
If a value is not provided in the text, infer smart, realistic default values based on the rest of the text, but tailor them to Pune CS student/builder context if it matches.

JSON SCHEMA:
{
  "name": "string (the user's name, default to 'Karan')",
  "twitterHandle": "string (the user's Twitter handle without '@', default to 'kwakhare5')",
  "niche": "string (1-sentence description of user's niche, target topics, and identity)",
  "tone": "string (2-4 adjectives describing the tone, e.g. punchy, casual, developer-focused)",
  "writingStyle": "string (description of writing rules, e.g. lower-case, brief fragments, no fluff)",
  "avoidList": ["string (corporate, influencer, or fluff words to avoid, at least 3 items)"],
  "exampleTweets": ["string (ideal tweets in the user's own voice focusing on his projects like Tonal, Git-for-Prompts, iPod, Swiggy waitlist, etc.)"],
  "admiredExampleTweets": ["string (ideal tweets from the target circle like @shydev69, @adxtyahq, @buildwithsid, @kalashvasaniya containing dry lists, hiring takes, and minimal builderupdates to copy the style)"]
}

RESPONSE FORMAT:
Return ONLY a valid JSON object matching the schema above. Do not include markdown code block syntax (like \\\`\\\`\\\`json), explanations, or preambles.
`

// ─── UNIFIED INTENT ROUTER ───────────────────────────────────────────────────

export const UNIFIED_ROUTER_PROMPT = (
  userInput: string,
  profile: UserProfile,
  topPerformers: string,
  dumpMode: 'auto' | 'dev' | 'personal' | 'shitpost' = 'auto'
) => {
  let modeInstructions = ""
  if (dumpMode === 'dev') {
    modeInstructions = "FORCED TONE MODE: Focus heavily on public builder updates, tool learnings, specific code/technical errors, and screenshots of shipments. Keep it builder-centric."
  } else if (dumpMode === 'personal') {
    modeInstructions = "FORCED TONE MODE: Focus on casual life observations, relatable developer routines, college placements, email refreshing, late-night coding, rejections, and simple text tweets without heavy dev terminology."
  } else if (dumpMode === 'shitpost') {
    modeInstructions = "FORCED TONE MODE: Write chaotic, funny, absurd, high-meme, sarcastic Indian student tech takes (e.g. mocking tool bugs, using student slang, Pune CS student realities). Keep it dry and sarcastic."
  }

  return `You are the core AI routing engine for TweetOS, a custom workspace for Twitter creator @${profile.twitterHandle}.

Your job: parse the user input, classify intent, then execute the task. Output JSON only.

${modeInstructions ? `⚠️ IMPORTANT RULE:\n${modeInstructions}\n` : ''}
━━━ WHO THIS PERSON IS — READ THIS BEFORE DOING ANYTHING ━━━

NAME: ${profile.name} | HANDLE: @${profile.twitterHandle}
NICHE: ${profile.niche}

SECOND BRAIN (their actual current state — thoughts, projects, frustrations, wins, opinions):
This is not a bio. This is the live version of who this person is right now. Every piece of output you generate must feel like it comes from this specific person in this specific moment.

${profile.secondBrain || '[Second Brain empty — generate from generic voice profile below]'}

INSPIRATIONS CONTEXT (Creator DNA Blueprint — merge their structural style/framing with your voice):
${profile.inspirationsContext || '[No inspiration context yet]'}

VOICE TONE:
${profile.voice.tone}

WRITING STYLE RULES:
${profile.voice.writingStyle}

CONTENT PILLARS:
${profile.contentPillars.map(p => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}

AUDIENCE:
Target: ${profile.audience?.targetAudience || 'Indian indie devs and builders'}
Their problems: ${(profile.audience?.audienceProblems || []).join(' | ')}
Their goals: ${(profile.audience?.audienceGoals || []).join(' | ')}

WORDS/PHRASES NEVER TO USE:
${profile.voice.avoidList.join(', ')}

EXAMPLE TWEETS IN THIS EXACT VOICE (match this energy):
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

ADMIRED STYLE EXAMPLES:
${(profile.voice.admiredExampleTweets || []).slice(0, 5).map((t, i) => `${i + 1}. "${t}"`).join('\n')}

RUNNING LEARNING NOTES:
${(profile.voice.learningNotes || []).slice(0, 5).map((n, i) => `[#${i + 1}] ${n}`).join('\n') || '[None yet]'}

PAST WINNING TWEETS FOR REFERENCE:
${topPerformers}

GOLDEN WRITING PATTERNS TO IMITATE:
• TECH/INFO: lowercase, specific model/tool name-drops, real metrics. e.g. "finally, a chinese lab distilled claude fable 5 traces into deepseek v4 flash.\n\n277× cheaper: $50/M -> $0.18/M output tokens."
• SHITPOST/RANT: lowercase, raw frustration, sarcastic code/AI references. e.g. "if I can just write a useState and a 250ms setTimeout inside a useEffect, why tf am I prompting Opus just for it to hallucinate and add 100 lines for a 4-line fix"

HARD CONSTRAINTS:
• Every tweet must be under 280 characters — non-negotiable (free X account)
• Anchor content to real moments from the Second Brain above — not generic takes
• Match voice exactly — lowercase-heavy, punchy, dry, no hype, no fluff

━━━ INTENT CLASSIFICATION ━━━

Analyze the user input and choose EXACTLY one intent:
1. 'draft' — user is writing thoughts, venting, sharing progress, or asking to write a new tweet
2. 'hooks' — user wants hook/first-line variations for a tweet
3. 'thread' — user wants to build a multi-tweet thread
4. 'tighten' — user wants to shorten or condense a tweet to under 280 chars
5. 'replies' — user wants reply options to a tweet they pasted

━━━ OUTPUT SCHEMAS ━━━

If intent is 'draft':
{
  "intent": "draft",
  "moments": [
    {
      "id": "mom1",
      "insight": "brief explanation of what this moment captures",
      "type": "progress|rant|insight",
      "pillarName": "Tool Reality Checks|Project Fragments|Journey Notes|Sharp Takes|Quick Connects",
      "tweet": "The main draft tweet under 280 characters, anchored to Second Brain context, matching voice exactly",
      "hookVariations": ["hook variation 1", "hook variation 2", "hook variation 3"],
      "isThread": false,
      "threadTweets": [],
      "factCheckNote": "If the tweet contains any technical fact, price, benchmark, or model spec — write a 1-sentence verification note (e.g. '⚠️ Claude Fable 5 specs unconfirmed — verify before posting'). If content is personal/opinion-based, set to empty string."
    }
  ]
}

If intent is 'hooks':
{
  "intent": "hooks",
  "hooks": [
    { "technique": "Intrigue | Open Loop | Absurdity | Contrast | Question | Blunt Observation", "text": "Generated hook line under 60 chars" }
  ]
}

If intent is 'thread':
{
  "intent": "thread",
  "thread": [
    { "number": 1, "content": "1/ Tweet content under 280 chars" },
    { "number": 2, "content": "2/ Tweet content under 280 chars" }
  ]
}

If intent is 'tighten':
{
  "intent": "tighten",
  "tightenedText": "Shortened version strictly under 280 characters, preserving voice and core message"
}

If intent is 'replies':
{
  "intent": "replies",
  "replies": [
    { "option": "A", "tone": "casual", "content": "casual reply, peer energy, under 280 chars" },
    { "option": "B", "tone": "insightful", "content": "reply with real insight or experience from Second Brain, under 280 chars" },
    { "option": "C", "tone": "question", "content": "reply ending with specific question to open conversation, under 280 chars" }
  ]
}

━━━ USER INPUT ━━━

"""
${userInput}
"""

RESPOND ONLY IN VALID JSON matching the classified intent schema. No markdown fences, no explanation, no backticks. Start with '{' and end with '}'.`
}

export const DAILY_INSPIRATION_PROMPT = (profile: UserProfile, topPerformers: string) => `You are the Daily Inspiration engine for TweetOS.
Your job is to read the user's profile and recent winning tweets, and generate 3 fresh, highly viral-ready tweet ideas/drafts for today.

━━━ USER PROFILE ━━━
NAME: ${profile.name} (@${profile.twitterHandle})
NICHE: ${profile.niche}
VOICE TONE: ${profile.voice.tone}
WRITING STYLE RULES: ${profile.voice.writingStyle}
SECOND BRAIN (Active daily context, frustrations, wins, opinions):
${profile.secondBrain}

INSPIRATIONS CONTEXT (Creator DNA Blueprint):
Merge the structural habits, psychological framing, and formatting habits from this blueprint with your voice to generate the tweets:
${profile.inspirationsContext || '[No inspiration context yet]'}

TOP PERFORMING TWEETS FOR REFERENCE:
${topPerformers}

Generate 3 distinct tweet ideas/inspirations. Anchor each idea to a specific CONTENT PILLAR and format it as a complete draft tweet in their exact voice (lowercase, punchy, student builder, dry wit, under 280 characters).

CONTENT PILLARS AVAILABLE:
${profile.contentPillars.map(p => `• ${p.name}: ${p.description}`).join('\n')}

RESPOND ONLY IN VALID JSON (no markdown fences, no preamble, no backticks, no markdown code block formatting):
{
  "inspirations": [
    {
      "pillarName": "Content Pillar Name",
      "tweet": "The full drafted tweet under 280 characters matching the voice exactly."
    },
    {
      "pillarName": "Content Pillar Name",
      "tweet": "The full drafted tweet under 280 characters matching the voice exactly."
    },
    {
      "pillarName": "Content Pillar Name",
      "tweet": "The full drafted tweet under 280 characters matching the voice exactly."
    }
  ]
}`


