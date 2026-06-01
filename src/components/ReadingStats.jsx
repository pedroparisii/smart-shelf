import { BookOpen, Bookmark, Target, TrendingUp } from "lucide-react"
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts"

const genreData = [
  { name: "Fantasy", books: 8, fill: "#a78bfa" },
  { name: "Sci-Fi", books: 6, fill: "#60a5fa" },
  { name: "Horror", books: 5, fill: "#f87171" },
  { name: "Romance", books: 5, fill: "#f472b6" },
]

const metrics = [
  { label: "Books Read", value: 24, icon: <BookOpen className="h-5 w-5" />, color: "text-blue-400" },
  { label: "Saved", value: 12, icon: <Bookmark className="h-5 w-5" />, color: "text-purple-400" },
  { label: "Annual Goal", value: "24/50", icon: <Target className="h-5 w-5" />, color: "text-green-400" },
]

const currentlyReading = [
  { title: "Dune", author: "Frank Herbert", progress: 63 },
  { title: "1984", author: "George Orwell", progress: 31 },
]

function ReadingStats() {
  return (
    <div className="flex flex-col gap-6 ">
      <div>
        <h2 className="text-2xl">Reading Stats</h2>
        <p className="text-muted-foreground">A snapshot of your reading journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid md:grid-cols-3 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                <div className={m.color}>{m.icon}</div>
                <span className="text-3xl font-semibold">{m.value}</span>
                <span className="text-sm text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Annual Goal</span>
              <span className="ml-auto text-sm text-muted-foreground">24 of 50 books</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: "48%" }} />
            </div>
            <span className="text-xs text-muted-foreground">48% complete — you're on track!</span>
          </div>

          <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card">
            <span className="text-sm font-medium">Currently Reading</span>
            <div className="flex flex-col gap-4">
              {currentlyReading.map((book) => (
                <div key={book.title} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{book.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${book.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
          <span className="text-sm font-medium">Top Genres</span>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={genreData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="books" nameKey="name" cornerRadius={6} background={{ fill: "transparent" }} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ display: "none" }}
                itemStyle={{ color: "var(--foreground)" }}
                formatter={(value, name, props) => [`${value} books`, props.payload.name]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-1">
            {genreData.map((g) => (
              <div key={g.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: g.fill }} />
                  <span className="text-muted-foreground">{g.name}</span>
                </div>
                <span className="font-medium">{g.books} books</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReadingStats