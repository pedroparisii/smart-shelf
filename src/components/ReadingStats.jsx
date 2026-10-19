import { BookOpen, Bookmark, BookMarked, Target } from "lucide-react"
import { Link } from "react-router"
import { getShelfStats } from "@/lib/achievements"

// Most common genres across the shelf, as [name, count]
function topGenres(rows, limit = 5) {
  const counts = {}
  for (const g of rows.flatMap((r) => r.genres)) {
    const name = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
    counts[name] = (counts[name] ?? 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit)
}

function ReadingStats({ rows, goal }) {
  const stats   = getShelfStats(rows)
  const percent = goal ? Math.min(100, Math.round((stats.readThisYear / goal) * 100)) : 0
  const reading = rows.filter((r) => r.status === "reading")
  const genres  = topGenres(rows)
  const maxGenre = genres[0]?.[1] ?? 1

  const metrics = [
    { label: "Read",        value: stats.read,    icon: BookMarked, color: "text-blue-400"   },
    { label: "Reading",     value: stats.reading, icon: BookOpen,   color: "text-green-400"  },
    { label: "Saved",       value: stats.saved,   icon: Bookmark,   color: "text-purple-400" },
    { label: "Annual Goal", value: goal ? `${stats.readThisYear}/${goal}` : "—", icon: Target, color: "text-orange-400" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-3xl font-semibold">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {goal && (
          <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-400" /> {new Date().getFullYear()} Goal
              </span>
              <span className="text-muted-foreground">{stats.readThisYear} of {goal} books — {percent}%</span>
            </div>
            <Bar percent={percent} className="bg-orange-400" />
          </div>
        )}

        {reading.length > 0 && (
          <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card">
            <span className="text-sm font-medium">Currently Reading</span>
            {reading.slice(0, 3).map((r) => (
              <Link key={r.id} to={`/book/${r.ol_id}`} className="flex flex-col hover:underline">
                <span className="text-sm font-medium">{r.title}</span>
                <span className="text-xs text-muted-foreground">{r.authors.join(", ")}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card">
        <span className="text-sm font-medium">Top Genres</span>
        {genres.length === 0 && <p className="text-xs text-muted-foreground">Save some books to see your genres.</p>}
        {genres.map(([name, count]) => (
          <div key={name} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{name}</span>
              <span className="font-medium">{count}</span>
            </div>
            <Bar percent={(count / maxGenre) * 100} className="bg-contrast" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Bar({ percent, className }) {
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full transition-all ${className}`} style={{ width: `${percent}%` }} />
    </div>
  )
}

export default ReadingStats
