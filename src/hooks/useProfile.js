import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getProfileData, updateProfile } from '@/lib/profile'

export function useProfile() {
  const { user } = useAuth()
  const userId = user?.id
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    getProfileData(userId)
      .catch(() => ({ profile: null, genres: [], goal: null }))
      .then((d) => { if (!cancelled) setData({ userId, ...d }) })
    return () => { cancelled = true }
  }, [userId])

  const current = data?.userId === userId ? data : null

  async function update(updates) {
    const profile = await updateProfile(userId, updates)
    setData((d) => ({ ...d, profile }))
  }

  return {
    profile: current?.profile ?? null,
    genres:  current?.genres ?? [],
    goal:    current?.goal ?? null,
    loading: !!userId && !current,
    updateProfile: update,
  }
}
