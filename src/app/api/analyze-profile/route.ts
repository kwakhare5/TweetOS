import { NextRequest, NextResponse } from "next/server"

import { GoogleGenAI, Type, Schema } from "@google/genai"
import { VOICE_BLUEPRINT_PROMPT } from "@/lib/prompts"
import { VoiceBlueprint } from "@/types"
import { runApifyScrape } from "@/lib/apify-scraper"

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json()

    if (!handle) {
      return NextResponse.json({ error: "X Handle is required" }, { status: 400 })
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

    const cleanHandle = handle.trim().replace(/^@/, '')
    const items = await runApifyScrape({
      searchTerms: [`from:${cleanHandle} -filter:retweets`],
      maxItems: 30,
      sort: "Latest",
      primaryActor: "61RPP7dywgiy0JPD0"
    })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No tweets found for this handle using any scraper." }, { status: 404 })
    }

    // 2. Format the tweets into a massive context block
    const tweetsText = items
      .map(item => `Tweet: ${item.text}`)
      .join("\\n\\n")

    console.log(`Extracted ${items.length} tweets. Passing to Gemini...`)

    // 3. Pass to Gemini API for Blueprint Extraction
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    
    const prompt = VOICE_BLUEPRINT_PROMPT(handle, tweetsText)

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        extractedFrom: { type: Type.STRING },
        extractedAt: { type: Type.STRING },
        hookFormula: { type: Type.STRING },
        bodyStructure: { type: Type.STRING },
        toneVibe: { type: Type.STRING },
        secretSauce: { type: Type.ARRAY, items: { type: Type.STRING } },
        writingRules: { type: Type.ARRAY, items: { type: Type.STRING } },
        antiRules: { type: Type.ARRAY, items: { type: Type.STRING } },
        sentencePatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        avgTweetLength: { type: Type.STRING },
        punctuationStyle: { type: Type.STRING },
        numberUsage: { type: Type.STRING },
        topStructuralPattern: { type: Type.STRING },
      },
      required: [
        "extractedFrom", "extractedAt", "hookFormula", "bodyStructure", "toneVibe",
        "secretSauce", "writingRules", "antiRules", "sentencePatterns",
        "avgTweetLength", "punctuationStyle", "numberUsage", "topStructuralPattern"
      ]
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

    const blueprint: VoiceBlueprint = JSON.parse(response.text)

    return NextResponse.json({ blueprint })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("Error analyzing profile:", error)
    return NextResponse.json(
      { error: msg || "Failed to analyze profile" },
      { status: 500 }
    )
  }
}
