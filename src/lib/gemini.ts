/**
 * Client-side Gemini helper.
 * Calls /api/gemini (server route) — the actual API key never touches the client bundle.
 */
function getUserApiKey(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('tweetos-profile-storage')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed.state?.profile?.geminiApiKey || null
  } catch (e) {
    console.warn('Could not read API key from localStorage:', e)
    return null
  }
}

export async function geminiText(prompt: string): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      apiKey: getUserApiKey(), // sent over HTTPS; server prefers its own env key
    }),
  })

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error || `Gemini API error: ${res.status}`)
  }

  const { text } = await res.json()
  return text ?? ''
}
