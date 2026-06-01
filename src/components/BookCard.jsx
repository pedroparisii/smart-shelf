import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Bookmark, BookmarkCheck, Star } from "lucide-react"
import { useNavigate } from "react-router"
import { useUserBook } from "@/hooks/useUserBook"

const COVER_FALLBACK = "/placeholder-cover.png"

function BookCard({ book }) {
  const navigate = useNavigate()
  const { status, setStatus } = useUserBook(book?.id)

  if (!book) return null

  const { id, title, authors, genres, coverUrl, averageRating } = book
  const authorLine = authors ?? "Unknown author"
  const cover      = coverUrl ?? COVER_FALLBACK
  const isSaved    = status !== null

  function handleSave(e) {
    e.stopPropagation()
    if (isSaved) {
      setStatus(book, null)
    } else {
      setStatus(book, 'saved')
    }
  }

  return (
    <Card
      className="relative md:h-120 w-full mx-auto max-w-70 pt-0 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/book/${id}`)}
    >
      <div className="absolute inset-0 z-10 h-50 bg-linear-to-b from-black/40 to-transparent pointer-events-none" />

      <div className="relative w-full overflow-hidden bg-muted xl:h-90">
        <img
          src={cover}
          alt={`Cover of ${title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = COVER_FALLBACK }}
        />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-sm leading-snug">{title}</CardTitle>
        <CardDescription className="line-clamp-1 text-xs">{authorLine}</CardDescription>
      </CardHeader>

      <CardFooter className="gap-2 justify-between">
        {averageRating ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{averageRating.toFixed(1)}</span>
          </div>
        ) : (
          <div />
        )}

        <Button
          variant={isSaved ? "default" : "outline"}
          size="sm"
          onClick={handleSave}
        >
          {isSaved
            ? <><BookmarkCheck className="h-3.5 w-3.5" /> {status.replace(/^./, i => i.toUpperCase())}</>
            : <><Bookmark className="h-3.5 w-3.5" /> Save</>
          }
        </Button>
      </CardFooter>

      {isSaved && (
        <div className="absolute top-0 right-6 z-20 animate-bookmark overflow-hidden drop-shadow-xl">
          <svg width="24" height="48" viewBox="0 0 24 48" fill="none">
            <path d="M0 0 H24 V44 L12 36 L0 44 Z" fill="#cf7412" />
          </svg>
        </div>
      )}
    </Card>
  )
}

export default BookCard
