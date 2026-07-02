import { NextRequest, NextResponse } from "next/server"

import { GoogleGenAI, Type, Schema } from "@google/genai"
import { ENGAGEMENT_HUNT_PROMPT } from "@/lib/prompts"
import { EngagementOpportunity } from "@/types"
import { runApifyScrape } from "@/lib/apify-scraper"

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { targetAccounts = [], keywords = [], profile, mode } = await req.json()

    if (!Array.isArray(targetAccounts) || !Array.isArray(keywords)) {
      return NextResponse.json({ error: "targetAccounts and keywords must be arrays" }, { status: 400 })
    }

    if (targetAccounts.length === 0 && keywords.length === 0) {
      return NextResponse.json({ error: "At least one target account or keyword is required" }, { status: 400 })
    }

    if (!profile) {
      return NextResponse.json({ error: "User profile is required" }, { status: 400 })
    }

    if (mode !== 'apify') {
      return NextResponse.json({ error: "Only apify mode is supported by this route" }, { status: 400 })
    }

    // Validate environment variables
    if (!process.env.APIFY_API_TOKEN || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API configuration is missing on the server" }, { status: 500 })
    }

    // Check API Key for basic protection against credit drain
    const authHeader = req.headers.get("x-api-key")
    if (process.env.TWEETOS_API_KEY && authHeader !== process.env.TWEETOS_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Combine accounts and keywords into searchTerms
    const searchTerms: string[] = []
    
    // For target accounts, we want recent tweets from them (exclude retweets)
    targetAccounts.forEach((account: string) => {
      const cleanHandle = account.replace(/^@/, '')
      searchTerms.push(`from:${cleanHandle} -filter:retweets`)
    })
    
    // Keywords can be searched directly
    if (keywords.length > 0) {
      // Group keywords into a single search term for efficiency, or separate if many
      searchTerms.push(...keywords)
    }

    const items = await runApifyScrape({
      searchTerms: searchTerms,
      maxItems: 30,
      sort: "Latest",
      primaryActor: "nfp1fpt5gUlBwPcor"
    })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No tweets found for these targets." }, { status: 404 })
    }

    // Map properties
    const scrapedTweets = items.map(item => ({
      text: item.text || item.full_text || "",
      likes: item.favorite_count || 0,
      author: item.user?.screen_name || item.author?.userName || "Unknown",
      tweetUrl: item.url
    })).filter(t => t.text.length > 0)



    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    
    const prompt = ENGAGEMENT_HUNT_PROMPT(profile, scrapedTweets)

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        opportunities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              authorHandle: { type: Type.STRING },
              originalTweet: { type: Type.STRING },
              tweetUrl: { type: Type.STRING, nullable: true },
              opportunityScore: { type: Type.INTEGER },
              relevance: { type: Type.STRING },
              opportunityType: { type: Type.STRING },
              replies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    option: { type: Type.STRING },
                    tone: { type: Type.STRING },
                    content: { type: Type.STRING },
                    charCount: { type: Type.INTEGER },
                  },
                  required: ["option", "tone", "content", "charCount"]
                }
              }
            },
            required: ["id", "authorHandle", "originalTweet", "opportunityScore", "relevance", "opportunityType", "replies"]
          }
        },
        topPriority: { type: Type.ARRAY, items: { type: Type.STRING } },
        strategyNote: { type: Type.STRING }
      },
      required: ["opportunities", "topPriority", "strategyNote"]
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    })

    if (!response.text) {
      throw new Error("No response from Gemini")
    }

    const result = JSON.parse(response.text)

    return NextResponse.json({ opportunities: result.opportunities as EngagementOpportunity[] })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("Error running engagement hunt:", error)
    return NextResponse.json(
      { error: msg || "Failed to run engagement hunt" },
      { status: 500 }
    )
  }
}
