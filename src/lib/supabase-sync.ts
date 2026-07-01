import { UserProfile, TweetDraft } from '@/types'
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
      geminiApiKey: data.gemini_api_key || '',
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
      gemini_api_key: profile.geminiApiKey,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error saving profile to Supabase:', err)
  }
}

export async function fetchDraftsFromSupabase(): Promise<TweetDraft[]> {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error || !data) return []
    
    return data.map(item => ({
      id: item.id,
      content: item.content || '',
      isThread: item.is_thread ?? false,
      threadTweets: item.thread_tweets || [],
      pillarId: item.pillar_id || '',
      momentType: item.moment_type || '',
      hookVariations: item.hook_variations || [],
      algorithmScore: item.algorithm_score || { overall: 0, suggestions: [], calculatedAt: new Date().toISOString() },
      status: item.status || 'draft',
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString(),
    }))
  } catch (err) {
    console.error('Error fetching drafts from Supabase:', err)
    return []
  }
}

export async function saveDraftToSupabase(draft: TweetDraft): Promise<void> {
  try {
    await supabase.from('drafts').upsert({
      id: draft.id,
      content: draft.content,
      is_thread: draft.isThread,
      thread_tweets: draft.threadTweets || [],
      pillar_id: draft.pillarId,
      moment_type: draft.momentType,
      hook_variations: draft.hookVariations || [],
      algorithm_score: draft.algorithmScore || null,
      status: draft.status,
      created_at: draft.createdAt,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error saving draft to Supabase:', err)
  }
}

export async function deleteDraftFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from('drafts').delete().eq('id', id)
  } catch (err) {
    console.error('Error deleting draft from Supabase:', err)
  }
}
