import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (error) setError(error.message)
    else setProfile(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  return { profile, loading, error, updateProfile, refetch: fetchProfile }
}

export function useShelfStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ saved: 0, reading: 0, read: 0 })
  const [goal, setGoal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchStats() {
      const year = new Date().getFullYear()
      const [booksRes, goalRes] = await Promise.all([
        supabase.from('user_books').select('status, updated_at').eq('user_id', user.id),
        supabase.from('reading_goals').select('goal').eq('user_id', user.id).eq('year', year).maybeSingle(),
      ])

      if (booksRes.data) {
        const counts = { saved: 0, reading: 0, read: 0 }
        booksRes.data.forEach(({ status, updated_at }) => {
          if (status === 'read') {
            // Only count books marked as read during the current year for goal tracking
            if (new Date(updated_at).getFullYear() === year) counts.read++
          } else if (status in counts) {
            counts[status]++
          }
        })
        setStats(counts)
      }

      if (goalRes.data) setGoal(goalRes.data.goal)
      setLoading(false)
    }

    fetchStats()
  }, [user])

  return { stats, goal, loading }
}
