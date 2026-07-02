import { NextRequest, NextResponse } from "next/server"

import { GoogleGenAI, Type, Schema } from "@google/genai"
import { TOPIC_HUNT_PROMPT } from "@/lib/prompts"
import { TopicHuntAngle } from "@/types"
import { runApifyScrape } from "@/lib/apify-scraper"

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { keywords, profile, mode } = await req.json()

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: "Keywords array is required" }, { status: 400 })
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

    const items = await runApifyScrape({
      searchTerms: keywords,
      maxItems: 20,
      sort: "Top",
      primaryActor: "nfp1fpt5gUlBwPcor"
    })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No tweets found for these keywords." }, { status: 404 })
    }

    // Map properties because different actors might return slightly different schemas
    const scrapedTweets = items.map(item => ({
      text: item.text || item.full_text || "",
      likes: item.favorite_count || 0,
      retweets: item.retweet_count || 0,
      author: item.user?.screen_name || item.author?.userName || "Unknown",
    })).filter(t => t.text.length > 0)

    console.log(`Passing ${scrapedTweets.length} tweets to Gemini Topic Hunt...`)

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    
    const prompt = TOPIC_HUNT_PROMPT(profile, scrapedTweets, keywords)

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        angles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              originalViral: { type: Type.STRING },
              originalContext: { type: Type.STRING },
              pillarMatch: { type: Type.STRING },
              rewrittenAngle: { type: Type.STRING },
              charCount: { type: Type.INTEGER },
              secondBrainAnchor: { type: Type.STRING },
              technique: { type: Type.STRING },
            },
            required: ["id", "originalViral", "originalContext", "pillarMatch", "rewrittenAngle", "charCount", "secondBrainAnchor", "technique"]
          }
        }
      },
      required: ["keywords", "angles"]
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

    return NextResponse.json({ angles: result.angles as TopicHuntAngle[] })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("Error running topic hunt:", error)
    return NextResponse.json(
      { error: msg || "Failed to run topic hunt" },
      { status: 500 }
    )
  }
}
