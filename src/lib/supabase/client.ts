import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isUrlValid = url && (url.startsWith('http://') || url.startsWith('https://'))
  if (!isUrlValid || !key) {
    // Returns a dummy during SSR/build — actual calls only happen in browser after hydration
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder')
  }
  return createBrowserClient(url, key)
}
