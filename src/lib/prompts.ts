import { UserProfile } from '@/types'

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
