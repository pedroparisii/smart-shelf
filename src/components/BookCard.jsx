import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bookmark, BookmarkCheck, Star } from "lucide-react"
import { Link } from "react-router"
import { useShelf } from "@/hooks/useShelf"

const COVER_FALLBACK = "/cover-placeholder.svg"

function BookCard({ book }) {
  const { getRow, setStatus } = useShelf()
  const status = getRow(book.id)?.status

  const { id, title, authors, coverUrl, averageRating } = book

  return (
    <Card className="relative md:h-120 w-full mx-auto max-w-70 pt-0 overflow-hidden group">
      <div className="absolute inset-0 z-10 h-50 bg-linear-to-b from-black/40 to-transparent pointer-events-none" />

      <div className="relative w-full overflow-hidden bg-muted xl:h-90">
        <img
          src={coverUrl ?? COVER_FALLBACK}
          alt={`Cover of ${title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = COVER_FALLBACK }}
        />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-sm leading-snug">
          {/* Stretched link: the ::after covers the whole card */}
          <Link to={`/book/${id}`} className="after:absolute after:inset-0">{title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-1 text-xs">{authors.join(", ")}</CardDescription>
      </CardHeader>

      <CardFooter className="gap-2 justify-between">
        {averageRating ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{averageRating.toFixed(1)}</span>
          </div>
        ) : <div />}

        {/* Only adds to the shelf; changing/removing happens on the book page */}
        {status ? (
          <Badge className="capitalize h-8 px-3">
            <BookmarkCheck className="h-3.5 w-3.5" /> {status}
          </Badge>
        ) : (
          <Button variant="outline" size="sm" className="relative z-20" onClick={() => setStatus(book, "saved")}>
            <Bookmark className="h-3.5 w-3.5" /> Save
          </Button>
        )}
      </CardFooter>

      {status && (
        <div className="absolute top-0 right-6 z-20 animate-bookmark overflow-hidden drop-shadow-xl">
          <svg width="24" height="48" viewBox="0 0 24 48" fill="none">
            <path d="M0 0 H24 V44 L12 36 L0 44 Z" className="fill-contrast" />
          </svg>
        </div>
      )}
    </Card>
  )
}

export default BookCard
