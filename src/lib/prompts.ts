import { UserProfile, DumpMode } from '@/types'

// ─── BRAIN DUMP ───────────────────────────────────────────────────────────────

function getDumpModeInstructions(mode: DumpMode): string {
  if (mode === 'personal') {
    return `MODE: Personal Life
TASK: Extract 2-4 relatable personal moments from the dump. These are NOT dev or AI tweets.
- Write in casual, first-person storytelling voice — like texting a close friend
- College life, relationships, daily observations, random thoughts, emotions — all fair game
- Funny, relatable, or oddly specific > generic life advice
- No dev jargon. No "as a developer" framing.
- Light self-deprecating humor works well
- Example energy: "refreshing my email like it owes me money 😭"
- Pillar suggestion: "Student Builder Journey" or "Personal" if it fits
- Moment type: story / observation / opinion`
  }

  if (mode === 'shitpost') {
    return `MODE: Shit Post
TASK: Extract 2-4 chaotic, funny, or unhinged takes from the dump.
- Think meme energy — absurd, dry, or darkly relatable
- Short is better. Under 140 chars hits harder for shit posts.
- No thesis. No value add. Just vibes, chaos, and relatability.
- Indian student context works great (hostel, mess food, college attendance, placement season)
- Can be completely disconnected from dev/AI
- DO NOT make it sound like a "creator" wrote it — should feel like a shitpost account
- Emojis: use sparingly and only when they add to the joke
- Pillar: "Personal" or just leave pillarName as "Shitpost"`
  }

  if (mode === 'auto') {
    return `MODE: Auto-Detect
TASK: Analyze the raw brain dump. For each key point or moment, classify it and write a draft in the most appropriate category:
1. Dev/AI (Vibe coding log, named tool/project updates, technical failures & fixes)
2. Personal Life (Relatable stories, Pune college daily observations, exams, frustrations)
3. Shitpost (Absurd meme energy, under 140 chars, hostel food, dry humor, no dev jargon)

Extract 2–4 strong moments matching these categories. For each moment:
- Pick the category that best fits the mood and content of the raw thoughts.
- Set "pillarName" to matching pillar name: "Vibe Coding Logs" (for Dev), "Student Builder Journey" (for Personal), or "Shitpost" (for Shitpost).
- Apply the corresponding style rules for that category (Dev: specific tools/projects; Personal: casual storytelling; Shitpost: meme energy/vibes under 140 chars).`
  }

  // default: dev
  return `MODE: Dev / AI
TASK: Extract 3-5 tweet-worthy moments. For each:
- Write one tweet in their EXACT voice (casual, punchy, first-person, specific)
- Sound like a Pune CS student — NOT a tech influencer
- Name the tool, project, error, or result specifically
- Natural CTA or question where it fits
- If it's a build update: name the project + what broke or worked`
}

export const BRAIN_DUMP_PROMPT = (
  dump: string,
  profile: UserProfile,
  topPerformers: string,
  mode: DumpMode = 'auto'
) => `You are a Twitter content strategist for ${profile.name} (@${profile.twitterHandle}).
`
  + `VOICE: ${profile.voice.tone}\n`
  + `WRITING STYLE: ${profile.voice.writingStyle}\n\n`
  + `${(mode === 'dev' || mode === 'auto') ? `CONTENT PILLARS:\n${profile.contentPillars.map((p) => `• ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}\n` : ''}
NEVER WRITE:
${profile.voice.avoidList.map((a) => `• ${a}`).join('\n')}

EXAMPLE TWEETS (match this energy exactly):
${profile.voice.exampleTweets.map((t, i) => `${i + 1}. ${t}`).join('\n\n')}

${topPerformers && (mode === 'dev' || mode === 'auto') ? `BEST PERFORMING TWEETS SO FAR:\n${topPerformers}` : ''}

RAW BRAIN DUMP:
---
${dump}
---

${getDumpModeInstructions(mode)}

RULES (apply to ALL modes):
• HARD LIMIT: 280 characters max per tweet (free account — never exceed this)
• No links in tweet body
• 2 alternative hook variations per tweet (different first line only)
• Light emojis where natural — don't force them
• 3 great drafts > 6 mediocre ones

RESPOND ONLY IN THIS JSON (no preamble, no markdown fences):
{
  "moments": [
    {
      "id": "m1",
      "insight": "core insight in one sentence",
      "type": "story",
      "pillarName": "Student Builder Journey",
      "tweet": "full tweet text here",
      "hookVariations": ["alt hook 1", "alt hook 2"],
      "isThread": false,
      "threadTweets": []
    }
  ]
}`

// ─── HOOK GENERATOR ───────────────────────────────────────────────────────────

export const HOOK_GENERATOR_PROMPT = (tweet: string, profile: UserProfile) => `Twitter hook specialist for ${profile.name} — ${profile.niche}

VOICE: ${profile.voice.tone}
EXAMPLE TWEETS: ${profile.voice.exampleTweets.slice(0, 3).join(' || ')}

TWEET TO REWORK:
${tweet}

Generate 5 different hook variations. Each uses a different technique:
1. Specific frustration or failure opener (relatable Karan energy)
2. Specific number or result ("built X in Y hours")
3. Personal story opener ("last week I..." / "been doing X for days now...")
4. Curiosity gap (make them need to read the rest)
5. Blunt take that will get replies

RULES:
- Sound like a Pune CS student — not a tech influencer
- Each hook under 100 chars (it's just the first line)
- Full tweet with the hook must stay under 280 chars total (free account hard limit)
- Specific, never vague

RESPOND ONLY IN JSON:
{
  "hooks": [
    { "technique": "frustration opener", "text": "hook text here" }
  ]
}`

// ─── THREAD BUILDER ───────────────────────────────────────────────────────────

export const THREAD_BUILDER_PROMPT = (idea: string, profile: UserProfile) => `Twitter thread writer for ${profile.name} (@${profile.twitterHandle}).

NICHE: ${profile.niche}
VOICE: ${profile.voice.tone}
AUDIENCE: ${profile.audience.targetAudience}

IDEA: ${idea}

Build a 5-7 tweet thread.

STRUCTURE:
Tweet 1: Hook — specific, personal, stops scroll. Must work standalone.
Tweets 2-5: One clear point each. Real specifics. No padding.
Tweet 6 (optional): Unexpected twist or honest reflection
Last tweet: Strong CTA — a question or insight, NOT "follow me"

RULES:
• Each tweet STRICTLY under 280 chars (free account hard limit — verify character count)
• No links in any tweet body
• Name tools, project names, real errors — not vague concepts
• Sound like Karan, not a growth hacker
• Number format: 1/ 2/ 3/
• 1 thread per week maximum — this is Saturday content

RESPOND ONLY IN JSON:
{
  "thread": [
    { "number": 1, "content": "tweet text" }
  ]
}`

// ─── REPLY GENERATOR ──────────────────────────────────────────────────────────

export const REPLY_GENERATOR_PROMPT = (
  originalTweet: string,
  authorHandle: string,
  opportunityType: string,
  profile: UserProfile
) => `Generate Twitter replies for ${profile.name} (@${profile.twitterHandle}).

THEIR IDENTITY: ${profile.niche}
THEIR VOICE: ${profile.voice.tone}
THEIR PROJECTS: Tonal (Chrome extension for tone translation in Gmail/Slack/WhatsApp), Git-for-Prompts (GitHub-style version control for AI prompts, built with Next.js + Supabase + Monaco Editor), MemoryPalace (second brain RAG app with pgvector)
THEIR EXPERTISE: Building full-stack AI apps with Claude/Gemini as a solo CS student in Pune

TWEET THEY'RE REPLYING TO (by @${authorHandle}):
"${originalTweet}"

OPPORTUNITY TYPE: ${opportunityType}

Generate 3 reply options:
Option A: casual and relatable (sounds like texting a friend)
Option B: adds specific insight or real experience from their projects
Option C: asks a genuine question that opens a real conversation

RULES FOR ALL OPTIONS:
✅ HARD LIMIT: Under 280 characters (free account — verify count)
✅ Reference what @${authorHandle} said specifically — not a generic reply
✅ Sound exactly like a Pune CS student, not a polished influencer
✅ Only mention projects if genuinely relevant and organic
❌ Never start with "Great point!" / "So true!" / "100%!"
❌ No promotional energy
❌ No vague compliments

RESPOND ONLY IN JSON (no preamble, no markdown fences):
{
  "context": "one sentence on why this is a good opportunity for Karan",
  "replies": [
    { "option": "A", "tone": "casual", "content": "reply text" },
    { "option": "B", "tone": "insightful", "content": "reply text" },
    { "option": "C", "tone": "question", "content": "reply text" }
  ]
}`

// ─── QUOTE TWEET ──────────────────────────────────────────────────────────────

export const QUOTE_TWEET_PROMPT = (
  originalTweet: string,
  authorHandle: string,
  profile: UserProfile
) => `Generate quote tweet takes for ${profile.name} (@${profile.twitterHandle}).

NICHE: ${profile.niche}
VOICE: ${profile.voice.tone}

TWEET BY @${authorHandle}:
"${originalTweet}"

Generate 3 quote tweet options — the text Karan writes ABOVE the quoted tweet.

Option A: Agree + add his own related experience or project insight
Option B: Nuanced take or honest pushback (respectful, not aggressive)
Option C: Question that opens conversation with original poster's audience

RULES:
✅ Under 200 characters (room for the quoted tweet embed)
✅ Adds genuine value — not just "this 🔥"
✅ Sounds like a Pune CS student — authentic, not polished
✅ Makes people want to read the original AND check Karan's profile
❌ Never just agree with nothing added
❌ No "As a student..." opener (overused)
❌ No promotional energy

RESPOND ONLY IN JSON:
{
  "quotes": [
    { "option": "A", "type": "agree_expand", "text": "quote text" },
    { "option": "B", "type": "nuanced_take", "text": "quote text" },
    { "option": "C", "type": "question", "text": "quote text" }
  ]
}`

// ─── VARIATION GENERATOR ──────────────────────────────────────────────────────

export const VARIATION_GENERATOR_PROMPT = (tweet: string, profile: UserProfile) => `Twitter variation generator for ${profile.name} (@${profile.twitterHandle}).

NICHE: ${profile.niche}
VOICE: ${profile.voice.tone}
EXAMPLE TWEETS: ${profile.voice.exampleTweets.slice(0, 3).join(' || ')}

TWEET TO REWORK:
"${tweet}"

Generate 3 different variations of this tweet, each from a distinct angle:
1. Bold/Assertive (Direct, punchy, strong opinion, Pune CS student builder stance)
2. Story-driven/Conversational (Casual, narrative, starts with personal context/action)
3. Contrarian/Curiosity (Contrarian take or curiosity gap to spark replies)

RULES:
- Each variation must be strictly under 280 characters.
- Sound authentic, not like a marketing growth hacker.
- Retain the core value or message of the original tweet, but change the phrasing/angle.

RESPOND ONLY IN JSON (no markdown fences, no preamble):
{
  "variations": [
    { "angle": "bold", "text": "variation text here" },
    { "angle": "story", "text": "variation text here" },
    { "angle": "contrarian", "text": "variation text here" }
  ]
}
`

// ─── TIGHTENER ───────────────────────────────────────────────────────────────

export const TIGHTENER_PROMPT = (tweet: string, profile: UserProfile) => `Twitter copy editor for ${profile.name} (@${profile.twitterHandle}).

VOICE: ${profile.voice.tone}

TWEET TO TIGHTEN:
"${tweet}"

TASK: Remove filler words, make sentences punchier, improve structure, and ensure the tweet is strictly under 280 characters. Keep the core message intact but make every single word earn its place.

RESPOND ONLY IN JSON (no markdown fences, no preamble):
{
  "tightenedText": "tightened tweet text here"
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
Return ONLY a valid JSON object matching the schema above. Do not include markdown code block syntax (like \`\`\`json), explanations, or preambles.
`

// ─── UNIFIED INTENT ROUTER ───────────────────────────────────────────────────

export const UNIFIED_ROUTER_PROMPT = (
  userInput: string,
  profile: UserProfile,
  topPerformers: string
) => `You are the core AI routing engine for TweetOS, a custom workspace for Twitter creator @${profile.twitterHandle}.

Your goal is to parse the user's natural language input, classify their intent, and execute the requested task.

USER NICHE/IDENTITY:
${profile.niche}

USER VOICE TONE:
${profile.voice.tone}

USER WRITING STYLE:
${profile.voice.writingStyle}

PAST WINNING TWEETS FOR REFERENCE:
${topPerformers}

AVOID LIST (NEVER USE THESE IN ANY GENERATION):
${profile.voice.avoidList.join(', ')}

DIRECTIONS FOR INTENT CLASSIFICATION:
Analyze the user's input to determine which tool they want to run. Choose EXACTLY one of these 5 intents:

1. 'draft': User is writing a raw dump of thoughts, venting, sharing coding progress, or asking to write a new draft tweet from scratch. E.g. "spent 5 hours debugging swiggy waitlist backend", "write a tweet about typescript utility types".
2. 'hooks': User wants to generate hook (first line) variations for a tweet. E.g. "make hooks for: [tweet text]", "give me hook variations".
3. 'thread': User wants to build/structure a multi-tweet thread. E.g. "make a thread about git-for-prompts architecture", "turn this topic into a thread: ...".
4. 'tighten': User wants to shorten, tighten, or condense a tweet to fit the 280-character limit. E.g. "tighten this: [tweet text]", "shorten it".
5. 'replies': User wants to reply to a tweet they pasted or mentioned. E.g. "suggest replies to this tweet: [tweet text]".

OUTPUT SCHEMA SPECIFICATION (Based on intent):

If intent is 'draft':
{
  "intent": "draft",
  "moments": [
    {
      "id": "mom1",
      "insight": "brief explanation",
      "type": "progress|rant|insight",
      "pillarName": "Tool Reality Checks|Project Fragments|Journey Notes|Sharp Takes|Quick Connects",
      "tweet": "The main draft tweet under 280 characters matching voice",
      "hookVariations": ["hook variation 1", "hook variation 2"],
      "isThread": false,
      "threadTweets": []
    }
  ]
}

If intent is 'hooks':
{
  "intent": "hooks",
  "hooks": [
    { "technique": "Intrigue | Open Loop | Absurdity | Contrast | Question", "text": "Generated hook line" }
  ]
}

If intent is 'thread':
{
  "intent": "thread",
  "thread": [
    { "number": 1, "content": "1/ Tweet content" },
    { "number": 2, "content": "2/ Tweet content" }
  ]
}

If intent is 'tighten':
{
  "intent": "tighten",
  "tightenedText": "Shortened, tightened version of the text strictly under 280 characters"
}

If intent is 'replies':
{
  "intent": "replies",
  "replies": [
    { "option": "A", "tone": "casual", "content": "casual reply option" },
    { "option": "B", "tone": "insightful", "content": "insightful reply option" },
    { "option": "C", "tone": "question", "content": "engaging question reply option" }
  ]
}

USER INPUT STRING TO CLASSIFY AND EXECUTE:
"""
${userInput}
"""

RESPOND ONLY IN VALID JSON matching the structure of the classified intent. Do not output any markdown code blocks, explanations, or backticks. Start response with '{' and end with '}'.`
