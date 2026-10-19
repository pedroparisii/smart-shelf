import { genreByKey } from "@/lib/genres"

const BASE        = "https://openlibrary.org"
const BASE_COVERS = "https://covers.openlibrary.org/b"

/** Builds a cover URL from Open Library cover ID */
function coverFromId(coverId, size = "L") {
  return coverId ? `${BASE_COVERS}/id/${coverId}-${size}.jpg` : null
}

/** Strips the leading /works/ from a key like "/works/OL27448W" → "OL27448W" */
function workId(key) {
  return key?.replace("/works/", "") ?? null
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
  const genre = genreByKey(category)

  if (search?.trim()) parts.push(`title:${search.trim()}`)
  if (author?.trim()) parts.push(`author:${author.trim()}`)
  if (genre)          parts.push(`subject:"${genre.subject}"`)

  return parts.length > 0 ? parts.join(" ") : "subject:fiction"
}

function normalizeSearchDoc(doc) {
  return {
    id:            workId(doc.key),
    title:         doc.title ?? "Unknown title",
    authors:       doc.author_name ?? ["Unknown author"],
    genres: doc.subject
      ?.map((s) => s.split("/").pop().split("--").pop().trim())
      .filter((s) => s.length < 30)
      .slice(0, 4) ?? [],
    coverUrl:      coverFromId(doc.cover_i),
    averageRating: doc.ratings_average ? Number(doc.ratings_average.toFixed(1)) : null,
  }
}

/** Drops results without a cover/author and the legal documents Open Library mixes in */
function qualityFilter(books) {
  return books.filter((b) =>
    b.coverUrl &&
    b.authors[0] !== "Unknown author" &&
    !/\bv\.\s+\w|MICH\b|F\.\d|Cal\.\b/.test(b.title)
  )
}

const cache = new Map()

export async function searchBooks({
  search    = "",
  category  = "",
  author    = "",
  orderBy   = "relevance",
  page      = 1,
  perPage   = 12,
}) {
  const params = new URLSearchParams({
    q:      buildQuery({ search, category, author }),
    fields: "key,title,author_name,cover_i,subject,ratings_average",
    limit:  perPage,
    offset: (page - 1) * perPage,
  })
  if (ORDER_MAP[orderBy]) params.set("sort", ORDER_MAP[orderBy])

  const cacheKey = params.toString()
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const res = await fetch(`${BASE}/search.json?${params}`)
  if (!res.ok) throw new Error(`Open Library search error: ${res.status}`)
  const data = await res.json()

  // Filtering can leave a page a little short, but pages never overlap
  const result = {
    books:      qualityFilter((data.docs ?? []).map(normalizeSearchDoc)),
    totalItems: Math.min(data.numFound ?? 0, 400),
  }
  cache.set(cacheKey, result)
  return result
}

const getJson = (path) =>
  fetch(`${BASE}${path}`).then((r) => (r.ok ? r.json() : null)).catch(() => null)

export async function getBookById(id) {
  const [work, ratings, editions] = await Promise.all([
    getJson(`/works/${id}.json`),
    getJson(`/works/${id}/ratings.json`),
    getJson(`/works/${id}/editions.json?limit=1`),
  ])
  if (!work) throw new Error("Book not found.")

  // The work only has author keys — fetch each name in parallel
  const authorDocs = await Promise.all(
    (work.authors ?? []).map((a) => a.author?.key).filter(Boolean).map((k) => getJson(`${k}.json`))
  )
  const authors = authorDocs.map((a) => a?.name).filter(Boolean)
  const edition = editions?.entries?.[0]

  return {
    id,
    title:         work.title ?? "Unknown title",
    authors:       authors.length ? authors : ["Unknown author"],
    publishedYear: work.first_publish_date?.slice(0, 4) ?? "",
    genres:        work.subjects?.slice(0, 4) ?? [],
    coverUrl:      coverFromId(work.covers?.[0]),
    description:   typeof work.description === "string" ? work.description : work.description?.value ?? "",
    averageRating: ratings?.summary?.average ? Number(ratings.summary.average.toFixed(1)) : null,
    ratingsCount:  ratings?.summary?.count ?? 0,
    pageCount:     edition?.number_of_pages ?? null,
    isbn:          edition?.isbn_13?.[0] ?? edition?.isbn_10?.[0] ?? null,
    publisher:     edition?.publishers?.[0] ?? "",
    language:      edition?.languages?.[0]?.key?.replace("/languages/", "") ?? "",
  }
}
