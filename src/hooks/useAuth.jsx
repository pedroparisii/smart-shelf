import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}


export async function signUpWithEmail({ email, password, username, genres, readingGoal, readingFormat }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const userId = data.user?.id
  if (!userId) throw new Error("Signup failed — no user returned.")

  const year = new Date().getFullYear()

  await Promise.all([
    supabase.from('profiles')
      .update({ display_name: username, preferred_format: readingFormat ?? null })
      .eq('user_id', userId),
    genres?.length
      ? supabase.from('user_genres').insert(genres.map(genre => ({ user_id: userId, genre })))
      : Promise.resolve(),
    readingGoal
      ? supabase.from('reading_goals').insert({ user_id: userId, year, goal: readingGoal })
      : Promise.resolve(),
  ])

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
