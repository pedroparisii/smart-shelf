import { useState, useEffect } from "react"
import { getBookById } from "@/lib/openLibrary.js"

export function useBook(id) {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      try {
        const data = await getBookById(id)
        if (!cancelled) setBook(data)
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load book.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()

    return () => { cancelled = true }
  }, [id])

  return { book, loading, error }
}