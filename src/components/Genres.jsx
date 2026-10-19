import { Link } from "react-router"
import { GENRES } from "@/lib/genres"

function GenresOverview() {
  return (
    <div>
      <div>
        <h2 className="text-2xl">Genres</h2>
        <p className='text-muted-foreground'>Explore books by your favorite genres and discover new ones.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-5">
        {GENRES.map(({ key, label, description, icon: Icon, color }) => (
          <Link
            key={key}
            to={`/search?category=${key}`}
            className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
          >
            <Icon className={`h-6 w-6 ${color}`} />
            <h3 className="text-base font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default GenresOverview
