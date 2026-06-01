import {  BookOpen, BookMarked, Search, BarChart2 } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

function AboutCard() {

  return (
      <div className=''>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-serif font-bold">What is Smart Shelf?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Smart Shelf is a personal reading companion — a place to discover new books,
              keep track of what you've read, what you're reading, and what's waiting on your list.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              No social pressure, no follower counts. Just you and your books.
              A private, organized, and beautiful record of your entire reading journey.
            </p>
            <Link to="/">
              <Button variant="outline" className="gap-2 w-fit">
                <BookOpen className="h-4 w-4" /> Explore the app
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                <div className="text-contrast"><Search/></div>
                <p className="font-semibold text-sm">Discover</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Search millions of books via <a className='text-contrast hover:underline' href='https://openlibrary.org/' target='_blank'>OpenLibrary API</a>
                </p>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                <div className="text-contrast"><BookMarked/></div>
                <p className="font-semibold text-sm">Organize</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Shelf books as Reading, Read or Saved</p>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                <div className="text-contrast"><BarChart2/></div>
                <p className="font-semibold text-sm">Track</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Stats, goals and reading history at a glance</p>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                <div className="text-contrast"><BookOpen/></div>
                <p className="font-semibold text-sm">Notes</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Leave personal notes at your books</p>
              </div>
          </div>
        </div>
      </div>
  )
}

export default AboutCard
