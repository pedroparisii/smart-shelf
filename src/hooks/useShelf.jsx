import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { getUserBooks, upsertUserBook, removeUserBook, saveUserBookNote } from '@/lib/userBooks'

const ShelfContext = createContext(null)

// Loads the signed-in user's whole shelf once; every screen reads from here
export function ShelfProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const navigate = useNavigate()
  const [data, setData] = useState({ userId: null, rows: [] })

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    getUserBooks(userId)
      .catch(() => { toast.error("Couldn't load your shelf."); return [] })
      .then((rows) => { if (!cancelled) setData({ userId, rows }) })
    return () => { cancelled = true }
  }, [userId])

  const ready = !!userId && data.userId === userId
  const rows  = useMemo(() => (ready ? data.rows : []), [ready, data.rows])

  // Runs a write and swaps the returned row into state
  const write = useCallback(async (fn, olId) => {
    try {
      const row = await fn()
      setData((d) => ({ ...d, rows: [...(row ? [row] : []), ...d.rows.filter((r) => r.ol_id !== olId)] }))
      return true
    } catch {
      toast.error("Couldn't update your shelf. Try again.")
      return false
    }
  }, [])

  const setStatus = useCallback((book, status) => {
    if (!userId) return navigate('/login')
    return write(() => upsertUserBook(userId, book, status), book.id)
  }, [userId, navigate, write])

  const remove   = useCallback((row) => write(() => removeUserBook(row.id).then(() => null), row.ol_id), [write])
  const saveNote = useCallback((row, note) => write(() => saveUserBookNote(row.id, note), row.ol_id), [write])

  const value = useMemo(() => ({
    rows,
    loading: !!userId && !ready,
    getRow: (olId) => rows.find((r) => r.ol_id === olId) ?? null,
    setStatus,
    remove,
    saveNote,
  }), [rows, userId, ready, setStatus, remove, saveNote])

  return <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>
}

export function useShelf() {
  return useContext(ShelfContext)
}
