const YEAR_MS = 365 * 24 * 60 * 60 * 1000

export const ACHIEVEMENTS = [
  { id: 1, icon: "📖", label: "First Chapter",  description: "Saved your first book",      check: (c) => c.total >= 1 },
  { id: 2, icon: "🏆", label: "Bookworm",       description: "Read 10 books",              check: (c) => c.read >= 10 },
  { id: 3, icon: "⭐", label: "Critic",         description: "Left notes on 5 books",      check: (c) => c.withNotes >= 5 },
  { id: 4, icon: "🚀", label: "Explorer",       description: "Save 5 different genres",    check: (c) => c.genres >= 5 },
  { id: 5, icon: "🔥", label: "Devoted Reader", description: "Read 50 books",              check: (c) => c.read >= 50 },
  { id: 6, icon: "🎯", label: "Goal Crusher",   description: "Complete your annual goal",  check: (c) => c.goal > 0 && c.readThisYear >= c.goal },
  { id: 7, icon: "🌙", label: "Night Owl",      description: "Read a Horror book",         check: (c) => c.readHorror },
  { id: 8, icon: "🎂", label: "Anniversary",    description: "1 year on Smart Shelf",      check: (c) => c.memberFor >= YEAR_MS },
]

// Counts per status; `readThisYear` is what the annual goal tracks
export function getShelfStats(rows) {
  const year  = new Date().getFullYear()
  const stats = { saved: 0, reading: 0, read: 0, readThisYear: 0 }
  for (const r of rows) {
    stats[r.status]++
    if (r.status === 'read' && new Date(r.finished_at).getFullYear() === year) stats.readThisYear++
  }
  return stats
}

export function calculateAchievements({ rows, goal, memberSince }) {
  const lower = (r) => r.genres.map((g) => g.toLowerCase())
  const context = {
    ...getShelfStats(rows),
    goal,
    total:      rows.length,
    withNotes:  rows.filter((r) => r.note?.trim()).length,
    genres:     new Set(rows.flatMap(lower)).size,
    readHorror: rows.some((r) => r.status === 'read' && lower(r).some((g) => g.includes('horror'))),
    memberFor:  memberSince ? Date.now() - new Date(memberSince).getTime() : 0,
  }
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(context) }))
}
