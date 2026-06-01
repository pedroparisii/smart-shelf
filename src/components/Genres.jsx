import { Rocket, Heart, Skull, Wand2, Search, UserRound, Cpu, Landmark, Sparkles, Brain, Compass, Feather } from "lucide-react"

function GenresOverview() {

  const genres = [
  { title: "Science Fiction", description: "Explore universes beyond imagination", icon: <Rocket className="h-6 w-6" />, color: "text-blue-400" },
  { title: "Romance", description: "Stories that touch the heart", icon: <Heart className="h-6 w-6" />, color: "text-pink-400" },
  { title: "Horror", description: "For the brave ones only", icon: <Skull className="h-6 w-6" />, color: "text-red-400" },
  { title: "Fantasy", description: "Magic, dragons and impossible worlds", icon: <Wand2 className="h-6 w-6" />, color: "text-purple-400" },
  { title: "Mystery", description: "Every page hides a clue", icon: <Search className="h-6 w-6" />, color: "text-yellow-400" },
  { title: "Biography", description: "Lives that inspire and teach", icon: <UserRound className="h-6 w-6" />, color: "text-orange-400" },
  { title: "Technology", description: "The future starts here", icon: <Cpu className="h-6 w-6" />, color: "text-cyan-400" },
  { title: "History", description: "The past that shaped the present", icon: <Landmark className="h-6 w-6" />, color: "text-amber-400" },
  { title: "Self-help", description: "Tools to always keep growing", icon: <Sparkles className="h-6 w-6" />, color: "text-green-400" },
  { title: "Philosophy", description: "Question everything around you", icon: <Brain className="h-6 w-6" />, color: "text-indigo-400" },
  { title: "Adventure", description: "Adrenaline on every chapter", icon: <Compass className="h-6 w-6" />, color: "text-teal-400" },
  { title: "Poetry", description: "Words that dance in the mind", icon: <Feather className="h-6 w-6" />, color: "text-rose-400" },
]

  return (
      <div className=''>
        <div>
          <h2 className="text-2xl" >Genres</h2>
          <p className='text-muted-foreground'>Explore books by your favorite genres and discover new ones.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 my-5">
          {genres.map((genre) => (
            <div
              key={genre.title}
              className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card hover:bg-muted cursor-pointer transition-colors"
            >
              <div className={genre.color}>{genre.icon}</div>
              <h3 className="text-base font-semibold">{genre.title}</h3>
              <p className="text-sm text-muted-foreground">{genre.description}</p>
            </div>
          ))}
        </div>
      </div>
  )
}

export default GenresOverview
