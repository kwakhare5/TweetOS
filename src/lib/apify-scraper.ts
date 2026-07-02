import { ApifyClient } from "apify-client"

export interface TweetItem {
  text?: string;
  full_text?: string;
  favorite_count?: number;
  retweet_count?: number;
  user?: { screen_name?: string };
  author?: { userName?: string };
  url?: string;
  isRetweet?: boolean;
  [key: string]: unknown;
}

export interface ApifyScrapeOptions {
  searchTerms: string[];
  maxItems: number;
  sort: "Latest" | "Top";
  primaryActor?: "61RPP7dywgiy0JPD0" | "nfp1fpt5gUlBwPcor";
}

export async function runApifyScrape(options: ApifyScrapeOptions): Promise<TweetItem[]> {
  const apifyToken = process.env.APIFY_API_TOKEN
  if (!apifyToken) {
    throw new Error("APIFY_API_TOKEN is not set in environment variables.")
  }
  
  const apifyClient = new ApifyClient({ token: apifyToken })
  
  // Set default fallback order based on primaryActor
  // "61RPP7dywgiy0JPD0" is tweet-scraper
  // "nfp1fpt5gUlBwPcor" is scraper-lite
  const actorsToTry = options.primaryActor === "nfp1fpt5gUlBwPcor" 
    ? ["nfp1fpt5gUlBwPcor", "61RPP7dywgiy0JPD0"]
    : ["61RPP7dywgiy0JPD0", "nfp1fpt5gUlBwPcor"]
    
  let items: TweetItem[] = []
  
  for (const actorId of actorsToTry) {
    try {

      
      const run = await apifyClient.actor(actorId).call({
        searchTerms: options.searchTerms,
        maxItems: options.maxItems,
        sort: options.sort,
      })


      const dataset = await apifyClient.dataset(run.defaultDatasetId).listItems()
      
      if (dataset.items && dataset.items.length > 0) {
        items = dataset.items as TweetItem[]

        break // Success! Exit the fallback loop
      } else {

      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`Actor ${actorId} failed:`, msg)
    }
  }

  return items
}
