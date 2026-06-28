import { GoogleGenAI } from '@google/genai'

let _currentKey: string | null = null
let _ai: GoogleGenAI | null = null

function getAI(): GoogleGenAI {
  let key: string | null = null

  // Resolve dynamically from local settings store
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('tweetos-profile-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        key = parsed.state?.profile?.geminiApiKey || null
      }
    } catch {}
  }

  // Fallback to env key
  if (!key) {
    key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || null
  }

  if (!key) {
    throw new Error('Missing Gemini API Key. Please configure one in Profile settings.')
  }

  if (!_ai || _currentKey !== key) {
    _currentKey = key
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
