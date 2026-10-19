import { supabase } from '@/lib/supabase'

// Profile, favorite genres and this year's reading goal in one go
export async function getProfileData(userId) {
  const [profile, genres, goal] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', userId).single(),
    supabase.from('user_genres').select('genre').eq('user_id', userId),
    supabase.from('reading_goals').select('goal')
      .eq('user_id', userId).eq('year', new Date().getFullYear()).maybeSingle(),
  ])
  const error = profile.error ?? genres.error ?? goal.error
  if (error) throw error
  return {
    profile: profile.data,
    genres:  genres.data.map((r) => r.genre),
    goal:    goal.data?.goal ?? null,
  }
}

export async function updateProfile(userId, { display_name, bio, avatar_url, preferred_format }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name, bio, avatar_url, preferred_format })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
