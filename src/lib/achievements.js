import { supabase } from '@/lib/supabase'

export async function getUserBooksWithGenres(userId) {
  const { data, error } = await supabase
    .from('user_books')
    .select('status, note, books(genres)')
    .eq('user_id', userId)
  if (error) throw error
  return data ?? []
}

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 1,
    icon: "📖",
    label: "First Chapter",
    description: "Saved your first book",
    check: ({ totalBooks }) => totalBooks >= 1,
  },
  {
    id: 2,
    icon: "🏆",
    label: "Bookworm",
    description: "Read 10 books",
    check: ({ stats }) => stats.read >= 10,
  },
  {
    id: 3,
    icon: "⭐",
    label: "Critic",
    description: "Left notes on 5 books",
    check: ({ booksWithNotes }) => booksWithNotes >= 5,
  },
  {
    id: 4,
    icon: "🚀",
    label: "Explorer",
    description: "Save 5 different genres",
    check: ({ uniqueGenres }) => uniqueGenres >= 5,
  },
  {
    id: 5,
    icon: "🔥",
    label: "Devoted Reader",
    description: "Read 50 books",
    check: ({ stats }) => stats.read >= 50,
  },
  {
    id: 6,
    icon: "🎯",
    label: "Goal Crusher",
    description: "Complete your annual goal",
    check: ({ stats, goal }) => goal > 0 && stats.read >= goal,
  },
  {
    id: 7,
    icon: "🌙",
    label: "Night Owl",
    description: "Read a Horror book",
    check: ({ hasReadHorror }) => hasReadHorror,
  },
  {
    id: 8,
    icon: "🎂",
    label: "Anniversary",
    description: "1 year on Smart Shelf",
    check: ({ memberSince }) => {
      if (!memberSince) return false
      const diff = Date.now() - new Date(memberSince).getTime()
      return diff >= 365 * 24 * 60 * 60 * 1000
    },
  },
]

// ── Calculator ─────────────────────────────────────────────────────────────

/**
 * Calculates which achievements are unlocked.
 *
 * @param {object} params
 * @param {object} params.stats         - { read, reading, saved }
 * @param {number} params.goal          - annual reading goal
 * @param {string} params.memberSince   - profile.created_at
 * @param {Array}  params.userBooks     - result of getUserBooksWithGenres()
 */
export function calculateAchievements({ stats, goal, memberSince, userBooks }) {
  const totalBooks   = (stats.read ?? 0) + (stats.reading ?? 0) + (stats.saved ?? 0)
  const booksWithNotes = userBooks.filter(b => b.note?.trim()).length

  const allGenres = userBooks.flatMap(b => {
    const raw = b.books?.genres
    if (!raw) return []
    // genres stored as JSON string "['Fiction', 'Horror']" or array
    if (Array.isArray(raw)) return raw
    try { return JSON.parse(raw) } catch { return [] }
  })

  const uniqueGenres = new Set(allGenres.map(g => g.toLowerCase())).size

  const hasReadHorror = userBooks.some(b => {
    if (b.status !== 'read') return false
    const raw = b.books?.genres
    if (!raw) return false
    const genres = Array.isArray(raw) ? raw : (() => { try { return JSON.parse(raw) } catch { return [] } })()
    return genres.some(g => g.toLowerCase().includes('horror'))
  })

  const context = { stats, goal, memberSince, totalBooks, booksWithNotes, uniqueGenres, hasReadHorror }

  return ACHIEVEMENT_DEFINITIONS.map(a => ({
    ...a,
    unlocked: a.check(context),
  }))
}