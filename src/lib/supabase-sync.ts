import { UserProfile } from '@/types'
import { supabase } from './supabase'

export async function fetchProfileFromSupabase(): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'default')
      .single()

    if (error || !data) return null

    return {
      name: data.name || '',
      twitterHandle: data.twitter_handle || '',
      niche: data.niche || '',
      bio: data.bio || '',
      contentPillars: data.content_pillars || [],
      voice: data.voice || { tone: '', avoidList: [], exampleTweets: [], admiredExampleTweets: [], writingStyle: '', learningNotes: [] },
      audience: data.audience || { currentAudience: '', targetAudience: '', audienceProblems: [], audienceGoals: [] },
      goals: data.goals || [],
      admiredAccounts: data.admired_accounts || [],
      postingFrequency: data.posting_frequency || '',
      secondBrain: data.second_brain || '',
      inspirationsContext: data.inspirations_context || '',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    }
  } catch (err) {
    console.error('Error fetching profile from Supabase:', err)
    return null
  }
}

export async function saveProfileToSupabase(profile: UserProfile): Promise<void> {
  try {
    await supabase.from('profiles').upsert({
      id: 'default',
      name: profile.name,
      twitter_handle: profile.twitterHandle,
      niche: profile.niche,
      bio: profile.bio,
      content_pillars: profile.contentPillars,
      voice: profile.voice,
      audience: profile.audience,
      goals: profile.goals,
      admired_accounts: profile.admiredAccounts,
      posting_frequency: profile.postingFrequency,
      second_brain: profile.secondBrain,
      inspirations_context: profile.inspirationsContext,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error saving profile to Supabase:', err)
  }
}
