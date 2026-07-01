import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Cache the AI instance per API key for the lifetime of the server process
const aiCache = new Map<string, GoogleGenAI>()

function getAI(apiKey: string): GoogleGenAI {
  if (!aiCache.has(apiKey)) {
    aiCache.set(apiKey, new GoogleGenAI({ apiKey }))
  }
  return aiCache.get(apiKey)!
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey: clientKey } = await req.json() as { prompt: string; apiKey?: string }

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    // Prefer server-side env key; fall back to user-provided key (their own key, sent over HTTPS)
    const key = process.env.GEMINI_API_KEY || clientKey || null
    if (!key) {
      return NextResponse.json(
        { error: 'Missing Gemini API Key. Configure one in Profile settings.' },
        { status: 401 }
      )
    }

    const ai = getAI(key)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    return NextResponse.json({ text: (response.text ?? '').trim() })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gemini request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
