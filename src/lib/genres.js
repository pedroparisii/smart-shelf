import { Rocket, Heart, Skull, Wand2, Search, UserRound, Cpu, Landmark, Sparkles, Brain, Compass, Feather } from "lucide-react"

// Single source for genres: home grid, signup onboarding and search filter.
// `key` is what's stored in user_genres and the ?category= URL param.
export const GENRES = [
  { key: "sci-fi",     label: "Science Fiction", subject: "science fiction", icon: Rocket,    color: "text-blue-400",   description: "Explore universes beyond imagination" },
  { key: "romance",    label: "Romance",         subject: "romance",         icon: Heart,     color: "text-pink-400",   description: "Stories that touch the heart" },
  { key: "horror",     label: "Horror",          subject: "horror",          icon: Skull,     color: "text-red-400",    description: "For the brave ones only" },
  { key: "fantasy",    label: "Fantasy",         subject: "fantasy",         icon: Wand2,     color: "text-purple-400", description: "Magic, dragons and impossible worlds" },
  { key: "mystery",    label: "Mystery",         subject: "mystery",         icon: Search,    color: "text-yellow-400", description: "Every page hides a clue" },
  { key: "biography",  label: "Biography",       subject: "biography",       icon: UserRound, color: "text-orange-400", description: "Lives that inspire and teach" },
  { key: "technology", label: "Technology",      subject: "technology",      icon: Cpu,       color: "text-cyan-400",   description: "The future starts here" },
  { key: "history",    label: "History",         subject: "history",         icon: Landmark,  color: "text-amber-400",  description: "The past that shaped the present" },
  { key: "self-help",  label: "Self-help",       subject: "self-help",       icon: Sparkles,  color: "text-green-400",  description: "Tools to always keep growing" },
  { key: "philosophy", label: "Philosophy",      subject: "philosophy",      icon: Brain,     color: "text-indigo-400", description: "Question everything around you" },
  { key: "adventure",  label: "Adventure",       subject: "adventure",       icon: Compass,   color: "text-teal-400",   description: "Adrenaline on every chapter" },
  { key: "poetry",     label: "Poetry",          subject: "poetry",          icon: Feather,   color: "text-rose-400",   description: "Words that dance in the mind" },
]

export const genreByKey = (key) => GENRES.find((g) => g.key === key)
