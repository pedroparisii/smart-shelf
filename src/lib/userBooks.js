import { supabase } from '@/lib/supabase'

const COLUMNS = 'id, ol_id, title, authors, cover_url, genres, status, note, updated_at, finished_at'

// All of the user's shelf rows, most recently touched first
export async function getUserBooks(userId) {
  const { data, error } = await supabase
    .from('user_books')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

// Adds a book to the shelf or changes its status (status: 'saved' | 'reading' | 'read')
export async function upsertUserBook(userId, book, status) {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('user_books')
    .upsert({
      user_id:     userId,
      ol_id:       book.id,
      title:       book.title,
      authors:     book.authors ?? [],
      cover_url:   book.coverUrl ?? null,
      genres:      book.genres ?? [],
      status,
      finished_at: status === 'read' ? now : null,
      updated_at:  now,
    }, { onConflict: 'user_id,ol_id' })
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

export async function removeUserBook(id) {
  const { error } = await supabase.from('user_books').delete().eq('id', id)
  if (error) throw error
}

export async function saveUserBookNote(id, note) {
  const { data, error } = await supabase
    .from('user_books')
    .update({ note, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

// Converts a user_books row to the app's normalized book format
export function rowToBook(row) {
  return {
    id:       row.ol_id,
    title:    row.title,
    authors:  row.authors,
    coverUrl: row.cover_url,
    genres:   row.genres,
  }
}
