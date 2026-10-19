import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Star, BookOpen, Bookmark, BookMarked, ChevronLeft, FileText, Globe, Hash, Building, Loader2, AlertCircle, Check, Trash2 } from 'lucide-react'
import PageLoader from '@/components/PageLoader.jsx'
import { useBook } from '@/hooks/useBook'
import { useShelf } from '@/hooks/useShelf'

const statusOptions = [
  { key: "reading", label: "Reading", icon: BookOpen   },
  { key: "read",    label: "Read",    icon: BookMarked },
  { key: "saved",   label: "Saved",   icon: Bookmark   },
]

function BookPage() {
  const { id } = useParams()
  // Remount per book so the note draft never leaks between books
  return <BookDetails key={id} id={id} />
}

function BookDetails({ id }) {
  const navigate = useNavigate()
  const { book, loading, error } = useBook(id)
  const { getRow, setStatus, remove, saveNote } = useShelf()
  const row = getRow(id)

  const [draft, setDraft]   = useState(null)
  const [saving, setSaving] = useState(false)
  const note      = draft ?? row?.note ?? ''
  const noteDirty = draft !== null && draft !== (row?.note ?? '')

  async function handleSaveNote() {
    setSaving(true)
    if (await saveNote(row, note)) setDraft(null)
    setSaving(false)
  }

  if (loading) return <PageLoader />

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error ?? "Book not found."}</p>
        <Button variant="outline" className="gap-1.5" asChild>
          <Link to="/"><ChevronLeft className="h-4 w-4" /> Back to Home</Link>
        </Button>
      </div>
    )
  }

  const {
    title, authors, publisher, publishedYear, description,
    pageCount, genres, averageRating, ratingsCount, language, isbn, coverUrl,
  } = book

  return (
    <>
      <div
        className="relative w-full h-72 bg-cover bg-center mt-20"
        style={{ backgroundImage: coverUrl && `url(${coverUrl})` }}
      >
        <div className="absolute inset-0 backdrop-blur-2xl bg-background/60" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
        <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-6">
          <button
            onClick={() => navigate(-1)}
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
              src={coverUrl ?? "/cover-placeholder.svg"}
              alt={title}
              className="w-57 rounded-xl shadow-2xl object-cover"
            />
            <div className="flex flex-col gap-2 sm:w-full">
              {statusOptions.map(({ key, label, icon: Icon }) => {
                const active = row?.status === key
                return (
                  <Button
                    key={key}
                    variant={active ? "default" : "outline"}
                    aria-pressed={active}
                    className="w-full gap-2 justify-start max-sm:h-24 max-sm:flex-col max-sm:justify-center"
                    onClick={() => !active && setStatus(book, key)}
                  >
                    {active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    {label}
                  </Button>
                )
              })}
              {row && <RemoveButton hasNote={!!row.note?.trim()} onConfirm={() => remove(row)} />}
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
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{description}</p>
                </div>
                <Separator />
              </>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FileText, label: "Pages",     value: pageCount  },
                  { icon: Globe,    label: "Language",  value: language?.toUpperCase() },
                  { icon: Hash,     label: "ISBN",      value: isbn       },
                  { icon: Building, label: "Publisher", value: publisher  },
                ]
                  .filter((d) => d.value)
                  .map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col gap-1 p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{label}</span>
                      </div>
                      <span className="text-sm font-medium truncate">{value}</span>
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
                value={note}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button className="w-fit" disabled={!noteDirty || saving || !row} onClick={handleSaveNote}>
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving…</>
                  : "Save note"
                }
              </Button>
              {!row && (
                <p className="text-xs text-muted-foreground">Add this book to your shelf first to save notes.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

function RemoveButton({ hasNote, onConfirm }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full gap-2 justify-start text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" /> Remove from shelf
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove from shelf?</DialogTitle>
          <DialogDescription>
            {hasNote
              ? "Your note for this book will be deleted too. This can't be undone."
              : "You can add it back anytime."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button variant="destructive" onClick={onConfirm}>Remove</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookPage
