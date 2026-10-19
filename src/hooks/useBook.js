import { useState, useEffect } from "react"
import { getBookById } from "@/lib/openLibrary.js"

export function useBook(id) {
  const [result, setResult] = useState({ id: null, book: null, error: null })

  useEffect(() => {
    let cancelled = false
    getBookById(id)
      .then((book) => ({ id, book, error: null }))
      .catch((err) => ({ id, book: null, error: err.message ?? "Failed to load book." }))
      .then((r) => { if (!cancelled) setResult(r) })
    return () => { cancelled = true }
  }, [id])

  return { ...result, loading: result.id !== id }
}
