import { supabase } from '@/lib/supabase'

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Onboarding answers go in the user metadata; a DB trigger turns them into
// the profile, genres and reading goal rows (see supabase/migrations).
export async function signUpWithEmail({ email, password, username, genres, readingGoal, readingFormat }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/shelf`,
      data: {
        display_name:     username,
        genres,
        reading_goal:     readingGoal,
        preferred_format: readingFormat,
      },
    },
  })
  if (error) throw error
  return data
}

export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
