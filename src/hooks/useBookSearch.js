import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router"
import { searchBooks } from "@/lib/openLibrary"

const DEFAULT_PER_PAGE = 12

// Which param values are considered "empty" and omitted from the URL
function isDefault(key, value) {
  if (key === "orderBy") return value === "relevance"
  if (key === "page")    return value === 1
  if (key === "perPage") return value === DEFAULT_PER_PAGE
  return !value
}

// Reads filters + pagination from the URL query string
function readStateFromParams(params, initialPerPage) {
  return {
    filters: {
      search:   params.get("q")        ?? "",
      category: params.get("category") ?? "",
      author:   params.get("author")   ?? "",
      orderBy:  params.get("orderBy")   ?? "relevance",
    },
    page:    Number(params.get("page"))    || 1,
    perPage: Number(params.get("perPage")) || initialPerPage,
  }
}

export function useBookSearch(initialPerPage = DEFAULT_PER_PAGE) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derived directly from the URL
  const { filters, page, perPage } = readStateFromParams(searchParams, initialPerPage)

  // The text input is "draft" state — it only hits the URL on submit
  const [searchDraft, setSearchDraft] = useState(filters.search)

  // Keep the draft in sync if the URL changes externally (back button, etc.)
  const [syncedSearch, setSyncedSearch] = useState(filters.search)
  if (syncedSearch !== filters.search) {
    setSyncedSearch(filters.search)
    setSearchDraft(filters.search)
  }

  // Results are tagged with the query they belong to; a mismatch means loading
  const queryKey = searchParams.toString()
  const [result, setResult] = useState({ key: null, books: [], totalItems: 0, error: null })
  const loading    = result.key !== queryKey
  const totalPages = Math.max(1, Math.ceil(result.totalItems / perPage))

  /**
   * Writes a partial state update to the URL.
   * Omits default/empty values to keep the URL clean.
   */
  const updateParams = useCallback((updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)

      // Map our state keys to URL param names
      const KEY_MAP = { search: "q" }

      for (const [key, value] of Object.entries(updates)) {
        const paramKey = KEY_MAP[key] ?? key
        if (isDefault(key, value)) {
          next.delete(paramKey)
        } else {
          next.set(paramKey, String(value))
        }
      }
      return next
    }, { replace: false })
  }, [setSearchParams])

  // ── Public actions ─────────────────────────────────────────────────────

  const setFilter = useCallback((key, value) => {
    if (key === "search") {
      setSearchDraft(value)
      return
    }
    // Instant filters reset to page 1
    updateParams({ [key]: value, page: 1 })
  }, [updateParams])

  /**
   * Called when the user presses Search / Enter.
   * Commits the text draft to the URL.
   */
  const submitSearch = useCallback(() => {
    updateParams({ search: searchDraft, page: 1 })
  }, [updateParams, searchDraft])

  const setPage = useCallback((newPage) => {
    updateParams({ page: newPage })
  }, [updateParams])

  const setPerPage = useCallback((newPerPage) => {
    updateParams({ perPage: newPerPage, page: 1 })
  }, [updateParams])

  // ── Fetch whenever the URL-derived state changes ───────────────────────

  useEffect(() => {
    let cancelled = false
    searchBooks({ ...filters, page, perPage })
      .then((r) => ({ ...r, error: null }))
      .catch((err) => ({ books: [], totalItems: 0, error: err.message ?? "Failed to fetch books." }))
      .then((r) => { if (!cancelled) setResult({ key: queryKey, ...r }) })
    return () => { cancelled = true }
    // queryKey captures every input of the search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  return {
    books: loading ? [] : result.books,
    loading,
    error: loading ? null : result.error,

    // filters.search reflects the COMMITTED search (in URL);
    // searchDraft is what the input shows while typing
    filters: { ...filters, search: searchDraft },
    setFilter,
    submitSearch,

    pagination: {
      page,
      perPage,
      totalPages,
      totalItems: result.totalItems,
      setPage,
      setPerPage,
    },
  }
}