import { UserProfile } from '@/types'

export const SEED_PROFILE: UserProfile = {
  name: "Karan",
  twitterHandle: "kwakhare5",
  niche: "3rd/4th-year Pune Comp Eng student vibe-coding full-stack AI projects and sharing the raw internship chase.",
  bio: "thanos was right the whole time",

  contentPillars: [
    {
      id: "pillar_1",
      name: "Vibe Coding Logs",
      description: "Raw day-in-the-life of building with Claude/Gemini: prompts that worked, failures, quick wins. Short updates + screenshots/code snippets.",
      percentage: 30
    },
    {
      id: "pillar_2",
      name: "Project Spotlights",
      description: "Deep dives or launch threads on GitHub projects (Git-for-Prompts, MemoryPalace, Tonal). Screenshots, tech decisions, lessons. Builds internship credibility.",
      percentage: 25
    },
    {
      id: "pillar_3",
      name: "AI Tool Reality Checks",
      description: "Honest takes on Gemini/Claude (frustrations + hacks), comparisons, student-friendly alternatives. Original insight, not just quote tweets.",
      percentage: 20
    },
    {
      id: "pillar_4",
      name: "Student Builder Journey",
      description: "Internship applications, Pune college life + building, refreshing emails, rejections/wins. Relatable emotional arc.",
      percentage: 15
    },
    {
      id: "pillar_5",
      name: "Quick Wins & Resources",
      description: "Prompt templates, small hacks, GitHub tips tailored for Indian CS students.",
      percentage: 10
    }
  ],

  voice: {
    tone: "Casual, relatable Pune student with dry humor and frustrated optimism. Punchy sentences, light emojis, first-person storytelling about real builds. Authentic without trying too hard.",
    avoidList: [
      "Pure reactions without original value",
      "Generic 'just use AI bro' advice",
      "Walls of text without visuals or context",
      "Boastful flexing",
      "Corporate jargon",
      "Overused 'Day X of building' without unique angle",
      "Quote tweeting without adding insight"
    ],
    exampleTweets: [
      "submitted my Instamart-Intelligence project to Swiggy Builders last week and I've been refreshing Gmail like it's gonna pay my fees 😭 day 5 still nothing. @Swiggy if you're seeing this, the WhatsApp restock agent actually works lmao. built it all with Claude in ~3 weekends",
      "vibe coding Git-for-Prompts today: Claude generated 80% of the Monaco editor integration perfectly. then it hallucinated the Drizzle schema twice 💀 pro tip: explicit 'no assumptions on relationships' in the prompt fixed it. repo link in bio if you version control prompts too",
      "Pune college + building full-stack: lectures till 4, then vibe code till 2am because Claude doesn't judge your sleep schedule. shipped the prompt VCS today. if you're a 3rd year feeling behind, you're not — just start documenting the mess. it compounds.",
      "just shipped a small feature to my pantry AI that predicts inventory from past Swiggy orders. took 2 hours with Gemini for the prediction logic + WhatsApp integration. feels illegal how fast this stuff moves now. what's one AI hack that's saved you hours?"
    ],
    writingStyle: "Start with strong personal hook or specific observation. Use casual Indian student slang lightly (vro, fr, lmao) but pair with clear value. End with CTA or question when natural. First-person storytelling. Punchy, not padded."
  },

  audience: {
    currentAudience: "Small group of similar students reacting to AI gripes and tool frustrations",
    targetAudience: "2nd-4th year CS/Comp Eng students in India (Tier 2/3 cities), aspiring full-stack/AI builders targeting MAANG/unicorns, indie hackers starting out",
    audienceProblems: [
      "Don't know what to build",
      "Struggling with AI prompt engineering for real apps",
      "Can't deploy projects confidently",
      "Don't know how to stand out on GitHub for internships",
      "Feel behind compared to peers"
    ],
    audienceGoals: [
      "Ship fast with AI tools",
      "Land good internship offers",
      "Build a visible GitHub portfolio",
      "Find repeatable AI workflows without senior mentorship"
    ]
  },

  goals: [
    "Grow Twitter following",
    "Get visibility for projects (Tonal, Git-for-Prompts, MemoryPalace)",
    "Land internships at top companies (Swiggy, MAANG)",
    "Build AI-native builder personal brand",
    "Connect with Indian dev community"
  ],

  admiredAccounts: [
    "shydev69",
    "buildwithsid",
    "adxtyahq",
    "dhruvtwt_",
    "bit2swaz",
    "kalashvasaniya"
  ],

  postingFrequency: "1 original tweet/day + 5-10 replies/day",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
