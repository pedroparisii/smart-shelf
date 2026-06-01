import { useState } from 'react'
import { useParams } from 'react-router'
import DOMPurify from 'dompurify'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Star, BookOpen, Bookmark, BookMarked, ChevronLeft, FileText, Globe, Hash, Building, Loader2, AlertCircle, Check } from 'lucide-react'
import { Link } from 'react-router'
import { useBook } from '@/hooks/useBook'
import { useUserBook } from '@/hooks/useUserBook'

const statusOptions = [
  { key: "reading", label: "Reading", icon: <BookOpen   className="h-4 w-4" /> },
  { key: "read",    label: "Read",    icon: <BookMarked className="h-4 w-4" /> },
  { key: "saved",   label: "Saved",   icon: <Bookmark   className="h-4 w-4" /> },
]

function BookPage() {
  const { id } = useParams()
  const { book, loading, error } = useBook(id)
  const { status, note: savedNote, saving, setStatus, saveNote } = useUserBook(id)

  const [localNote, setLocalNote] = useState(null)
  const noteValue   = localNote ?? savedNote
  const noteDirty   = localNote !== null && localNote !== savedNote

  function handleStatusClick(key) {
    if (!book) return
    setStatus(book, status === key ? null : key)
  }

  async function handleSaveNote() {
    await saveNote(noteValue)
    setLocalNote(null)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="overflow-x-hidden min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading book...</span>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !book) {
    return (
      <div className="overflow-x-hidden min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3 text-muted-foreground">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">{error ?? "Book not found."}</p>
          <Link to="/">
            <Button variant="outline" className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Book page ──────────────────────────────────────────────────────────────
  const {
    title, authors, publisher, publishedYear, description,
    pageCount, genres, averageRating, ratingsCount, language, isbn, coverUrl,
  } = book

  return (
    <div className='overflow-x-hidden min-h-screen'>
      <Header />

      <div
        className="relative w-full h-72 bg-cover bg-center mt-20"
        style={{ backgroundImage: `url(${coverUrl})` }}
      >
        <div className="absolute inset-0 backdrop-blur-2xl bg-background/60" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
        <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 pb-24 -mt-44 relative z-10">
        <div className="flex flex-col lg:flex-row lg:gap-10">

          <div className="shrink-0 flex sm:flex-col items-center max-sm:justify-center max-sm:-mt-8 lg:items-start gap-4">
            <img
              src={coverUrl}
              alt={title}
              className="w-57 rounded-xl shadow-2xl object-cover"
            />
            <div className="flex flex-col gap-2 sm:w-full">
              {statusOptions.map((s) => (
                <Button
                  key={s.key}
                  variant={status === s.key ? "default" : "outline"}
                  className="w-full gap-2 justify-start max-sm:h-24 max-sm:flex-col max-sm:justify-center"
                  onClick={() => handleStatusClick(s.key)}
                >
                  {status === s.key
                    ? <Check className="h-4 w-4" />
                    : s.icon
                  }
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col min-w-0 gap-6 flex-1 pt-12 lg:pt-24">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-lg text-muted-foreground">
                {authors.join(", ")}
                {publisher && ` · ${publisher}`}
                {publishedYear && ` · ${publishedYear}`}
              </p>

              {averageRating && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{averageRating}</span>
                  <span className="text-sm text-muted-foreground">({ratingsCount.toLocaleString()} ratings)</span>
                </div>
              )}

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres.map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {description && (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">About</h2>
                  <div
                    className="text-muted-foreground leading-relaxed text-sm [&_b]:font-semibold [&_i]:italic [&_br]:block [&_br]:mb-2"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                  />
                </div>
                <Separator />
              </>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <FileText  className="h-4 w-4" />, label: "Pages",     value: pageCount  },
                  { icon: <Globe     className="h-4 w-4" />, label: "Language",  value: language?.toUpperCase() },
                  { icon: <Hash      className="h-4 w-4" />, label: "ISBN",      value: isbn       },
                  { icon: <Building  className="h-4 w-4" />, label: "Publisher", value: publisher  },
                ]
                  .filter((d) => d.value)
                  .map((detail) => (
                    <div key={detail.label} className="flex flex-col gap-1 p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {detail.icon}
                        <span className="text-xs">{detail.label}</span>
                      </div>
                      <span className="text-sm font-medium truncate">{detail.value}</span>
                    </div>
                  ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">My Notes</h2>
              <Textarea
                placeholder="Write your thoughts, quotes or anything about this book..."
                className="min-h-32 resize-none"
                value={noteValue}
                onChange={(e) => setLocalNote(e.target.value)}
              />
              <Button
                className="w-fit"
                disabled={!noteDirty || saving || !status}
                onClick={handleSaveNote}
              >
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving…</>
                  : "Save note"
                }
              </Button>
              {!status && (
                <p className="text-xs text-muted-foreground">Add this book to your shelf first to save notes.</p>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BookPage