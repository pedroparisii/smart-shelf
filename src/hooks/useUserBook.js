import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import {
  getUserBookByOlId,
  setUserBookStatus,
  removeUserBook,
  saveUserBookNote,
} from '@/lib/userBooks'

export function useUserBook(olId) {
  const { user } = useAuth()

  const [status, setStatusState]     = useState(null)
  const [note, setNoteState]         = useState('')
  const [userBookId, setUserBookId]  = useState(null)
  const [loading, setLoading]        = useState(false)
  const [saving, setSaving]          = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !olId) return
    setLoading(true)
    getUserBookByOlId(user.id, olId)
      .then(row => {
        if (row) {
          setStatusState(row.status)
          setNoteState(row.note ?? '')
          setUserBookId(row.id)
        } else {
          setStatusState(null)
          setNoteState('')
          setUserBookId(null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, olId])

  const setStatus = useCallback(async (book, newStatus) => {
    if (!user) { navigate("/login"); return }
    const prevStatus    = status
    const prevId        = userBookId

    if (newStatus === null) {
      if (!userBookId) return
      setStatusState(null)
      setUserBookId(null)
      try {
        await removeUserBook(userBookId)
      } catch {
        setStatusState(prevStatus)
        setUserBookId(prevId)
      }
    } else {
      setStatusState(newStatus)
      try {
        const row = await setUserBookStatus(user.id, book, newStatus)
        setUserBookId(row.id)
      } catch {
        setStatusState(prevStatus)
      }
    }
  }, [user, status, userBookId])

  const saveNote = useCallback(async (newNote) => {
    if (!user || !userBookId) return
    setSaving(true)
    try {
      await saveUserBookNote(userBookId, newNote)
      setNoteState(newNote)
    } finally {
      setSaving(false)
    }
  }, [user, userBookId])

  return { status, note, loading, saving, setStatus, saveNote, userBookId }
}
