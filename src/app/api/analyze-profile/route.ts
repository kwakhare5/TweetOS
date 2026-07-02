import { NextRequest, NextResponse } from "next/server"
import { ApifyClient } from "apify-client"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json()

    if (!handle) {
      return NextResponse.json({ error: "X Handle is required" }, { status: 400 })
    }

    const apifyClient = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    })

    interface TweetItem {
      text?: string;
      isRetweet?: boolean;
      [key: string]: unknown;
    }

    const actorsToTry = ["61RPP7dywgiy0JPD0", "nfp1fpt5gUlBwPcor"]
    let items: TweetItem[] = []
    
    for (const actorId of actorsToTry) {
      try {
        console.log(`Starting Apify scrape for @${handle} using actor ${actorId}...`)
        
        // We pass a few common input formats in case the backup actor expects a slightly different key
        const run = await apifyClient.actor(actorId).call({
          twitterHandles: [handle],
          handles: [handle],
          searchTerms: [`from:${handle}`],
          maxItems: 30, // Get the 30 most recent tweets to build the voice blueprint
          sort: "Latest",
        })

        console.log(`Apify scrape finished for ${actorId}. Fetching dataset...`)
        const dataset = await apifyClient.dataset(run.defaultDatasetId).listItems()
        
        if (dataset.items && dataset.items.length > 0) {
          items = dataset.items as TweetItem[]
          console.log(`Successfully extracted ${items.length} tweets using ${actorId}.`)
          break // Success! Exit the fallback loop
        } else {
          console.log(`Actor ${actorId} returned 0 items. Trying backup...`)
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`Actor ${actorId} failed:`, msg)
      }
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No tweets found for this handle using any scraper." }, { status: 404 })
    }

    // 2. Format the tweets into a massive context block
    const tweetsText = items
      .filter(item => item.text && !item.isRetweet) // Filter out pure retweets
      .map(item => `Tweet: ${item.text}`)
      .join("\n\n")

    console.log(`Extracted ${items.length} tweets. Passing to Gemini...`)

    // 3. Pass to Gemini API for Blueprint Extraction
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const prompt = `Analyze the following recent tweets from the X (Twitter) account @${handle}. 
I need you to extract their "Creator DNA Blueprint".

Do NOT just describe what they talk about. I need their structural habits, psychological framing, and formatting habits. Extract the exact framework of how they think and structure a tweet so I can apply it to my own content.

Provide the blueprint in this exact format:
- The Hook Formula (How they grab attention)
- The Body Structure (How they build the argument or story)
- The Tone/Vibe (The emotional resonance)
- The Secret Sauce (The 3 unwritten rules they follow to make their content hit)

Here are their recent tweets:
${tweetsText}
`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const blueprint = response.text

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
