const BASE_SEARCH  = "https://openlibrary.org/search.json"
const BASE_WORKS   = "https://openlibrary.org"
const BASE_COVERS  = "https://covers.openlibrary.org/b"

/** Builds a cover URL from Open Library cover ID */
function coverFromId(coverId, size = "L") {
  if (!coverId) return null
  return `${BASE_COVERS}/id/${coverId}-${size}.jpg`
}

/** Strips the leading /works/ from a key like "/works/OL27448W" → "OL27448W" */
function workId(key) {
  return key?.replace("/works/", "") ?? null
}

/** Maps our category select values to Open Library subject queries */
const SUBJECT_MAP = {
  fiction:     "subject:fiction",
  romance:     "subject:romance",
  terror:      "subject:horror",
  fantasy:     "subject:fantasy",
  nonfiction:  "subject:nonfiction",
  biography:   "subject:biography",
  technology:  "subject:technology",
}

const ORDER_MAP = {
  relevance: null,           // omit sort param
  popular:   "readinglog",
  rating:    "rating desc",
  newest:    "new",
  az:        "title",
}

/** Builds the query string for the search endpoint */
function buildQuery({ search, category, author }) {
  const parts = []

  if (search?.trim()) parts.push(`title:${search.trim()}`)
  if (author?.trim()) parts.push(`author:${author.trim()}`)
  if (category && SUBJECT_MAP[category]) parts.push(SUBJECT_MAP[category])

  return parts.length > 0 ? parts.join(" ") : "subject:fiction"
}

// Normalizers
function normalizeSearchDoc(doc) {
  const id = workId(doc.key)

  return {
    id,
    title:         doc.title ?? "Unknown title",
    authors:       doc.author_name ?? ["Unknown author"],
    publishedYear: doc.first_publish_year?.toString() ?? "",
    genres: doc.subject
      ?.map((s) => s.split("/").pop().split("--").pop().trim())
      .filter((s) => s.length < 30)
      .slice(0, 4) ?? [],
    coverUrl:      coverFromId(doc.cover_i),
    averageRating: doc.ratings_average ? Number(doc.ratings_average.toFixed(1)) : null,
    ratingsCount:  doc.ratings_count ?? 0,
    editionCount:  doc.edition_count ?? 0,
    // These aren't available in search — filled in on the book page
    description:   "",
    publisher:     doc.publisher?.[0] ?? "",
    pageCount:     doc.number_of_pages_median ?? null,
    language:      doc.language?.[0] ?? "",
    isbn:          doc.isbn?.[0] ?? null,
    previewLink:   `https://openlibrary.org/works/${id}`,
  }
}

//Normalizes a Works API response into our app's Book format
function normalizeWork(work, ratings) {
  const id = workId(work.key)

  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value ?? ""

  const coverId = work.covers?.[0]
  const coverUrl = coverFromId(coverId)

  return {
    id,
    title:         work.title ?? "Unknown title",
    authors:       [],            // fetched separately via /works/:id/authors.json
    publishedYear: work.first_publish_date?.slice(0, 4) ?? "",
    genres:        work.subjects?.slice(0, 4) ?? [],
    coverUrl,
    description,
    averageRating: ratings?.summary?.average
      ? Number(ratings.summary.average.toFixed(1))
      : null,
    ratingsCount:  ratings?.summary?.count ?? 0,
    editionCount:  0,
    publisher:     "",
    pageCount:     null,
    language:      "",
    isbn:          null,
    previewLink:   `https://openlibrary.org/works/${id}`,
  }
}

// Quality filter
function qualityFilter(books) {
  return books.filter((b) => {
    if (!b.coverUrl)                          return false
    if (b.authors[0] === "Unknown author")    return false
    // Legal Cases Filter
    if (/\bv\.\s+\w|MICH\b|F\.\d|Cal\.\b/.test(b.title)) return false
    return true
  })
}

// Public API
const cache = new Map()

export async function searchBooks({
  search    = "",
  category  = "",
  author    = "",
  orderBy   = "relevance",
  page      = 1,
  perPage   = 12,
}) {
  const q = buildQuery({ search, category, author })

  // Fetch a larger batch so quality filtering doesn't leave us with too few results
  const fetchLimit  = perPage + 6
  const startIndex  = (page - 1) * perPage

  const fields = [
    "key", "title", "author_name", "first_publish_year",
    "cover_i", "subject", "isbn", "publisher",
    "ratings_average", "ratings_count", "edition_count",
    "number_of_pages_median", "language",
  ].join(",")

  const params = new URLSearchParams({
    q,
    fields,
    limit:  fetchLimit,
    offset: startIndex,
  })

  const sortValue = ORDER_MAP[orderBy]
  if (sortValue) params.set("sort", sortValue)

  // CACHE
  const cacheKey = params.toString()
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const res = await fetch(`${BASE_SEARCH}?${params}`)

  if (!res.ok) throw new Error(`Open Library search error: ${res.status}`)

  const data = await res.json()

  if (!data.docs?.length) return { books: [], totalItems: 0 }

  let books = data.docs.map(normalizeSearchDoc)

  // Quality filter
  books = qualityFilter(books)

  // Trim to requested perPage after filtering
  books = books.slice(0, perPage)

  const totalItems = Math.min(data.numFound ?? 0, 400)

  const result = { books, totalItems }
  cache.set(cacheKey, result)
  return result
}

export async function getBookById(id) {
  const [workRes, ratingsRes, editionsRes] = await Promise.all([
    fetch(`${BASE_WORKS}/works/${id}.json`),
    fetch(`${BASE_WORKS}/works/${id}/ratings.json`),
    fetch(`${BASE_WORKS}/works/${id}/editions.json?limit=1`),
  ])

  if (!workRes.ok) throw new Error(`Book not found: ${id}`)

  const [work, ratings, editionsData] = await Promise.all([
    workRes.json(),
    ratingsRes.ok ? ratingsRes.json() : null,
    editionsRes.ok ? editionsRes.json() : null,
  ])

  const book = normalizeWork(work, ratings)

  // The work response already contains author keys — fetch each name in parallel.
  // (/works/:id/authors.json returns the same keys but no names either.)
  const authorKeys = (work.authors ?? []).map((a) => a.author?.key).filter(Boolean)
  if (authorKeys.length) {
    const authorDocs = await Promise.all(
      authorKeys.map((k) =>
        fetch(`${BASE_WORKS}${k}.json`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    )
    const names = authorDocs.filter(Boolean).map((a) => a.name).filter(Boolean)
    if (names.length) book.authors = names
  }
  if (!book.authors.length) book.authors = ["Unknown author"]

  // Edition details (pages, isbn, publisher, language)
  const edition = editionsData?.entries?.[0]
  if (edition) {
    book.pageCount = edition.number_of_pages ?? null
    book.isbn      = edition.isbn_13?.[0] ?? edition.isbn_10?.[0] ?? null
    book.publisher = edition.publishers?.[0] ?? ""
    book.language  = edition.languages?.[0]?.key?.replace("/languages/", "") ?? ""
  }

  return book
}