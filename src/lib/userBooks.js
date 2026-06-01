import { supabase } from '@/lib/supabase'

// Upserts a book by ol_id and returns its DB uuid
export async function ensureBook(book) {
  const { data, error } = await supabase
    .from('books')
    .upsert({
      ol_id:          book.id,
      title:          book.title,
      authors: Array.isArray(book.authors) ? book.authors.join(", ") : (book.authors ?? ""),
      cover_url:      book.coverUrl ?? null,
      publisher:      book.publisher ?? null,
      published_year: book.publishedYear ? parseInt(book.publishedYear) || null : null,
      genres:         book.genres ?? [],
      page_count:     book.pageCount ?? null,
      language:       book.language ?? null,
      isbn:           book.isbn ?? null,
    }, { onConflict: 'ol_id' })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

// Returns the user_books row for a given Open Library ID, or null
export async function getUserBookByOlId(userId, olId) {
  const { data: bookRow } = await supabase
    .from('books')
    .select('id')
    .eq('ol_id', olId)
    .maybeSingle()

  if (!bookRow) return null

  const { data, error } = await supabase
    .from('user_books')
    .select('id, status, note')
    .eq('user_id', userId)
    .eq('book_id', bookRow.id)
    .maybeSingle()

  if (error) throw error
  return data
}

// Upserts the status for a book (status: 'saved' | 'reading' | 'read')
export async function setUserBookStatus(userId, book, status) {
  const bookDbId = await ensureBook(book)
  const { data, error } = await supabase
    .from('user_books')
    .upsert(
      { user_id: userId, book_id: bookDbId, status, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,book_id' }
    )
    .select('id, status, note')
    .single()
  if (error) throw error
  return data
}

// Removes a book from the user's shelf entirely
export async function removeUserBook(userBookId) {
  const { error } = await supabase
    .from('user_books')
    .delete()
    .eq('id', userBookId)
  if (error) throw error
}

// Updates the note on a user_books row
export async function saveUserBookNote(userBookId, note) {
  const { error } = await supabase
    .from('user_books')
    .update({ note, updated_at: new Date().toISOString() })
    .eq('id', userBookId)
  if (error) throw error
}

// Fetches all user_books for a status, with book data joined
export async function getShelfBooks(userId, status) {
  const { data, error } = await supabase
    .from('user_books')
    .select('id, status, note, updated_at, books(*)')
    .eq('user_id', userId)
    .eq('status', status)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Converts a DB books row to the app's normalized book format
export function dbBookToAppBook(dbBook) {
  return {
    id:            dbBook.ol_id,
    title:         dbBook.title,
    authors: dbBook.authors ? [dbBook.authors] : ["Unknown author"],
    coverUrl:      dbBook.cover_url ?? null,
    publisher:     dbBook.publisher ?? '',
    publishedYear: dbBook.published_year ?? '',
    genres:        dbBook.genres ?? [],
    pageCount:     dbBook.page_count ?? null,
    language:      dbBook.language ?? '',
    isbn:          dbBook.isbn ?? null,
    averageRating: null,
    ratingsCount:  0,
  }
}

// Fetches the user's favorite genres based on their read books
export async function getUserGenres(userId) {
  const { data, error } = await supabase
    .from('user_genres')
    .select('genre')
    .eq('user_id', userId)
  if (error) throw error
  return data?.map(r => r.genre) ?? []
}