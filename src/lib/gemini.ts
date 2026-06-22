import { GoogleGenAI } from '@google/genai'

let _ai: GoogleGenAI | null = null

function getAI(): GoogleGenAI {
  if (!_ai) {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!key) throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY')
    _ai = new GoogleGenAI({ apiKey: key })
  }
  return _ai
}

/**
 * Call Gemini and parse JSON response.
 * Strips markdown fences if model wraps output in ```json ... ```
 */
export async function geminiJSON<T>(prompt: string): Promise<T> {
  const ai = getAI()
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  })
  const text = response.text ?? ''
  // Strip optional markdown fences
  const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(clean) as T
}
